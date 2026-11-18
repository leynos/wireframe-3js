import { queueMotion } from "./queue-motion.js";
import { C } from "./drawing.js";
import { block, samples, mix } from "./civic-geometry.js";

export function corridor(d, id) {
  const gate = id === 4,
    width = gate ? 5 : 6;
  for (let x = -width; x <= width; x++)
    d.path(
      samples(40, (t) => [x, 0, mix(14, -100, t)]),
      gate ? C.cyan : C.blue,
      gate ? 1.65 : 0.95,
    );
  for (let z = -100; z <= 14; z += gate ? 1.6 : 3.6) {
    d.path(
      [
        [-width, 0, z],
        [width, 0, z],
      ],
      gate ? C.cyan : C.blue,
      gate ? 1.5 : 0.65,
    );
    for (const side of [-1, 1])
      d.path(
        [
          [side * width, 0, z],
          [side * 20, 0, z],
        ],
        C.blue,
        0.65,
      );
  }
  if (gate) {
    for (const x of [-6.35, 6.35]) {
      for (const dx of [-0.43, 0.43])
        block(d, x + dx, 0, 0.34, 1.78, 7.64, C.blue, 1.18);
      block(d, x, 0, 0.66, 1.44, 6.72, C.blue, 0.82);
      for (const y of [6.38, 6.71, 7.54])
        block(d, x, 0, 1.32, 1.94, 0.19, C.blue, 1.32, y);
      for (const z of [-0.9, 0.9]) {
        d.path(
          [
            [x - 0.55, 0, z],
            [x + 0.44, 6.48, z],
            [x - 0.51, 7.68, z],
          ],
          C.blue,
          0.92,
        );
        d.path(
          [
            [x + 0.55, 0, z],
            [x - 0.45, 6.48, z],
            [x + 0.51, 7.68, z],
          ],
          C.blue,
          0.92,
        );
      }
    }
    block(d, 0, 0, 13.92, 1.71, 0.74, C.blue, 1.35, 6.91);
    for (const y of [6.61, 6.84, 7.62])
      block(d, 0, 0, 13.86, 1.85, 0.09, C.blue, 1.18, y);
    for (const x of [-4.45, 0, 4.45]) {
      block(d, x, 0, 0.87, 1.86, 0.5, C.blue, 1.15, 6.43);
      for (const dx of [-0.51, 0.51])
        block(d, x + dx, 0, 0.085, 1.98, 0.56, C.blue, 1.1, 6.4);
    }
    for (const z of [-6, -20]) {
      d.path(
        [
          [-5, 0, z],
          [-5, 5.85, z],
          [5, 5.85, z],
          [5, 0, z],
        ],
        C.blue,
        0.44,
      );
    }
    for (const x of [-5, 5])
      for (let j = 0; j < 4; j++)
        d.path(
          samples(40, (t) => [
            x + Math.sign(x) * j * 0.085,
            0.05,
            mix(14, -100, t),
          ]),
          C.cyan,
          2.3,
        );
    for (const side of [-1, 1]) {
      for (let z = -90; z < 15; z += 4)
        d.path(
          [
            [side * 7, 0, z],
            [side * 17, 5, z],
          ],
          C.blue,
          0.6,
        );
      for (let i = 0; i < 8; i++)
        d.path(
          samples(30, (t) => [side * (7 + i * 1.4), i * 0.7, mix(15, -90, t)]),
          C.blue,
          0.6,
        );
    }
    return { eye: [6.5, 1.4, 10], target: [-0.3, 3.55, -3], fov: 56 };
  }
  const packets = [];
  const rows = 46,
    spacing = 2.6;
  for (let row = 0; row < rows; row++) {
    const z = -108 + row * spacing;
    for (let lane = -2; lane <= 2; lane++) {
      const x = lane * 1.66,
        t = z + (lane % 2) * 0.64 + d.random() * 0.42;
      const line = d.positions.length,
        face = d.faces.length,
        halo = d.halos.length;
      block(d, x, t, 1.02, 1.24, 0.89, C.red, 3.4);
      d.halo([x, 0.44, t], 1.12, C.red, 0.09);
      d.loop(
        [
          [x - 0.51, 0.4, t - 0.62],
          [x + 0.51, 0.4, t - 0.62],
          [x + 0.51, 0.4, t + 0.62],
          [x - 0.51, 0.4, t + 0.62],
        ],
        C.red,
        1.6,
      );
      packets.push({
        z: t,
        line,
        end: d.positions.length,
        face,
        faceEnd: d.faces.length,
        halo,
      });
    }
    for (const sign of [-1, 1])
      block(
        d,
        sign * (9 + d.random() * 1.5),
        z,
        3.3,
        3,
        5.5 + d.random() * 6,
        C.blue,
        0.85,
      );
  }
  return {
    eye: [0, 3.1, 12],
    target: [0, 0, -0.2],
    fov: 48,
    fixedCamera: true,
    animateSurfaces: true,
    animate: queueMotion(d, packets, rows * spacing),
  };
}
