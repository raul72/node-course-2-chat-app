const jQuery = require('jquery');
const io = require('socket.io-client');
const moment = require('moment');
const Mustache = require('mustache');

jQuery(function($){
  const socket = io();
  const $messages = $('#messages');

  function scrollToBottom() {
    const $newMessage = $messages.children('li:last-child');

    const clientHeight = $messages.prop('clientHeight');
    const scrollTop = $messages.prop('scrollTop');
    const scrollHeight = $messages.prop('scrollHeight');
    const newMssageHeight = $newMessage.innerHeight();
    const lastMessageHeight = $newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMssageHeight + lastMessageHeight >= scrollHeight) {
      $messages.scrollTop(scrollHeight);
    }

  }

  socket.on('connect', () => {
    console.log('connected to the server');
    const params = $.deparam();
    socket.emit('join', params, function(err){
      if (err) {
        alert(err);
        window.location.href = '/';
      } else {
        console.log('no error');
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected from the server');
  });

  socket.on('updateUserList', (users) => {
    const $ol = $('<ol/>');
    users.forEach((user) => {
      $('<li/>').text(user).appendTo($ol);
    });
    $('#users').html($ol);
  });

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
    scrollToBottom();
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
    scrollToBottom();
  });

  const $form = $('#message-form');
  const $text = $('input[name="message"]', $form);
  $form.on('submit', function(){
    $text.attr('disabled', true);
    socket.emit('createMessage', {
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
