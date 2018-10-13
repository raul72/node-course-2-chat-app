const config = require('./config/config.js');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {

  console.log('connected with a client');

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });

});

server.listen(config.port, () => {
  console.log(`Server is up on port ${config.port}`);
});
