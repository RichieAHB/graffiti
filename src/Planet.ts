import Vec2 from './Vec2';
import Color from './Color';

const G = 300;

export default class Planet {
  static create(
    pos: Vec2,
    velocity: Vec2,
    mass: number,
    color: Color,
    posHistoryLength: number = 0
  ) {
    return new Planet(
      pos,
      velocity,
      Vec2.create(0, 0),
      mass,
      color,
      Array.from({ length: posHistoryLength }, () => null)
    );
  }

  constructor(
    readonly pos: Vec2,
    readonly velocity: Vec2,
    readonly acceleration: Vec2, // for rendering
    readonly mass: number,
    readonly color: Color,
    readonly posHistory: (Vec2 | null)[]
  ) {
    this.pos = pos;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
    this.color = color;
    this.posHistory = posHistory;
  }

  private forceBetween(p: Planet) {
    const d = this.pos.distance(p.pos);
    return d && G * ((this.mass * p.mass) / d ** 2);
  }

  private getAccelerationDueToOthers(others: Planet[]) {
    return others
      .reduce(
        (acc, other) =>
          acc.add(
            other.pos.subtract(this.pos).unit.scale(this.forceBetween(other))
          ),
        Vec2.create()
      )
      .scale(1 / this.mass);
  }

  public update(others: Planet[], deltaMs: number, markHistory: boolean) {
    const deltaS = deltaMs / 1000;
    const acceleration = this.getAccelerationDueToOthers(others);
    const velocity = acceleration.scale(deltaS).add(this.velocity);
    const pos = velocity.scale(deltaS).add(this.pos);
    const posHistory = markHistory
      ? [pos, ...this.posHistory.slice(0, -1)]
      : this.posHistory;
    return new Planet(
      pos,
      velocity,
      acceleration,
      this.mass,
      this.color,
      posHistory
    );
  }

  public toString() {
    return `[${this.pos.x}, ${this.pos.y}]`;
  }
}
