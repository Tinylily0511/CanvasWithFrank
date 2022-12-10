export class FloatingMessage {
  constructor(value, x, y, targetX, targetY) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.marked = false;
    this.timer = 0;
  };
  update() {
    this.x += (this.targetX - this.x) * 0.03;
    this.y += (this.targetY - this.y);
    this.timer++;
    if (this.timer > 100) this.marked = true;
  };
  draw(ctx) {
    ctx.font = '20px Creepster';
    ctx.fillStyle = 'white';
    ctx.fillText(this.value, this.x, this.y);
    ctx.fillStyle = 'black';
    ctx.fillText(this.value, this.x - 2, this.y - 2);
  };
}