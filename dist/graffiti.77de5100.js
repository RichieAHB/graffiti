// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"index.ts":[function(require,module,exports) {
"use strict";

var G = 10;

var renderPlanet = function renderPlanet(ctx, scale) {
  return function (planet) {
    var pos = planet.pos.scale(scale);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, Math.cbrt(planet.mass) * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
  };
};

var renderPhysics = function renderPhysics(ctx, scale) {
  return function (planet) {
    var pos = planet.pos.scale(scale);
    var velo = planet.velocity.scale(scale);
    var acc = planet.acceleration.scale(scale);
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    var a = pos.add(acc);
    ctx.lineTo(a.x, a.y);
    ctx.strokeStyle = 'orange';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    var v = pos.add(velo);
    ctx.lineTo(v.x, v.y);
    ctx.strokeStyle = 'red';
    ctx.stroke();
  };
};

var SystemRenderer =
/** @class */
function () {
  function SystemRenderer(canvas) {
    if (canvas === void 0) {
      canvas = document.createElement('canvas');
    }

    this.canvas = canvas;
    this.scale = 1;
    this.canvas = canvas;
    this.canvas.style.position = 'fixed';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = window.innerWidth + "px";
    this.canvas.style.height = window.innerHeight + "px";
    var ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('2d canvas not available');
    this.ctx = ctx;
    this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  }

  SystemRenderer.create = function () {
    return new SystemRenderer();
  };

  SystemRenderer.prototype.clear = function () {
    var _a = this,
        canvas = _a.canvas,
        ctx = _a.ctx;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  SystemRenderer.prototype.render = function (system) {
    this.clear();
    system.planets.forEach(renderPlanet(this.ctx, this.scale));
    system.planets.forEach(renderPhysics(this.ctx, this.scale));
  };

  return SystemRenderer;
}();

var System =
/** @class */
function () {
  function System(planets) {
    this.planets = planets;
    this.planets = planets;
  }

  System.create = function (planets) {
    return new System(planets);
  };

  System.prototype.update = function (deltaMs) {
    var _this = this;

    this.planets = this.planets.map(function (planet, i) {
      return planet.update(_this.planets.slice(0, i).concat(_this.planets.slice(i + 1)), deltaMs);
    });
  };

  System.prototype.toString = function () {
    return this.planets.join(', ');
  };

  return System;
}();

var Planet =
/** @class */
function () {
  function Planet(pos, velocity, acceleration, // for debugging mainly
  mass) {
    this.pos = pos;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
    this.pos = pos;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
  }

  Planet.create = function (x, y, vx, vy, mass) {
    if (vx === void 0) {
      vx = 0;
    }

    if (vy === void 0) {
      vy = 0;
    }

    if (mass === void 0) {
      mass = 0.00001;
    }

    return new Planet(Vec2.create(x, y), Vec2.create(vx, vy), Vec2.create(0, 0), mass);
  };

  Planet.prototype.forceBetween = function (p) {
    var d = this.pos.distance(p.pos);
    return d && G * (this.mass * p.mass / Math.pow(d, 2));
  };

  Planet.prototype.getAccelerationDueToOthers = function (others) {
    var _this = this;

    return others.reduce(function (acc, other) {
      return acc.add(other.pos.subtract(_this.pos).unit.scale(_this.forceBetween(other)));
    }, Vec2.create()).scale(1 / this.mass);
  };

  Planet.prototype.update = function (others, deltaMs) {
    var deltaS = deltaMs / 1000;
    var acceleration = this.getAccelerationDueToOthers(others);
    var velocity = acceleration.scale(deltaS).add(this.velocity);
    var pos = velocity.scale(deltaS).add(this.pos);
    return new Planet(pos, velocity, acceleration, this.mass);
  };

  Planet.prototype.toString = function () {
    return "[" + this.pos.x + ", " + this.pos.y + "]";
  };

  return Planet;
}();

var Vec2 =
/** @class */
function () {
  function Vec2(x, y) {
    this.x = x;
    this.y = y;
    this.x = x;
    this.y = y;
  }

  Vec2.create = function (x, y) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    return new Vec2(x, y);
  };

  Object.defineProperty(Vec2.prototype, "magnitude", {
    get: function get() {
      var _a = this,
          x = _a.x,
          y = _a.y;

      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Vec2.prototype, "unit", {
    get: function get() {
      // if magnitude is 0 then it means x and y are 0 so we can scalar to any num
      var magnitude = this.magnitude || 1;
      return Vec2.create(this.x / magnitude, this.y / magnitude);
    },
    enumerable: true,
    configurable: true
  });

  Vec2.prototype.scale = function (s) {
    return Vec2.create(this.x * s, this.y * s);
  };

  Vec2.prototype.add = function (v) {
    return Vec2.create(this.x + v.x, this.y + v.y);
  };

  Vec2.prototype.subtract = function (v) {
    return Vec2.create(this.x - v.x, this.y - v.y);
  };

  Vec2.prototype.distance = function (v) {
    return v.subtract(this).magnitude;
  };

  return Vec2;
}();

var system = System.create([Planet.create(-51, 50, 50, 50, 40000), Planet.create(50, -50, -50, -50, 40000), Planet.create(-50, -51, -50, 50, 40000), Planet.create(50, 50, 50, -50, 40000)]);
var i = 0;
var renderer = SystemRenderer.create();
document.body.appendChild(renderer.canvas);

var run = function run(n) {
  if (n === void 0) {
    n = Infinity;
  }

  if (i < n) requestAnimationFrame(function () {
    return run(n);
  });
  i++;
  renderer.render(system); // console.log(sys.toString());

  system.update(16);
};

run();
},{}]},{},["index.ts"], null)
//# sourceMappingURL=/graffiti.77de5100.map