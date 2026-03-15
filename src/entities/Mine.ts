import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { Enemy } from './Enemy';
import type { Player } from './Player';
import type { PlayfieldObject } from './PlayfieldObject';
import { Fading } from '../core/Fading';
import { drawMine } from '../rendering/Sprites';

export class Mine extends Enemy {
  private static readonly LIFETIME = 600;
  private age: number = 0;

  constructor(game: Game, position: Vec, player: Player) {
    super(game, 10, position, player);
    this.velocity = new Vec(0, 0);
    this.makeCollidable(8);
  }

  update(): void {
    this.age += 1;
    if (this.age >= Mine.LIFETIME) {
      this.markAsUnusedInArray();
      return;
    }
    super.update();
  }

  handlePlayerCollision(): void {
    this.health -= 10;
    this.player.health -= 15;
    Fading.quickFlash(this.game, this.player);
  }

  die(): void {
    this.game.getPlayfield().addExplosion(this.position);
    this.markAsUnusedInArray();
  }

  handleBulletCollision(bullet: PlayfieldObject): void {
    this.health -= 10;
    bullet.markAsUnusedInArray();
    this.game.score += 5;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    drawMine(ctx, this.age);
    ctx.restore();
  }
}
