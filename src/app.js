var socket = io();

socket.on('connect', () => {
  console.log('connected to the server');
});

socket.on('disconnect', () => {
  console.log('disconnected from the server');
});
