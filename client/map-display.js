// Global objects //
const canvas = document.getElementById("mazeCanvas");
const homeRadius = 10;
const currRadius = 10;
const mapSize = 0.003614; // approx. quarter mile

function drawCanvas(locData) {
    // TODO data structure that gives *everyone's* relative position
    // and move the rel. pos. calculation out of this file
    var currLoc = locData.currLoc;
    var homeLoc = locData.homeLoc;

    canvas.height = canvas.width;

    var ctx = canvas.getContext("2d");

    // TODO the actual puzzle
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();

    var midX = canvas.width / 2, midY = canvas.height / 2;

    // home dot
    ctx.beginPath();
    ctx.arc(midX, midY, homeRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();

    // current dot
    var currX = canvas.width * (currLoc.latitude - homeLoc.latitude) / mapSize + midX;
    var currY = canvas.height * (currLoc.longitude - homeLoc.longitude) / mapSize + midY;

    ctx.beginPath();
    ctx.arc(currX, currY, currRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();

    // TODO label with initials? and also draw others
}

export { drawCanvas };
