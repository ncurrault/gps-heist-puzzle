// Global objects //
const mapCan = document.getElementById("mapCanvas");
const mapCtx = mapCan.getContext("2d");
const mapSize = 0.003614; // approx. quarter mile

const revealCan = document.getElementById("revealCanvas");
const revealCtx = revealCan.getContext("2d");
const brushRadius = 20; // TODO playtest this
var lastCenter = null;

/* function for map canvas */

function clearMap() {
    mapCtx.beginPath();
    mapCtx.rect(0, 0, mapCan.width, mapCan.height);
    mapCtx.fillStyle = "black";
    mapCtx.fill();
}

function dot(x, y, r, col) {
    mapCtx.beginPath();
    mapCtx.arc(x, y, r, 0, 2 * Math.PI, false);
    mapCtx.fillStyle = col;
    mapCtx.fill();
}

/* https://stackoverflow.com/questions/15397036/drawing-dashed-lines-on-html5-canvas */
function dottedLine(x1, y1, x2, y2, col) {
    mapCtx.setLineDash([5, 3]); /* 5px dashes, 3px spaces */
    mapCtx.beginPath();
    mapCtx.moveTo(x1, y1);
    mapCtx.lineTo(x2, y2);
    mapCtx.strokeStyle = col;
    mapCtx.stroke();
}

function text(x, y, col, text) {
    mapCtx.font = "12px Arial";
    mapCtx.textAlign = "center";
    mapCtx.fillStyle = col;
    mapCtx.fillText(text, x, y);
}

function setup() {
    mapCan.height = mapCan.width;
    revealCan.height = revealCan.width;
    // TODO better aspect ratios (pending puzzle redesign)

    var img = new Image();

    img.onload = function() {
        revealCtx.drawImage(img, 0, 0, revealCan.width, revealCan.height);
    }
    img.src = '/resources/cover.png';
}

function revealDot(x, y){
    revealCtx.beginPath();
    revealCtx.arc(x, y, brushRadius, 0, 2*Math.PI, true);
    revealCtx.fillStyle = '#000';
    revealCtx.globalCompositeOperation = "destination-out";
    revealCtx.fill();
}

function revealPath(x1, y1, x2, y2) {
    if (x1 > x2) {
        return revealPath(x2, y2, x1, y1)
    }

    var slope = (y2 - y1) / (x2 - x1);
    for (var x = Math.floor(x1); x < x2; x++) {
        revealDot(x, slope * (x - x1) + y1);
    }

    // TODO steep/vertical lines
}

function update(locData) {
    clearMap();

    var midX = mapCan.width / 2, midY = mapCan.height / 2;
    var transformX = (x) => mapCan.width * x / mapSize + midX;
    var transformY = (y) => mapCan.height * y / mapSize + midY;

    // emphasize home with crosshairs through center
    dottedLine(mapCan, midX, 0, midX, mapCan.height, 'white');
    dottedLine(mapCan, 0, midY, mapCan.width, midY, 'white');

    // current location dot
    dot(transformX(locData.local.x), transformY(locData.local.y),
        5, 'blue');

    if (locData.server) {
        // avoid error when rendering before first server ping

        // mean of player positions
        var centerX = transformX(locData.server.center.x),
            centerY = transformY(locData.server.center.y);
        dot(centerX, centerY, 5, 'red');

        // draw users
        for (let p in locData.server.players) {
            dottedLine(transformX(locData.server.players[p].x),
                transformY(locData.server.players[p].y), centerX, centerY, 'red');
        }
        for (let p in locData.server.players) {
            if (!p) {
                continue; // avoid mysterious "undefined" label
            }
            text(transformX(locData.server.players[p].x),
                transformY(locData.server.players[p].y), 'white', p);
        }

        // update actual puzzle
        if (lastCenter) {
            revealPath(lastCenter.x, lastCenter.y, centerX, centerY);
        } else {
            revealDot(centerX, centerY);
        }
        lastCenter = {x: centerX, y: centerY};
    }
}

export { setup, update };
