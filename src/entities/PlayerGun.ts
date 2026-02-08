import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { PlayfieldObject } from './PlayfieldObject';
import { drawRotated } from '../rendering/Renderer';
import { drawTurret } from '../rendering/Sprites';

export class PlayerGun extends PlayfieldObject {
  private mousePosition: Vec = new Vec(0, 0);
  public angle: number = 0; // radians

  constructor(game: Game) {
    super(game, new Vec(0, 0));
  }

  private adjustGun(): void {
    const diff = this.mousePosition.sub(this.position);
    this.angle = Math.atan2(diff.y, diff.x);
    this.rotation = 180 * this.angle / Math.PI + 90;
  }

  trackMouse(mousePosition: Vec): void {
    this.mousePosition = mousePosition;
  }

  update(): void {
    super.update();
    this.adjustGun();
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawRotated(ctx, this.position.x, this.position.y, this.rotation, (c) => {
      drawTurret(c, this.alpha);
    });
  }
}
