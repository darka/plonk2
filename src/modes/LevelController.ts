import type { Game } from '../core/Game';
import { GameMode } from './GameMode';
import { Playfield } from '../world/Playfield';
import { GameInterface } from '../ui/GameInterface';
import { Fading } from '../core/Fading';
import { drawBackground, drawControlsInfo } from '../rendering/Sprites';

export class LevelController extends GameMode {
  public playfield!: Playfield;
  private gameInterface!: GameInterface;

  // Controls info dialog fade tracking
  private controlsInfoAlpha = 0;
  private controlsInfoFadeable = { alpha: 0 };
  private showControlsInfo = true;

  constructor(game: Game) {
    super(game);
  }

  start(): void {
    this.playfield = new Playfield(this.game);

    // Controls info dialog: fade in, then fade out, then remove
    this.controlsInfoFadeable.alpha = 0;
    Fading.fadeIn(this.game, this.controlsInfoFadeable, 1.0);
    this.game.registerTimer(500, 1, () => {
      Fading.fadeOut(this.game, this.controlsInfoFadeable);
    });
    this.game.registerTimer(1000, 1, () => {
      this.showControlsInfo = false;
    });

    this.gameInterface = new GameInterface(this.game);

    // Load level text (Level 1)
    this.game.registerTimer(900, 1, () => {
      this.gameInterface.showLevelText('Level 1', 'Titular Caverns');
    });
  }

  update(): void {
    const input = this.game.input;

    // Apply input to player
    if (!this.playfield.ignorePlayer && !this.playfield.player.dead) {
      this.playfield.player.applyInput(
        input.left, input.right, input.up, input.down,
        input.mouseDown, input.mousePos
      );
    }

    // Check for player death
    if (this.playfield && !this.playfield.destroyed && this.playfield.player.dead) {
      this.playfield.destroy();
    }

    this.playfield.update();
    this.gameInterface.update();
    this.controlsInfoAlpha = this.controlsInfoFadeable.alpha;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Background
    drawBackground(ctx, this.game.windowWidth, this.game.windowHeight);

    // Playfield (entities)
    this.playfield.render(ctx);

    // HUD
    this.gameInterface.render(ctx);

    // Controls info dialog on top
    if (this.showControlsInfo && this.controlsInfoAlpha > 0) {
      drawControlsInfo(
        ctx,
        this.game.windowWidth / 2,
        this.game.windowHeight / 2 - 30,
        this.controlsInfoAlpha
      );
    }
  }
}
