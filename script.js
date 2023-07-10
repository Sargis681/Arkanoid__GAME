const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const container__lives = document.querySelector(".container__lives");
const container__restart = document.querySelector(".container__restart");
const container__heart = document.querySelector(".container__heart");
let container__goGame = document.querySelector(".container__goGame");
let contanier__startid = document.querySelector(".contanier__startid");
let start = document.querySelector(".start");
let heart = 3;
const bricks = [];
let cot__go = true;
let gameStarted = false;
let oneStart = true;
document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

let roundsPlayed = 3;
const paddle = {
  x: 300,
  y: 470,
  width: 200,
  height: 10,
  color: "orange",
};

const ball = {
  x: paddle.width + paddle.width,
  y: paddle.y - 10,
  radius: 10,
  dx: 0,
  dy: 0,
  speed: -2,
  color: "blue",
};

let animationId;
container__heart.innerHTML = `press to tab`;
document.addEventListener("keydown", startPaddle);

function startPaddle(event) {
  if (
    event.keyCode === 32 &&
    ball.dx === 0 &&
    ball.dy === 0 &&
    cot__go === false&& 
    bricks.length>=0
  ) {
    console.log(ball.y);
    console.log(container__goGame);
    if (roundsPlayed !== 0 && container__goGame) {
      requestAnimationFrame(draw);
      const randomDirection = Math.random() >= 0.5 ? 1 : -1;
      ball.dx = ball.speed * randomDirection;
      ball.dy = ball.speed;
      gameStarted = true;
    }
  }
}

function drawPaddle() {
  context.fillStyle = paddle.color;
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = ball.color;
  context.fill();
  context.closePath();
}

function drawBricks() {
  bricks.forEach((brick) => {
    context.fillStyle = brick.color;
    context.fillRect(brick.x, brick.y, brick.width, brick.height);
  });

  if (bricks.length === 0) {
    container__restart.innerHTML = `
    <div class="container__winstart">You win</div>`;
    cancelAnimationFrame(animationId);
    container__lives.remove();
  }
}
function allDraw() {
  drawPaddle();
  drawBall();
  drawBricks();
  updateBallPosition();
  movePaddle();

  oneStart = false;
  cancelAnimationFrame(animationId);
}

// brickLength.innerHTML = ""
function draw() {
  container__heart.innerHTML = "";
  
  let brickLength = document.createElement("span");
  brickLength.innerHTML = `The number of available blocks: ${
    bricks.length - 1
  }`;
  context.clearRect(0, 0, canvas.width, canvas.height);
  allDraw();
  console.log("ayo");

  animationId = requestAnimationFrame(draw);

  container__heart.append(brickLength);

  if (ball.y + ball.radius >= canvas.height) {
    roundsPlayed--;

    resetBall();
    if (roundsPlayed === 1) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      allDraw();
      cancelAnimationFrame(animationId);
    }
    if (roundsPlayed === 2) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      allDraw();
      resetBall();
      cancelAnimationFrame(animationId);
    }
    if (roundsPlayed === 0 && bricks.length !== 0) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      allDraw();
      cancelAnimationFrame(animationId);
      gameOver();
    }
  }
  for (let index = 0; index < roundsPlayed; index++) {
    container__heart.innerHTML += `<img src="./images/heart.png" alt="">`;
  }
  container__lives.innerHTML = `You have ${heart} attempts / ${roundsPlayed}`;
}

function collideRect(circle, rect) {
  let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
  let distanceX = circle.x - closestX;
  let distanceY = circle.y - closestY;

  return (
    distanceX * distanceX + distanceY * distanceY <=
    circle.radius * circle.radius
  );
}

