import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { Fading } from '../core/Fading';

export class PlayfieldObject {
  public game: Game;
  public position: Vec;
  public collidable: boolean = false;
  public radius: number = 0;
  public alpha: number = 1;
  public rotation: number = 0; // degrees
  public unusedInArray: boolean = false;

  private static readonly OFFSCREEN_LIMIT = 300;

  constructor(game: Game, position: Vec) {
    this.game = game;
    this.position = position;
  }

  makeCollidable(radius: number): void {
    this.collidable = true;
    this.radius = radius;
  }

  collidesWith(other: PlayfieldObject): boolean {
    if (this.collidable && other.collidable) {
      const dx = this.position.x - other.position.x;
      const dy = this.position.y - other.position.y;
      return Math.sqrt(dx * dx + dy * dy) < this.radius + other.radius;
    }
    return false;
  }

  update(): void {
    // Base update does nothing special in canvas mode
  }

  fadeIn(): void {
    Fading.fadeIn(this.game, this, 1.0);
  }

  fadeOut(): void {
    Fading.fadeOut(this.game, this);
  }

  isOffscreen(): boolean {
    const limit = PlayfieldObject.OFFSCREEN_LIMIT;
    return (
      this.position.x < -limit ||
      this.position.y < -limit ||
      this.position.x > this.game.windowWidth + limit ||
      this.position.y > this.game.windowHeight + limit
    );
  }

  markAsUnusedInArray(): void {
    if (!this.unusedInArray) {
      this.unusedInArray = true;
    }
  }

  handlePlayerCollision(): void {
    // Override in subclasses
  }

  spawnBubblesAroundMaybe(): void {
    if (Math.random() > 0.95) {
      this.game.getPlayfield().addBubbles(this.position.copy());
    }
  }

  render(_ctx: CanvasRenderingContext2D): void {
    // Override in subclasses
  }
}
