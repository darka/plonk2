export function drawRotated(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angleDeg: number,
  drawFn: (ctx: CanvasRenderingContext2D) => void
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);
  drawFn(ctx);
  ctx.restore();
}

export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
}
