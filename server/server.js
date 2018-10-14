const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const config = require('./config/config.js');
const User = require('./modal/user.js');

const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

let users = [];
let messageHistory = [];

function sendUserListUpdate() {
  io.emit('userList', users);
}

io.on('connection', (socket) => {

  let user = new User();
  users.push(user);

  sendUserListUpdate();

  const welcome = {
    status: 1
  };
  if (config.messageHistory.enabled) {
    if (config.messageHistory.maxAge) {
      console.log('age',config.messageHistory.maxAge);
      messageHistory = messageHistory.filter(function(message){
        console.log('mage',(new Date() * 1) - message.time);
        return (new Date() * 1) - message.time < config.messageHistory.maxAge * 1000;
      });
    }
    welcome.messageHistory = messageHistory;
  }
  socket.emit('welcome', welcome);


  socket.broadcast.emit('message', {
    time: new Date().getTime(),
    type: 'userList',
    message: user.nick + '#' + user.id + ' has joined the server'
  });

  console.log('connected with a client');

  socket.on('message', (msg) => {
    if (!msg) {
      return;
    }

    const message = {
      time: new Date() * 1,
      type: 'messsage',
      user: user,
      message: msg
    };
    io.emit('message', message);

    if (config.messageHistory.enabled) {
      messageHistory.push(message);
      if (messageHistory.length > config.messageHistory.limit) {
        messageHistory.shift();
      }
    }

  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', {
      time: new Date().getTime(),
      type: 'userList',
      message: user.nick + '#' + user.id + ' has left the server'
    });

    users = users.filter((val) => val != user);
    user.destroy();
    user = null;
    sendUserListUpdate();
    console.log('client disconnected');
  });

});

server.listen(config.port, () => {
  console.log(`Server is up on port ${config.port}`);
});
