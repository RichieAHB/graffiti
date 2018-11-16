import * as dat from 'dat.gui';
import SystemRenderer from './SystemRenderer';
import System from './System';
import Planet from './Planet';
import { balancedCircle, createDeltaGetter } from './utils';
import Color from './Color';

const lerp = (min: number, max: number, a: number) => min + (max - min) * a;

const balancedPlanets = (
  n: number,
  dist: number,
  minWeight: number,
  maxWeight: number,
  offsetAngle: number = 0
) =>
  balancedCircle(n, offsetAngle).map(({ pos, velo }) =>
    Planet.create(
      pos.scale(dist),
      velo.scale(dist),
      lerp(minWeight, maxWeight, Math.random()),
      Color.create(
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
      ),
      60
    )
  );

const renderer = SystemRenderer.create(0.25);
document.body.appendChild(renderer.canvas);

let restart = () => {};

const vars = {
  speed: 1,
  paused: true,
  showPhysics: true,
  showHistory: true,
  planetCount: 3,
  distance: 250,
  minMass: 110000,
  maxMass: 150000,
  restart: () => restart(),
  set scale(s: number) {
    renderer.scale = Math.log10(s);
  },
  get scale() {
    return 10 ** renderer.scale;
  }
};

let i = 0;

const start = () => {
  const system = System.create(
    balancedPlanets(vars.planetCount, vars.distance, vars.minMass, vars.maxMass)
  );
  renderer.render(system, vars.showPhysics, vars.showHistory);
  const getDelta = createDeltaGetter();
  let raf = -1;
  const run = () => {
    raf = requestAnimationFrame(run);
    const delta = getDelta();
    if (!vars.paused) {
      system.update(delta * vars.speed, !(i++ % 5));
      renderer.render(system, vars.showPhysics, vars.showHistory);
    }
  };
  run();

  return () => {
    cancelAnimationFrame(raf);
    return start();
  };
};

restart = start();

const gui = new dat.GUI();
gui.add(vars, 'speed', -2, 2);
gui.add(vars, 'scale', 1.01, 3);
const paused = gui.add(vars, 'paused');
gui.add(vars, 'showPhysics');
gui.add(vars, 'showHistory');
const folder = gui.addFolder('start conditions (needs restart)');
folder.add(vars, 'planetCount');
folder.add(vars, 'distance');
folder.add(vars, 'minMass');
folder.add(vars, 'maxMass');
folder.open();
gui.add(vars, 'restart');

const startButton = document.getElementById('start');

if (startButton) {
  startButton.addEventListener('click', () => {
    paused.setValue(false);
    const parent = startButton.parentNode;
    if (parent) {
      parent.removeChild(startButton);
    }
  });
}
