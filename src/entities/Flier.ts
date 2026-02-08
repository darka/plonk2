import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { Enemy } from './Enemy';
import type { Player } from './Player';
import type { PlayfieldObject } from './PlayfieldObject';
import { Fading } from '../core/Fading';
import { drawRotated } from '../rendering/Renderer';
import { drawFlier } from '../rendering/Sprites';

export class Flier extends Enemy {
  private static readonly VELOCITY_COEF = 3.0;

  constructor(game: Game, position: Vec, player: Player) {
    super(game, 20, position, player);

    const angle = this.aim(player.position);
    this.rotation = 90 + angle * 180.0 / Math.PI;
    this.velocity = new Vec(Math.cos(angle), Math.sin(angle)).mult(Flier.VELOCITY_COEF);
    this.makeCollidable(16);
  }

  update(): void {
    this.position = this.position.add(this.velocity);
    super.update();
    this.spawnBubblesAroundMaybe();
  }

  handlePlayerCollision(): void {
    this.health -= 20;
    this.player.health -= 10;
    Fading.quickFlash(this.game, this.player);
  }

  die(): void {
    this.game.getPlayfield().addExplosion(this.position);
    this.markAsUnusedInArray();
  }

  handleBulletCollision(bullet: PlayfieldObject): void {
    this.health -= 20;
    bullet.markAsUnusedInArray();
    this.game.score += 10;
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawRotated(ctx, this.position.x, this.position.y, this.rotation, (c) => {
      drawFlier(c);
    });
  }
}
