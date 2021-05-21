// Global objects //
const canvas = document.getElementById("mazeCanvas");
const homeRadius = 10;
const currRadius = 10;
const mapSize = 0.003614; // approx. quarter mile

function clear(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
}

function dot(canvas, x, y, r, col) {
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = col;
    ctx.fill();
}

/* https://stackoverflow.com/questions/15397036/drawing-dashed-lines-on-html5-canvas */
function dottedLine(canvas, x1, y1, x2, y2, col) {
    var ctx = canvas.getContext("2d");

    ctx.setLineDash([5, 3]); /* 5px dashes, 3px spaces */
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = col;
    ctx.stroke();
}

function drawCanvas(locData) {
    canvas.height = canvas.width;
    clear(canvas);

    var midX = canvas.width / 2, midY = canvas.height / 2;

    // home
    dottedLine(canvas, midX, 0, midX, canvas.height, 'white');
    dottedLine(canvas, 0, midY, canvas.width, midY, 'white');

    // current dot
    var currX = canvas.width * locData.local.x / mapSize + midX;
    var currY = canvas.height * locData.local.y / mapSize + midY;
    dot(canvas, midX, midY, 5, 'blue');

    // TODO draw other users, each labelled with initials
    // TODO draw mean pos as a dot
}

export { drawCanvas };
