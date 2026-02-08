import { describe, it, expect, vi } from 'vitest';
import { Timer } from './Timer';
import type { Game } from './Game';

function fakeGame(tick: number = 0): Game {
  return { currentTick: () => tick } as Game;
}

describe('Timer', () => {
  it('fires after the specified interval', () => {
    const fn = vi.fn();
    const timer = new Timer(fakeGame(0), 5, 1, fn);

    for (let t = 1; t <= 4; t++) timer.tick(t);
    expect(fn).not.toHaveBeenCalled();

    timer.tick(5);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('repeats the specified number of times', () => {
    const fn = vi.fn();
    const timer = new Timer(fakeGame(0), 3, 3, fn);

    // fires at tick 3, 6, 9
    for (let t = 1; t <= 9; t++) timer.tick(t);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(timer.hasFinished()).toBe(true);
  });

  it('marks as finished after all repetitions', () => {
    const fn = vi.fn();
    const timer = new Timer(fakeGame(0), 2, 1, fn);

    expect(timer.hasFinished()).toBe(false);
    timer.tick(2);
    expect(timer.hasFinished()).toBe(true);
  });

  it('does not fire on wrong ticks', () => {
    const fn = vi.fn();
    const timer = new Timer(fakeGame(10), 5, 1, fn);

    timer.tick(14);
    expect(fn).not.toHaveBeenCalled();
    timer.tick(15);
    expect(fn).toHaveBeenCalledOnce();
  });
});
