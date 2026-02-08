import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { PlayfieldObject } from './PlayfieldObject';
import { drawBullet } from '../rendering/Sprites';

export class PlayerBullet extends PlayfieldObject {
  private direction: Vec;
  private static readonly SPEED = 6;

  constructor(game: Game, position: Vec, direction: Vec) {
    super(game, position);
    this.makeCollidable(10);
    this.direction = direction;
  }

  update(): void {
    this.position = this.position.add(this.direction.mult(PlayerBullet.SPEED));
    super.update();
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    drawBullet(ctx);
    ctx.restore();
  }
}
