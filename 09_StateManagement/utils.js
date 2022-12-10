export function drawStatusText(ctx, input) {
  ctx.font = '30px Helvetica';
  ctx.fillText('Last input: ' + input.lastkey, 20, 50);
}