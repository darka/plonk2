import type { Game } from './Game';

export class Timer {
  private interval: number;
  private repeatCount: number;
  private timesActivated: number = 0;
  private finished: boolean = false;
  private func: () => void;
  public global: boolean;
  public nextTick: number;

  constructor(game: Game, interval: number, repeatCount: number, func: () => void, global: boolean = false) {
    this.interval = interval;
    this.repeatCount = repeatCount;
    this.func = func;
    this.global = global; // Fixed: AS3 had bug `global_ = false` overwriting the param
    this.nextTick = game.currentTick() + interval;
  }

  tick(currentTick: number): void {
    if (!this.finished && this.nextTick === currentTick) {
      this.func();
      this.timesActivated += 1;
      if (this.timesActivated >= this.repeatCount) {
        this.finished = true;
      } else {
        this.nextTick = currentTick + this.interval;
      }
    }
  }

  hasFinished(): boolean {
    return this.finished;
  }
}
