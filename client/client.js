// Global objects //
const canvas = document.getElementById("mazeCanvas");
const homeRadius = 10;
const currRadius = 10;
const mapSize = 0.003614; // approx. quarter mile

var homeLoc = null, currLoc = null;

function queryLocation(callback) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            if (homeLoc === null) {
                homeLoc = position.coords;
            }
            currLoc = position.coords;

            callback();
        },
        () => { alert("location error"); } // TODO more subtle text
    );
}

document.getElementById("setHome").onclick = function () {
    homeLoc = currLoc;
    // TODO extra confirmation, because hitting this mid-maze could be bad
};

document.getElementById("locUpdate").onclick = function () {
    step();
    document.getElementById("pings").innerHTML += currLoc.latitude;
    document.getElementById("pings").innerHTML += "&nbsp;";
    document.getElementById("pings").innerHTML += currLoc.longitude;
    document.getElementById("pings").innerHTML += "<br>";
};

function setup() {
    if (!navigator.geolocation) {
        alert("Your browser doesn't support Geolocation :(");
        return;
    }

    canvas.height = canvas.width;
}

function step() {
    queryLocation(() => {
        // TODO fetch other players' positions from server

        // TODO maze background
        var ctx = canvas.getContext("2d");
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
        // TODO label with initials?
    });
}

setup();
