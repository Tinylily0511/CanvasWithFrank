window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 700;

  class Game {
    constructor(ctx, width, height) {
      // 3 lines below pass global variables into class properties
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 500;
      this.enemyTimer = 0;
      this.enemyTypes = ['worm', 'ghost', 'spider'];
    };
    update(deltaTime) {
      // filter the marked true enemies and move out of array
      this.enemies = this.enemies.filter(obj => !obj.marked);
      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach(obj => obj.update(deltaTime));
    };
    draw() {
      this.enemies.forEach(obj => obj.draw(this.ctx));
    };
    // start with # is private class method that can ONLY be called in this class
    #addNewEnemy() {
      const randomEnemy = this.enemyTypes[Math.floor(Math.random()*this.enemyTypes.length)];
      // this in parameter will carry all the constructor info to new created enemy
      if (randomEnemy == 'worm') this.enemies.push(new Worm(this));
      if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this));
      if (randomEnemy == 'spider') this.enemies.push(new Spider(this));
      // after push a new enemy, sort the array so lower enemy draw in front and higher behind as a 3D effect
      // this.enemies.sort(function (a, b) {
      //   return a.y - b.y;
      // })
    };
  }

  class Enemy {
    // game in parameter accept Game constructor info
    constructor(game) {
      this.game = game;
      // mark the ones left screen
      this.marked = false;
      // frame settings to adjust the frame changing speed
      this.frameX;
      this.maxFrame = 5;
      this.frameInterval = 100;
      this.frameTimer = 0;
    };
    update(deltaTime) {
      this.x -= this.vxSpeed * deltaTime;
      // change to true for enemies moved out of the screen
      if (this.x < 0 - this.width) this.marked = true;
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer = deltaTime;
      }
    };
    draw(ctx) {
      ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth,this.spriteHeight,this.x, this.y, this.width, this.height);
    };
  };

  // Worm is sub class of Enemy, if call some data/method that Worm doesn't have, it will automatically look up in Enemy
  class Worm extends Enemy{
    constructor(game) {
      // super to call all info in parent's constructor, MUST be called before given new keyword
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      // all elements in DOM with an id automatically added to JS execution enviroment as a global variable, so NO need to getElementById or querySelector
      this.image = worm;
      this.vxSpeed = Math.random() * 0.1 + 0.1;
    }
  };

  class Ghost extends Enemy{
    constructor(game) {
      super(game);
      this.spriteWidth = 261;
      this.spriteHeight = 209;
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      this.image = ghost;
      this.vxSpeed = Math.random() * 0.2 + 0.1;
      this.angle = 0;
      this.curve = Math.random() * 3;
    };
    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.03;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = 0.5;
      super.draw(ctx);
      ctx.restore();
    }
  };

  class Spider extends Enemy{
  constructor(game) {
    super(game);
    this.spriteWidth = 310;
    this.spriteHeight = 175;
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHeight * 0.5;
    this.x = Math.random() * this.game.width;
    this.y = 0 - this.height;
    this.image = spider;
    this.vxSpeed = 0;
    this.vySpeed = Math.random() * 0.1 + 0.1;
    this.maxLength = Math.random() * this.game.height;
    };
    update(deltaTime) {
      super.update(deltaTime);
      if (this.y < 0 - this.height * 2) this.marked = true;
      this.y += this.vySpeed * deltaTime;
      if (this.y > this.maxLength) this.vySpeed *= -1;
    };
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width/2, 0);
      ctx.lineTo(this.x + this.width/2, this.y + 10);
      ctx.stroke();
      super.draw(ctx);
    }
  };

  const game = new Game(ctx, canvas.width, canvas.height);
  let lastTime = 1;
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
  };
  animate(0);
});