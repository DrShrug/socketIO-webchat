$(function() {
  var socket = io.connect();
  var username;
  var users = [];

  // User events
  // Set username at the start screen
  $("#nameselected").on('click', function() {
    setUsername();
  });

  // Emit message to server if textbox has focus and user presses Enter
  $('#messagebox').keydown(function(event) {
    // If the user presses enter while the focus is on the box, sends message
    if ($(this).is(':focus')) {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    }
  });

  // Sets username if user presses Enter
  $("#usernameTextbox").keyup(function(event) {
    if ($(this).is(':focus'))
      if (event.keyCode === 13)
        setUsername();
  });

  // Socket events
  // Socket receives new message and displays it
  socket.on('new msg', function(msg) {
    // Prevents html injection and allows multiline messages
    var messageWithSpace = msg.message
                            .split('<').join('&lt;')
                            .split('>').join('&gt;')
                            .split('&lt;br /&gt;').join('<br/>')
                            .split(' ').join('\xa0');
    var template = $("#message-template").html();
    var html = Mustache.render(template, {
      author: msg.author,
      message: messageWithSpace,
      timestamp: msg.formatedTime
    });

    $('#messages').append(html);
    chatScroll();
    // Changes page title if user is in another tab while receiving a new message
    if (!document.hasFocus() && username !== null) {
      document.title = '[New] Web Chat App';
    }
  });

  // Socket receieve new array of connected user and displays it
  socket.on('update users', function (connectedUsers) {
    users = connectedUsers;
    listConnectedUsers();
  });

  // Socket receives a message stating that a user has joined
  socket.on('user joined', function (data) {
    $("#messages").append(
      $('<li class="userJoinedMessage preventOverflow">')
        .text( data.username + ' has joined')
        .append('<hr class="dropdown-divider">'));
    listConnectedUsers();
    chatScroll();
  });

  // Socket receives a message stating that a user has left
  socket.on('user left', function (data) {
    $("#messages").append(
      $('<li class="userLeftMessage preventOverflow">')
      .text( data.username + ' has disconnected')
      .append('<hr class="dropdown-divider">'));
    listConnectedUsers();
    chatScroll();
  });

  // Client side functions
  // Removes new message notification
  $(window).focus(function () {
    document.title = 'Web Chat App';
  });

  // Sets the list of connected users
  function listConnectedUsers(){
    $("#userList").html('');
    users.forEach((user) => {
      $("#userList").append($('<li class="connectedUser preventOverflow">').text(user))
    })
    $("#onlinecount").text(`Online - ${ users.length }`)
  }

  // Sets the username by emiting to the server
  function setUsername() {
    username = $('#usernameTextbox').val().trim().substring(0, 16);
    if (username) {
      $('#usernameScreen').fadeOut();
      $('#chatSession').show();
      $('#usernameScreen').off('click', 'keyup'); //Removes events from login page
      $("#currentname").text("Currently chatting as : " + username);
      socket.emit('add user', username);
    }
  }

  // Chat automatically scrolls to the bottom when called
  function chatScroll() {
    var chat = document.getElementById('chatContainer');
    chat.scrollTop = chat.scrollHeight;
  }

  // Sends a user message to the server
  function sendMessage() {
    if ($('#messagebox').val().trim().length > 0) {
      socket.emit('send msg', {
        author: username,
        message: $('#messagebox').val().substring(0, 500).replace(/\r?\n/g, '<br />'),
      });
      $('#messagebox').val('');
    }
  }
})