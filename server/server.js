var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

const {Users} = require('./utils/users')
const {generateMessage} = require('./utils/message');

var users = new Users();
const port = process.env.PORT || 80;

app.use(require('express').static(__dirname + './../chat'));

io.on('connection', function(socket) {
  console.log('User connected');

  socket.on('disconnect', function() {
    console.log('User disconnected');

    var user = users.removeUser(socket.id);
    if (user) {
      updateUserList();
      io.emit('user left', user);
    };
  });

  socket.on('send msg', function(msg) {
    var generated = generateMessage(msg.author, msg.message);
    io.emit('new msg', generated);
  });

  socket.on('add user', function (username) {
    var user = users.addUser(socket.id, username);
    updateUserList();
    io.emit('user joined', user);
  });
});
    
function updateUserList(){
  io.emit('update users', users.getUserList());
};

http.listen(port, function(){
  console.log('Listening on ' + port);
});