function updateBallPosition() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (collideRect(ball, paddle)) {
    if (ball.y + ball.radius <= paddle.y) {
      ball.dy *= -1;
      ball.y = paddle.y - ball.radius;
    } else if (ball.x <= paddle.x + ball.radius) {
      ball.dx *= -1;
      ball.x = paddle.x - ball.speed - ball.radius;
    } else {
      ball.dx *= -1;
      ball.x = paddle.x + paddle.width + ball.speed + ball.radius;
    }
  }

  if (
    ball.x + ball.radius >= canvas.width - ball.speed ||
    ball.x - ball.radius <= ball.speed
  ) {
    ball.dx = -ball.dx;
  }

  if (ball.y - ball.radius <= 0) {
    ball.dy = -ball.dy;
  }

  for (let index = 0; index < bricks.length; index++) {
    const brick = bricks[index];

    if (collideRect(ball, brick)) {
      bricks.splice(index, 1);

      if (
        ball.y + ball.radius + ball.speed <= brick.y ||
        ball.y >= brick.y + brick.height + ball.speed
      ) {
        ball.dy *= -1;
      } else {
        ball.dx *= -1;
      }
      break;
    }
  }
}
if (ball.y + ball.radius >= canvas.height) {
}
function resetBall() {
  ball.x = paddle.x + 100;
  ball.y = canvas.height - 42;
  ball.dx = 0;
  ball.dy = 0;
  gameStarted = false;
}

let leftPressed = false;
let rightPressed = false;

function keydown(event) {
  if (event.key === "ArrowLeft") {
    if (paddle.x - 5 >= 0) {
      leftPressed = true;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      drawBall();
      drawBricks();
      if (ball.dx === 0 && ball.dy === 0) {
        ball.x -= 5;
        paddle.x -= 5;
      }

      console.log("every");
    }
  } else if (event.key === "ArrowRight") {
    if (paddle.x <= canvas.width - paddle.width - 5) {
      rightPressed = true;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      drawBall();
      drawBricks();
      if (ball.dx === 0 && ball.dy === 0) {
        ball.x += 5;
        paddle.x += 5;
      }
    }
  }
}

function keyup(event) {
  if (event.key === "ArrowLeft") {
    leftPressed = false;
  } else if (event.key === "ArrowRight") {
    rightPressed = false;
  }
}

function movePaddle() {
  if (leftPressed && paddle.x - 5 >= 0) {
    paddle.x -= 5;

    if (!gameStarted) {
      ball.x -= 5;
    }
  } else if (rightPressed && paddle.x <= canvas.width - paddle.width - 5) {
    paddle.x += 5;
    if (!gameStarted) {
      ball.x += 5;
    }
  }
}

function generateBricks() {
  const rows = Math.floor(Math.random() * 6) + 3;
  const brickHeight = 20;

  for (let row = 0; row < rows * brickHeight; row += brickHeight) {
    const cols = Math.floor(Math.random() * 6) + 3;
    const brickWidth = canvas.width / cols;

    for (let col = 0; col < canvas.width; col += brickWidth) {
      const red = Math.floor(Math.random() * 256);
      const green = Math.floor(Math.random() * 256);
      const blue = Math.floor(Math.random() * 256);
      const randomColor = `rgb(${red}, ${green}, ${blue})`;

      let brick = {
        x: col,
        y: row,
        width: brickWidth,
        height: brickHeight,
        color: randomColor,
      };
      bricks.push(brick);
    }
  }
}

generateBricks();

function gameOver() {
  heart = false;
  container__restart.innerHTML = "you lost click start again to play again";
}

let container__button = document.querySelector(".container__button");
container__button.addEventListener("click", () => {
  console.log("harutik");
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  heart = 3;
  roundsPlayed = 3;
  drawBall();
  bricks.length=0
  generateBricks();
  drawBricks();
  container__restart.innerHTML =""

  // bricks.length=0
  // cot__go = false;
  // container__goGame.remove();
});

let container = contanier__startid.addEventListener("click", () => {
  drawPaddle();
  drawBall();
  drawBricks();
  cot__go = false;
  container__goGame.remove();
});
