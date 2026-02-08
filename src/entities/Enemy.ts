import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { PlayfieldObject } from './PlayfieldObject';
import type { Player } from './Player';

export abstract class Enemy extends PlayfieldObject {
  protected velocity!: Vec;
  protected player: Player;
  public health: number;

  constructor(game: Game, health: number, position: Vec, player: Player) {
    super(game, position);
    this.player = player;
    this.health = health;
  }

  protected aim(target: Vec): number {
    return Math.atan2(target.y - this.position.y, target.x - this.position.x);
  }

  update(): void {
    if (this.health <= 0) {
      this.die();
    }
    super.update();
  }

  die(): void {
    // Override in subclasses
  }

  abstract handleBulletCollision(bullet: PlayfieldObject): void;
}
