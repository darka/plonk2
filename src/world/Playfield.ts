import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { Player } from '../entities/Player';
import { PlayerBullet } from '../entities/PlayerBullet';
import { Flier } from '../entities/Flier';
import { Seeker } from '../entities/Seeker';
import { Bubble } from '../entities/Bubble';
import { Explosion } from '../entities/Explosion';
import { MuzzleFlash } from '../entities/MuzzleFlash';
import { Enemy } from '../entities/Enemy';
import type { PlayfieldObject } from '../entities/PlayfieldObject';

export class Playfield {
  public player: Player;
  public playfieldObjects: PlayfieldObject[] = [];
  public enemies: Enemy[] = [];
  public bullets: PlayerBullet[] = [];

  public readonly width = 640;
  public readonly height = 480;
  public readonly spawnCircleRadius = Math.sqrt(320 * 320 + 240 * 240) + 50;

  public destroyed = false;
  public ignorePlayer = true;

  private static readonly BUBBLE_SPREAD = 20;
  private game: Game;

  constructor(game: Game) {
    this.game = game;
    this.player = new Player(game, new Vec(this.width / 2, this.height / 2));
    this.player.makeInvisible();

    game.registerTimer(120, 1, () => {
      this.player.fadeIn();
      this.ignorePlayer = false;
    });
    game.registerTimer(180, 1, () => { this.player.canShoot = true; });
    game.registerTimer(300, 1, () => {
      game.registerTimer(900, 1000, () => this.spawnFlierSwarm());
      this.spawnFlierSwarm();
    });
    game.registerTimer(600, 1, () => {
      game.registerTimer(600, 1000, () => this.addSeeker());
      this.addSeeker();
    });
  }

  update(): void {
    if (!this.ignorePlayer) {
      this.player.update();
    }

    // Enemy-player collision
    for (let i = 0; i < this.enemies.length; ++i) {
      if (!this.ignorePlayer && this.enemies[i].collidesWith(this.player)) {
        this.enemies[i].handlePlayerCollision();
      }
    }

    // Bullet-enemy collision
    for (let i = 0; i < this.bullets.length; ++i) {
      for (let j = 0; j < this.enemies.length; ++j) {
        if (this.enemies[j].collidesWith(this.bullets[i])) {
          this.enemies[j].handleBulletCollision(this.bullets[i]);
        }
      }
    }

    // Update and cleanup playfield objects
    for (let i = 0; i < this.playfieldObjects.length; ++i) {
      const obj = this.playfieldObjects[i];
      if (obj.isOffscreen()) {
        obj.markAsUnusedInArray();
      } else {
        obj.update();
      }

      if (obj.unusedInArray) {
        // Remove from specialized arrays if needed
        if (obj instanceof Enemy) {
          const idx = this.enemies.indexOf(obj);
          if (idx !== -1) {
            this.enemies[idx] = this.enemies[this.enemies.length - 1];
            this.enemies.pop();
          }
        } else if (obj instanceof PlayerBullet) {
          const idx = this.bullets.indexOf(obj);
          if (idx !== -1) {
            this.bullets[idx] = this.bullets[this.bullets.length - 1];
            this.bullets.pop();
          }
        }

        // Swap-pop from main array
        this.playfieldObjects[i] = this.playfieldObjects[this.playfieldObjects.length - 1];
        this.playfieldObjects.pop();
        --i;
      }
    }
  }

  spawnFlierSwarm(): void {
    this.game.registerTimer(Math.floor(30 + 40 * Math.random()), 20, () => this.addFlier());
  }

  addBullet(position: Vec, direction: Vec): void {
    const bullet = new PlayerBullet(this.game, position, direction);
    this.playfieldObjects.push(bullet);
    this.bullets.push(bullet);
  }

  addFlier(): void {
    const enemy = new Flier(this.game, this.randomSpawnCircleLocation(), this.player);
    this.playfieldObjects.push(enemy);
    this.enemies.push(enemy);
  }

  addSeeker(): void {
    const enemy = new Seeker(this.game, this.randomSpawnCircleLocation(), this.player);
    this.playfieldObjects.push(enemy);
    this.enemies.push(enemy);
  }

  addBubbles(position: Vec): void {
    const spread = Playfield.BUBBLE_SPREAD;
    const spawnPos = position
      .sub(new Vec(spread / 2, spread / 2))
      .add(new Vec(Math.random() * spread, Math.random() * spread));
    this.playfieldObjects.push(new Bubble(this.game, spawnPos));
  }

  addExplosion(position: Vec): void {
    this.playfieldObjects.push(new Explosion(this.game, position));
  }

  addMuzzleFlash(rotation: number): void {
    this.playfieldObjects.push(new MuzzleFlash(this.game, this.player, rotation));
  }

  randomSpawnCircleLocation(): Vec {
    const angle = Math.random() * 2 * Math.PI;
    return new Vec(
      this.width / 2 + this.spawnCircleRadius * Math.cos(angle),
      this.height / 2 + this.spawnCircleRadius * Math.sin(angle)
    );
  }

  destroy(): void {
    this.player.canShoot = false;
    this.addExplosion(this.player.position);
    this.ignorePlayer = true;

    this.game.registerTimer(100, 1, () => {
      for (let i = 0; i < this.enemies.length; ++i) {
        this.enemies[i].die();
      }
      this.game.registerTimer(20, 1, () => {
        for (let i = 0; i < this.playfieldObjects.length; ++i) {
          this.playfieldObjects[i].markAsUnusedInArray();
        }
      });
    }, true);

    this.destroyed = true;
    this.game.pauseTimers();
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Render playfield objects (bubbles, explosions, muzzle flashes, enemies, bullets)
    for (const obj of this.playfieldObjects) {
      obj.render(ctx);
    }
    // Render player on top
    if (!this.ignorePlayer) {
      this.player.render(ctx);
    }
  }
}
