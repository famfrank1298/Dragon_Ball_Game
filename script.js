"use strict";
let canvas = document.querySelector('.canvas');
let context = canvas.getContext('2d');

let bg_img = document.createElement("img");
bg_img.setAttribute("src", "imgs/game_bg.jpg");
context.drawImage(bg_img, 0, 0, 1250, 500);

// Define the edges of the canvas
const canvasWidth = 1250;
const canvasHeight = 500;

class GameObject {
  constructor(context, x, y, vx, vy) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    this.isColliding = false;
  }
}

class Items extends GameObject {
  constructor(context, x, y, vx, vy, type) {
    super(context, x, y, vx, vy);

    // Set default width and height
    this.width = Math.floor(Math.random() * (60 - 50 + 1) + 50);;
    this.height = this.width;
    this.type = type;

  }

  draw() {

    this.context.imageSmoothingEnabled = true;
    this.context.imageSmoothingQuality = 'high';
    
    if(this.type == "collectable") {
      dragon_ball.setAttribute("src", "imgs/star7.png");
      this.context.drawImage(dragon_ball, this.x, this.y, this.width, this.height);
    } else if(this.type == "enemy") { // enemy
      this.context.drawImage(enemy_img, this.x, this.y, this.width, this.height);
    }
    
  }

  update(secondsPassed) {
    this.vy += secondsPassed;
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;
  }
}

// MC Object
class MC {
  constructor(context, x, y) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.isColliding = false;
    this.score = 0;
    this.lives = 3;
    this.width = 80;
  }

  draw() {
    this.context.imageSmoothingEnabled = true;
    this.context.imageSmoothingQuality = 'high';

    let current_img = img;
    if (this.isColliding) {
      current_img = collision_img;
    }

    this.context.drawImage(current_img, this.x, this.y, this.width, this.width);
  }

  update(newX, newY) {

    if(!gameOver) {
      this.x = newX;
      this.y = newY;
      this.context.drawImage(img, this.x, this.y, this.width, this.width);
    }
  }

  setPos(newX, newY) {
    this.x = newX;
    this.y = newY;
  }

  move(key) {
    if(key == "ArrowLeft") {
      if(mc.x > 0) {
        mc.update(mc.x - 10, mc.y);
      }
    } else if(key == "ArrowRight") {
      if(mc.x + mc.width < canvasWidth) {
        mc.update(mc.x + 10, mc.y);
      }
    } else if(key == "ArrowDown") {
      if(mc.y + mc.width < canvasHeight) {
        mc.update(mc.x, mc.y + 10);
      }
    } else if(key == "ArrowUp") {
      if(mc.y > 0) {
        mc.update(mc.x, mc.y - 10);
      }
    } else {
      // ignore...should not reach here
    }
  }
}

// global variables
let life = document.querySelector(".lives");
let score = document.querySelector(".score");
let lvl = document.querySelector(".level");
let startBtn = document.querySelector(".startBtn");
let welcome = document.querySelector(".welcomePage");
let nextLvlBtn = document.querySelector(".nextLevel");
let bod = document.querySelector("body");
let start = false;
let gameOver = false;
let level = 1;
let mc = new MC(context, canvasWidth/2, canvasHeight/2);
let gameObjects = [];


startBtn.addEventListener("click", function(e) {
  welcome.style.display = "none";
  canvas.style.display = "block";
  start = true;
});

// reset variables and canvas layout
function resetGame() {
  if(mc.score == 7) {
    level++;
  }
  
  mc.lives = 3; 
  mc.score = 0;
  start = true;
  gameOver = false;

  life.style.color = "#e8a221";
  score.style.color = "#e8a221";
  lvl.style.color = "#e8a221";
  canvas.style.borderColor = "red";

  bod.style.backgroundImage = "linear-gradient(to right bottom, #5c1010, #b33c3c)";
  createWorld();

  score.innerText = "Score: " + mc.score;
  life.innerText = "Lives: " + mc.lives;

  mc.setPos(canvasWidth/2, canvasHeight/2);
  nextLvlBtn.style.display = "none";
}

nextLvlBtn.addEventListener("click", function(e) {
  resetGame();
});

context.imageSmoothingEnabled = true;
context.imageSmoothingQuality = 'high';

let win_img = document.createElement("img");
win_img.setAttribute("src", "imgs/win_bg.jpg");

let lose_img = document.createElement("img");
lose_img.setAttribute("src", "imgs/lose_bg.jpg");

let img = document.createElement("img");
img.setAttribute("src", "imgs/star1.png");

let collision_img = document.createElement("img");
collision_img.setAttribute("src", "imgs/black_ball.png");

let enemy_img = document.createElement("img");
enemy_img.setAttribute("src", "imgs/death_ball.png");

let dragon_ball = document.createElement("img");

function playNext() {
  life.style.color = "#7DF9FF";
  score.style.color = "#7DF9FF";
  lvl.style.color = "#7DF9FF";
  canvas.style.borderColor = "#7DF9FF";
  nextLvlBtn.innerText = "Next Level Warrior";
  nextLvlBtn.style.display = "block";
  gameObjects.splice(0,gameObjects.length);
  bod.style.backgroundImage = "linear-gradient(to right bottom, #2e42a3, #1f39ff)";
  nextLvlBtn.style.backgroundImage = "linear-gradient(-180deg, #7DF9FF, #1f39ff)";
  context.drawImage(win_img, 0, 0, 1250, 500);
}

