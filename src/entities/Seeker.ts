import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { Enemy } from './Enemy';
import type { Player } from './Player';
import type { PlayfieldObject } from './PlayfieldObject';
import { Fading } from '../core/Fading';
import { drawRotated } from '../rendering/Renderer';
import { drawSeeker } from '../rendering/Sprites';

export class Seeker extends Enemy {
  private static readonly SPEED = 0.8;
  private static readonly TURN_RATE = 1.5; // degrees per frame
  private heading: number; // degrees

  constructor(game: Game, position: Vec, player: Player) {
    super(game, 10, position, player);
    this.makeCollidable(10);
    const angle = this.aim(player.position);
    this.heading = angle * 180 / Math.PI;
    this.updateVelocity();
  }

  private updateVelocity(): void {
    const rad = this.heading * Math.PI / 180;
    this.velocity = new Vec(
      Seeker.SPEED * Math.cos(rad),
      Seeker.SPEED * Math.sin(rad)
    );
    this.rotation = 90 + this.heading;
  }

  update(): void {
    if (!this.player.dead) {
      const targetAngle = this.aim(this.player.position) * 180 / Math.PI;
      let diff = targetAngle - this.heading;

      // Normalize to -180..180
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;

      if (diff > Seeker.TURN_RATE) {
        this.heading += Seeker.TURN_RATE;
      } else if (diff < -Seeker.TURN_RATE) {
        this.heading -= Seeker.TURN_RATE;
      } else {
        this.heading = targetAngle;
      }

      this.updateVelocity();
    }
    this.position = this.position.add(this.velocity);
    super.update();
    this.spawnBubblesAroundMaybe();
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
    this.game.score += 20;
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawRotated(ctx, this.position.x, this.position.y, this.rotation, (c) => {
      drawSeeker(c);
    });
  }
}
