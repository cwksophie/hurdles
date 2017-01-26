// constants
var PLAYER_SIZE = 30;
var HURDLE_SIZE = 50;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = 500;
canvas.width = 800;
var x = 20;
var y = 0;
var xSpeed = 0;
var ySpeed = 0;
var hurdles = [];
var level = 1;
var counter = 0;
var hurdlesJumped = 0
var playGame = true;

// setting up key listeners
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setInterval(update, 50);

function update() {
  if (playGame) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    updateHurdle();
    checkCollision();
    drawSquare(x, y, PLAYER_SIZE);
    counter += 1;
  }
}

function updatePlayer() {
  // arrow key movements
  if (rightPressed == true) {
    if (y >= (canvas.height - PLAYER_SIZE)) {
      xSpeed += 2;
    } else {
      xSpeed += 0.5;
    }
  }
  if (leftPressed == true) {
    if (y >= (canvas.height - PLAYER_SIZE)) {
      xSpeed -= 2;
    } else {
      xSpeed -= 0.5;
    }
  }
  if (upPressed == true && y >= (canvas.height - PLAYER_SIZE)) {
    ySpeed -= 18;
  }

  // apply gravity
  ySpeed += 1;

  // apply friction
  if (y >= (canvas.height - PLAYER_SIZE)) {
    xSpeed *= 0.8;
  } else {
    xSpeed *= 0.95;
  }
  if (Math.abs(xSpeed) < 0.05) {
    xSpeed = 0;
  }

  // detect hitting edge
  if ((y >= (canvas.height - PLAYER_SIZE - ySpeed)) && (ySpeed > 0)) {
    ySpeed = 0;
    y = canvas.height - PLAYER_SIZE;
  }
  if ((x < 0) && (xSpeed < 0)) {
    xSpeed = 0;
    x = 0;
  }
  if (x >= (canvas.width - PLAYER_SIZE - xSpeed) && xSpeed > 0) {
    xSpeed = 0;
    x = canvas.width - PLAYER_SIZE;
  }

  // update position
  x += xSpeed;
  y += ySpeed;
}

// update hurdles
function updateHurdle() {
  if (counter > (500 / (level + 2))) {
    createHurdle();
    counter = 0;
  }
  var remove = 0;
  for (var i = 0; i < hurdles.length; i++) {
    var hurdle = hurdles[i];
    hurdle.x += -2 * (level + 3);
    if (hurdle.x < -HURDLE_SIZE) {
      remove += 1;
      hurdlesJumped += 1;
      if (hurdlesJumped % 5 == 0) {
        level += 1;
      }
    }
    drawHurdle(hurdle);
  }
  for (var i = 0; i < remove; i++) {
    hurdles.shift();
  }
}

// check collision
function checkCollision() {
  for (var i = 0; i < hurdles.length; i++) {
    var hurdle = hurdles[i];
    if ((((x + PLAYER_SIZE > hurdle.x) &&
          (x + PLAYER_SIZE < hurdle.x + HURDLE_SIZE)) ||
        ((x < hurdle.x + HURDLE_SIZE) && (x > hurdle.x))) &&
      (y + PLAYER_SIZE > hurdle.y)) {
      console.log("Game over")
      playGame = false;
    }
  }
}

// create hurdles
function createHurdle() {
  hurdle = {
    x: canvas.width,
    y: canvas.height - HURDLE_SIZE
  };
  hurdles.push(hurdle);
}

function drawSquare(x, y, size) {
  ctx.beginPath();
  ctx.rect(x, y, size, size);
  ctx.fillStyle = "cyan";
  ctx.stroke();
  ctx.fill();
}

// draw hurdle
function drawHurdle(hurdle) {
  ctx.beginPath();
  ctx.rect(hurdle.x, hurdle.y, HURDLE_SIZE, HURDLE_SIZE);
  ctx.fillStyle = "orange";
  ctx.stroke();
  ctx.fill();
}

// handle key presses
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
  if (e.keyCode == 38) {
    upPressed = true;
  } else if (e.keyCode == 40) {
    downPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
  if (e.keyCode == 38) {
    upPressed = false;
  } else if (e.keyCode == 40) {
    downPressed = false;
  }
}