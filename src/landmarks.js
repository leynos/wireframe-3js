import { civicSignal } from "./civic-signal.js";
import { C, TAU } from "./drawing.js";
import {
  block,
  building,
  deck,
  mix,
  prism,
  rect,
  samples,
} from "./civic-geometry.js";

function globe(d, x, y, z, r, c) {
  for (let i = 1; i < 8; i++) {
    const a = (Math.PI * i) / 8;
    d.path(
      samples(32, (t) => [
        x + r * Math.cos(t * TAU) * Math.sin(a),
        y + r * Math.cos(a),
        z + r * Math.sin(t * TAU) * Math.sin(a),
      ]),
      c,
    );
  }
  for (let i = 0; i < 16; i++) {
    const a = (TAU * i) / 16;
    d.path(
      samples(18, (t) => [
        x + r * Math.cos(a) * Math.sin(t * Math.PI),
        y + r * Math.cos(t * Math.PI),
        z + r * Math.sin(a) * Math.sin(t * Math.PI),
      ]),
      c,
    );
  }
}

export function cityGlobe(d, id) {
  const violet = id === 18 ? C.violet : "#adaeff";
  // A shallow, elliptical plinth holds a continuous skyline on the lower chord.
  const ellipse = (rx, rz) =>
    samples(64, (t) => [rx * Math.cos(t * TAU), rz * Math.sin(t * TAU)]).slice(
      0,
      -1,
    );
  prism(d, ellipse(6.5, 2.2), -2.5, 0.18, C.cyan, 1.6);
  for (let row = 0; row < 3; row++)
    for (let k = -6; k <= 6; k++) {
      const x = k * 0.84 + (d.random() - 0.5) * 0.3,
        z = (row - 1) * 1.1;
      const h =
        0.4 +
        (1 - Math.abs(k) / 8) * (0.6 + 5.2 * d.random()) * (1 - row * 0.24);
      const w = 0.48 + d.random() * 0.46;
      building(d, x, z, w, 0.78, h, C.cyan, 1.3, k % 3 === 0 ? 1 : 3, -2.32);
    }
  // Offset successive latitude rings by half a cell. Connecting the nearest
  // vertices makes the broad triangular facets visible across the front face.
  const shellStart = d.positions.length;
  const shell = (row, col) => {
    const lat = (row / 6 - 0.5) * Math.PI,
      lon = ((col + (row % 2) * 0.5) * TAU) / 12 + row * 0.015 + 0.23;
    return [
      8.45 * Math.cos(lat) * Math.cos(lon),
      8.45 * Math.sin(lat),
      8.45 * Math.cos(lat) * Math.sin(lon),
    ];
  };
  for (let row = 0; row < 6; row++)
    for (let col = 0; col < 12; col++) {
      const p = shell(row, col),
        q = shell(row, col + 1),
        r = shell(row + 1, col);
      const light = p[2] > 0 ? 1.45 : 0.42;
      d.path([q, p, r], violet, light);
      d.path([p, shell(row + 1, col + (row % 2 ? 1 : -1))], violet, light);
    }
  const shellEnd = d.positions.length;
  for (const r of [8.4, 8.5]) d.circle(0, 0, 0, r, violet, 2.2, 150);
  const focus = id === 18 ? [8.05, -0.35, 2] : [7.65, 3.65, 0];
  for (let i = 0; i < 55; i++) {
    const a = d.random() * TAU,
      len = 0.18 + d.random() ** 2 * 1.15;
    d.path(
      [
        focus,
        [focus[0] + len * Math.cos(a), focus[1] + len * Math.sin(a), 0.35],
      ],
      i % 4 ? C.cyan : C.white,
      1.65,
    );
  }
  if (id === 20) {
    for (let j = 0; j < 3; j++)
      d.path(
        samples(50, (t) => [
          focus[0] + 1.45 + 1.55 * Math.cos(t * TAU),
          focus[1] + 0.57 + 0.41 * Math.sin(t * TAU) + 0.42 * Math.cos(t * TAU),
          0.2 * j,
        ]),
        j === 1 ? C.cyan : C.green,
        1.6,
      );
  }
  for (const side of [-1, 1])
    for (let i = 0; i < 88; i++) {
      const t = d.random(),
        x = side * (7.4 + 11 * t),
        slope = id === 18 ? (side < 0 ? 1 : 0.58) : side < 0 ? 0.32 : -0.8;
      const y =
        focus[1] + t * 9 * slope + (d.random() - 0.5) * (0.45 + t * 1.3);
      d.path(
        [
          [x, y, -1],
          [x + 0.05 + d.random() * 0.18, y + 0.08, -1],
        ],
        i % 3 ? violet : C.green,
        1.2,
      );
    }
  for (let i = 0; i < 160; i++) {
    const a = d.random() * TAU,
      r = Math.sqrt(d.random()) * 8.1,
      x = r * Math.cos(a),
      y = r * Math.sin(a);
    d.path(
      [
        [x, y, -4],
        [x + 0.025, y + 0.015, -4],
      ],
      violet,
      0.9,
    );
  }
  const animate = id === 18 ? civicSignal(d, shellStart, shellEnd) : undefined;
  return { eye: [0, 2.2, 46], target: [0, 0, 0], span: 18.8, animate };
}

