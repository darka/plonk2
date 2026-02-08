import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { Enemy } from './Enemy';
import type { Player } from './Player';
import type { PlayfieldObject } from './PlayfieldObject';
import { Fading } from '../core/Fading';
import { drawRotated } from '../rendering/Renderer';
import { drawSeeker } from '../rendering/Sprites';

export class Seeker extends Enemy {
  private static readonly VELOCITY_COEF = 2.0;

  constructor(game: Game, position: Vec, player: Player) {
    super(game, 20, position, player);
    this.makeCollidable(16);
    this.aimAtPlayer();
  }

  private aimAtPlayer(): void {
    const angle = this.aim(this.player.position);
    this.velocity = new Vec(
      Seeker.VELOCITY_COEF * Math.cos(angle),
      Seeker.VELOCITY_COEF * Math.sin(angle)
    );
    this.rotation = 90 + angle * 180.0 / Math.PI;
  }

  update(): void {
    if (!this.player.dead) {
      this.aimAtPlayer();
    }
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
      drawSeeker(c);
    });
  }
}
