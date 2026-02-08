import type { Game } from '../core/Game';

export abstract class GameMode {
  protected game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  start(): void {}
  update(): void {}
  render(_ctx: CanvasRenderingContext2D): void {}
}
