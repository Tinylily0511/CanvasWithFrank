window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1')
  const ctx = canvas.getContext('2d')
  canvas.width = 1200;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener('keydown', e => {
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.game.keys.indexOf(e.key) === -1) this.game.keys.push(e.key);
        // check if it works well for the array
        // console.log(this.game.keys);
        else if (e.key === ' ') this.game.player.shootTop();
        else if (e.key === 'd') this.game.debug = !this.game.debug;
      });
      window.addEventListener('keyup', e => {
        if (this.game.keys.indexOf(e.key) > -1) this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
      });
    }
  }

  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.image = document.getElementById('projectile');
      this.marked = false;
    };
    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.8) this.marked = true;
    };
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y);
    };
  }

  class Particle {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.image = document.getElementById('gears');
      this.frameX = Math.floor(Math.random() * 3);
      this.frameY = Math.floor(Math.random() * 3);
      this.spriteSize = 50;
      this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
      this.size = this.spriteSize * this.sizeModifier;
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * -15;
      this.gravity = 0.5;
      this.marked = false;
      this.angle = 0;
      this.va = Math.random() * 0.2 - 0.1;
      this.bounced = 0;
      this.bottomBounceBoundary = Math.random() * 80 + 60;
    };
    update() {
      this.angle += this.va;
      this.speedY += this.gravity;
      this.x -= this.speedX + this.game.speed;
      this.y += this.speedY;
      if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.marked = true;
      if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced < 2) {
        this.bounced++;
        this.speedY *= -0.7;
      }
    };
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size);
      ctx.restore();
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 198;
      this.x = 20;
      this.y = 100;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
      this.speedY = 0;
      this.maxSpeed = 3;
      this.projectiles = [];
      this.image = document.getElementById('player');
      this.powerUp = false;
      this.powerUpTimer = 0;
      this.powerUpLimit = 10000;
    };
    update(deltaTime) {
      if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
      else this.speedY = 0;
      this.y += this.speedY;
      // vertical boundary
      if (this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
      else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
      // handle projectiles
      this.projectiles.forEach(p => p.update());
      this.projectiles = this.projectiles.filter(p => !p.marked);
      // sprite animation
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
      // 10s power up mode
      if (this.powerUp) {
        if (this.powerUpTimer > this.powerUpLimit) {
          this.powerUpTimer = 0;
          this.powerUp = false;
          this.frameY = 0;
        } else {
          this.powerUpTimer += deltaTime;
          this.frameY = 1;
          // this.game.ammo += 0.2;
        }
      }
    };
    draw(ctx) {
      if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
      this.projectiles.forEach(p => p.draw(ctx));
      ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height); 
    };
    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(new Projectile(this.game, this.x + 85, this.y + 27 ));
        this.game.ammo--;
      }
      if (this.powerUp) this.shootBottom();
    };
    shootBottom() {
      if (this.game.ammo > 0) {
        this.projectiles.push(new Projectile(this.game, this.x + 85, this.y + 165));
      }
    };
    enterPowerUp() {
      this.powerUpTimer = 0;
      this.powerUp = true;
      if(this.game.ammo < this.game.maxAmmo) this.game.ammo = this.game.maxAmmo;
    };
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -2.5 - 1.5;
      this.marked = false;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
    };
    update() {
      this.x += this.speedX - this.game.speed;
      if (this.x + this.width < 0) this.marked = true;
      // sprite animation
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    };
    draw(ctx) {
      if (this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
      if (this.game.debug) {
        ctx.font = '20px Helvetica';
        ctx.fillText('enemy lives = '+this.lives, this.x, this.y);
      }
    };
  }

  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 228;
      this.height = 169;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = document.getElementById('angler1');
      this.frameY = Math.floor(Math.random() * 3);
      this.lives = 2;
      this.score = this.lives;
    }
  }

  class Angler2 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 213;
      this.height = 165;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = document.getElementById('angler2');
      this.frameY = Math.floor(Math.random() * 2);
      this.lives = 3;
      this.score = this.lives;
    }
  }

  class LuckyFish extends Enemy {
    constructor(game) {
      super(game);
      this.width = 99;
      this.height = 95;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = document.getElementById('lucky');
      this.frameY = Math.floor(Math.random() * 2);
      this.lives = 3;
      this.score = 15;
      this.type = 'lucky';
    }
  }

  class HiveWhale extends Enemy {
    constructor(game) {
      super(game);
      this.width = 400;
      this.height = 227;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = document.getElementById('hiveWhale');
      this.frameY = 0;
      this.lives = 15;
      this.score = this.lives;
      this.type = 'hive';
      this.speedX = Math.random() * -1.2 - 0.2;
    }
  }

  class Drone extends Enemy {
    constructor(game, x, y) {
      super(game);
      this.width = 115;
      this.height = 95;
      this.x = x;
      this.y = y;
      this.image = document.getElementById('drone');
      this.frameY = Math.floor(Math.random() * 2);
      this.lives = 3;
      this.score = this.lives;
      this.type = 'drone';
      this.speedX = Math.random() * -4.2 - 0.5;
    }
  }

  class Layer {
    constructor(game, image, speedModifier) {
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width = 1768;
      this.height = 500;
      this.x = 0;
      this.y = 0;
    };
    update() {
      if (this.x <= -this.width) this.x = 0;
      this.x -= this.game.speed * this.speedModifier;
    };
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y);
      ctx.drawImage(this.image, this.x + this.width, this.y);
    };
  }

  class Background {
    constructor(game) {
      this.game = game;
      this.image1 = document.getElementById('layer1');
      this.image2 = document.getElementById('layer2');
      this.image3 = document.getElementById('layer3');
      this.image4 = document.getElementById('layer4');
      this.layer1 = new Layer(this.game, this.image1, 0.3);
      this.layer2 = new Layer(this.game, this.image2, 0.6);
      this.layer3 = new Layer(this.game, this.image3, 1);
      this.layer4 = new Layer(this.game, this.image4, 1.5);
      this.layers = [this.layer1, this.layer2, this.layer3];
    };
    update() {
      this.layers.forEach(layer => layer.update());
    };
    draw(ctx) {
      this.layers.forEach(layer => layer.draw(ctx));
    }
  }

  class Explosion {
    constructor(game, x, y) {
      this.game = game;
      this.frameX = 0;
      this.maxFrame = 0;
      this.spriteHeight = 200;
      this.spriteWidth = 200;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.x = x - this.width * 0.5;
      this.y = y - this.height * 0.5;
      this.fps = 30;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      this.marked = false;
    };
    update(deltaTime) {
      this.x -= this.game.speed;
      if (this.timer > this.interval) {
        this.frameX++;
        this.timer = 0;
      } else {
        this.timer += deltaTime;
      }
      if (this.frameX > this.maxFrame) this.marked = false;
    };
    draw(ctx) {
      ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
  }

  class Smoke extends Explosion {
    constructor(game, x, y) {
      super(game, x, y);
      this.image = document.getElementById('smoke');
    }
  }

  class Fire extends Explosion {
    constructor(game, x, y) {
      super(game, x, y);
      this.image = document.getElementById('fire');
    }
  }

  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = 'Bangers';
      this.color = 'white';
    };
    draw(ctx) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowColor = 'black';
      ctx.font = this.fontSize + 'px ' + this.fontFamily;
      // show score
      ctx.fillText('Score: ' + this.game.score, 20, 40);
      // show time
      const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
      ctx.fillText('Timer: ' + formattedTime, 20, 100);
      // show game over
      if (this.game.gameOver) {
        ctx.textAlign = 'center';
        let msg1;
        let msg2;
        if (this.game.score > this.game.winningScore) {
          msg1 = 'Most Wondrous!';
          msg2 = 'Well done explorer!';
        } else {
          msg1 = 'Blazes!';
          msg2 = 'Get my repair kit and try again!';
        }
        ctx.font = '90px ' + this.fontFamily;
        ctx.fillText(msg1, this.game.width * 0.5, this.game.height * 0.5 - 20);
        ctx.font = '25px ' + this.fontFamily;
        ctx.fillText(msg2, this.game.width * 0.5, this.game.height * 0.5 + 20);
      }
      // show ammo
      if(this.game.player.powerUp) ctx.fillStyle = '#ffffbd';
      for (let i = 0; i < this.game.ammo; i++){
        ctx.fillRect(20 + 5 * i, 50, 3, 20);
      }
      ctx.restore();
    };
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.bg = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = [];
      this.particles = [];
      this.explosions = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000 + Math.random() * 1000;
      this.ammo = 20;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 1000;
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 100;
      this.gameTime = 0;
      this.timeLimit = 30000;
      this.speed = 1;
      this.debug = false;
    };
    update(deltaTime) {
      if (!this.gameOver) this.gameTime += deltaTime;
      if (this.gameTime > this.timeLimit) this.gameOver = true;
      this.bg.update();
      this.bg.layer4.update();
      this.player.update(deltaTime);
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      };
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => !p.marked);
      this.explosions.forEach(e => e.update(deltaTime));
      this.explosions = this.explosions.filter(e => !e.marked);
      this.enemies.forEach(e => {
        e.update(); 
        // player collision with eney
        if (this.checkCollision(this.player, e)) {
          e.marked = true;
          this.addExplosioin(e);
          for (let i = 0; i < e.score; i++){
            this.particles.push(new Particle(this, e.x + e.width * 0.5, e.y + e.height * 0.5));
          }
          if (e.type === 'lucky') this.player.enterPowerUp();
          else if(!this.gameOver) this.score--;
        };
        // projectile collision with enemy
        this.player.projectiles.forEach(p => {
          if (this.checkCollision(p, e)) {
            e.lives--;
            p.marked = true;
            this.particles.push(new Particle(this, e.x + e.width * 0.5, e.y + e.height * 0.5));
            if (e.lives <= 0) {
              for (let i = 0; i < e.score; i++){
                this.particles.push(new Particle(this, e.x + e.width * 0.5, e.y + e.height * 0.5));
              }
              e.marked = true;
              this.addExplosioin(e);
              if (e.type === 'hive') {
                for (let i = 0; i < 5; i++) {
                  this.enemies.push(new Drone(this, e.x + Math.random() * e.width, e.y + Math.random() * e.height * 0.5));
                }
              }
              if(!this.gameOver) this.score += e.score;
              // if (this.score > this.winningScore) this.gameOver = true;
            }
          }
        })
      });
      this.enemies = this.enemies.filter(e => !e.marked);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    };
    draw(ctx) {
      this.bg.draw(ctx);
      this.ui.draw(ctx);
      this.player.draw(ctx);
      this.particles.forEach(p => p.draw(ctx));
      this.enemies.forEach(e => e.draw(ctx));
      this.explosions.forEach(e => e.draw(ctx));
      this.bg.layer4.draw(ctx);
    };
    addEnemy() {
      const randomize = Math.random();
      if (randomize < 0.3) this.enemies.push(new Angler1(this));
      else if (randomize < 0.6) this.enemies.push(new Angler2(this));
      else if (randomize < 0.8) this.enemies.push(new HiveWhale(this));
      else this.enemies.push(new LuckyFish(this));
      // check if marked enemies are well removed from array
      // console.log(this.enemies);
    };
    addExplosioin(enemy) {
      const randomize = Math.random();
      if (randomize < 0.5) this.explosions.push(new Smoke(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
      else this.explosions.push(new Fire(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
    }
    checkCollision(rect1, rect2) {
      return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y)
    };
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    game.update(deltaTime);
    requestAnimationFrame(animate);
  }

  animate(0);
})