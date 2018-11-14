import Vec2 from './Vec2';

const G = 300;

export default class Planet {
  static create(
    pos: Vec2,
    velocity: Vec2,
    mass: number,
    color: string
  ) {
    return new Planet(
      pos,
      velocity,
      Vec2.create(0, 0),
      mass,
      color
    );
  }

  constructor(
    readonly pos: Vec2,
    readonly velocity: Vec2,
    readonly acceleration: Vec2, // for debugging mainly
    readonly mass: number,
    readonly color: string
  ) {
    this.pos = pos;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
    this.color = color;
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

  public update(others: Planet[], deltaMs: number) {
    const deltaS = deltaMs / 1000;
    const acceleration = this.getAccelerationDueToOthers(others);
    const velocity = acceleration.scale(deltaS).add(this.velocity);
    const pos = velocity.scale(deltaS).add(this.pos);
    return new Planet(pos, velocity, acceleration, this.mass, this.color);
  }

  public toString() {
    return `[${this.pos.x}, ${this.pos.y}]`;
  }
}
