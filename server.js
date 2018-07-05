var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  socket.on('endTurn', function() {
    socket.broadcast.emit('endTurn');
  });
  socket.on('guess', function(word) {
    socket.broadcast.emit('guess', word);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
