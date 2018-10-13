(function(){
  const socket = io();
  const chatUserList = document.getElementById('chat-userlist');
  const chatText = document.getElementById('chat-text');
  const textInput = document.getElementById('text');

  function padDateNumnber(number) {
    return [0].concat(number.toString().split('')).slice(-2).join('');
  }

  function getFormattedTime(time) {
    let h = padDateNumnber(time.getHours());
    let i = padDateNumnber(time.getMinutes());
    let s = padDateNumnber(time.getSeconds());
    return  `${h}:${i}:${s}`;
  }

  function printMessage(message) {
    const row = document.createElement('p');
    switch (message.type) {
    case 'userList':
    case 'system':
      row.style.color = 'gray';
      break;
    }

    if (message.time) {
      const time = new Date(message.time);
      const timeDom = document.createElement('span');
      timeDom.className = 'time';
      timeDom.innerHTML = getFormattedTime(time);
      row.appendChild(timeDom);
    }

    if (message.user) {
      const userDom = document.createElement('span');
      const userText = document.createTextNode(message.user.nick + '#' + message.user.id);
      userDom.className = 'user';
      userDom.appendChild(userText);
      row.appendChild(userDom);
    }

    const rowText = document.createTextNode(message.message);
    row.appendChild(rowText);

    // scrolling
    let initialScrollHeight = chatText.scrollHeight;
    let initialHeight = chatText.offsetHeight;
    let initialScrollTop = chatText.scrollTop;

    chatText.appendChild(row);

    // {initialScrollHeight: 764, initialScrollTop: 314, initialHeight: 450, x: 450}
    if (initialScrollHeight > initialHeight && (initialScrollHeight - 50 < initialHeight || initialScrollHeight - initialScrollTop == initialHeight)) {
      // only scroll if box is high enough
      // only scroll if scroll position is bottom
      setTimeout(function(){
        chatText.scrollTop =  chatText.scrollHeight - chatText.offsetHeight;
      }, 50);
    }

  }
  function printSystemMessage(msg) {
    printMessage({
      time: new Date() * 1,
      type: 'system',
      message: msg
    });
  }

  socket.on('connect', () => {
    printSystemMessage('connected to the server');
  });
  socket.on('disconnect', () => {
    printSystemMessage('disconnected from the server');
  });

  socket.on('userList', (users) => {
    console.log(users);
    chatUserList.innerHTML = '';

    for (let i in users) {
      if (users.hasOwnProperty(i)) {
        let user = users[i];
        let userDom = document.createElement('div');
        userDom.innerHTML = user.nick + '#' + user.id;
        chatUserList.appendChild(userDom);
      }
    }

  });

  // shold wrap input in form and capture break submit event
  textInput.onkeyup = function(e) {
    if (e.keyCode == 13) {
      if (textInput.value) {
        socket.emit('message', textInput.value);
      }
      textInput.value = '';
    }
  };

  socket.on('message', printMessage);

})();
