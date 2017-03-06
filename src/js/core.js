var SPEED = 0;          // speed of player
var SPEED_ENEMY = 5;

var ACCEL_GRAVITY = 0.8;
var SPEED_IMPULSE = 12;

var ENEMY_HEIGHT = 30;

var block;          // block object (player)
var enemies = [];   // list of enemy objects
var score;

// init canvas
function startGame() {
    cx = 480;
    cy = 270;
    block = new component(30, 30, "red", 10, 120);
    score = new component("30px", "Consolas",  "black", 280, 40, "text");
    gameArea.start(cx, cy);
}

// component object (block (player), enemies, score)
function component(width, height, color, x, y, type) {
    this.type = type    // only valid type is "text",
                        // none needed for block or enemy
    this.width = width;
    this.height = height;
    
    // current position
    this.x = x;
    this.y = y;
    
    // current speed
    this.speedX = 0;
    this.speedY = 0;
    
    // current acceleration
    this.gravity = ACCEL_GRAVITY;
    this.gravity_speed = 0;
    
    // handles color, size
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
    
    // handles position
    this.newPos = function() {
        this.gravity_speed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravity_speed;
        this.hitBottom();
    }
    
    this.impulseUp = function() {
        this.gravity_speed = -(SPEED_IMPULSE);
    }
    
    this.hitBottom = function() {
        var rockbottom = gameArea.canvas.height - this.height;
        console.log("ROCKBOTTOM: ", rockbottom);
        if (this.y >= rockbottom) {
            this.y = rockbottom;
            this.speedY = 0;
            return true;
        } else {
            return false;
        }
    }
    
    // handles component collision
    this.crashWith = function(otherObj) {
        
        // edges of this component (hitbox)
        var lSide = this.x;
        var rSide = this.x + (this.width);
        var tSide = this.y;
        var bSide = this.y + (this.height);
        
        // edges of the other component (eg. ol is "other left")
        var olSide = otherObj.x;
        var orSide = otherObj.x + (otherObj.width);
        var otSide = otherObj.y;
        var obSide = otherObj.y + (otherObj.height);
        
        // check if an edge of this component
        // overlaps with an edge of the other
        // component
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

function everyInterval(n) {
    if ((gameArea.frameNo/n)%1 == 0) {return true;}
    return false;
}

// main update function
function updateGameArea() {
    
    // check for collisions
    var x, y;
    for (i = 0; i < enemies.length; i += 1) {
        if (block.crashWith(enemies[i])) {
            gameArea.stop();
            return;
        }
    }
    
    // clear game area
    gameArea.clear();
    gameArea.frameNo += 1;
    
    // main update function starts here
    block.speedX = 0;
    block.speedY = 0;
    
    // spawn new block
    if (gameArea.frameNo == 1 || everyInterval(150)) {
        x = gameArea.canvas.width;
        y = gameArea.canvas.height - ENEMY_HEIGHT;
        enemies.push(new component(30, ENEMY_HEIGHT, "green", x, y))
    }
    
    // update each enemy
    for (i = 0; i < enemies.length; i += 1) {
        enemies[i].x -= SPEED_ENEMY;
        enemies[i].update();
    }
    
    // if enemy leaves the screen, remove it from list
    if (enemies.length > 0) {
        if (enemies[0].x < -enemies[0].width) {
            enemies.shift();
        }
    }
    console.log(enemies.length);
    
    // output current score
    score.text = "SCORE: " + Math.trunc(gameArea.frameNo/2);
    score.update();
    
    // key inputs
    if (gameArea.keys && gameArea.keys[37]) {block.speedX = -SPEED; }
    if (gameArea.keys && gameArea.keys[39]) {block.speedX = SPEED; }
    if (gameArea.keys && gameArea.keys[40]) {
        console.log("DOWN BUTTON PRESSED")
    }
    if (gameArea.keys && gameArea.keys[38]) {
        if (block.hitBottom()) {
            block.impulseUp();
            console.log(block.speedY);

        }
    }
    
    // update block
    block.newPos();
    block.update();
    console.log("--------------------------------");
    console.log(block.hitBottom());
    console.log(block.y);
    console.log(block.gravity_speed);
    console.log("--------------------------------");
}

// main canvas
var gameArea = {
    canvas : document.createElement("canvas"),
    
    // init
    start : function(cx, cy) {
        this.canvas.width = cx;
        this.canvas.height = cy;
        
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        
        // add key press listeners
        window.addEventListener('keydown', function(e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e) {
            gameArea.keys[e.keyCode] = false;
        })
    },
    
    // called after every frame to update components
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    // game over
    stop : function() {
        clearInterval(this.interval);
    }
}