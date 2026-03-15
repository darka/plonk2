// Sprite draw functions.
// Entity sprites use SVG assets; animations and UI keep programmatic drawing.
// Each entity sprite draws centered at (0,0); caller handles translate/rotate.

import { getSprite } from './Assets';

function blitSprite(ctx: CanvasRenderingContext2D, name: string): void {
  const s = getSprite(name);
  ctx.drawImage(s.img, -s.originX, -s.originY);
}

export function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const s = getSprite('background');
  ctx.drawImage(s.img, 0, 0, s.width, s.height, 0, 0, w, h);
}

export function drawSubmarine(ctx: CanvasRenderingContext2D, alpha: number): void {
  ctx.globalAlpha = alpha;
  blitSprite(ctx, 'player');
  ctx.globalAlpha = 1;
}

export function drawTurret(ctx: CanvasRenderingContext2D, alpha: number): void {
  ctx.globalAlpha = alpha;
  blitSprite(ctx, 'gun');
  ctx.globalAlpha = 1;
}

export function drawBullet(ctx: CanvasRenderingContext2D): void {
  blitSprite(ctx, 'bullet');
}

export function drawFlier(ctx: CanvasRenderingContext2D): void {
  blitSprite(ctx, 'flier');
}

export function drawSeeker(ctx: CanvasRenderingContext2D): void {
  blitSprite(ctx, 'seeker');
}

export function drawBubble(ctx: CanvasRenderingContext2D, alpha: number): void {
  ctx.globalAlpha = alpha;
  blitSprite(ctx, 'bubble');
  ctx.globalAlpha = 1;
}

export function drawExplosion(ctx: CanvasRenderingContext2D, frame: number, totalFrames: number): void {
  const t = frame / totalFrames;
  const radius = 5 + t * 35;
  const alpha = 1 - t;

  let r: number, g: number, b: number;
  if (t < 0.5) {
    const u = t * 2;
    r = 255;
    g = Math.floor(255 * (1 - u * 0.6));
    b = Math.floor(80 * (1 - u));
  } else {
    const u = (t - 0.5) * 2;
    r = Math.floor(255 * (1 - u * 0.3));
    g = Math.floor(102 * (1 - u));
    b = 0;
  }

  ctx.globalAlpha = alpha;
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

export function drawMuzzleFlash(ctx: CanvasRenderingContext2D, frame: number, totalFrames: number): void {
  const t = frame / totalFrames;
  const radius = 8 * (1 - t);
  const alpha = 1 - t;

  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffffcc';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// --- Programmatic enemy sprites ---

export function drawSpinner(ctx: CanvasRenderingContext2D): void {
  // Rotating ring with spokes
  ctx.strokeStyle = '#66ddff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.stroke();

  // Inner dot
  ctx.fillStyle = '#aaeeff';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Spokes
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 4, Math.sin(a) * 4);
    ctx.lineTo(Math.cos(a) * 10, Math.sin(a) * 10);
    ctx.stroke();
  }
}

export function drawBomber(ctx: CanvasRenderingContext2D): void {
  // Large dark hexagon
  ctx.fillStyle = '#334455';
  ctx.strokeStyle = '#556677';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 6;
    const x = Math.cos(a) * 18;
    const y = Math.sin(a) * 18;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inner circle detail
  ctx.fillStyle = '#667788';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  // Center dot
  ctx.fillStyle = '#ff6644';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
}

export function drawDasher(ctx: CanvasRenderingContext2D): void {
  // Arrow/chevron shape pointing up (rotation handled by caller)
  ctx.fillStyle = '#ff4466';
  ctx.strokeStyle = '#ff8899';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -14);    // tip
  ctx.lineTo(8, 10);     // right
  ctx.lineTo(0, 4);      // inner notch
  ctx.lineTo(-8, 10);    // left
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function drawMine(ctx: CanvasRenderingContext2D, age: number): void {
  // Pulsing circle with spikes
  const pulse = 1 + 0.2 * Math.sin(age * 0.15);
  const baseRadius = 6 * pulse;

  // Spikes
  ctx.strokeStyle = '#ffaa33';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * baseRadius, Math.sin(a) * baseRadius);
    ctx.lineTo(Math.cos(a) * (baseRadius + 4), Math.sin(a) * (baseRadius + 4));
    ctx.stroke();
  }

  // Core
  ctx.fillStyle = '#ff8822';
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
  ctx.fill();

  // Inner glow
  ctx.fillStyle = '#ffcc44';
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

// Menu sprites

export function drawOrbPad(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const s = getSprite('orbPad');
  ctx.drawImage(s.img, x - s.originX, y - s.originY);
}

export function drawOrb(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const s = getSprite('orb');
  // Orb SVG is 445x445 but displayed at ~160px diameter (r=80 in old code)
  const displaySize = 160;
  ctx.drawImage(s.img, x - displaySize / 2, y - displaySize / 2, displaySize, displaySize);
}

export function drawPlonkLogo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.font = 'bold 48px Tahoma, sans-serif';
  ctx.fillStyle = '#88aaff';
  ctx.textAlign = 'center';
  ctx.fillText('PLONK', x, y);
  ctx.textAlign = 'start';
}

export function drawPlayButton(ctx: CanvasRenderingContext2D, x: number, y: number, hover: boolean): void {
  const w = 120;
  const h = 40;
  const r = 8;
  ctx.fillStyle = hover ? '#5577cc' : '#3355aa';
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();

  ctx.font = 'bold 20px Tahoma, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PLAY', x + w / 2, y + h / 2);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

export function drawControlsInfo(ctx: CanvasRenderingContext2D, x: number, y: number, alpha: number): void {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  const w = 280;
  const h = 120;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);

  ctx.fillStyle = '#ffffff';
  ctx.font = '14px Tahoma, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('WASD / Arrow Keys - Move', x, y - 30);
  ctx.fillText('Mouse - Aim', x, y - 5);
  ctx.fillText('Click - Shoot', x, y + 20);
  ctx.textAlign = 'start';
  ctx.globalAlpha = 1;
}

export function drawInterfaceBackground(ctx: CanvasRenderingContext2D, w: number, alpha: number): void {
  ctx.globalAlpha = alpha;
  const s = getSprite('interfaceBg');
  // Scale to fill the game width, position at bottom of screen
  ctx.drawImage(s.img, 0, 0, s.width, s.height, 0, 480 - s.height, w, s.height);
  ctx.globalAlpha = 1;
}
