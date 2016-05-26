var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require('./public/Player.js');

var players;
var socket;

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  console.log("a user connected");
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
})


var server = http.listen(8080, function(){
  console.log('listening on *:8080');
  init();
});

function init(){
  players = [];
  socket = io.listen(server)
  
  seteventHandlers();
}

function seteventHandlers(){
  socket.sockets.on('connection', onSocketConnection)
}

function onSocketConnection(client){
  console.log('new Player has connected: ' + client.id);
  
  client.on('disconnect', onClientDisconnect);
  
  client.on('new player', onNewPlayer);
  
  client.on('move player', onMovePlayer);
}

function onClientDisconnect(){
  console.log('Player has disconnected: ' + this.id)
  
  var removePlayer = playerById(this.id);
  
  if(!removePlayer){
    console.log('Player on disconnect not found: ' + this.id)
    return
  }
  
  players.splice(players.indexOf(removePlayer), 1)
  
  this.broadcast.emit('remove player', {id: this.id});
}

function onNewPlayer(data){
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;
  
  this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()})

  var existingPlayer;
  for(var i = 0; i < players.length; i++){
    existingPlayer = players[i];
    this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()})
  }

  players.push(newPlayer);
  
  console.log(players);
  
}

function onMovePlayer (data) {
  console.log(data);
  // Find player in array
  var movePlayer = playerById(this.id)
  console.log(movePlayer);
  // Player not found
  if (!movePlayer) {
    util.log('Player not move found: ' + this.id)
    return
  }

  // Update player position
  movePlayer.setX(data.x)
  movePlayer.setY(data.y)

  // Broadcast updated position to connected socket clients
  this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()})
}


function playerById (id) {
  var i
  console.log("This is the players: " + players);
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i]
    }
  }

  return false
}