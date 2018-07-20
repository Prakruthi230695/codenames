const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

const STATIC_REL_PATH = 'client/build'
const PORT = process.env.PORT || 3001;
const INDEX = path.join(__dirname, STATIC_REL_PATH, 'index.html');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(STATIC_REL_PATH));
};

app.get('/*', function(req, res){
  res.sendFile(INDEX);
});

io.on('connection', function(socket){

  const url = socket.request.headers.referer;
  const room = url.split(".com", 2)[1];
  // const room = url.split("3000", 2)[1];
  socket.join(room);

  socket.on('endTurn', function() {
    socket.to(room).emit('endTurn');
  });
  socket.on('guess', function(groupedWord) {
    socket.to(room).emit('guess', groupedWord);
  });
  socket.on('newGame', function(groupedWords) {
    socket.to(room).emit('newGame', groupedWords);
  });
  socket.on('joiningGame', function(gameData, newPlayerID) {
    socket.to(newPlayerID).emit('joiningGame', gameData);
  });

  // Setting up the game: get current game if joining; make a new one if no one
  // else in the room yet.
  io.in(room).clients((error, clients) => {
    if (error) {
      throw error;
    }
    if (clients.length === 1) {
      io.in(room).emit('createNewGame');
    } else {
      const activePlayerID = clients[0] !== socket.id ? clients[0] : clients[1];
      socket.to(activePlayerID).emit('needGameData', socket.id);
    }
  });
});

http.listen(PORT, function(){
  console.log(`listening on ${ PORT }`);
});
