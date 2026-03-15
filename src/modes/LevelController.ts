import type { Game } from '../core/Game';
import { GameMode } from './GameMode';
import { Playfield } from '../world/Playfield';
import { GameInterface } from '../ui/GameInterface';
import { Fading } from '../core/Fading';
import { drawBackground, drawControlsInfo } from '../rendering/Sprites';
import { LEVELS } from '../world/LevelDefs';
import type { SpawnDef } from '../world/LevelDefs';

export class LevelController extends GameMode {
  public playfield!: Playfield;
  private gameInterface!: GameInterface;

  // Controls info dialog fade tracking
  private controlsInfoAlpha = 0;
  private controlsInfoFadeable = { alpha: 0 };
  private showControlsInfo = true;

  // Level progression
  private currentLevel = 0;
  private levelStartTick = 0;
  private levelActive = false;
  private transitioning = false;

  constructor(game: Game) {
    super(game);
  }

  start(): void {
    this.playfield = new Playfield(this.game);

    // Controls info dialog: quick fade in, brief display, quick fade out
    this.controlsInfoFadeable.alpha = 0;
    this.game.registerTimer(2, 5, () => {
      this.controlsInfoFadeable.alpha = Math.min(1, this.controlsInfoFadeable.alpha + 0.2);
    });
    this.game.registerTimer(90, 1, () => {
      this.game.registerTimer(2, 5, () => {
        this.controlsInfoFadeable.alpha = Math.max(0, this.controlsInfoFadeable.alpha - 0.2);
      });
    });
    this.game.registerTimer(110, 1, () => {
      this.showControlsInfo = false;
    });

    this.gameInterface = new GameInterface(this.game);

    // Start first level after player intro
    this.game.registerTimer(150, 1, () => {
      this.startLevel(0);
    });
  }

  private startLevel(index: number): void {
    this.currentLevel = index;
    this.transitioning = false;

    const levelDef = LEVELS[this.currentLevel];
    this.gameInterface.showLevelText(levelDef.title, levelDef.subtitle);

    // Delay spawns slightly so level text is visible
    this.game.registerTimer(120, 1, () => {
      this.levelStartTick = this.game.currentTick();
      this.levelActive = true;
      this.setupSpawns(levelDef.spawns);
    });
  }

  private setupSpawns(spawns: SpawnDef[]): void {
    const pf = this.playfield;

    for (const spawn of spawns) {
      this.game.registerTimer(spawn.startTick, 1, () => {
        // Initial spawn
        this.doSpawn(spawn, pf);
        // Repeating spawns
        this.game.registerTimer(spawn.interval, 10000, () => {
          if (this.levelActive) {
            this.doSpawn(spawn, pf);
          }
        });
      });
    }
  }

  private doSpawn(spawn: SpawnDef, pf: Playfield): void {
    switch (spawn.type) {
      case 'flier-swarm':
        pf.spawnFlierSwarm(spawn.count ?? 20);
        break;
      case 'seeker':
        pf.addSeeker();
        break;
      case 'spinner':
        pf.addSpinner();
        break;
      case 'bomber':
        pf.addBomber();
        break;
      case 'dasher':
        pf.addDasher();
        break;
    }
  }

  private advanceLevel(): void {
    this.levelActive = false;
    this.transitioning = true;

    // Clear non-global timers (spawn timers)
    this.game.clearTimers();

    // Restore shooting ability (clearTimers may have killed the cooldown timer)
    this.playfield.player.canShoot = true;

    // Clear remaining enemies
    this.playfield.clearEnemies();

    const nextLevel = this.currentLevel + 1;

    if (nextLevel >= LEVELS.length) {
      // Victory! Show win message, then loop back
      this.game.registerTimer(60, 1, () => {
        this.gameInterface.showLevelText('You Win!', 'Looping back...');
        this.game.registerTimer(240, 1, () => {
          this.startLevel(0);
        });
      });
    } else {
      // Brief pause then start next level
      this.game.registerTimer(90, 1, () => {
        this.startLevel(nextLevel);
      });
    }
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
      this.levelActive = false;
    }

    // Check for level completion
    if (this.levelActive && !this.transitioning && !this.playfield.player.dead) {
      const levelDef = LEVELS[this.currentLevel];
      const elapsed = this.game.currentTick() - this.levelStartTick;
      if (elapsed >= levelDef.duration) {
        this.advanceLevel();
      }
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
