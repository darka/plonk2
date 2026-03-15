import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { Enemy } from './Enemy';
import type { Player } from './Player';
import type { PlayfieldObject } from './PlayfieldObject';
import { Fading } from '../core/Fading';
import { drawRotated } from '../rendering/Renderer';
import { drawDasher } from '../rendering/Sprites';

export class Dasher extends Enemy {
  private static readonly DASH_SPEED = 5.0;
  private static readonly DASH_DURATION = 30;
  private static readonly PAUSE_DURATION = 60;

  private dashTick: number = 0;
  private dashing: boolean = false;

  constructor(game: Game, position: Vec, player: Player) {
    super(game, 20, position, player);
    this.velocity = new Vec(0, 0);
    this.makeCollidable(14);
    this.startDash();
  }

  private startDash(): void {
    this.dashing = true;
    this.dashTick = 0;
    if (!this.player.dead) {
      const angle = this.aim(this.player.position);
      this.rotation = 90 + angle * 180.0 / Math.PI;
      this.velocity = new Vec(Math.cos(angle), Math.sin(angle)).mult(Dasher.DASH_SPEED);
    }
  }

  private startPause(): void {
    this.dashing = false;
    this.dashTick = 0;
    this.velocity = new Vec(0, 0);
  }

  update(): void {
    this.dashTick += 1;

    if (this.dashing) {
      if (this.dashTick >= Dasher.DASH_DURATION) {
        this.startPause();
      }
    } else {
      if (this.dashTick >= Dasher.PAUSE_DURATION) {
        this.startDash();
      }
    }

    this.position = this.position.add(this.velocity);
    super.update();
    this.spawnBubblesAroundMaybe();
  }

  handlePlayerCollision(): void {
    this.health -= 20;
    this.player.health -= 15;
    Fading.quickFlash(this.game, this.player);
  }

  die(): void {
    this.game.getPlayfield().addExplosion(this.position);
    this.markAsUnusedInArray();
  }

  handleBulletCollision(bullet: PlayfieldObject): void {
    this.health -= 20;
    bullet.markAsUnusedInArray();
    this.game.score += 25;
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawRotated(ctx, this.position.x, this.position.y, this.rotation, (c) => {
      drawDasher(c);
    });
  }
}
