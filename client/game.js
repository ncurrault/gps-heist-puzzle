// import { io } from "socket.io-client";
import * as Loc from "./location.js"
import * as Map from "./map-display.js"

// How often to tell our current tilt to the server; ms
const pushInterval = 5000;

// Connect to the server
// const socket = io();

// Lobby //
// See: https://stackoverflow.com/questions/5384712/intercept-a-form-submit-in-javascript-and-prevent-normal-submission
function registerPlayer(e) {
    e.preventDefault();
    const username = e.target[0].value;
    // TODO stack group

    // Attempt to register this player
    // socket.emit("register", username);
    startGame();
}
document.getElementById("lobbyForm").addEventListener("submit", registerPlayer);

function startGame() {
    // Replace lobby HTML with game HTML
    document.getElementById("lobby").hidden = true;
    document.getElementById("game").hidden = false;

    // TODO socoket handlers
    // window.setInterval(() => {
    //     // TODO update loc, send relative loc to server
    // }, pushInterval);

    // TODO reset button
}

// socket.on("registerSuccess", startGame);
// socket.on("registerFailed", (error) => {
//     document.getElementById("lobbyError").hidden = false;
//     document.getElementById("lobbyError").innerText = error;
//     console.log(error);
// });


// Main loop
function step() {
    Loc.queryLocation();
    Map.drawCanvas({
        currLoc: Loc.currLoc,
        homeLoc: Loc.homeLoc
    });
}

document.getElementById("setHome").onclick = function () {
    Loc.resetHome();
    // TODO extra confirmation, because hitting this mid-maze could be bad
};

document.getElementById("locUpdate").onclick = function () {
    step();
    document.getElementById("pings").innerHTML += Loc.currLoc.latitude;
    document.getElementById("pings").innerHTML += "&nbsp;";
    document.getElementById("pings").innerHTML += Loc.currLoc.longitude;
    document.getElementById("pings").innerHTML += "<br>";
};
