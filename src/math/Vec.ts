export class Vec {
  constructor(public x: number, public y: number) {}

  add(other: Vec): Vec {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  sub(other: Vec): Vec {
    return new Vec(this.x - other.x, this.y - other.y);
  }

  dot(other: Vec): number {
    return this.x * other.x + this.y * other.y;
  }

  mult(n: number): Vec {
    return new Vec(this.x * n, this.y * n);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normal(): Vec {
    return this.mult(1.0 / this.length());
  }

  copy(): Vec {
    return new Vec(this.x, this.y);
  }
}
