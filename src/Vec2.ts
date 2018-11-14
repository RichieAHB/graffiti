export default class Vec2 {
  static create(x: number = 0, y: number = 0) {
    return new Vec2(x, y);
  }

  constructor(readonly x: number, readonly y: number) {
    this.x = x;
    this.y = y;
  }

  public get magnitude() {
    const { x, y } = this;
    return Math.sqrt(x ** 2 + y ** 2);
  }

  public get unit() {
    // if magnitude is 0 then it means x and y are 0 so we can scalar to any num
    const magnitude = this.magnitude || 1;
    return Vec2.create(this.x / magnitude, this.y / magnitude);
  }

  public scale(s: number) {
    return Vec2.create(this.x * s, this.y * s);
  }

  public add(v: Vec2) {
    return Vec2.create(this.x + v.x, this.y + v.y);
  }

  public subtract(v: Vec2) {
    return Vec2.create(this.x - v.x, this.y - v.y);
  }

  public distance(v: Vec2) {
    return v.subtract(this).magnitude;
  }

  public rotate(t: number) {
    const c = Math.cos(t);
    const s = Math.sin(t);
    return Vec2.create(this.x * c - this.y * s, this.x * s + this.y * c);
  }

  public get angle() {
    return Math.atan2(this.x, this.y);
  }
}
