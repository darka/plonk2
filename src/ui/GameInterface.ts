import type { Game } from '../core/Game';
import type { Player } from '../entities/Player';
import { Fading } from '../core/Fading';
import { drawInterfaceBackground } from '../rendering/Sprites';

export class GameInterface {
  private game: Game;
  private player: Player;
  private interfaceBgAlpha = 0;
  private healthAlpha = 0;
  private scoreAlpha = 0;

  private levelTitleText: string | null = null;
  private levelOutlineText: string | null = null;
  private levelTitleAlpha = 0;
  private levelOutlineAlpha = 0;

  // Fadeable wrappers
  private interfaceBgFadeable = { alpha: 0 };
  private healthFadeable = { alpha: 0 };
  private scoreFadeable = { alpha: 0 };
  private levelTitleFadeable = { alpha: 0 };
  private levelOutlineFadeable = { alpha: 0 };

  private frames = 0;
  private fps = 0;
  private nextFpsTick = 0;

  constructor(game: Game) {
    this.game = game;
    this.player = game.getPlayfield().player;

    Fading.fadeIn(game, this.interfaceBgFadeable, 1.0);
    Fading.fadeIn(game, this.healthFadeable, 0.7);
    Fading.fadeIn(game, this.scoreFadeable, 0.4);
  }

  showLevelText(title: string, outline: string): void {
    this.levelTitleText = title;
    this.levelOutlineText = outline;

    Fading.fadeIn(this.game, this.levelTitleFadeable, 0.6, 0.1);
    this.game.registerTimer(200, 1, () => {
      Fading.fadeIn(this.game, this.levelOutlineFadeable, 0.6, 0.1);
    });
    this.game.registerTimer(500, 1, () => {
      Fading.fadeOut(this.game, this.levelTitleFadeable);
      Fading.fadeOut(this.game, this.levelOutlineFadeable);
    });
    this.game.registerTimer(600, 1, () => {
      this.levelTitleText = null;
      this.levelOutlineText = null;
    });
  }

  update(): void {
    this.interfaceBgAlpha = this.interfaceBgFadeable.alpha;
    this.healthAlpha = this.healthFadeable.alpha;
    this.scoreAlpha = this.scoreFadeable.alpha;
    this.levelTitleAlpha = this.levelTitleFadeable.alpha;
    this.levelOutlineAlpha = this.levelOutlineFadeable.alpha;

    // FPS counter
    this.frames += 1;
    const time = performance.now();
    if (time >= this.nextFpsTick) {
      this.fps = this.frames;
      this.frames = 0;
      this.nextFpsTick = time + 1000;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const w = this.game.windowWidth;

    // Interface background
    drawInterfaceBackground(ctx, w, this.interfaceBgAlpha);

    // Health display
    ctx.globalAlpha = this.healthAlpha;
    ctx.font = 'bold 25px Tahoma, sans-serif';
    ctx.fillStyle = '#CB3333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(Math.max(0, Math.floor(this.player.health))), 85, 456);

    // Score display
    ctx.globalAlpha = this.scoreAlpha;
    ctx.fillStyle = '#112244';
    ctx.textAlign = 'right';
    ctx.fillText(String(this.game.score), 612, 456);

    ctx.globalAlpha = 1;
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';

    // FPS display
    ctx.font = '12px Tahoma, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('FPS: ' + this.fps, 4, 14);

    // Level text
    if (this.levelTitleText !== null) {
      ctx.globalAlpha = this.levelTitleAlpha;
      ctx.font = 'bold 75px Tahoma, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(this.levelTitleText, w / 2, 100);
      ctx.textAlign = 'start';
      ctx.globalAlpha = 1;
    }
    if (this.levelOutlineText !== null) {
      ctx.globalAlpha = this.levelOutlineAlpha;
      ctx.font = 'bold 21px Tahoma, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(this.levelOutlineText, w / 2, 160);
      ctx.textAlign = 'start';
      ctx.globalAlpha = 1;
    }
  }
}
