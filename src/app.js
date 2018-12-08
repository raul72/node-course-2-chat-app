const jQuery = require('jquery');
const io = require('socket.io-client');
const moment = require('moment');
const Mustache = require('mustache');

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
    const template = $('#message-template').html();
    const formattedTime = moment(message.createdAt).format('HH:mm');
    const html = Mustache.render(
      template,
      {
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
      }
    );
    $messages.append(html);
  });

  socket.on('newLocationMessage', function (message) {
    const template = $('#location-message-template').html();
    const formattedTime = moment(message.createdAt).format('HH:mm');
    const html = Mustache.render(
      template,
      {
        url: message.url,
        from: message.from,
        createdAt: formattedTime,
      }
    );
    $messages.append(html);
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
