const canvasEl = document.getElementById("myCanvas");
const penEl = document.getElementById("pen");
const eraseEl = document.getElementById("erase");
const undoEl = document.getElementById("undo");
const ctx = canvasEl.getContext("2d");

let position = { x: 0, y: 0 };
let { x, y } = position;
let fontColor = "#FF0000";
const boardColor = "#383838";
const width = 10;
let isPen = true;
let isEraser = false;
let lastTaskPerformed = [];

function resize() {
  ctx.canvas.height = window.innerHeight;
  ctx.canvas.width = window.innerWidth;
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

resize();
window.addEventListener("resize", resize);

canvasEl.addEventListener("mouseenter", setPos);
canvasEl.addEventListener("mousemove", draw);
canvasEl.addEventListener("mousedown", setPos);
canvasEl.addEventListener("mousedown", setDrawRange);
canvasEl.addEventListener("mouseup", setDrawRange);

penEl.addEventListener("click", setPenHandler);
eraseEl.addEventListener("click", setEraserHandler);
undoEl.addEventListener("click", undoHandler);

function setDrawRange() {
  lastTaskPerformed.push("flag");
}

function setPenHandler() {
  isPen = true;
  isEraser = false;
  fontColor = "#FF0000";
  penEl.classList.add("nav-icons-selected");
  eraseEl.classList.remove("nav-icons-selected");
}

function setEraserHandler() {
  isPen = false;
  isEraser = true;
  fontColor = boardColor;
  penEl.classList.remove("nav-icons-selected");
  eraseEl.classList.add("nav-icons-selected");
}

function setPos(event) {
  x = event.clientX;
  y = event.clientY;
}

function draw(event) {
  if (event.buttons !== 1) return;

  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.strokeStyle = fontColor;
  ctx.moveTo(x, y);
  let moveX = x,
    moveY = y;
  setPos(event);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.closePath();

  if (lastTaskPerformed.length >= 5000) {
    checkOperationStack();
  }

  lastTaskPerformed.push({
    moveX: moveX,
    moveY: moveY,
    lineX: x,
    lineY: y,
    pen: isPen,
    eraser: isEraser,
    fontColor: fontColor,
  });
}

function checkOperationStack() {
  lastTaskPerformed.shift();
  for (let i = 0; i < lastTaskPerformed.length; i++) {
    if (lastTaskPerformed[i] === "flag") {
      lastTaskPerformed.shift();
      return;
    }
  }
}

function undoHandler() {
  removeOperationRange();
  redraw();
}

function removeOperationRange() {
  lastTaskPerformed.pop();
  for (let i = lastTaskPerformed.length - 1; i >= 0; i--) {
    if (lastTaskPerformed[i] === "flag") {
      lastTaskPerformed.pop();
      return;
    }
    lastTaskPerformed.pop();
  }
}

function redraw() {
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = 0; i < lastTaskPerformed.length; i++) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = lastTaskPerformed[i].fontColor;
    ctx.moveTo(lastTaskPerformed[i].moveX, lastTaskPerformed[i].moveY);
    ctx.lineTo(lastTaskPerformed[i].lineX, lastTaskPerformed[i].lineY);
    ctx.stroke();
    ctx.closePath();
  }
}
