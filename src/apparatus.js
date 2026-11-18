import { ShapeUtils, Vector2 } from "three";
import { C } from "./drawing.js";
import { block, samples } from "./civic-geometry.js";

const iceBlue = "#67aeff";
const steel = "#507fd1",
  rim = "#8ec9ff";

function frame(d, x, y, z, w, h, c, p = 1) {
  d.loop(
    [
      [x - w / 2, y - h / 2, z],
      [x + w / 2, y - h / 2, z],
      [x + w / 2, y + h / 2, z],
      [x - w / 2, y + h / 2, z],
    ],
    c,
    p,
  );
}

function rack(d, x) {
  for (const edge of [-4.22, -4.08, -3.86, 3.86, 4.08, 4.22]) {
    block(d, x + edge, -0.14, 0.085, 0.46, 19, steel, 1, -9.5);
  }
  for (const shelf of [-6.7, -3.05, 3.05, 6.7]) {
    block(d, x, -0.13, 7.85, 0.38, 0.14, rim, 1.1, shelf);
    for (let slot = 0; slot < 4; slot++) {
      const bx = x - 2.91 + slot * 1.94,
        by = shelf + (shelf > 0 ? 1.1 : -1.1);
      frame(d, bx, by, 0.035, 1.79, 1.88, steel, 0.95);
      frame(d, bx, by, 0.05, 1.63, 1.69, steel, 0.65);
      for (let row = 0; row < 4; row++) {
        const yy = by - 0.58 + row * 0.34;
        frame(d, bx, yy, 0.065, 1.38, 0.22, steel, 0.85);
        d.path(
          [
            [bx - 0.54, yy, 0.07],
            [bx - 0.36, yy, 0.07],
          ],
          C.cyan,
          1.5,
        );
      }
    }
  }
  for (const side of [-1, 1])
    for (let i = 0; i < 18; i++) {
      const y = -2.62 + i * 0.31,
        by = y * 0.56;
      const end = side * (0.7 + d.random() * 0.83);
      const line = [
        [3.68, y],
        [2.98 - (i % 4) * 0.12, y],
        [2.42 - (i % 4) * 0.12, by],
        [Math.abs(end), by],
      ];
      d.path(
        line.map(([u, v]) => [x + side * u, v, -0.12]),
        steel,
        0.55,
      );
      if (i % 3 === 0) d.circle(x + end, by, -0.12, 0.052, rim, 0.75, 9);
    }
}

function drawEnvelope(d, x) {
  const w = 3.7,
    h = 2.85;
  const at = d.length,
    depth = 1.15,
    z = 0.85;
  d.box(x, -h / 2, z, w, h, depth, C.cyan, 1.65);
  d.path(
    [
      [x - w / 2, h / 2, 1.425],
      [x, -0.45, 1.425],
      [x + w / 2, h / 2, 1.425],
    ],
    C.cyan,
    1.6,
  );
  d.path(
    [
      [x - w / 2, -h / 2, 1.425],
      [x - 0.38, -0.07, 1.425],
    ],
    rim,
    1.15,
  );
  d.path(
    [
      [x + w / 2, -h / 2, 1.425],
      [x + 0.38, -0.07, 1.425],
    ],
    rim,
    1.15,
  );
  d.path(
    [
      [x - w / 2, -h / 2, 0.275],
      [x - w / 2, h / 2, 1.425],
      [x - w / 2, -h / 2, 1.425],
      [x - w / 2, h / 2, 0.275],
    ],
    C.cyan,
    0.85,
  );
  return [
    { x, y: 0, z: z - depth / 2, w, h, at },
    { x, y: -h / 2, z, w, h: depth, pitch: -Math.PI / 2, at },
    { x: x + w / 2, y: 0, z, w: depth, h, yaw: -Math.PI / 2, at },
  ];
}

