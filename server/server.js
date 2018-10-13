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

function sendUserListUpdate() {
  io.emit('userList', users);
}

io.on('connection', (socket) => {

  let user = new User();
  users.push(user);

  sendUserListUpdate();
  socket.broadcast.emit('message', {
    time: new Date().getTime(),
    type: 'userList',
    message: user.nick + '#' + user.id + ' has joined the server'
  });

  console.log('connected with a client');

  socket.on('message', (msg) => {
    const message = {
      time: new Date() * 1,
      type: 'messsage',
      user: user,
      message: msg
    };
    io.emit('message', message);
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
