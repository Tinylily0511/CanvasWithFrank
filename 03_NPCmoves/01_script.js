/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 300;
const CANVAS_HEIGHT = canvas.height = 700;
const numberOfEnemies = 40;
const enemiesArray = [];
let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = './images/enemy1.png';
    // this.speed = Math.round(Math.random() * 4) - 2;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.spriteWidth = 293;
    this.spriteHeight = 155;
    this.scale = Math.round(Math.random() * 2) + 2;
    this.width = this.spriteWidth / this.scale;
    this.height = this.spriteHeight / this.scale;
    // this.x = Math.round(Math.random() * (canvas.width - this.width));
    // this.y = Math.round(Math.random() * (canvas.height - this.height));
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 +  2);
  };
  update() {
    // this.x += this.speed;
    // this.y += this.speed;
    this.x += Math.random() * 5 - 2.5;
    this.y += Math.random() * 6 -3;
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