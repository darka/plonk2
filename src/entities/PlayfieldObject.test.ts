import { describe, it, expect } from 'vitest';
import { Vec } from '../math/Vec';
import { PlayfieldObject } from './PlayfieldObject';
import type { Game } from '../core/Game';
import type { Playfield } from '../world/Playfield';

function fakeGame(): Game {
  return {
    currentTick: () => 0,
    registerTimer: () => {},
    windowWidth: 640,
    windowHeight: 480,
    getPlayfield: () => ({
      addBubbles: () => {},
    } as unknown as Playfield),
  } as unknown as Game;
}

describe('PlayfieldObject', () => {
  describe('collision', () => {
    it('detects collision between overlapping objects', () => {
      const a = new PlayfieldObject(fakeGame(), new Vec(0, 0));
      const b = new PlayfieldObject(fakeGame(), new Vec(5, 0));
      a.makeCollidable(10);
      b.makeCollidable(10);

      expect(a.collidesWith(b)).toBe(true);
    });

    it('reports no collision when objects are far apart', () => {
      const a = new PlayfieldObject(fakeGame(), new Vec(0, 0));
      const b = new PlayfieldObject(fakeGame(), new Vec(100, 0));
      a.makeCollidable(10);
      b.makeCollidable(10);

      expect(a.collidesWith(b)).toBe(false);
    });

    it('reports no collision when objects are not collidable', () => {
      const a = new PlayfieldObject(fakeGame(), new Vec(0, 0));
      const b = new PlayfieldObject(fakeGame(), new Vec(1, 0));

      expect(a.collidesWith(b)).toBe(false);
    });

    it('detects collision at exact boundary', () => {
      const a = new PlayfieldObject(fakeGame(), new Vec(0, 0));
      const b = new PlayfieldObject(fakeGame(), new Vec(19, 0));
      a.makeCollidable(10);
      b.makeCollidable(10);

      // distance = 19, combined radii = 20, so they collide
      expect(a.collidesWith(b)).toBe(true);
    });
  });

  describe('offscreen detection', () => {
    it('marks objects far outside bounds as offscreen', () => {
      const obj = new PlayfieldObject(fakeGame(), new Vec(-400, 0));
      expect(obj.isOffscreen()).toBe(true);
    });

    it('keeps objects within bounds as onscreen', () => {
      const obj = new PlayfieldObject(fakeGame(), new Vec(320, 240));
      expect(obj.isOffscreen()).toBe(false);
    });

    it('tolerates objects slightly outside the viewport', () => {
      // OFFSCREEN_LIMIT is 300, so -299 should still be onscreen
      const obj = new PlayfieldObject(fakeGame(), new Vec(-299, 0));
      expect(obj.isOffscreen()).toBe(false);
    });
  });

  describe('markAsUnusedInArray', () => {
    it('sets unusedInArray flag', () => {
      const obj = new PlayfieldObject(fakeGame(), new Vec(0, 0));
      expect(obj.unusedInArray).toBe(false);
      obj.markAsUnusedInArray();
      expect(obj.unusedInArray).toBe(true);
    });
  });
});
