import Planet from './Planet';

export default class System {
  static create(planets: Planet[]) {
    return new System(planets);
  }

  constructor(public planets: Planet[]) {
    this.planets = planets;
  }

  public update(deltaMs: number, markHistory = true) {
    this.planets = this.planets.map((planet, i) =>
      planet.update(
        [...this.planets.slice(0, i), ...this.planets.slice(i + 1)],
        deltaMs,
        markHistory
      )
    );
  }

  toString() {
    return this.planets.join(', ');
  }
}
