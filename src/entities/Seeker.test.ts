import { describe, it, expect } from 'vitest';
import { Vec } from '../math/Vec';
import { Seeker } from './Seeker';
import type { Game } from '../core/Game';
import type { Player } from './Player';
import type { Playfield } from '../world/Playfield';

function fakeGame(): Game {
  return {
    currentTick: () => 0,
    registerTimer: () => {},
    windowWidth: 640,
    windowHeight: 480,
    getPlayfield: () => ({
      addExplosion: () => {},
      addBubbles: () => {},
    } as unknown as Playfield),
    score: 0,
  } as unknown as Game;
}

function fakePlayer(x: number, y: number): Player {
  return {
    position: new Vec(x, y),
    dead: false,
    health: 100,
  } as unknown as Player;
}

describe('Seeker', () => {
  it('moves toward the player', () => {
    const player = fakePlayer(320, 240);
    const seeker = new Seeker(fakeGame(), new Vec(0, 240), player);

    const startDist = seeker.position.sub(player.position).length();
    for (let i = 0; i < 60; i++) seeker.update();
    const endDist = seeker.position.sub(player.position).length();

    expect(endDist).toBeLessThan(startDist);
  });

  it('gradually turns rather than snapping to target', () => {
    // Player is to the right; seeker spawns above heading down-right
    const player = fakePlayer(400, 240);
    const seeker = new Seeker(fakeGame(), new Vec(0, 0), player);

    // Now move the player far away so the target angle changes significantly
    player.position = new Vec(0, 400);

    const rotationBefore = seeker.rotation;
    seeker.update();
    const rotationAfter = seeker.rotation;

    // Rotation should change, but by at most the turn rate (1.5 deg)
    const rotationDelta = Math.abs(rotationAfter - rotationBefore);
    expect(rotationDelta).toBeGreaterThan(0);
    expect(rotationDelta).toBeLessThanOrEqual(1.5 + 0.001);
  });

  it('tracks a moving player', () => {
    const player = fakePlayer(100, 240);
    const seeker = new Seeker(fakeGame(), new Vec(320, 240), player);

    // Run a few frames toward initial position
    for (let i = 0; i < 30; i++) seeker.update();

    // Move player to opposite side
    player.position = new Vec(500, 240);

    // Run enough frames to complete the U-turn and close distance
    const posBeforeMove = seeker.position.copy();
    for (let i = 0; i < 300; i++) seeker.update();

    // Seeker should now be closer to the new player position
    const distToNewPos = seeker.position.sub(player.position).length();
    const distFromOldStart = posBeforeMove.sub(player.position).length();
    expect(distToNewPos).toBeLessThan(distFromOldStart);
  });

  it('stops turning when player is dead', () => {
    const player = fakePlayer(320, 240);
    const seeker = new Seeker(fakeGame(), new Vec(0, 0), player);

    // Run a few frames
    for (let i = 0; i < 10; i++) seeker.update();

    player.dead = true;
    const rotationBefore = seeker.rotation;

    // Run more frames — rotation should not change
    for (let i = 0; i < 10; i++) seeker.update();
    expect(seeker.rotation).toBe(rotationBefore);
  });

  it('dies from a single bullet hit', () => {
    const game = fakeGame();
    const player = fakePlayer(320, 240);
    const seeker = new Seeker(game, new Vec(0, 240), player);

    const bullet = { markAsUnusedInArray: () => {} } as any;
    seeker.handleBulletCollision(bullet);

    // Health should be 0 (started at 10, took 10 damage)
    expect(seeker.health).toBe(0);
  });
});
