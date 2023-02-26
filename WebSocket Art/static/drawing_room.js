const sock = io();
var me = null;

// Main Socket Stuff
sock.on("connect", function() {
    sock.emit("new");
});

sock.on("accepted", function(id) {
    me = id;
});

// Drawing Stuff (and a little bit of sockets)
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "red";
var isMousePressed = false;
var size = 10;

function setColor(newColor) {
    ctx.fillStyle = newColor;
}

function setSize(newSize) {
    size = parseInt(newSize);
}

canvas.addEventListener("click", e => {
    ctx.fillRect(e.clientX - 10, e.clientY - 50, size, size);
    sock.emit("draw", {x: e.clientX, y: e.clientY, size: size, ignore: me, color: ctx.fillStyle});
});

canvas.addEventListener("mousedown", () => {
    isMousePressed = true;
});

canvas.addEventListener("mouseup", () => {
    isMousePressed = false;
});

canvas.addEventListener("mousemove", (e) => {
    if(isMousePressed) {
        ctx.fillRect(e.clientX - 10, e.clientY - 50, size, size);
        sock.emit("draw", {x: e.clientX, y: e.clientY, size: size, ignore: me, color: ctx.fillStyle});
    }
});

const colorSelector = document.getElementById("select-color");
const sizeChanger = document.getElementById("set-size");

colorSelector.addEventListener("change", e => {
    setColor(e.target.value);
});

sizeChanger.addEventListener("change", e => {
    setSize(e.target.value);
});

sock.on("draw", function(data) {
    let prevColor = ctx.fillStyle;
    ctx.fillStyle = data.color;
    ctx.fillRect(data.x - 10, data.y - 50, data.size, data.size);
    ctx.fillStyle = prevColor;
});