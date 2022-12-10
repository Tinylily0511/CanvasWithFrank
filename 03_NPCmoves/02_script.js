/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 300;
const CANVAS_HEIGHT = canvas.height = 700;
const numberOfEnemies = 50;
const enemiesArray = [];
let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = './images/enemy2.png';
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 266;
    this.spriteHeight = 188;
    // this.scale = Math.round(Math.random() * 2) + 2;
    // this.width = this.spriteWidth / this.scale;
    // this.height = this.spriteHeight / this.scale;
    this.width = this.spriteWidth / 3;
    this.height = this.spriteHeight / 3;
    this.x = Math.round(Math.random() * (canvas.width - this.width));
    this.y = Math.round(Math.random() * (canvas.height - this.height));
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 2);
    this.angle = Math.random() * 2;
    this.angleSpeed = Math.random() * 0.2;
    this.curve = Math.random() * 10;
  };
  update() {
    this.x -= this.speed;
    this.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed;
    if (this.x + this.width < 0) this.x = canvas.width;
    // this.x += Math.random() * 5 - 2.5;
    // this.y += Math.random() * 5 - 2;
    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? this.frame = 0 : this.frame++;
    }
  };
  draw() {
    context.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

for (let i = 0; i < numberOfEnemies; i++){
  enemiesArray.push(new Enemy());
}

function animate() {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemiesArray.forEach(enemy => {
    enemy.update();
    enemy.draw();
  })
  gameFrame++;
  requestAnimationFrame(animate);
};

animate();