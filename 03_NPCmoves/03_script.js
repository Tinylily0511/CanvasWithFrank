/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 300;
const CANVAS_HEIGHT = canvas.height = 700;
const numberOfEnemies = 100;
const enemiesArray = [];
let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = './images/enemy3.png';
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 218;
    this.spriteHeight = 177;
    this.width = this.spriteWidth / 3;
    this.height = this.spriteHeight / 3;
    this.x = Math.round(Math.random() * (canvas.width - this.width));
    this.y = Math.round(Math.random() * (canvas.height - this.height));
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 2);
    this.angle = Math.random() * 100 + 30;
    this.angleSpeed = Math.random() * 2 + 0.1;
  };
  update() {
    // change sin/cos/tan & numbers divid for PI, the moving pattern gonna change
    this.x = canvas.width/2 * Math.sin(this.angle * Math.PI / 200) + (canvas.width - this.width) / 2;
    this.y = canvas.height/2 * Math.cos(this.angle * Math.PI / 250) + (canvas.height - this.height)/2;
    this.angle += this.angleSpeed;
    if (this.x + this.width < 0) this.x = canvas.width;
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