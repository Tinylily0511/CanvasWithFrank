const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;

const explosions = [];
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHeight * 0.5;
    this.image = new Image();
    this.image.src = 'boom.png';
    this.frame = 0;
    this.timer = 0;
    this.angle = Math.random() * 6.2;
    this.sound = new Audio();
    this.sound.src = 'boom.wav';
  };
  update() {
    if (this.frame === 0) this.sound.play();
    this.timer++
    if (this.timer % 10 === 0) {
      this.frame++;
    };
  };
  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 - this.width * 0.5, 0 - this.height * 0.5, this.width, this.height);
    context.restore();
  }
};

window.addEventListener('click', function (e) {
  createAnimation(e);
});

function createAnimation(e) {
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;
  explosions.push(new Explosion(positionX, positionY));
  // animate();
};

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < explosions.length; i++){
    explosions[i].update();
    explosions[i].draw();
    if (explosions[i].frame > 5) {
      explosions.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
};

animate();