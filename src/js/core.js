var SPEED = 2;          // speed of player
var SPEED_ENEMY = 1;
var ENEMY_HEIGHT = 70;

var block;
var enemies = [];
var score;

function startGame() {
    cx = 480;
    cy = 270;
//    cx = document.body.canvas.clientWidth;
//    cy = document.body.canvas.clientHeight;
    block = new component(30, 30, "red", 10, 120);
    score = new component("30px", "Consolas",  "black", 280, 40, "text");
    gameArea.start(cx, cy);
}

function component(width, height, color, x, y, type) {
    this.type = type
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherObj) {
        var lSide = this.x;
        var rSide = this.x + (this.width);
        var tSide = this.y;
        var bSide = this.y + (this.height);
        
        var olSide = otherObj.x;
        var orSide = otherObj.x + (otherObj.width);
        var otSide = otherObj.y;
        var obSide = otherObj.y + (otherObj.height);
        
        var crash = true;
        if ((bSide < otSide) ||
            (tSide > obSide) ||
            (rSide < olSide) ||
            (lSide > orSide)) {
            crash = false;
        }
        return crash;
    }
}

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function(cx, cy) {
        this.canvas.width = cx;
        this.canvas.height = cy;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e) {
            gameArea.keys[e.keyCode] = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function everyInterval(n) {
    if ((gameArea.frameNo/n)%1 == 0) {return true;}
    return false;
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < enemies.length; i += 1) {
        if (block.crashWith(enemies[i])) {
            gameArea.stop();
            return;
        }
    }
    gameArea.clear();
    gameArea.frameNo += 1;
    block.speedX = 0;
    block.speedY = 0;
    if (gameArea.keys && gameArea.keys[37]) {block.speedX = -SPEED; }
    if (gameArea.keys && gameArea.keys[39]) {block.speedX = SPEED; }
    if (gameArea.keys && gameArea.keys[38]) {block.speedY = -SPEED; }
    if (gameArea.keys && gameArea.keys[40]) {block.speedY = SPEED; }
    if (gameArea.frameNo == 1 || everyInterval(150)) {
        x = gameArea.canvas.width;
        y = gameArea.canvas.height - ENEMY_HEIGHT;
        enemies.push(new component(30, ENEMY_HEIGHT, "green", x, y))
    }
    
    for (i = 0; i < enemies.length; i += 1) {
        enemies[i].x -= SPEED_ENEMY;
        enemies[i].update();
    }
    score.text = "SCORE: " + Math.trunc(gameArea.frameNo/2);
    score.update();
    block.newPos();
    block.update();
}