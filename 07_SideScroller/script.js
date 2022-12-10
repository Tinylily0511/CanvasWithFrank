window.addEventListener('load', function () {
  const ctx = cA.getContext('2d');
  cA.width = 800;
  cA.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;

  class InputHandler{
    constructor() {
      this.keys = [];
      // use arrow function so 'this' in the function still the same this, won't change to window
      window.addEventListener('keydown', e => {
        // log e.key to check the key name in console 
        // console.log(e.key);
        if ((e.key === 'ArrowDown' ||
            e.key === 'ArrowUp' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight')
          && this.keys.indexOf(e.key) === -1) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener('keyup', e => {
        if (e.key === 'ArrowDown' ||
            e.key === 'ArrowUp' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight') {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  };
  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = playerImg;
      this.frameX = 0;
      this.maxFrame = 8; 
      this.frameY = 0;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    };
    draw(ctx) {
      ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    };
    update(input, deltaTime, enemies) {
      // collision detection
      enemies.forEach(enemy => {
        const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
        const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (enemy.width + this.width) / 3) {
          gameOver = true;
        }
      })
      // sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      // control movement speed with keys 
      if (input.keys.indexOf('ArrowRight') > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf('ArrowLeft') > -1) {
        this.speed = -5;
      } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
        this.vy -= 30;
      } else {
        this.speed = 0;
      }
      // horizontal movement boundary
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
      // vertical movement
      this.y += this.vy;
      if (!this.onGround()) {
        this.vy += this.weight;
        this.maxFrame = 5;
        this.frameY = 1;
      } else {
        this.vy = 0;
        this.maxFrame = 8;
        this.frameY = 0;
      }
      // vertical movement boundary
      if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  };
  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = bgImg;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 5;

    };
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(this.image, this.x + this.width -1, this.y, this.width, this.height);
    };
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) this.x = 0;
    }
  };
  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 160;
      this.height = 119;
      this.image = enemyImg;
      this.x = this.gameWidth;
      this.y = this.gameHeight - this.height;
      this.frameX = 0;
      this.maxFrame = 5;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.speed = 5;
      this.marked = false;
    };
    draw(ctx) {
      ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    };
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.marked = true;
        score++;
      }
    }
  };
  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(cA.width, cA.height));
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    };
    enemies.forEach(enemy => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    });
    enemies = enemies.filter(enemy => !enemy.marked);
  };
  function displayStatusText(ctx) {
    ctx.font = '40px Helvetica';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 20, 50);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 22, 52);
    if (gameOver) {
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';
      ctx.fillText('GAME OVER, try again!', cA.width / 2, 200);
      ctx.fillStyle = 'white';
      ctx.fillText('GAME OVER, try again!', cA.width / 2 + 2, 202);
    }
  };

  const input = new InputHandler();
  const player = new Player(cA.width, cA.height);
  const bg = new Background(cA.width, cA.height);

  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 1000;
  let randomEnemyInterval = Math.random() * 1000 + 500;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, cA.width, cA.height);
    bg.draw(ctx);
    bg.update();
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime);
    displayStatusText(ctx);
    if(!gameOver) requestAnimationFrame(animate);
  };

  animate(0);
})