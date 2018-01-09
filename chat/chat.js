$(function() {
  var $window = $(window);
  var socket = io.connect();

  var width = $window.width();
  var $setname = $('#usernameScreen');
  var $chatPage = $('#chatSession'); 

  var username;
  var users = [];
  var isTyping = false;

  $('#sendMSG').click(function(){
      socket.emit('send msg', username + " : " + $('#m').val());
      $('#m').val('');
  });

  $("#m").keyup(function(event) {
    if ($(this).is(':focus'))
      if (event.keyCode === 13)
        $("#sendMSG").click();
  });

  $("#usernameTextbox").keyup(function(event) {
    if ($(this).is(':focus'))
      if (event.keyCode === 13)
        $("#nameselected").click();
  });

  socket.on('send msg', function(msg){
    $('#messages').append($('<li>').text(msg));
    var chat = document.getElementById('chatContainer');
    chat.scrollTop = chat.scrollHeight;
  });

  socket.on('update', function (connectedUsers) {
    users = connectedUsers;
    listConnectedUsers();
  });

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

  function listConnectedUsers(){
    $("#userList").html('');
    for(var i = 0; i < users.length; i++){
      $("#userList").append($('<li style="color:#aaabad">').text(users[i]))
    }
    $("#onlinecount").text("Online (" + users.length + ")")
  }

  socket.on('user joined', function (data) {
    $("#messages").append($('<li style="color: #228B22">').text( data.username + ' has joined'));
    listConnectedUsers();
  });

  socket.on('user left', function (data) {
    $("#messages").append($('<li style="color: #FF0000">').text( data.username + ' has disconnected'));
    listConnectedUsers();
  });

  $("#nameselected").on('click', function() {
    setUsername();
  });
  
})