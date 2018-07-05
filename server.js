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
  socket.on('guess', function(groupedWord) {
    socket.broadcast.emit('guess', groupedWord);
  });
  socket.on('newGame', function(groupedWords) {
    socket.broadcast.emit('newGame', groupedWords);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
