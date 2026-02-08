import { Timer } from './Timer';
import { Input } from './Input';
import type { GameMode } from '../modes/GameMode';
import type { Playfield } from '../world/Playfield';

export class Game {
  public readonly windowWidth = 640;
  public readonly windowHeight = 480;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public input: Input;

  public gameMode!: GameMode;
  public score: number = 0;

  private timers: Timer[] = [];
  private tick_: number = 0;
  private paused: boolean = false;

  // Set by main.ts to avoid circular imports
  public LevelControllerClass!: new (game: Game) => GameMode & { playfield: Playfield };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.input = new Input(canvas);
  }

  getPlayfield(): Playfield {
    return (this.gameMode as unknown as { playfield: Playfield }).playfield;
  }

  startPlaying(): void {
    this.gameMode = new this.LevelControllerClass(this);
    this.gameMode.start();
  }

  update(): void {
    this.gameMode.update();
    this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
    this.gameMode.render(this.ctx);
    this.tick_ += 1;

    for (let i = 0; i < this.timers.length; ++i) {
      if (this.paused && !this.timers[i].global) {
        this.timers[i].nextTick += 1;
      }
      if (this.timers[i].hasFinished()) {
        this.timers[i] = this.timers[this.timers.length - 1];
        this.timers.pop();
        i -= 1;
        continue;
      } else {
        this.timers[i].tick(this.tick_);
      }
    }
  }

  currentTick(): number {
    return this.tick_;
  }

  registerTimer(interval: number, repeatCount: number, func: () => void, global: boolean = false): void {
    this.timers.push(new Timer(this, interval, repeatCount, func, global));
  }

  pauseTimers(): void {
    this.paused = true;
  }
}
