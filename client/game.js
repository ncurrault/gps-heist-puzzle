import * as Loc from "./location.js"
import * as Map from "./map-display.js"

// How often to push/pull data from the server; ms
const pushInterval = 1000;

var locData = {
    local: null,
    server: null
};

// Connect to the socket.io server
const socket = io();

// Lobby //
function lobbyError(error) {
    document.getElementById("lobbyError").hidden = false;
    document.getElementById("lobbyError").innerText = error;
    console.log(error);
}
// See: https://stackoverflow.com/questions/5384712/intercept-a-form-submit-in-javascript-and-prevent-normal-submission
function registerPlayer(e) {
    e.preventDefault();
    const username = e.target[0].value;
    // TODO stack group

    var locationErr = Loc.setup(onLocUpdate, lobbyError, () => {
        // When location setup is successful, attempt to register this player
        socket.emit("register", username);
    });
}
document.getElementById("lobbyForm").addEventListener("submit", registerPlayer);

function startGame() {
    Map.setup();

    // Replace lobby HTML with game HTML
    document.getElementById("lobby").hidden = true;
    document.getElementById("game").hidden = false;

    socket.on("serverUpdate", onServerUpdate);

    window.setInterval(() => {
        socket.emit("clientUpdate", locData.local);
    }, pushInterval);

    // buttons
    document.getElementById("setHome").onclick = function () {
        var response = confirm("Are you sure you want to move to the origin?");
        if (response) {
            Loc.resetHome();
        }
    };
    // TODO reset button?
}

socket.on("registerSuccess", startGame);
socket.on("registerFailed", lobbyError);

// Graphics updates prompted by either (local) loc change or server ping
function graphicsStep() {
    Map.update(locData);
}

function onLocUpdate(newLoc) {
    locData.local = newLoc;
    graphicsStep();
}
function onServerUpdate(serverData) {
    locData.server = serverData;

    // TODO list other users somewhere else in the interface?
    graphicsStep();
}
