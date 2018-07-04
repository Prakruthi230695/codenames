var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  socket.on('endTurn', function(data) {
    socket.broadcast.emit('endTurn');
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
