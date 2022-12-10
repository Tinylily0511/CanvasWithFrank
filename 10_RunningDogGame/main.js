import { Player } from './player.js'
import { InputHandler } from './input.js'
import { Background } from './background.js'
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js'
import { UI } from './UI.js'

window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 5;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.maxParticles = 50;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      // Adjust min score for winning
      this.winningScore = 10;
      this.fontColor = 'black';
      this.time = 0;
      // Adjusting the max time
      this.maxTime = 30000;
      this.gameOver = false;
      this.lives = 5;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    };
    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.maxTime) this.gameOver = true;
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      // handle enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach(enemy => enemy.update(deltaTime));
      // handle floatingMessages
      this.floatingMessages.forEach(msg => msg.update());
      // handle particles
      this.particles.forEach(particle => particle.update());
      if (this.particles.length > this.maxParticles) this.particles.length = this.maxParticles;
      // handle collision
      this.collisions.forEach(collision => collision.update(deltaTime));
      // filter these arraies to keep out screen items deleted
      this.enemies = this.enemies.filter(e => !e.marked);
      this.particles = this.particles.filter(p => !p.marked);
      this.collisions = this.collisions.filter(c => !c.marked);
      this.floatingMessages = this.floatingMessages.filter(m => !m.marked)
    };
    draw(ctx) {
      this.background.draw(ctx);
      this.player.draw(ctx);
      this.enemies.forEach(enemy => enemy.draw(ctx));
      this.particles.forEach(particle => particle.draw(ctx));
      this.collisions.forEach(collision => collision.draw(ctx));
      this.floatingMessages.forEach(msg => msg.draw(ctx));
      this.UI.draw(ctx);
    };
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
    };
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if(!game.gameOver) requestAnimationFrame(animate);
  }

  animate(0);
})