export function envelope(d) {
  for (const x of [-9.1, 0, 9.1]) rack(d, x);
  for (const x of [0, 9.1])
    for (const z of [-0.24, 0, 0.13])
      frame(d, x, 0, z, 7.58, 5.83, steel, 1.05);
  // Sweep the dense cabinet wiring faster to give each envelope a visible turn at the beam.
  d.times = d.times.map((time) => time * 0.035);
  d.length *= 0.035;
  const first = drawEnvelope(d, 0);
  const tag = [
    [0.45, 0.04],
    [0.72, 0.43],
    [2.52, 0.43],
    [2.52, -0.35],
    [0.72, -0.35],
  ].map(([x, y]) => [x, y, 1.54]);
  d.face(tag);
  d.loop(tag, C.cyan, 1.5);
  d.circle(0.64, 0.04, 1.56, 0.045, C.cyan, 1.5, 10);
  d.label("DATA-ID: 0x8B4A", 1.64, 0.185, 1.6, 0.18, C.cyan);
  d.labels.at(-1).surface = true;
  d.label("ROUTE: MAIN_NET", 1.64, -0.1, 1.6, 0.18, C.green);
  d.labels.at(-1).surface = true;
  const second = drawEnvelope(d, 9.1);
  return {
    eye: [-5.5, 3.9, 12.5],
    target: [2.9, 0, 0.45],
    fov: 28,
    panes: [...first, ...second],
  };
}

// A clipped-corner section gives the conduit a flat sill and vertical jambs.
function section(w, h, corner, z) {
  return [
    [-w + corner, -h],
    [w - corner, -h],
    [w, -h + corner],
    [w, h - corner],
    [w - corner, h],
    [-w + corner, h],
    [-w, h - corner],
    [-w, -h + corner],
  ].map(([x, y]) => [x, y, z]);
}
function collar(d, z, w, h, thickness, depth, colour) {
  const outside = section(w, h, 1.02, z),
    back = section(w, h, 1.02, z - depth);
  const inside = section(w - thickness, h - thickness, 0.88, z);
  d.loop(outside, colour, 1.25);
  d.loop(inside, colour, 1.35);
  d.loop(back, steel, 0.82);
  outside.forEach((a, i) => {
    const j = (i + 1) % 8;
    d.face([a, outside[j], inside[j], inside[i]]);
    d.face([a, back[i], back[j], outside[j]]);
    d.path([a, back[i]], colour, 0.95);
  });
}

function latch(d) {
  // A scalloped mounting plate carries the four recessed openings and hinge.
  const outline = [
    [1.35, 2.76],
    [2.44, 2.76],
    [3.52, 1.66],
    [3.52, -1.57],
    [2.48, -2.62],
    [1.31, -2.62],
    [0.94, -2.22],
    [0.94, -1.09],
    [1.23, -0.72],
    [1.23, 0.78],
    [0.94, 1.09],
    [0.94, 2.26],
  ];
  const front = outline.map(([x, y]) => [x, y, 0.39]);
  for (const triangle of ShapeUtils.triangulateShape(
    outline.map(([x, y]) => new Vector2(x, y)),
    [],
  )) {
    d.face(triangle.map((i) => front[i]));
  }
  d.loop(front, rim, 2);
  for (const z of [0.16, 0.27])
    d.loop(
      outline.map(([x, y]) => [x, y, z]),
      steel,
      1.1,
    );
  const cavity = [
    [1.45, 1.21],
    [1.85, 1.06],
    [2.65, 1.83],
    [2.32, 2.19],
    [1.78, 2.19],
    [1.45, 1.85],
  ];
  for (const sign of [-1, 1]) {
    for (const [shape, cx, cy] of [
      [cavity, 1.99, 1.65],
      [
        [
          [2.05, 0.48],
          [3.03, 0.48],
          [3.03, 1.53],
          [2.77, 1.69],
          [2.05, 0.97],
        ],
        2.6,
        0.95,
      ],
    ]) {
      for (const scale of [1, 0.82])
        d.loop(
          shape.map(([x, y]) => [
            cx + (x - cx) * scale,
            sign * (cy + (y - cy) * scale),
            0.435,
          ]),
          rim,
          1.55,
        );
    }
    block(d, 3.26, 0.52, 0.89, 0.4, 0.16, rim, 1.65, sign * 0.53);
    block(d, 2.92, 0.5, 0.35, 0.37, 0.18, steel, 1.35, sign * 0.29);
    block(d, 1.7, 0.45, 0.25, 0.38, 0.38, rim, 1.45, sign * 2.62);
  }
  block(d, 3.72, 0.56, 0.23, 0.36, 1.55, iceBlue, 1.45, -0.77);
  for (let i = 0; i < 6; i++)
    d.circle(1.29, -0.63 + i * 0.25, 0.48, 0.058, C.cyan, 1.8, 10);
}

