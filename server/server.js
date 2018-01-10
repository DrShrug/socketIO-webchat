var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

const {generateMessage} = require('./utils/message');

var connectedUsers = [];
const port = process.env.PORT || 80;

app.use(require('express').static(__dirname + './../chat'));

io.on('connection', function(socket){
  console.log('User connected');

  socket.on('disconnect', function(){
    console.log('User disconnected');
    if (socket.username !== undefined) {
      socket.broadcast.emit('user left', {
      username: socket.username });
      if (connectedUsers.indexOf(socket.username) !== -1) {
        connectedUsers.splice(connectedUsers.indexOf(socket.username), 1);
      }
      updateUserList();
    } 
  });

  socket.on('send msg', function(msg) {
    var generated = generateMessage(msg.author, msg.message);
    io.emit('send msg', generated);
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
