$(function() {
  var $window = $(window);
  var socket = io.connect();

  var $setname = $('#usernameScreen');
  var $chatPage = $('#chatSession'); 

  var username;
  var users = [];
  var isTyping = false;

  // User events
  // Emit message to server
  $('#sendMSG').click(function(){
      socket.emit('send msg', username + " : " + $('#m').val().substring(0, 240));
      $('#m').val('');
  });

  // Set username at the start screen
  $("#nameselected").on('click', function() {
    setUsername();
  });

  // Emit message to server if textbox has focus and user presses Enter
  $("#m").keyup(function(event) {
    if ($(this).is(':focus'))
      if (event.keyCode === 13)
        $("#sendMSG").click();
  });

  // Sets username if user presses Enter
  $("#usernameTextbox").keyup(function(event) {
    if ($(this).is(':focus'))
      if (event.keyCode === 13)
        $("#nameselected").click();
  });

  // Socket on
  // Socket receives new message and displays it
  socket.on('send msg', function(msg){
    $('#messages').append($('<li>').text(msg));
    var chat = document.getElementById('chatContainer');
    chat.scrollTop = chat.scrollHeight;
  });

  // Socket receieve new array of connected user and displays it
  socket.on('update', function (connectedUsers) {
    users = connectedUsers;
    listConnectedUsers();
  });

  // Socket receives a message stating that a user has joined
  socket.on('user joined', function (data) {
    $("#messages").append($('<li style="color: #228B22">').text( data.username + ' has joined'));
    listConnectedUsers();
  });

  // Socket receives a message stating that a user has left
  socket.on('user left', function (data) {
    $("#messages").append($('<li style="color: #FF0000">').text( data.username + ' has disconnected'));
    listConnectedUsers();
  });

  
  // Sets the list of connected users
  function listConnectedUsers(){
    $("#userList").html('');
    for(var i = 0; i < users.length; i++){
      $("#userList").append($('<li style="color:#aaabad">').text(users[i]))
    }
    $("#onlinecount").text(`Online - ${ users.length }`)
  }

  // Sets the username by emiting to the server
  function setUsername() {
    username = $('#usernameTextbox').val().trim();
    if (username) {
      $setname.fadeOut();
      $chatPage.show();
      $setname.off('click', 'keyup') //Removes click event from that page
      $("#currentname").text("Currently chatting as : " + username)
      socket.emit('add user', username)
    }
  }

})