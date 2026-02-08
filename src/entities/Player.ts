import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { PlayfieldObject } from './PlayfieldObject';
import { PlayerGun } from './PlayerGun';
import { drawRotated } from '../rendering/Renderer';
import { drawSubmarine } from '../rendering/Sprites';
import { playPhaser } from '../audio/Audio';

export class Player extends PlayfieldObject {
  private movementAngle: number = 90;
  private direction: Vec = new Vec(0.0, -1.0);
  private velocity: Vec = new Vec(0.0, 0.0);

  private movingUp = false;
  private movingDown = false;
  private movingLeft = false;
  private movingRight = false;
  private accelerating = false;
  private shooting = false;

  private static readonly ROTATION_SPEED = 11.25;
  private static readonly ACCELERATION_COEF = 0.4;
  private static readonly MAX_SPEED_FORWARD = 2;
  private static readonly FRICTION = 0.9487;
  private static readonly EDGE_HIT_COEF = 0.4;
  private static readonly SHOOTING_DELAY = 30;
  private static readonly COLLISION_RADIUS = 10;

  public playerGun: PlayerGun;
  public canShoot: boolean = false;
  public health: number = 100;
  public dead: boolean = false;

  constructor(game: Game, position: Vec) {
    super(game, position);
    this.playerGun = new PlayerGun(game);
    this.makeCollidable(Player.COLLISION_RADIUS);
  }

  makeInvisible(): void {
    this.alpha = 0;
    this.playerGun.alpha = 0;
  }

  startMovingLeft(): void { this.movingLeft = true; this.movingRight = false; }
  stopMovingLeft(): void { this.movingLeft = false; }
  startMovingRight(): void { this.movingRight = true; this.movingLeft = false; }
  stopMovingRight(): void { this.movingRight = false; }
  startMovingUp(): void { this.movingUp = true; this.movingDown = false; }
  stopMovingUp(): void { this.movingUp = false; }
  startMovingDown(): void { this.movingDown = true; this.movingUp = false; }
  stopMovingDown(): void { this.movingDown = false; }

  startShooting(): void { this.shooting = true; }
  stopShooting(): void { this.shooting = false; }

  shoot(): void {
    const playfield = this.game.getPlayfield();
    playfield.addBullet(
      this.position,
      new Vec(Math.cos(this.playerGun.angle), Math.sin(this.playerGun.angle))
    );
    playfield.addMuzzleFlash(this.playerGun.rotation);
    playPhaser();
  }

  applyInput(left: boolean, right: boolean, up: boolean, down: boolean, shooting: boolean, mousePos: Vec): void {
    this.movingLeft = left;
    this.movingRight = right;
    this.movingUp = up;
    this.movingDown = down;
    this.shooting = shooting;
    this.playerGun.trackMouse(mousePos);
  }

  update(): void {
    if (this.movingLeft || this.movingRight || this.movingUp || this.movingDown) {
      let targetAngle = this.movementAngle;
      if (this.movingLeft) {
        targetAngle = 360;
        if (this.movingUp) targetAngle = 45;
        else if (this.movingDown) targetAngle = 315;
      } else if (this.movingRight) {
        targetAngle = 180;
        if (this.movingUp) targetAngle = 135;
        else if (this.movingDown) targetAngle = 225;
      } else if (this.movingUp) {
        targetAngle = 90;
      } else if (this.movingDown) {
        targetAngle = 270;
      }

      if (targetAngle !== this.movementAngle) {
        if (
          (targetAngle > this.movementAngle && targetAngle - this.movementAngle < 180) ||
          (targetAngle < this.movementAngle && 360 - this.movementAngle + targetAngle < 180)
        ) {
          this.movementAngle += Player.ROTATION_SPEED;
        } else {
          this.movementAngle -= Player.ROTATION_SPEED;
        }
      }

      if (this.movementAngle < 0) this.movementAngle += 360;
      if (this.movementAngle > 360) this.movementAngle -= 360;

      this.rotation = this.movementAngle - 90;
      const angleInRadians = this.movementAngle * Math.PI / 180.0;
      this.direction = new Vec(-Math.cos(angleInRadians), -Math.sin(angleInRadians));
      this.accelerating = true;
    } else {
      this.accelerating = false;
    }

    if (this.accelerating && this.velocity.length() < Player.MAX_SPEED_FORWARD) {
      const acceleration = this.direction.mult(Player.ACCELERATION_COEF);
      this.velocity = this.velocity.add(acceleration);
    } else {
      this.velocity = this.velocity.mult(Player.FRICTION);
    }

    let newPosition = this.position.add(this.velocity);

    const pf = this.game.getPlayfield();
    if (newPosition.x < 0 || newPosition.x > pf.width) {
      this.velocity = this.velocity.mult(Player.EDGE_HIT_COEF);
      this.velocity = new Vec(-this.velocity.x, this.velocity.y);
      newPosition = this.position.add(this.velocity);
    } else if (newPosition.y < 0 || newPosition.y > pf.height) {
      this.velocity = this.velocity.mult(Player.EDGE_HIT_COEF);
      this.velocity = new Vec(this.velocity.x, -this.velocity.y);
      newPosition = this.position.add(this.velocity);
    }

    if (this.shooting && this.canShoot) {
      this.shoot();
      this.canShoot = false;
      this.game.registerTimer(Player.SHOOTING_DELAY, 1, () => { this.canShoot = true; });
    }

    this.position = newPosition;
    super.update();
    this.playerGun.position = this.position;
    this.playerGun.update();
    this.spawnBubblesAroundMaybe();
    if (this.health <= 0) this.dead = true;
  }

  fadeIn(): void {
    this.playerGun.fadeIn();
    super.fadeIn();
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawRotated(ctx, this.position.x, this.position.y, this.rotation, (c) => {
      drawSubmarine(c, this.alpha);
    });
    this.playerGun.render(ctx);
  }
}
