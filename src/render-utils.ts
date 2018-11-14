import Planet from './Planet';
import Vec2 from './Vec2';

type TipSpec = [Vec2, Vec2, Vec2];

const createArrowTip = (from: Vec2, to: Vec2, size: number): TipSpec => {
  const angle = -to.subtract(from).angle;
  return [
    Vec2.create(-size / 2, 0)
      .rotate(angle)
      .add(to),
    Vec2.create(size / 2, 0)
      .rotate(angle)
      .add(to),
    Vec2.create(0, size)
      .rotate(angle)
      .add(to)
  ];
};

interface Arrow {
  type: 'Arrow';
  from: Vec2;
  to: Vec2;
  color: string;
  tip: [Vec2, Vec2, Vec2];
  z: number;
}

export const createArrow = (
  from: Vec2,
  to: Vec2,
  color: string,
  size: number,
  z: number = 1
): Arrow => ({
  type: 'Arrow',
  from,
  to,
  color,
  tip: createArrowTip(from, to, size),
  z
});

interface Circle {
  type: 'Circle';
  pos: Vec2;
  radius: number;
  color: string;
  z: number;
}

export const createCircle = (
  pos: Vec2,
  radius: number,
  color: string,
  z: number = 1
): Circle => ({
  type: 'Circle',
  pos,
  radius,
  color,
  z
});

export type Renderable = Arrow | Circle;

const renderCircle = (ctx: CanvasRenderingContext2D, circle: Circle) => {
  const { pos, radius, color } = circle;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
};

const renderArrow = (ctx: CanvasRenderingContext2D, spec: Arrow) => {
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(spec.from.x, spec.from.y);
  ctx.lineTo(spec.to.x, spec.to.y);
  ctx.strokeStyle = spec.color;
  ctx.stroke();

  const [p1, p2, p3] = spec.tip;

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.fillStyle = spec.color;
  ctx.fill();
};

export const renderSpecs = (ctx: CanvasRenderingContext2D) => (
  _specs: Renderable[]
) => {
  const specs = [..._specs].sort((a, b) => a.z - b.z);
  specs.forEach(spec => {
    switch (spec.type) {
      case 'Arrow': {
        renderArrow(ctx, spec);
        break;
      }
      case 'Circle': {
        renderCircle(ctx, spec);
        break;
      }
      default: {
        return;
      }
    }
  });
};
