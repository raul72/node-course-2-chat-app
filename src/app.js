var socket = io();

socket.on('connect', () => {
  console.log('connected to the server');
});

socket.on('disconnect', () => {
  console.log('disconnected from the server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});

socket.emit('createMessage', {
  from: 'Bob',
  text: 'Bob was here'
}, function(payload){
  console.log('Got it', payload);
});
