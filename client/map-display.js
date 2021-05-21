// Global objects //
// TODO refactor all canvases/contexts into globals
const canvas = document.getElementById("mapCanvas");
const mapSize = 0.003614; // approx. quarter mile

const revealCanvas = document.getElementById("revealCanvas");
var lastCenter = null;
const brushRadius = 20; // TODO playtest this

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

function text(canvas, x, y, col, text) {
    var ctx = canvas.getContext("2d");
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = col;
    ctx.fillText(text, x, y);
}

function setup() {
    var revealCtx = revealCanvas.getContext("2d");

    var img = new Image();

    img.onload = function(){
        revealCtx.drawImage(img, 0, 0, revealCanvas.width, revealCanvas.height);
    }
    img.loc = '/resources/';
    img.filename = 'cover.png';
    img.src = img.loc + img.filename;
}

function revealDot(ctx, x, y){
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, 2*Math.PI, true);
    ctx.fillStyle = '#000';
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill();
}

function revealPath(ctx, x1, y1, x2, y2) {
    if (x1 > x2) {
        return revealPath(ctx, x2, y2, x1, y1)
    }

    var slope = (y2 - y1) / (x2 - x1);
    for (var x = Math.floor(x1); x < x2; x++) {
        revealDot(ctx, x, slope * (x - x1) + y1);
    }

    // TODO vertical lines
}

function update(locData) {
    canvas.height = canvas.width;
    revealCanvas.height = revealCanvas.width;

    clear(canvas);

    var midX = canvas.width / 2, midY = canvas.height / 2;
    var transformX = (x) => canvas.width * x / mapSize + midX;
    var transformY = (y) => canvas.height * y / mapSize + midY;

    // emphasize home with crosshairs through center
    dottedLine(canvas, midX, 0, midX, canvas.height, 'white');
    dottedLine(canvas, 0, midY, canvas.width, midY, 'white');

    // current location dot
    dot(canvas, transformX(locData.local.x), transformY(locData.local.y),
        5, 'blue');

    if (locData.server) {
        // avoid error when rendering before first server ping

        // mean of player positions
        var centerX = transformX(locData.server.center.x),
            centerY = transformY(locData.server.center.y);
        dot(canvas, centerX, centerY, 5, 'red');

        // draw users
        for (let p in locData.server.players) {
            dottedLine(canvas, transformX(locData.server.players[p].x),
                transformY(locData.server.players[p].y), centerX, centerY, 'red');
        }
        for (let p in locData.server.players) {
            if (!p) {
                continue; // avoid mysterious "undefined" label
            }
            text(canvas, transformX(locData.server.players[p].x),
                transformY(locData.server.players[p].y), 'white', p);
        }
    }

    // update actual puzzle
    var revealCtx = revealCanvas.getContext("2d");
    if (lastCenter) {
        revealPath(revealCtx, lastCenter.x, lastCenter.y, centerX, centerY);
    } else {
        revealDot(revealCtx, centerX, centerY);
    }
    lastCenter = {x: centerX, y: centerY};
}

export { setup, update };
