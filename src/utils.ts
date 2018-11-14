import Vec2 from './Vec2';
import { createCircle, createArrow, Renderable } from './render-utils';
import Planet from './Planet';

export const balancedCircle = (n: number, offsetAngle: number) => {
  const d = (Math.PI * 2) / n;
  let points = [];
  for (let i = 0; i < n; i++) {
    const t = i * d + offsetAngle;
    const pos = Vec2.create(Math.cos(t), Math.sin(t));
    const velo = pos.rotate(-Math.PI / 2);
    points.push({
      pos,
      velo
    });
  }
  return points;
};

export const planetToSpecs = (scale: number, showPhysics: boolean) => (
  planet: Planet
): Renderable[] => {
  const { velocity, acceleration, mass, color } = planet;
  const pos = planet.pos.scale(scale);
  const velo = pos.add(velocity.scale(scale));
  const acc = pos.add(acceleration.scale(scale));
  return [
    createCircle(pos, Math.cbrt(mass) * scale, color, 0),
    ...(showPhysics
      ? [
          createArrow(pos, velo, 'rgba(255, 255, 255, 0.5)', 10, 1),
          createArrow(pos, acc, 'rgba(255, 255, 0, 0.25)', 10, 1)
        ]
      : [])
  ];
};

export const createDeltaGetter = () => {
  let time = Date.now();
  return () => {
    const newTime = Date.now();
    const delta = newTime - time;
    time = newTime;
    return delta;
  };
};
