$(function() {
  var $window = $(window);
  var socket = io.connect();

  var $setname = $('#usernameScreen');
  var $chatPage = $('#chatSession'); 

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
        $("#nameselected").click();
  });

  // Socket on
  // Socket receives new message and displays it
  socket.on('send msg', function(msg) {
    $('#messages').append(`<li class="chatMessage">[${ msg.timestamp }] ${ msg.author } : ${ msg.message }</li>`);
    chatScroll();
    if (!document.hasFocus() && username !== null) {
      document.title = 'Web chat [!]'
    }
  });

  // Socket receieve new array of connected user and displays it
  socket.on('update', function (connectedUsers) {
    users = connectedUsers;
    listConnectedUsers();
  });

  // Socket receives a message stating that a user has joined
  socket.on('user joined', function (data) {
    $("#messages").append($('<li class="userJoinedMessage cleanUsername">').text( data.username + ' has joined'));
    listConnectedUsers();
    chatScroll();
  });

  // Socket receives a message stating that a user has left
  socket.on('user left', function (data) {
    $("#messages").append($('<li class="userLeftMessage cleanUsername">').text( data.username + ' has disconnected'));
    listConnectedUsers();
    chatScroll();
  });

  // Removes new message notification
  $(window).focus(function () {
    document.title = 'Web chat';
  });

  // Sets the list of connected users
  function listConnectedUsers(){
    $("#userList").html('');
    for(var i = 0; i < users.length; i++){
      $("#userList").append($('<li class="connectedUser cleanUsername">').text(users[i]))
    }
    $("#onlinecount").text(`Online - ${ users.length }`)
  }

  // Sets the username by emiting to the server
  function setUsername() {
    username = $('#usernameTextbox').val().trim().substring(0, 16);
    if (username) {
      $setname.fadeOut();
      $chatPage.show();
      $setname.off('click', 'keyup') //Removes click event from that page
      $("#currentname").text("Currently chatting as : " + username)
      socket.emit('add user', username)
    }
  }

  function chatScroll() {
    var chat = document.getElementById('chatContainer');
    chat.scrollTop = chat.scrollHeight;
  }

  function sendMessage() {
    if ($('#messagebox').val() !== '') {
      var currentTime = new Date();
      var minuteDigits = (currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes();
      var formatedDate = `${ currentTime.getDate() } ${ getMonthFromNumber(currentTime.getMonth()) } ${ currentTime.getFullYear() } - ${ currentTime.getHours() }:${ minuteDigits }`;
      var message = {
        author: username,
        message: $('#messagebox').val().substring(0, 240).replace(/\r?\n/g, '<br />'),
        timestamp: formatedDate
      }
      socket.emit('send msg', message);
      $('#messagebox').val('');
    }
  }

  function getMonthFromNumber(month) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    return monthNames[month];
  }
})