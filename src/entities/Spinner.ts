import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { Enemy } from './Enemy';
import type { Player } from './Player';
import type { PlayfieldObject } from './PlayfieldObject';
import { Fading } from '../core/Fading';
import { drawSpinner } from '../rendering/Sprites';

export class Spinner extends Enemy {
  private static readonly SPEED = 1.5;
  private static readonly ORBIT_SPEED = 0.08; // radians per frame
  private static readonly RADIUS_DECAY = 0.3; // px per frame closer

  private orbitAngle: number;
  private orbitRadius: number;
  private targetPoint: Vec;

  constructor(game: Game, position: Vec, player: Player) {
    super(game, 15, position, player);
    this.velocity = new Vec(0, 0);
    this.makeCollidable(12);

    const dx = position.x - player.position.x;
    const dy = position.y - player.position.y;
    this.orbitRadius = Math.sqrt(dx * dx + dy * dy);
    this.orbitAngle = Math.atan2(dy, dx);
    this.targetPoint = player.position.copy();
  }

  update(): void {
    // Drift target point toward player
    if (!this.player.dead) {
      const toPlayer = this.player.position.sub(this.targetPoint);
      const dist = toPlayer.length();
      if (dist > 1) {
        this.targetPoint = this.targetPoint.add(toPlayer.mult(0.02));
      }
    }

    // Shrink orbit radius
    this.orbitRadius = Math.max(0, this.orbitRadius - Spinner.RADIUS_DECAY);

    // Advance orbit angle
    this.orbitAngle += Spinner.ORBIT_SPEED;

    // Compute position from orbit
    this.position = new Vec(
      this.targetPoint.x + Math.cos(this.orbitAngle) * this.orbitRadius,
      this.targetPoint.y + Math.sin(this.orbitAngle) * this.orbitRadius
    );

    this.rotation = (this.orbitAngle * 180 / Math.PI) * 3; // visual spin

    super.update();
    this.spawnBubblesAroundMaybe();
  }

  handlePlayerCollision(): void {
    this.health -= 15;
    this.player.health -= 12;
    Fading.quickFlash(this.game, this.player);
  }

  die(): void {
    this.game.getPlayfield().addExplosion(this.position);
    this.markAsUnusedInArray();
  }

  handleBulletCollision(bullet: PlayfieldObject): void {
    this.health -= 15;
    bullet.markAsUnusedInArray();
    this.game.score += 15;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    drawSpinner(ctx);
    ctx.restore();
  }
}
