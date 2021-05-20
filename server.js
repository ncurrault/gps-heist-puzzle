"use strict";

const express = require("express");
const http = require("http");

const app = express();
const port = process.env.PORT || 42069

const { Server } = require("socket.io");
const pushInterval = 1000; // How often to push data to all players, ms
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static("client", { maxage: 0 }));
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}.`);
});

// TODO handle multiple games
var gameData = {
    players: {},
    center: {x: 0.0, y: 0.0}
};

function reomputeCenter() {
    // TODO
}

// socket.io
io.on("connection", (socket) => {
    console.log(`[${socket.id}] Client connected.`);

    socket.on("disconnect", () => {
        // TODO remove user, recompute?
        console.log(`[${socket.id}] Client disconnected.`);
    });

    socket.on("register", (username) => {
        if (Object.keys(users).includes(username)) {
            socket.emit("registerFailed", "A player has already registered with those initials.");
            // TODO check if this causes problems when trying to reconnect
            return;
        }

        gameData[username] = {
            sock: socket,
            data: null
        };

        socket.username = username;
        console.log(
            `[${socket.id}] Registered user ${username} for game ${gameUUID}`
        );

        socket.emit("registerSuccess");
    });

    socket.on("clientUpdate", (data) => {
        gameData.players[socket.username].data = data;
        recomputeCenter();
    });
});

// Periodically send control and reset signal to all in all games
function sendUpdate() {
    for (let user in gameData.players) {
        user.sock.emit("serverUpdate", gameData);
    }
}
setInterval(sendUpdate, pushInterval);
