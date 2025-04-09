const TILE_SIZE = 10;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const MAX_RAND = 29;
const INITIAL_LENGTH = 3;
const DELAY = 140;

const KEY_CODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

let canvas, ctx;
let headImg, bodyImg, appleImg;
let snakeLength, snakeX = [], snakeY = [];
let appleX, appleY;
let direction = "RIGHT";
let inGame = true;

function initGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  headImg = new Image();
  headImg.src = "head.png";

  bodyImg = new Image();
  bodyImg.src = "dot.png";

  appleImg = new Image();
  appleImg.src = "apple.png";

  snakeLength = INITIAL_LENGTH;
  for (let i = 0; i < snakeLength; i++) {
    snakeX[i] = 100 - i * TILE_SIZE;
    snakeY[i] = 100;
  }

  placeApple();
  setTimeout(gameLoop, DELAY);
}

function placeApple() {
  appleX = Math.floor(Math.random() * MAX_RAND) * TILE_SIZE;
  appleY = Math.floor(Math.random() * MAX_RAND) * TILE_SIZE;
}

function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (inGame) {
    ctx.drawImage(appleImg, appleX, appleY);

    for (let i = 0; i < snakeLength; i++) {
      ctx.drawImage(i === 0 ? headImg : bodyImg, snakeX[i], snakeY[i]);
    }
  } else {
    showGameOver();
  }
}

function showGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "bold 18px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const points = snakeLength - INITIAL_LENGTH;
  ctx.fillText(`${points} ${points === 1 ? "punt" : "punts"} - Game Over`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

function gameLoop() {
  if (!inGame) return;

  checkAppleCollision();
  checkCollisions();
  moveSnake();
  draw();
  setTimeout(gameLoop, DELAY);
}

function moveSnake() {
  for (let i = snakeLength; i > 0; i--) {
    snakeX[i] = snakeX[i - 1];
    snakeY[i] = snakeY[i - 1];
  }

  switch (direction) {
    case "LEFT":  snakeX[0] -= TILE_SIZE; break;
    case "RIGHT": snakeX[0] += TILE_SIZE; break;
    case "UP":    snakeY[0] -= TILE_SIZE; break;
    case "DOWN":  snakeY[0] += TILE_SIZE; break;
  }
}

function checkAppleCollision() {
  if (snakeX[0] === appleX && snakeY[0] === appleY) {
    snakeLength++;
    placeApple();
  }
}

function checkCollisions() {
  for (let i = 1; i < snakeLength; i++) {
    if (snakeX[0] === snakeX[i] && snakeY[0] === snakeY[i]) {
      inGame = false;
    }
  }

  if (
    snakeX[0] < 0 || snakeX[0] >= CANVAS_WIDTH ||
    snakeY[0] < 0 || snakeY[0] >= CANVAS_HEIGHT
  ) {
    inGame = false;
  }
}

document.addEventListener("keydown", (e) => {
  const key = e.keyCode;
  switch (key) {
    case KEY_CODES.LEFT:
      if (direction !== "RIGHT") direction = "LEFT";
      break;
    case KEY_CODES.RIGHT:
      if (direction !== "LEFT") direction = "RIGHT";
      break;
    case KEY_CODES.UP:
      if (direction !== "DOWN") direction = "UP";
      break;
    case KEY_CODES.DOWN:
      if (direction !== "UP") direction = "DOWN";
      break;
  }
});