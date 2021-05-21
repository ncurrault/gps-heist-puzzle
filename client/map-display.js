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

function text(canvas, x, y, text) {
    var ctx = canvas.getContext("2d");
    ctx.font = "12px Arial";
    ctx.fillText(text, x, y);
}

function drawCanvas(locData) {
    canvas.height = canvas.width;
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
                transformY(locData.server.players[p].y), p);
        }
    }
}

export { drawCanvas };
