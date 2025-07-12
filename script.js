const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let chicken = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 0.8,
  jumpPower: -12,
  onGround: true
};

let floorY = 350;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && chicken.onGround) {
    chicken.velocityY = chicken.jumpPower;
    chicken.onGround = false;
    console.log("🐔 Squawk!"); // You can play sound here
  }
});

function update() {
  // Gravity
  chicken.velocityY += chicken.gravity;
  chicken.y += chicken.velocityY;

  // Floor collision
  if (chicken.y + chicken.height >= floorY) {
    chicken.y = floorY - chicken.height;
    chicken.velocityY = 0;
    chicken.onGround = true;
  }

  draw();
  requestAnimationFrame(update);
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
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(chicken.x, chicken.y, chicken.width, chicken.height);
}

update();
