const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const chickenImg = new Image();
chickenImg.src = "assets/chicken.png";

const panImg = new Image();
panImg.src = "assets/pan.png";

// Sounds
const squawk = new Audio("assets/sounds/squawk.mp3");
const sizzle = new Audio("assets/sounds/sizzle.mp3");
const gameover = new Audio("assets/sounds/gameover.mp3");

let chicken = {
  x: 80,
  y: 300,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 0.8,
  jumpPower: -12,
  onGround: true
};

let floorY = 350;
let score = 0;
let gameRunning = true;
let obstacles = [];

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && chicken.onGround && gameRunning) {
    chicken.velocityY = chicken.jumpPower;
    chicken.onGround = false;
    squawk.play();
  } else if (!gameRunning && e.code === "Enter") {
    resetGame();
  }
});

function spawnObstacle() {
  const size = 40 + Math.random() * 20;
  obstacles.push({
    x: canvas.width,
    y: floorY - size,
    width: size,
    height: size,
    speed: 6
  });
}

function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= obstacles[i].speed;

    if (
      chicken.x < obstacles[i].x + obstacles[i].width &&
      chicken.x + chicken.width > obstacles[i].x &&
      chicken.y < obstacles[i].y + obstacles[i].height &&
      chicken.y + chicken.height > obstacles[i].y
    ) {
      endGame();
    }
  }

  // Remove off-screen
  obstacles = obstacles.filter((o) => o.x + o.width > 0);
}

function resetGame() {
  chicken.y = 300;
  chicken.velocityY = 0;
  chicken.onGround = true;
  obstacles = [];
  score = 0;
  gameRunning = true;
  loop();
}

function endGame() {
  gameRunning = false;
  sizzle.play();
  gameover.play();
  setTimeout(() => {
    ctx.fillStyle = "#fff";
    ctx.font = "32px Comic Sans MS";
    ctx.fillText("Game Over! Press Enter to try again!", 150, 200);
  }, 100);
}

function update() {
  chicken.velocityY += chicken.gravity;
  chicken.y += chicken.velocityY;

  if (chicken.y + chicken.height >= floorY) {
    chicken.y = floorY - chicken.height;
    chicken.velocityY = 0;
    chicken.onGround = true;
  }

  updateObstacles();

  if (gameRunning && Math.random() < 0.02) spawnObstacle();

  if (gameRunning) score++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#fceabb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Floor
  ctx.fillStyle = "#b5651d";
  ctx.fillRect(0, floorY, canvas.width, 50);

  // Chicken
  ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);

  // Obstacles
  for (let o of obstacles) {
    ctx.drawImage(panImg, o.x, o.y, o.width, o.height);
  }

  // Score
  ctx.fillStyle = "#000";
  ctx.font = "20px Comic Sans MS";
  ctx.fillText("Score: " + score, 10, 30);
}

function loop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

