window.addEventListener('load', function () {
  const ctx = cA.getContext('2d');
  cA.width = 1400;
  cA.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;

  class InputHandler{
    constructor() {
      this.keys = [];
      this.touchY = '';
      this.touchTreshold = 30;
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
        } else if (e.key === 'Enter' && gameOver) restartGame();
      });
      window.addEventListener('keyup', e => {
        if (e.key === 'ArrowDown' ||
            e.key === 'ArrowUp' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight') {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
      // event for mobile
      window.addEventListener('touchstart', e => {
        this.touchY = e.changedTouches[0].pageY;
      });
      window.addEventListener('touchmove', e => {
        const swipeDistance = e.changedTouches[0].pageY - this.touchY;
        if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipeUp') === -1) {
          this.keys.push('swipeUp');
        }
        else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipeDown') === -1) {
          this.keys.push('swipeDown');
          if (gameOver) restartGame();
        }
      });
      window.addEventListener('touchend', e => {
        this.keys.splice(this.keys.indexOf('swipeUp'), 1);
        this.keys.splice(this.keys.indexOf('swipeDown'), 1);
      })
    }
  };

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 100;
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
    restart() {
      this.x = 100;
      this.y = this.gameHeight - this.height;
      this.maxFrame = 8; 
      this.frameY = 0;
    };
    draw(ctx) {
      // Draw a circle around player for checking collision, same for enemy
      // ctx.lineWidth = 5;
      // ctx.strokeStyle = 'white';
      // ctx.beginPath();
      // ctx.arc(this.x + this.width / 2, this.y + this.height / 2 + 20, this.width / 3, 0, Math.PI * 2);
      // ctx.stroke();
      ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    };
    update(input, deltaTime, enemies) {
      // collision detection
      enemies.forEach(enemy => {
        const dx = (enemy.x + enemy.width/2 - 20) - (this.x + this.width/2);
        const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2 + 20);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < (enemy.width + this.width)/3) {
          gameOver = true;
        };
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
      } else if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipeUp') > -1) && this.onGround()) {
        this.vy -= 32;
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
    };
    restart() {
      this.x = 0;
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
      // when enemy left screen, score +1
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
    ctx.textAlign = 'left';
    ctx.font = '40px Helvetica';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 20, 50);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 22, 52);
    if (gameOver) {
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';
      ctx.fillText('GAME OVER, press Enter or swipe down to restart!', cA.width / 2, 200);
      ctx.fillStyle = 'white';
      ctx.fillText('GAME OVER, press Enter or swipe down to restart!', cA.width / 2 + 2, 202);
    }
  };

  function restartGame() {
    player.restart();
    bg.restart();
    enemies = [];
    score = 0;
    gameOver = false;
    animate(0);
  };

  fullScreenBtn.addEventListener('click', toggleFullScreen);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      cA.requestFullscreen()
        .catch(err => {
          alert(`Erro, can't enable full-screen mode: ${err.message}`)
        });
    } else {
      document.exitFullscreen();
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