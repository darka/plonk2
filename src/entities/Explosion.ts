import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { PlayfieldObject } from './PlayfieldObject';
import { drawExplosion } from '../rendering/Sprites';
import { playExplosion } from '../audio/Audio';

export class Explosion extends PlayfieldObject {
  private frame: number = 0;
  private static readonly TOTAL_FRAMES = 15;

  constructor(game: Game, position: Vec) {
    super(game, position);
    playExplosion();
  }

  update(): void {
    this.frame += 1;
    if (this.frame >= Explosion.TOTAL_FRAMES) {
      this.markAsUnusedInArray();
    }
    super.update();
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.frame < Explosion.TOTAL_FRAMES) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      drawExplosion(ctx, this.frame, Explosion.TOTAL_FRAMES);
      ctx.restore();
    }
  }
}
