import { describe, it, expect } from 'vitest';
import { Vec } from './Vec';

describe('Vec', () => {
  it('adds two vectors', () => {
    const result = new Vec(1, 2).add(new Vec(3, 4));
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('subtracts two vectors', () => {
    const result = new Vec(5, 7).sub(new Vec(2, 3));
    expect(result.x).toBe(3);
    expect(result.y).toBe(4);
  });

  it('computes dot product', () => {
    expect(new Vec(2, 3).dot(new Vec(4, 5))).toBe(23);
  });

  it('multiplies by scalar', () => {
    const result = new Vec(3, 4).mult(2);
    expect(result.x).toBe(6);
    expect(result.y).toBe(8);
  });

  it('computes length', () => {
    expect(new Vec(3, 4).length()).toBe(5);
  });

  it('normalizes to unit length', () => {
    const n = new Vec(3, 4).normal();
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
    expect(n.length()).toBeCloseTo(1);
  });

  it('copies without sharing reference', () => {
    const a = new Vec(1, 2);
    const b = a.copy();
    b.x = 99;
    expect(a.x).toBe(1);
  });
});
