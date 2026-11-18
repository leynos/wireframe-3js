import { Euler, Quaternion, Vector3 } from "three";
import { C } from "./drawing.js";

const ink = "#8e99a4";
const sample = (d, low, high) => low + (high - low) * d.random();

// Split each of the twelve edges once. Both neighbouring corners use the same
// cut, so the eight fragments form a complete cuboid before the wave arrives.
function cornerFragments(d, x, y, addFragment) {
  const corners = Array.from({ length: 8 }, (_, i) => [
    x + (i & 1 ? 0.39 : -0.39),
    y + (i & 2 ? 0.39 : -0.39),
    i & 4 ? 0.13 : -0.14,
  ]);
  const cuts = corners.map(() => []);
  for (let i = 0; i < 8; i++) {
    for (const axis of [1, 2, 4]) {
      const j = i ^ axis;
      if (i > j) continue;
      const fraction = sample(d, 0.3, 0.7);
      const cut = corners[i].map((v, k) => v + (corners[j][k] - v) * fraction);
      cuts[i].push(cut);
      cuts[j].push(cut);
    }
  }
  corners.forEach((corner, i) => {
    const start = d.positions.length;
    for (const cut of cuts[i]) d.path([corner, cut], ink, 0.85);
    addFragment(start, corner);
  });
}

export function proposal(d) {
  const fragments = [];
  // In the artwork the grid sits between two faint perspective fields.
  for (const sign of [-1, 1]) {
    for (let i = -5; i <= 5; i++) {
      d.path(
        [
          [i * 1.4, sign * 2.5, -5],
          [i * 2.4, sign * 5.8, -0.6],
        ],
        ink,
        0.09,
      );
    }
    for (let j = 0; j < 4; j++) {
      const y = sign * (2.6 + j * 0.85);
      d.path(
        [
          [-11, y, -4 + j],
          [11, y, -4 + j],
        ],
        ink,
        0.085,
      );
    }
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 10; col++) {
      const x = col - 4.5,
        y = row - 3.5;
      const distance = (y - x * 0.96) / Math.SQRT2;
      if (Math.abs(distance) > 1.1) {
        d.box(x, y - 0.39, 0, 0.78, 0.78, 0.27, ink, 0.74);
        continue;
      }

      const side = Math.sign(distance) || 1;
      const addFragment = (start, pivot) => {
        const kick = sample(d, 0.55, 1.5);
        fragments.push({
          start,
          end: d.positions.length,
          pivot: new Vector3(...pivot),
          offset: new Vector3(
            -side * kick + sample(d, -0.35, 0.35),
            side * kick + sample(d, -0.35, 0.35),
            sample(d, 0.3, 1.4),
          ),
          spin: new Euler(
            sample(d, -1.6, 1.6),
            sample(d, -1.6, 1.6),
            sample(d, -0.95, 0.95),
          ),
          onset: 0.12 + (x + y + 8) * 0.14 + sample(d, 0, 0.1),
          duration: sample(d, 0.65, 1.25),
        });
      };
      if ((row + 2 * col) % 4 === 0) {
        const start = d.positions.length;
        d.box(x, y - 0.39, 0, 0.78, 0.78, 0.27, ink, 0.85);
        addFragment(start, [x, y, 0]);
      } else {
        cornerFragments(d, x, y, addFragment);
      }
    }
  }

  const strokes = [
    [
      [-6.5, -6.5],
      [-4.55, -4.12],
      [-3.9, -4.12],
      [-1.02, -1.04],
    ],
    [
      [1.05, 1.06],
      [4.02, 4.08],
      [4.65, 4.08],
      [6.65, 6.45],
    ],
  ];
  for (const stroke of strokes)
    for (let i = -4; i <= 4; i++) {
      d.path(
        stroke.map(([x, y]) => [x + i * 0.016, y - i * 0.012, 0.46]),
        C.yellow,
        2,
      );
    }
  d.label("PROPOSAL: 845", 0, 0, 1.7, 1.45, C.yellow);
  d.labels.at(-1).font = "900 48px Arial, sans-serif";

  const vertex = new Vector3(),
    rotation = new Quaternion(),
    angles = new Euler();
  const finish = Math.max(...fragments.map((f) => f.onset + f.duration));
  let previous = 0;
  // Evaluate from the intact coordinates so replay and pause never accumulate drift.
  function animate(position, seconds) {
    const time = Math.min(seconds, finish);
    if (time === previous) return;
    previous = time;
    for (const f of fragments) {
      const phase = Math.max(0, Math.min(1, (time - f.onset) / f.duration));
      const ease = 1 - (1 - phase) ** 3;
      rotation.setFromEuler(
        angles.set(f.spin.x * ease, f.spin.y * ease, f.spin.z * ease),
      );
      for (let i = f.start; i < f.end; i += 3) {
        vertex
          .fromArray(d.positions, i)
          .sub(f.pivot)
          .applyQuaternion(rotation)
          .add(f.pivot)
          .addScaledVector(f.offset, ease)
          .toArray(position.array, i);
      }
    }
    position.needsUpdate = true;
  }
  return { d, eye: [0, 0, 14], target: [0, 0, 0], fov: 38, animate };
}
