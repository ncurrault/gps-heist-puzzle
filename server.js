"use strict";

const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 42069;
const pushInterval = 1000; // How often to push data to all players, ms

app.use(express.static("client", { maxage: 0 }));

// TODO handle multiple games
var gameData = {
    players: {},
    center: {x: 0.0, y: 0.0},
    playerSockets: {}
};

function recomputeCenter() {
    var xSum = 0.0, ySum = 0.0, n = 0;
    for (let p in gameData.players) {
        if (! gameData.players[p]) {
            continue; // avoid crashing server in (rare?) cases
        }

        xSum += gameData.players[p].x;
        ySum += gameData.players[p].y;
        n++;
    }
    if (n == 0)
        n++;
    gameData.center = {x: xSum / n, y: ySum / n};
    // TODO tracking previous centers may be necessary to reveal codeword
}

// socket.io
io.on("connection", (socket) => {
    console.log(`[${socket.id}] Client connected.`);

    socket.on("disconnect", () => {
        delete gameData.playerSockets[socket.username];
        delete gameData.players[socket.username];

        console.log(`[${socket.id}] Client disconnected.`);
    });

    socket.on("register", (username) => {
        if (Object.keys(gameData.players).includes(username)) {
            socket.emit("registerFailed", "A player has already registered with those initials.");
            return;
        }

        gameData.players[username] = {x: 0.0, y: 0.0};
        gameData.playerSockets[username] = socket;

        socket.username = username;
        console.log(
            `[${socket.id}] Registered user ${username} for game`
        );

        socket.emit("registerSuccess");
    });

    socket.on("clientUpdate", (data) => {
        if (! socket.username in gameData.players) {
            return; // avoid crashing server in (rare?) cases
        }

        gameData.players[socket.username] = data;
        recomputeCenter();
    });
});

// Periodically send control and reset signal to all in all games
function sendUpdate() {
    for (let user in gameData.players) {
        if (! gameData.playerSockets[user]) {
            continue; // avoid crashing server in (rare?) cases
        }

        gameData.playerSockets[user].emit("serverUpdate", {
            players: gameData.players,
            center: gameData.center
        });
    }
}
setInterval(sendUpdate, pushInterval);

// TODO admin API for resetting game
// TODO 2: way to watch without playing? good for sherpas

http.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}.`);
});
