var mycanvas = document.getElementById("mycanvas");
var ctx = mycanvas.getContext("2d");

var box = {
    xPos: 20,
    yPos: 50,
    goLeft: false,
    goRight: false,
    goUp: false,
    goDown: false,
    move: function(){
        console.log(box.goLeft);
        if(box.goLeft){
            box.xPos = box.xPos - 5;
        }
        if(box.goRight){
            box.xPos += 5;
        }
        if(box.goUp){
            box.yPos -= 5;
        }
        if(box.goDown){
            box.yPos += 5;
        }
        console.log(box.xPos);
    },
    draw: function(){
        ctx.rect(box.xPos,box.yPos,20,20);
        ctx.stroke();
    }
}

document.addEventListener("keydown", function(evt){
    if(evt.keyCode === 37){
        box.goLeft = true;
    }
    if(evt.keyCode === 38){
        box.goUp = true;
    }
    if(evt.keyCode === 39){
        box.goRight = true;
    }
    if(evt.keyCode === 40){
        box.goDown = true;
    }

});

document.addEventListener("keyup", function(evt){
    if(evt.keyCode === 37){
        box.goLeft = false;
    }
    if(evt.keyCode === 38){
        box.goUp = false;
    }
    if(evt.keyCode === 39){
        box.goRight = false;
    }
    if(evt.keyCode === 40){
        box.goDown = false;
    }
})

function gameLoop(){
    ctx.beginPath();
    ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
    box.move();
    box.draw();
    window.requestAnimationFrame(gameLoop);
}
gameLoop();
