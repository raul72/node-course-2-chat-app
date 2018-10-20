const jQuery = require('jquery');
const io = require('socket.io-client');

jQuery(function($){
  const socket = io();

  socket.on('connect', () => {
    console.log('connected to the server');
  });

  socket.on('disconnect', () => {
    console.log('disconnected from the server');
  });

  const $messages = $('#messages');
  socket.on('newMessage', function (message) {
    $('<li/>')
      .text(`${message.from}: ${message.text}`)
      .appendTo($messages)
    ;
    console.log('newMessage', message);
  });

  socket.emit('createMessage', {
    from: 'Bob',
    text: 'Bob was here'
  }, function(payload){
    console.log('Got it', payload);
  });

  const $form = $('#message-form');
  const $text = $('input[name="message"]', $form);
  $form.on('submit', function(){
    $text.attr('disabled', true);
    socket.emit('createMessage', {
      from: 'Bob',
      text: $text.val()
    }, function(payload){
      $text.val('');
      $text.attr('disabled', false);
      $text.focus();
      console.log('Got it', payload);
    });
    return false;
  });

});