function pyramid(d, x, z, r, h, c) {
  prism(d, rect(x, z, r * 2), 0, h, c, 1.6, 0.025);
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    d.loop(
      rect(x, z, r * 2 * (1 - t * 0.975)).map(([a, b]) => [a, h * t, b]),
      c,
      1.2,
    );
  }
}
function diamond(d, x, z, r, h, c) {
  const belt = rect(x, z, r * 1.5);
  const ring = belt.map(([a, b]) => [a, h * 0.56, b]);
  d.loop(ring, c, 1.15);
  for (let i = 0; i < 4; i++) {
    d.path([[x, 0, z], ring[i], [x, h, z]], c, 1.5);
    const next = ring[(i + 1) % 4];
    d.face([ring[i], next, [x, h, z]]);
    d.face([next, ring[i], [x, 0, z]]);
  }
}
function bridge(d, x, z, length, height, c) {
  deck(
    d,
    [
      [-length / 2 + x, 1.62, z],
      [length / 2 + x, 1.62, z],
    ],
    0.52,
    c,
  );
  for (const side of [-1, 1]) {
    const zz = z + side * 0.51;
    for (const tower of [-1, 1])
      block(d, x + tower * length * 0.24, zz, 0.21, 0.22, height, c, 1.4);
    for (const [a, b, mid] of [
      [-0.5, -0.24, false],
      [-0.24, 0.24, true],
      [0.5, 0.24, false],
    ]) {
      const at = (t) => [
        x + length * mix(a, b, t),
        1.67 + (height - 1.67) * (mid ? (2 * t - 1) ** 2 : t ** 2),
        zz,
      ];
      d.path(samples(30, at), c, 1.5);
      for (let j = 1; j < 19; j++) {
        const p = at(j / 19);
        d.path([[p[0], 1.62, zz], p], c, 0.96);
      }
    }
  }
}

export function civicPanorama(d) {
  const colours = [C.blue, C.cyan, C.pink, C.green, "#ffbd70"];
  for (let i = -6; i <= 6; i++) {
    const t = i * 4;
    for (const across of [false, true])
      deck(
        d,
        samples(20, (u) =>
          across ? [mix(-29, 29, u), 0.01, t] : [t, 0.02, mix(-29, 29, u)],
        ),
        0.42,
        C.cyan,
        { power: 0.83 },
      );
  }
  for (let i = -6; i < 6; i++)
    for (let j = -6; j < 5; j++) {
      const x = i * 4 + 2,
        z = j * 4 + 2;
      if (z > 0 && Math.abs(x) < 12) continue;
      const c = colours[Math.abs(i * 3 + j) % 5];
      building(
        d,
        x,
        z,
        1.6 + d.random(),
        1.8 + d.random(),
        0.5 + d.random() * 2.8,
        c,
        1.15,
        Math.floor(d.random() * 4),
      );
    }
  pyramid(d, -5, 6, 3, 4.4, C.pink);
  d.halo([-5, 4.4, 6], 1.7, C.pink, 0.17);
  pyramid(d, -8, -6, 1.7, 2.4, C.cyan);
  bridge(d, -9, 3.3, 21, 4.15, C.pink);
  bridge(d, 1, -6, 19, 3, C.cyan);
  globe(d, -0.4, 0.95, 8.7, 1.05, C.cyan);
  d.halo([-0.4, 0.95, 8.7], 1.6, C.cyan, 0.14, 0.66);
  globe(d, -13, 2.6, 0, 1.15, C.cyan);
  d.halo([-13, 2.6, 0], 1.75, C.cyan, 0.14, 0.66);
  for (const [x, z, r, h, c] of [
    [-13, -8, 1, 5.6, C.pink],
    [5, 0, 1.2, 4.6, C.pink],
    [9, -9, 1.3, 6.4, C.green],
    [14, -4, 1.6, 6.1, "#ffbc76"],
    [-1, -15, 0.85, 5.5, C.pink],
  ])
    diamond(d, x, z, r, h, c);
  deck(
    d,
    samples(36, (t) => [mix(-11, 13, t), 1.1, mix(24, -12, t)]),
    0.32,
    "#ffbc76",
  );
  deck(
    d,
    samples(36, (t) => [mix(-23, 22, t), 1.4, mix(1.5, 9, t)]),
    0.27,
    C.pink,
  );
  for (const [x, z, c] of [
    [4, 12, C.green],
    [6, 10, C.green],
    [-4, 12, "#ffbc76"],
    [-7, 12, "#ffbc76"],
    [9, 8, C.green],
    [12, 10, C.pink],
  ]) {
    building(d, x, z, 1.7, 1.65, 0.8 + d.random(), c, 1.2, 2);
  }
  // Vary the angular size as well as the light. Subpixel strokes alone
  // disappear into the void when the plate is displayed as a small embed.
  for (let i = 0; i < 380; i++) {
    const x = mix(-112, 72, d.random()),
      y = mix(1, 53, d.random()),
      z = mix(-84, -60, d.random());
    const magnitude = d.random() ** 3;
    const radius = 0.085 + 0.15 * magnitude;
    const tint = i % 5 === 0 ? "#bfcadf" : "#849abf";
    d.path(
      [
        [x - radius, y, z],
        [x + radius, y, z],
      ],
      tint,
      0.58 + magnitude,
    );
    if (magnitude > 0.55)
      d.path(
        [
          [x, y - radius * 0.7, z],
          [x, y + radius * 0.7, z],
        ],
        tint,
        0.85,
      );
  }
  return { eye: [8, 8.2, 27], target: [0, 5.9, -1], fov: 44 };
}
