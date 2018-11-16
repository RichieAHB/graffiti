export default class Color {
  static create(r: number, g: number, b: number, a: number = 1) {
    return new Color(r, g, b, a);
  }

  constructor(
    readonly r: number,
    readonly g: number,
    readonly b: number,
    readonly a: number
  ) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  setAlpha(a: number) {
    const { r, g, b } = this;
    return Color.create(r, g, b, a)
  }

  toString() {
    const { r, g, b, a } = this;
    return `rgba(${r},${g},${b},${a})`;
  }
}
