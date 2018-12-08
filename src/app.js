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
  });

  socket.on('newLocationMessage', function (message) {
    const $a = $('<a/>')
      .attr('href', message.url)
      .attr('target', '_blank')
      .text('My Current Location')
    ;
    const $li = $('<li/>')
      .text(`${message.from}: `)
    ;
    $li.append($a);
    $li.appendTo($messages);
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

  const $locationButton = $('#send-location');
  $locationButton.on('click', function(){
    if (!navigator.geolocation) {
      return alert('Geolocation not supported by your browser');
    }

    $locationButton
      .attr('disabled', true)
      .text('Sending location...')
    ;

    navigator.geolocation.getCurrentPosition(function(position){

      $locationButton
        .removeAttr('disabled')
        .text('Send location')
      ;

      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, function(){
      $locationButton
        .removeAttr('disabled')
        .text('Send location')
      ;
      alert('Unable to fetch location.');
    }, {

    });
  });

});
