import type { Game } from './Game';

export interface Fadeable {
  alpha: number;
}

export class Fading {
  static fadeIn(game: Game, target: Fadeable, maxFade: number, speed: number = 0.05): void {
    target.alpha = 0;
    game.registerTimer(10, 20, () => {
      if (target.alpha + speed < maxFade) {
        target.alpha += speed;
      } else {
        target.alpha = maxFade;
      }
    });
  }

  static fadeOut(game: Game, target: Fadeable): void {
    game.registerTimer(10, 20, () => {
      if (target.alpha - 0.05 >= 0) {
        target.alpha -= 0.05;
      } else {
        target.alpha = 0;
      }
    });
  }

  static quickFlash(game: Game, target: Fadeable): void {
    game.registerTimer(2, 4, () => { target.alpha -= 0.25; });
    game.registerTimer(8, 1, () => { game.registerTimer(2, 4, () => { target.alpha += 0.25; }); });
    game.registerTimer(16, 1, () => { game.registerTimer(2, 4, () => { target.alpha -= 0.25; }); });
    game.registerTimer(24, 1, () => { game.registerTimer(2, 4, () => { target.alpha += 0.25; }); });
  }
}