function playAgain() {
  life.style.color = "#ffae3d";
  score.style.color = "#ffae3d";
  lvl.style.color = "#ffae3d";
  canvas.style.borderColor = "#ffae3d";
  bod.style.backgroundImage = "linear-gradient(to right bottom, #7B3F00, #6E260E)";
  context.drawImage(lose_img, 0, 0, 1250, 500);
  nextLvlBtn.innerText = "Try Again Warrior";
  gameObjects.splice(0,gameObjects.length);
  nextLvlBtn.style.display = "block";
  nextLvlBtn.style.backgroundImage = "linear-gradient(-180deg, #D27D2D, #DAA06D)";
  nextLvlBtn.style.color = "#FFFFFF";
}

function addCollectables() {
  for (let i = 1; i < 8; i++) {
    let x = Math.floor(Math.random() * (canvas.width - 10 + 1) + 10);
    let y = Math.floor(Math.random() * (canvas.height - 10 + 1) + 10);
    let xv = Math.floor(Math.random() * (100 - (-100) + 1) + 100);
    let yv = Math.floor(Math.random() * (100 - 10 + 1) + 10);

    gameObjects.push(new Items(context, x, y, xv, yv, "collectable"));
  }
}

function addEnemies() {
  let max = (level * 2) + 1;

  for (let i = 0; i < max; i++) {
    let x = Math.floor(Math.random() * (canvas.width - 10 + 1) + 10);
    let y = Math.floor(Math.random() * (canvas.height - 10 + 1) + 10);
    let xv = Math.floor(Math.random() * (100 - (-100) + 1) + 100);
    let yv = Math.floor(Math.random() * (100 - 10 + 1) + 10);

    gameObjects.push(new Items(context, x, y, xv, yv, "enemy"));
  }
}

document.addEventListener("keydown", function(event) {
  mc.move(event.key);
});

function createWorld() {
  addCollectables();
  addEnemies();
}

function circleIntersect(x1, y1, r1, x2, y2, r2) {
  // Calculate the distance between the two circles
  let circleDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
  
  // When the distance is smaller or equal to the sum
  // of the two radius, the circles touch or overlap
  return circleDistance <= ((r1 + r2) * (r1 + r2));
}

function detectCollisions() {
  let obj1 = mc;
  let obj2;
  
  // Reset collision state of all objects
  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].isColliding = false;
  }

  mc.isColliding = false;
  
  // Start checking for collisions with collectables and enemies
  for (let j = 0; j < gameObjects.length; j++) {
    obj2 = gameObjects[j];

    // Compare object1 with object2
    if (circleIntersect(obj1.x, obj1.y, obj1.width/2.5, obj2.x, obj2.y, obj2.width/2.5)) {

      if(obj2.type == "collectable") {
        mc.score = mc.score + 1;
        score.innerText = "Score: " + mc.score;
        gameObjects.splice(j, 1);

        if(mc.score == 7) {
          gameOver = true;
        }
        
      } else { // obj2.type == "enemy"
        mc.lives = mc.lives - 1;
        life.innerText = "Lives: " + mc.lives;
        obj1.isColliding = true;

        if(mc.lives <= 0) {
          gameOver = true;
        }

        let x = Math.floor(Math.random() * (canvas.width - 10 + 1) + 10);
        let y = Math.floor(Math.random() * (canvas.height - 10 + 1) + 10);
        obj2.x = x;
        obj2.y = y;
      }
    }
  }
}

// Set a restitution, a lower value will lose more energy when colliding
const restitution = 0.90;

function detectEdgeCollisions() {
  let obj;
  for (let i = 0; i < gameObjects.length; i++) {
    obj = gameObjects[i];

    // Check for left and right
    if (obj.x < obj.width) {
      obj.vx = Math.abs(obj.vx) * restitution;
      obj.x = obj.width;
    } else if (obj.x > canvasWidth - obj.width) {
      obj.vx = -Math.abs(obj.vx) * restitution;
      obj.x = canvasWidth - obj.width;
    }

    // Check for bottom and top
    if (obj.y < obj.height) {
      obj.vy = Math.abs(obj.vy) * restitution;
      obj.y = obj.height;
    } else if (obj.y > canvasHeight - obj.height) {
      obj.vy = -Math.abs(obj.vy) * restitution;
      obj.y = canvasHeight - obj.height;
    }
  }
}

createWorld();
window.onload = init;

function init() {
  // Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

let oldTimeStamp = 0;
let secondsPassed = 0;

function gameLoop(timeStamp) {

  if(!gameOver && start) {
    lvl.innerText = "Level: " + level;
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
  
    // Loop over all game objects
    for (let i = 0; i < gameObjects.length; i++) {
      gameObjects[i].update(secondsPassed);
    }
  
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.drawImage(bg_img, 0, 0, 1250, 500);
    detectCollisions();
    mc.draw();
    
    // Do the same to draw
    for (let i = 0; i < gameObjects.length; i++) {
      detectEdgeCollisions();
      gameObjects[i].draw();
    }
  } else {
    if(mc.score == 7) { // winner
      playNext();
    } else if (mc.lives <= 0){ // lose
      playAgain();
    } else {
      // do nothing
    }

    mc.lives = 3;
  }

  window.requestAnimationFrame(gameLoop);
  
}