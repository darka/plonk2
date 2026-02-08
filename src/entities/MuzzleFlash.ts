import type { Game } from '../core/Game';
import type { Player } from './Player';
import { PlayfieldObject } from './PlayfieldObject';
import { drawMuzzleFlash } from '../rendering/Sprites';

export class MuzzleFlash extends PlayfieldObject {
  private player: Player;
  private frame: number = 0;
  private static readonly TOTAL_FRAMES = 6;

  constructor(game: Game, player: Player, rotation: number) {
    super(game, player.position.copy());
    this.player = player;
    this.rotation = rotation;
  }

  update(): void {
    this.position = this.player.position;
    this.frame += 1;
    if (this.frame >= MuzzleFlash.TOTAL_FRAMES) {
      this.markAsUnusedInArray();
    }
    super.update();
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.frame < MuzzleFlash.TOTAL_FRAMES) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      drawMuzzleFlash(ctx, this.frame, MuzzleFlash.TOTAL_FRAMES);
      ctx.restore();
    }
  }
}
