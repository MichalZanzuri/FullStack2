const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreSpan = document.getElementById("score");

const runImages = [
  "../../image/run.png",
  "../../image/run2.png"
];
const jumpImage = "../../image/jump.png";
const fallImage = "../../image/fall.png";

const obstacles = [
  { image: "../../image/bag.png", type: "ground" },
  { image: "../../image/book.png", type: "ground" },
  { image: "../../image/computer.png", type: "ground" },
  { image: "../../image/formula.png", type: "ground" },
  { image: "../../image/globe.png", type: "ground" },
  { image: "../../image/stackofbooks.png", type: "ground" }
];

let obstacleIndex = 0;
let velocityY = 0;
let gravity = 1.2;
let groundY = 100;
let score = 0;
let currentFrame = 0;
let isRunning = false;
let isJumping = false;
const GROUND_LEVEL = 100;
let hangTime = 0;
const MAX_HANG_TIME = 200; 
let obstacleSpeed = 5;
const MAX_SPEED = 14;
let lives = 5;
const hearts = document.querySelectorAll(".heart");


setInterval(() => {
  if (!isRunning || isJumping) return;

  currentFrame = (currentFrame + 1) % runImages.length;
  player.style.backgroundImage = `url(${runImages[currentFrame]})`;
}, 120);

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") {
    isRunning = true;
    game.classList.add("running");
  }

  if (e.code === "Space") {
    jump();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") {
    isRunning = false;
    game.classList.remove("running");
  }
});

function jump() {
  if (isJumping) return;
  velocityY = 22;
  hangTime = 0;
  isJumping = true;
  player.style.backgroundImage = `url(${jumpImage})`;
}

setInterval(() => {
  if (!isJumping) return;

if (velocityY > 0) {
  velocityY -= gravity;
} else if (hangTime < MAX_HANG_TIME) {
  hangTime += 15; 
  velocityY = 0;  
} else {
  velocityY -= gravity;
}
  let currentBottom = parseInt(player.style.bottom || groundY);
  let newBottom = currentBottom + velocityY;

  if (newBottom <= groundY) {
    newBottom = groundY;
    isJumping = false;
    velocityY = 0;
  }

  player.style.bottom = newBottom + "px";
}, 20);


function checkCollision(player, obstacle) {
  const p = player.getBoundingClientRect();
  const o = obstacle.getBoundingClientRect();

const playerFeet = {
  left: p.left + 40,
  right: p.right - 40,
  top: p.bottom - 10,
  bottom: p.bottom
};


  const obstacleBody = {
    left: o.left,
    right: o.right,
    top: o.top,
    bottom: o.bottom
  };

  const hit =
    playerFeet.right > obstacleBody.left &&
    playerFeet.left < obstacleBody.right &&
    playerFeet.bottom > obstacleBody.top &&
    playerFeet.top < obstacleBody.bottom;

  return hit;
}

function createObstacle() {
  const pattern = obstacles[obstacleIndex];

  const obstacleEl = document.createElement("div");
  obstacleEl.classList.add("obstacle");

  obstacleEl.style.backgroundImage = `url(${pattern.image})`;
  obstacleEl.style.backgroundSize = "contain";
  obstacleEl.style.backgroundRepeat = "no-repeat";

  obstacleEl.dataset.passed = "false";

  obstacleEl.style.left = game.clientWidth + "px";
  obstacleEl.style.bottom = "100px"; 

  game.appendChild(obstacleEl);
  moveObstacle(obstacleEl);

  obstacleIndex = (obstacleIndex + 1) % obstacles.length;
}


function moveObstacle(obstacle) {
  let x = obstacle.offsetLeft;
  const speed = obstacleSpeed;

  const interval = setInterval(() => {
    //move obstacle
    x -= speed;
    obstacle.style.left = x + "px";


    //if hit 
  const playerBottom = parseInt(player.style.bottom || GROUND_LEVEL);

  if (playerBottom <= GROUND_LEVEL && checkCollision(player, obstacle)) {
      handleHit();
      clearInterval(interval);
      obstacle.remove();
      return;
    }
    
    //if passed obstacle - increase score
    if (obstacle.dataset.passed === "false") {

      const obstacleRight = x + obstacle.offsetWidth;
      const playerLeft = player.offsetLeft;

      if (obstacleRight < playerLeft) {
        obstacle.dataset.passed = "true";
        score += 10;
        
        updateScoreDisplay(); 
      }
    }

    if (x < -obstacle.offsetWidth) {
      clearInterval(interval);
      obstacle.remove();
    }
  }, 20);
}

let counter = 0;

function spawnObstacle() {
  if (isRunning) {
    createObstacle();
  }

const nextTime = Math.max(
  800,
  2500 - obstacleSpeed * 120
);
  setTimeout(spawnObstacle, nextTime);
}

spawnObstacle();


function updateScoreDisplay() {
  scoreSpan.innerText = score;
}

function handleHit() {
  if (lives <= 0) return;

  lives--;
  score -= 10;
  
  updateScoreDisplay();

  hearts[lives].classList.add("lost");

  player.style.backgroundImage = `url(${fallImage})`;

  if (lives === 0) {
    endGame();
  } else {
    setTimeout(() => {
      if (isRunning) {
        player.style.backgroundImage = `url(${runImages[currentFrame]})`;
      }
    }, 400);
  }
}


setInterval(() => {
  if (!isRunning) return;

  if (obstacleSpeed < MAX_SPEED) {
    obstacleSpeed += 0.3;
  }
}, 5000); 

function endGame() {
  isRunning = false;

  document.getElementById("final-score").innerText = score;
  document.getElementById("game-over").classList.remove("hidden");
  document.getElementById("hud").classList.add("hidden");
  game.classList.remove("running");

  // --- שמירת הניקוד ---
  // עכשיו שהפונקציה המקומית שינתה שם, הקריאה הזו תלך סוף סוף לקובץ userManager!
  console.log("Game Over! Saving score to database...");
  
  if (typeof updateScore === 'function') {
      updateScore('run', score); 
  } else {
      console.error("Global updateScore function not found!");
  }
}