export function boundedPassage(d) {
  // The panel behind the payload closes the throat. The returning ribs are
  // visible on the outside of the barrel, down its left flank.
  d.face(section(3.69, 2.99, 1.02, -2.15));
  for (let bay = 1; bay <= 21; bay++) {
    const z = -2.8 * bay;
    collar(d, z, 3.85, 3.15, 0.18, 0.39, steel);
    for (const y of [-1.63, 1.53]) {
      const flank = [
        [-3.79, y, z],
        [-3.79, y, z - 2.15],
        [-3.79, y + 0.32, z - 2.4],
        [-3.79, y + 0.32, z - 0.28],
      ];
      d.loop(flank, iceBlue, 0.94);
    }
    for (const dx of [-1.1, 1.1])
      d.path(
        [
          [dx, 3.05, z],
          [dx, 3.05, z - 2.8],
        ],
        steel,
        0.92,
      );
    for (const side of [-1, 1]) {
      block(d, side * 3.18, z, 0.31, 0.35, 3.55, steel, 0.9, -5.05);
      block(d, side * 3.47, z, 0.54, 0.52, 0.47, steel, 1.1, -2.63);
    }
  }
  const back = section(3.72, 3.02, 1.02, -60),
    front = section(3.72, 3.02, 1.02, -0.32);
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8;
    d.face([back[i], back[j], front[j], front[i]]);
    d.path([back[i], front[i]], steel, 1.15);
  }
  for (const [z, w, h, t, dep, c] of [
    [-0.24, 3.84, 3.12, 0.2, 0.4, steel],
    [0, 3.76, 3.05, 0.29, 0.23, iceBlue],
    [0.11, 3.45, 2.73, 0.13, 0.12, rim],
    [0.18, 3.29, 2.57, 0.095, 0.08, rim],
  ]) {
    collar(d, z, w, h, t, dep, c);
  }
  for (const [x, y] of [
    [-2.78, 2.67],
    [-3.54, 1.76],
    [-3.54, 0.15],
    [-3.54, -1.63],
    [-2.77, -2.7],
    [-1.88, -2.91],
    [-1.9, 2.9],
    [0.62, 2.9],
    [2.52, 2.85],
  ]) {
    d.circle(x, y, 0.15, 0.082, rim, 1.6, 12);
    d.path(
      [
        [x - 0.043, y - 0.04, 0.16],
        [x + 0.043, y + 0.04, 0.16],
      ],
      rim,
      1.2,
    );
  }
  latch(d);
  d.halo([1.29, 0, 0.48], 0.74, C.cyan, 0.14);
  for (const [x, y] of [
    [3.81, 2.13],
    [3.86, -0.49],
    [3.32, -2.42],
    [2.65, -3.15],
    [-2.35, -3.18],
    [-2.9, -3.38],
    [1.72, 3.24],
    [3.95, 1.89],
  ]) {
    for (const off of [-0.125, 0, 0.125])
      d.path(
        samples(20, (t) => [x + off, y, -24 + 39 * t]),
        iceBlue,
        0.9,
      );
  }
  const center = [-0.7, -0.32, -0.62];
  const firstVertex = d.times.length;
  for (const size of [1.48, 0.77]) {
    const [x, y, z] = center;
    d.box(x, y - size / 2, z, size, size, size, C.red, 2);
  }
  for (const sx of [-1, 1])
    for (const sy of [-1, 1])
      for (const sz of [-1, 1])
        d.path(
          [0.38, 0.74].map((r) =>
            center.map((v, i) => v + r * [sx, sy, sz][i]),
          ),
          C.red,
          1.55,
        );
  for (const sign of [-1, 1]) {
    d.path(
      [
        [center[0] - 0.74, center[1] + sign * 0.74, center[2] + 0.74],
        [center[0] + 0.38, center[1] - sign * 0.38, center[2] + 0.38],
        [center[0] + 0.74, center[1] - sign * 0.74, center[2] - 0.74],
      ],
      C.red,
      1.28,
    );
  }
  d.halo(center, 1.68, C.red, 0.21);
  return {
    eye: [-8.25, 2.1, 10.3],
    target: [-0.48, -0.18, -0.58],
    fov: 37,
    payload: { firstVertex, halo: d.halos.at(-1) },
  };
}
