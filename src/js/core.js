function startGame()
{
    cx = 480; // document.body.canvas.clientWidth;
    cy = 270; // document.body.canvas.clientHeight;
//    cx = document.body.canvas.clientWidth;
//    cy = document.body.canvas.clientHeight;
    gameArea.start(cx, cy);
    block = new component(30, 30, "red", 10, 120);
}

function component(width, height, color, x, y)
{
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx = gameArea.context
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function(cx, cy) {
        this.canvas.width = cx;
        this.canvas.height = cy;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}