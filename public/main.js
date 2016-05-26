var mycanvas = document.getElementById("mycanvas");
var ctx = mycanvas.getContext("2d");
var socket;
var enemies = [];

socket = io.connect();
setEventHandlers();
function setEventHandlers(){
      // Socket connection successful
  socket.on('connect', onSocketConnected);

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect);

  // New player message received
  socket.on('new player', onNewPlayer);

  // Player move message received
  socket.on('move player', onMovePlayer);

  // Player removed message received
  socket.on('remove player', onRemovePlayer);
}

// Socket connected
function onSocketConnected () {
  console.log('Connected to socket server')

  // Reset enemies on reconnect
  enemies.forEach(function (enemy) {
    enemy.player.kill()
  })
  enemies = []

  // Send local player data to the game server
  socket.emit('new player', { x: player.x, y: player.y })
}

// Socket disconnected
function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}

// New player
function onNewPlayer (data) {
  console.log('New player connected:', data.id)

  // Avoid possible duplicate players
  var duplicate = playerById(data.id)
  if (duplicate) {
    console.log('Duplicate player!')
    return
  }

  // Add new player to the remote players array
  enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y))
}

// Move player
function onMovePlayer (data) {
  var movePlayer = playerById(data.id)

  // Player not found
  if (!movePlayer) {
    console.log('Player not found: ', data.id)
    return
  }
  // Update player position
  movePlayer.player.x = data.x
  movePlayer.player.y = data.y
}

// Remove player
function onRemovePlayer (data) {
  var removePlayer = playerById(data.id)

  // Player not found
  if (!removePlayer) {
    console.log('Player not found: ', data.id)
    return
  }
  removePlayer.player.kill()
  // Remove player from array
  enemies.splice(enemies.indexOf(removePlayer), 1)
}



var player = {
    xPos: 20,
    yPos: 50,
    goLeft: false,
    goRight: false,
    goUp: false,
    goDown: false,
    move: function(){
        if(player.goLeft){
            player.xPos = player.xPos - 5;
        }
        if(player.goRight){
            player.xPos += 5;
        }
        if(player.goUp){
            player.yPos -= 5;
        }
        if(player.goDown){
            player.yPos += 5;
        }
    },
    draw: function(){
        ctx.rect(player.xPos,player.yPos,20,20);
        ctx.stroke();
    }
}

document.addEventListener("keydown", function(evt){
    if(evt.keyCode === 37){
        player.goLeft = true;
    }
    if(evt.keyCode === 38){
        player.goUp = true;
    }
    if(evt.keyCode === 39){
        player.goRight = true;
    }
    if(evt.keyCode === 40){
        player.goDown = true;
    }

});

document.addEventListener("keyup", function(evt){
    if(evt.keyCode === 37){
        player.goLeft = false;
    }
    if(evt.keyCode === 38){
        player.goUp = false;
    }
    if(evt.keyCode === 39){
        player.goRight = false;
    }
    if(evt.keyCode === 40){
        player.goDown = false;
    }
})

function gameLoop(){

    ctx.beginPath();
    ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
    player.move();
    player.draw();
    window.requestAnimationFrame(gameLoop);
}
gameLoop();
