var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);


var connectedUsers = [];
const port = process.env.PORT || 80;

app.use(require('express').static(__dirname + '/chat'));

io.on('connection', function(socket){
  console.log('User connected');

  socket.on('disconnect', function(){
    console.log('User disconnected');
    socket.broadcast.emit('user left', {
      username: socket.username });
    connectedUsers.splice(connectedUsers.indexOf(socket.username), 1);
    updateUserList();
  });

  socket.on('send msg', function(msg){
    io.emit('send msg', msg);
  });

  socket.on('add user', function (username) {
    socket.username = username;
    connectedUsers.push(username);
    updateUserList();
    socket.broadcast.emit('user joined', {
      username: socket.username,
    });
  });
});
    
function updateUserList(){
  io.emit('update', connectedUsers)
}

http.listen(port, function(){
  console.log('Listening on ' + port);
});
