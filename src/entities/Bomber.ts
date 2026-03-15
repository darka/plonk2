import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { Enemy } from './Enemy';
import type { Player } from './Player';
import type { PlayfieldObject } from './PlayfieldObject';
import { Fading } from '../core/Fading';
import { drawRotated } from '../rendering/Renderer';
import { drawBomber } from '../rendering/Sprites';

export class Bomber extends Enemy {
  private static readonly SPEED = 1.0;
  private static readonly MINE_INTERVAL = 90;

  private ticksSinceLastMine: number = 0;

  constructor(game: Game, position: Vec, player: Player) {
    super(game, 60, position, player);

    const angle = this.aim(player.position);
    this.rotation = 90 + angle * 180.0 / Math.PI;
    this.velocity = new Vec(Math.cos(angle), Math.sin(angle)).mult(Bomber.SPEED);
    this.makeCollidable(20);
  }

  update(): void {
    this.position = this.position.add(this.velocity);

    this.ticksSinceLastMine += 1;
    if (this.ticksSinceLastMine >= Bomber.MINE_INTERVAL) {
      this.ticksSinceLastMine = 0;
      this.game.getPlayfield().addMine(this.position.copy());
    }

    super.update();
    this.spawnBubblesAroundMaybe();
  }

  handlePlayerCollision(): void {
    this.health -= 60;
    this.player.health -= 20;
    Fading.quickFlash(this.game, this.player);
  }

  die(): void {
    this.game.getPlayfield().addExplosion(this.position);
    this.markAsUnusedInArray();
  }

  handleBulletCollision(bullet: PlayfieldObject): void {
    this.health -= 20;
    bullet.markAsUnusedInArray();
    this.game.score += 30;
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawRotated(ctx, this.position.x, this.position.y, this.rotation, (c) => {
      drawBomber(c);
    });
  }
}
