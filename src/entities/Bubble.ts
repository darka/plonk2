import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { PlayfieldObject } from './PlayfieldObject';
import { drawBubble } from '../rendering/Sprites';

export class Bubble extends PlayfieldObject {
  private speed: number = 2;
  private acc: number;

  constructor(game: Game, position: Vec) {
    super(game, position);
    this.acc = Math.random() * 0.05;
    game.registerTimer(30 + Math.floor(Math.random() * 30), 1, () => this.markAsUnusedInArray());
  }

  update(): void {
    this.position.y -= this.speed;
    this.speed += this.acc;
    super.update();
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    drawBubble(ctx, this.alpha);
    ctx.restore();
  }
}
