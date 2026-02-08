import { Vec } from '../math/Vec';
import type { Game } from '../core/Game';
import { GameMode } from './GameMode';
import { drawBackground, drawOrbPad, drawOrb, drawPlonkLogo, drawPlayButton } from '../rendering/Sprites';

// Inlined widget movement system from Widget.as / WidgetContainer.as
interface MenuWidget {
  position: Vec;
  velocity: Vec;
  moving: boolean;
  accelerating: boolean;
  decelerating: boolean;
  acceleration: number;
  deceleration: number;
  maxSpeed: number;
}

function createWidget(pos: Vec): MenuWidget {
  return {
    position: pos,
    velocity: new Vec(0, 0),
    moving: false,
    accelerating: false,
    decelerating: false,
    acceleration: 1,
    deceleration: 1,
    maxSpeed: 1,
  };
}

function arriveWithSlowDown(w: MenuWidget, direction: Vec, accel: number, maxSpd: number, decel: number): void {
  w.moving = true;
  w.accelerating = true;
  w.decelerating = false;
  w.acceleration = accel;
  w.deceleration = decel;
  w.maxSpeed = maxSpd;
  w.velocity = direction.normal();
}

function updateWidget(w: MenuWidget): void {
  if (w.moving) {
    if (w.accelerating) {
      w.velocity = w.velocity.mult(w.acceleration);
      if (w.velocity.length() > w.maxSpeed) {
        w.accelerating = false;
        w.decelerating = true;
      }
    } else if (w.decelerating) {
      w.velocity = w.velocity.mult(w.deceleration);
      if (w.velocity.length() < 0.1) {
        w.decelerating = false;
        w.moving = false;
      }
    }
    w.position = w.position.add(w.velocity);
  }
}

export class Menu extends GameMode {
  // Widget positions track the orb pad origin, orb origin, etc.
  private orbPad: MenuWidget | null = null;
  private orb: MenuWidget | null = null;
  private buttonPos = new Vec(0, 0); // relative to orbPad
  private logoPos = new Vec(0, 0);   // relative to orbPad

  // Container offset (orbPad + button + logo move together)
  private container: MenuWidget | null = null;

  private showingGreyBg = false;
  private hiding = false;
  private buttonHover = false;
  private buttonActive = true;

  // Constant initial positions from AS3
  private readonly orbPadStartPos = new Vec(660, -40);
  private readonly orbStartPos = new Vec(-550, 16);
  private readonly buttonStartPos = new Vec(1032, 152);

  constructor(game: Game) {
    super(game);
  }

  start(): void {
    // Show background, then after 60 ticks show the menu
    this.game.registerTimer(60, 1, () => this.showGreyBackground());
  }

  private showGreyBackground(): void {
    this.showingGreyBg = true;

    // Container holds orbPad, button, logo - starts at (0,0) offset
    this.container = createWidget(new Vec(0, 0));

    // OrbPad position (relative to container)
    this.orbPad = createWidget(this.orbPadStartPos.copy());

    // Button and logo are relative to orbPad
    this.buttonPos = this.buttonStartPos.copy();
    this.logoPos = this.buttonStartPos.sub(new Vec(-10, 60));

    // Container slides left
    arriveWithSlowDown(this.container, new Vec(-1.0, 0.0), 1.1, 21, 0.957);

    // Orb slides right independently
    this.orb = createWidget(this.orbStartPos.copy());
    arriveWithSlowDown(this.orb, new Vec(1.0, 0.0), 1.1, 20, 0.8);
  }

  private hideGreyBackground(): void {
    if (!this.container || !this.orb) return;
    this.hiding = true;
    this.buttonActive = false;

    arriveWithSlowDown(this.container, new Vec(1.0, 0.0), 1.1, 30, 0.957);
    arriveWithSlowDown(this.orb, new Vec(-1.0, 0.0), 1.1, 20, 0.8);

    this.game.registerTimer(50, 1, () => {
      this.game.startPlaying();
    });
  }

  update(): void {
    if (this.container) updateWidget(this.container);
    if (this.orb) updateWidget(this.orb);

    // Check mouse for button hover/click
    if (this.showingGreyBg && this.buttonActive && this.container) {
      const bx = this.buttonPos.x + this.container.position.x;
      const by = this.buttonPos.y + this.container.position.y;
      const mx = this.game.input.mousePos.x;
      const my = this.game.input.mousePos.y;
      this.buttonHover = mx > bx && mx < bx + 120 && my > by && my < by + 40;

      if (this.buttonHover && this.game.input.mouseDown) {
        this.hideGreyBackground();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Background
    drawBackground(ctx, this.game.windowWidth, this.game.windowHeight);

    if (!this.showingGreyBg) return;

    const cx = this.container ? this.container.position.x : 0;
    const cy = this.container ? this.container.position.y : 0;

    // Orb (independent movement)
    if (this.orb) {
      drawOrb(ctx, this.orb.position.x + 100, this.orb.position.y + 200);
    }

    // Orb pad (within container)
    if (this.orbPad) {
      drawOrbPad(ctx, this.orbPad.position.x + cx, this.orbPad.position.y + cy);
    }

    // Plonk logo (within container)
    drawPlonkLogo(ctx, this.logoPos.x + cx + 60, this.logoPos.y + cy + 20);

    // Play button (within container)
    const bx = this.buttonPos.x + cx;
    const by = this.buttonPos.y + cy;
    drawPlayButton(ctx, bx, by, this.buttonHover && this.buttonActive);
  }
}
