let startBtn = document.getElementById("startBtn");
let stopBtn = document.getElementById("stopBtn");
var interval;

startBtn.addEventListener("click", () => {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  let width = canvas.width; //480
  let height = canvas.height; //320
  let paddle = {
    x: width / 2 - 50, //190
    y: height - 20,
    width: 100,
    height: 10,
  };
  let arrow = {
    x: width / 2,
  };
  let ball = {
    x: width / 2,
    y: height - 50,
    ballRadius: 10,
  };
  let brick = {
    brickRowCount: 3,
    brickColumnCount: 5,
    brickWidth: 75,
    brickHeight: 20,
    brickPadding: 10,
    brickOffsetTop: 30,
    brickOffsetLeft: 30,
  };
  let dx = 2;
  let dy = -2;
  let pdlDx = -1;

  let score = 0;

  let isGameStarted = false;
  let rightPressed = false;
  let leftPressed = false;

  interval = setInterval(draw, 10);

  const bricks = [];
  for (let i = 0; i < brick.brickColumnCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brick.brickRowCount; j++) {
      bricks[i][j] = { x: 0, y: 0, status: true };
    }
  }

  document.addEventListener("mousemove", mouseMoveHandler);

  document.getElementById("myCanvas").addEventListener("click", () => {
    isGameStarted = true;
  });

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }

  function mouseMoveHandler(e) {
    //console.log("mouseMove: ", e)
    if (
      e.clientX >= paddle.x &&
      e.clientX <= paddle.x + paddle.width &&
      !isGameStarted
    ) {
      arrow.x = e.clientX;
      ball.x = e.clientX;
      dx = (e.clientX - width / 2) / 20;
    } else if (isGameStarted) {
      if (
        e.clientX > paddle.width / 2 &&
        e.clientX < width - paddle.width / 2
      ) {
        paddle.x = e.clientX - paddle.width / 2;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
    drawScore();
    collisionDetection();
    if (isGameStarted) {
      if (
        ball.x + dx > width - ball.ballRadius ||
        ball.x + dx < ball.ballRadius
      ) {
        dx = -dx;
      }
      if (ball.y + dy < ball.ballRadius) {
        dy = -dy;
      } else if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + dy > paddle.y - ball.ballRadius
      ) {
        dy = -dy;
        if (pdlDx * dx < 0 && rightPressed) {
          dx = -1.5 * dx;
        }
      } else if (ball.y + dy > height - ball.ballRadius) {
        gameOver();
      }

      if (rightPressed && paddle.x < width - paddle.width) {
        paddle.x += 7;
        pdlDx = 1;
      } else if (leftPressed && paddle.x > 0) {
        paddle.x -= 7;
        pdlDx = -1;
      }

      ball.x += dx;
      ball.y += dy;
    } else {
      drawArrow();
    }
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  function drawArrow() {
    ctx.beginPath();
    ctx.moveTo(width / 2, paddle.y);
    ctx.lineTo(arrow.x, paddle.y - 50);
    ctx.stroke();
    ctx.closePath();
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (let i = 0; i < brick.brickColumnCount; i++) {
      for (let j = 0; j < brick.brickColumnCount; j++) {
        if (bricks[i][j]) {
          if (bricks[i][j].status) {
            bricks[i][j].x =
              i * (brick.brickWidth + brick.brickPadding) +
              brick.brickOffsetLeft;
            bricks[i][j].y =
              j * (brick.brickHeight + brick.brickPadding) +
              brick.brickOffsetTop;
            ctx.beginPath();
            ctx.rect(
              bricks[i][j].x,
              bricks[i][j].y,
              brick.brickWidth,
              brick.brickHeight
            );
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }
  }

  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText(`Score: ${score}`, 8, 20);
  }

  function collisionDetection() {
    for (let i = 0; i < brick.brickColumnCount; i++) {
      for (let j = 0; j < brick.brickRowCount; j++) {
        if (score === brick.brickRowCount * brick.brickColumnCount) {
          console.log("You win");
          clearInterval(interval);
        }
        const b = bricks[i][j];
        if (
          b.status &&
          ball.x > b.x &&
          ball.x < b.x + brick.brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + brick.brickHeight
        ) {
          bricks[i][j].status = false;
          dy = -dy;
          score++;
        }
      }
    }
  }
});

function gameOver() {
  alert("Game Over!");
  isGameStarted = false;
  clearInterval(interval);
}
