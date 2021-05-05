// Global objects //
const canvas = document.getElementById("mazeCanvas");

function setup() {
    canvas.height = canvas.width;

    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
}

document.getElementById("setHome").onclick = function () {
    /* TODO */
};

setup();
