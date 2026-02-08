import { Vec } from '../math/Vec';

export class Input {
  public left = false;
  public right = false;
  public up = false;
  public down = false;
  public mouseDown = false;
  public mousePos = new Vec(0, 0);

  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('mousemove', this.onMouseMove);
    // Prevent context menu on right-click
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    switch (e.code) {
      case 'ArrowLeft': case 'KeyA': this.left = true; this.right = false; break;
      case 'ArrowRight': case 'KeyD': this.right = true; this.left = false; break;
      case 'ArrowUp': case 'KeyW': this.up = true; this.down = false; break;
      case 'ArrowDown': case 'KeyS': this.down = true; this.up = false; break;
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    switch (e.code) {
      case 'ArrowLeft': case 'KeyA': this.left = false; break;
      case 'ArrowRight': case 'KeyD': this.right = false; break;
      case 'ArrowUp': case 'KeyW': this.up = false; break;
      case 'ArrowDown': case 'KeyS': this.down = false; break;
    }
  };

  private onMouseDown = (_e: MouseEvent): void => {
    this.mouseDown = true;
  };

  private onMouseUp = (_e: MouseEvent): void => {
    this.mouseDown = false;
  };

  private onMouseMove = (e: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePos = new Vec(e.clientX - rect.left, e.clientY - rect.top);
  };
}
