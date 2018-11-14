import System from './System';
import { planetToSpecs } from './utils';
import { renderSpecs } from './render-utils';

export default class SystemRenderer {
  private ctx: CanvasRenderingContext2D;

  static create(scale: number = 1) {
    return new SystemRenderer(scale);
  }

  constructor(
    public scale: number,
    readonly canvas: HTMLCanvasElement = document.createElement('canvas')
  ) {
    this.scale = scale;
    this.canvas = canvas;
    const pr = window.devicePixelRatio;
    this.canvas.style.position = 'fixed';
    this.canvas.width = window.innerWidth * pr;
    this.canvas.height = window.innerHeight * pr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2d canvas not available');
    this.ctx = ctx;
    this.ctx.translate(
      (window.innerWidth / 2) * pr,
      (window.innerHeight / 2) * pr
    );
    this.ctx.scale(pr, pr);
  }

  clear() {
    const { canvas, ctx } = this;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  render(system: System, showPhysics: boolean) {
    this.clear();
    const spec = system.planets
      .map(planetToSpecs(this.scale, showPhysics))
      .reduce((acc, specs) => [...acc, ...specs], []);

    renderSpecs(this.ctx)(spec);
  }
}
