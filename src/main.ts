import { loadAssets } from './rendering/Assets';
import { Game } from './core/Game';
import { Menu } from './modes/Menu';
import { LevelController } from './modes/LevelController';

async function main(): Promise<void> {
  await loadAssets();

  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const game = new Game(canvas);
  game.LevelControllerClass = LevelController as any;

  // Start with Menu
  game.gameMode = new Menu(game);
  game.gameMode.start();

  // 30 FPS game loop
  const FRAME_MS = 1000 / 30;
  let lastTime = 0;
  let accumulator = 0;

  function gameLoop(timestamp: number): void {
    if (lastTime === 0) lastTime = timestamp;
    accumulator += timestamp - lastTime;
    lastTime = timestamp;

    while (accumulator >= FRAME_MS) {
      game.update();
      accumulator -= FRAME_MS;
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

main();
