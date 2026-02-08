import { describe, it, expect } from 'vitest';
import { Fading } from './Fading';
import type { Fadeable } from './Fading';
import { Timer } from './Timer';
import type { Game } from './Game';

// Minimal game stub that runs timers synchronously
function createTimerRunner() {
  const timers: Timer[] = [];
  let tick = 0;

  const game = {
    currentTick: () => tick,
    registerTimer(interval: number, repeatCount: number, func: () => void) {
      timers.push(new Timer(game as unknown as Game, interval, repeatCount, func));
    },
  } as unknown as Game;

  function advance(frames: number) {
    for (let i = 0; i < frames; i++) {
      tick++;
      for (const t of timers) t.tick(tick);
    }
  }

  return { game, advance };
}

describe('Fading', () => {
  it('fadeIn increases alpha to maxFade', () => {
    const { game, advance } = createTimerRunner();
    const target: Fadeable = { alpha: 1 };

    Fading.fadeIn(game, target, 0.8);
    expect(target.alpha).toBe(0); // immediately set to 0

    // 20 repeats at interval 10, speed 0.05 -> 200 frames to complete
    advance(200);
    expect(target.alpha).toBeCloseTo(0.8);
  });

  it('fadeOut decreases alpha to 0', () => {
    const { game, advance } = createTimerRunner();
    const target: Fadeable = { alpha: 1 };

    Fading.fadeOut(game, target);
    advance(200);
    expect(target.alpha).toBe(0);
  });

  it('fadeIn respects custom speed', () => {
    const { game, advance } = createTimerRunner();
    const target: Fadeable = { alpha: 1 };

    Fading.fadeIn(game, target, 0.6, 0.1);
    // 0.1 * 6 steps = 0.6, at interval 10 = 60 frames
    advance(60);
    expect(target.alpha).toBeCloseTo(0.6);
  });

  it('quickFlash cycles alpha down and up', () => {
    const { game, advance } = createTimerRunner();
    const target: Fadeable = { alpha: 1 };

    Fading.quickFlash(game, target);

    // After first batch (4 decrements of 0.25 at interval 2): 8 frames
    advance(8);
    expect(target.alpha).toBeCloseTo(0);

    // At tick 8, the second timer fires registering increment timers
    // Advance through the increment phase
    advance(8);
    expect(target.alpha).toBeCloseTo(1);
  });
});
