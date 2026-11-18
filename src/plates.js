import { heroDiagram, complexityDiagram } from "./site-diagrams.js";
import { guardedCore } from "./guarded-core.js";
import { maintenance } from "./maintenance.js";
import { boundedPassage, envelope } from "./apparatus.js";
import { proposal } from "./proposal.js";
import { corridor } from "./corridor.js";
import { IcosahedronGeometry, SphereGeometry } from "three";
import { C, TAU, Drawing } from "./drawing.js";
import { city } from "./city.js";

function instrument(d, id) {
  const panel = (x, y, w, h, c = C.blue) =>
    d.box(x, y - h / 2, 0, w, h, 0.18, c, 0.85);
  const title = (s) => d.label(s, 0, 3.8, 0.2, 0.5);
  if (id === 6) {
    title("SEVEN REQUESTS FOR COMMENTS");
    d.circle(0, -0.3, 0, 1, C.cyan);
    d.label("PR #845", 0, -0.3, 0.2, 0.34);
    for (let i = 0; i < 7; i++) {
      const a = (i * TAU) / 7 - Math.PI / 2,
        x = 4 * Math.cos(a),
        y = -0.3 + 2.6 * Math.sin(a);
      d.path(
        [
          [x * 0.37, y * 0.38, 0],
          [x * 0.84, y * 0.84, 0],
        ],
        C.blue,
      );
      d.circle(x, y, 0, 0.76, C.cyan, 1, 6);
      d.label("RFC 000" + (3 + i), x, y, 0.1, 0.2);
    }
  } else if (id === 10) {
    title("NEGOTIATED TRANSITION");
    panel(-6, 0, 1, 5);
    for (let i = 0; i < 3; i++) {
      const y = 2 - i * 1.8;
      panel(0, y, 10, 0.98);
      d.label(
        ["INBOUND READS", "APP EXECUTION", "OUTBOUND WRITES"][i],
        -3,
        y,
        0.2,
        0.27,
      );
    }
    d.path(
      [
        [1.4, -2.7, 0.4],
        [1.4, 2.85, 0.4],
      ],
      C.red,
      1.7,
    );
    d.label("FLUSH BARRIER", 1.4, 3.05, 0.4, 0.25, C.red);
  } else if (id === 11) {
    title("STREAMS AND DATAGRAMS");
    panel(0, 1.55, 13, 1.35);
    d.label("TCP STREAM", -4.5, 1.55, 0.2, 0.32);
    d.path(
      [
        [-2.6, 1.55, 0.3],
        [5.8, 1.55, 0.3],
      ],
      C.cyan,
    );
    panel(0, -1.65, 13, 2.9, C.pink);
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 4;
      panel(x, -1.6, 3, 1.2, C.green);
      d.label("DATAGRAM " + (i + 1), x, -1.6, 0.2, 0.25);
    }
  } else if (id === 15) {
    title("INDEPENDENT RESOURCE BUDGETS");
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 4.7,
        c = i === 1 ? C.red : C.green;
      d.label("CHANNEL " + ["A", "B", "C"][i], x, 2.85, 0.1, 0.29);
      d.circle(x, 1.25, 0, 1.1, c, 1, 40, 0, Math.PI);
      const angle = [2.1, 0.28, 2.45][i];
      d.path(
        [
          [x, 1.25, 0.2],
          [x + 0.88 * Math.cos(angle), 1.25 + 0.88 * Math.sin(angle), 0.2],
        ],
        C.white,
      );
      panel(x, -1.35, 3, 3.5, c);
      panel(x, -1.2, 2.3, 0.67, c);
      d.label("FRAME", x, -1.2, 0.2, 0.25);
    }
  } else if (id === 17) {
    ["ALLOCATED MEMORY", "OUTBOUND BUFFER"].forEach((name, row) => {
      const y = 1.9 - row * 3.5;
      panel(0, y, 13, 2.4);
      for (let i = 0; i < 21; i++)
        panel(
          -5.9 + i * 0.59,
          y + 0.2,
          0.45,
          1.15,
          row ? (i < 8 ? C.green : C.red) : i < 15 ? C.cyan : C.blue,
        );
      d.label(name, -3.5, y - 0.83, 0.2, 0.31);
    });
  } else {
    title("ADAPTER CONFORMANCE HARNESS");
    for (const side of [-1, 1]) {
      const x = side * 4.8;
      panel(x, 0, 3.9, 5, C.cyan);
      d.label(
        side < 0 ? "RAW WIRE FIXTURES" : "WIRE-FRAME TOY SERVER",
        x,
        1.96,
        0.3,
        0.23,
      );
      for (let i = 0; i < 3; i++)
        panel(x, 1 - i * 1.2, 3, 0.68, i === 1 ? C.green : C.blue);
      d.path(
        [
          [side * 2.85, 0.65, 0],
          [side * 0.65, 0.65, 0],
        ],
        C.green,
      );
    }
    panel(0, 0.65, 1.3, 0.62);
    d.label("CHECK", 0, 0.65, 0.2, 0.21);
  }
}

function tunnel(d, id) {
  const floor = id === 12;
  const radius = 7,
    floorY = -3.6;
  // For the channel, keep only the wall arc above the chord. Its two
  // endpoints are also the outer edges of the flat gridded deck.
  const start = floor ? Math.asin(floorY / radius) : Math.PI / 8;
  const sweep = floor ? Math.PI - 2 * start : TAU;
  const point = (u, z) => {
    const a = start + u * sweep,
      x = Math.cos(a),
      y = Math.sin(a);
    if (id === 13) {
      // A rounded rectangular guard bends slightly as it recedes.
      const section = (v) => Math.sign(v) * Math.pow(Math.abs(v), 0.57);
      return [
        radius * section(x) + 0.28 * Math.sin(z * 0.16),
        radius * section(y) * 0.84,
        z,
      ];
    }
    return [radius * x, radius * y, z];
  };
  const count = floor ? 54 : 40;
  for (let i = 0; i < (floor ? count + 1 : count); i++) {
    const rail = [];
    for (let z = -66; z <= 8; z += 2) rail.push(point(i / count, z));
    const colour = floor
      ? [C.blue, C.blue, C.cyan, C.blue, C.green, C.blue, C.red][i % 7]
      : C.blue;
    d.path(rail, colour, 1.35);
  }
  for (let z = -66; z <= 8; z += floor ? 2.6 : 3.4) {
    d.path(
      Array.from({ length: count + 1 }, (_, i) => point(i / count, z)),
      C.blue,
      0.9,
    );
  }
  if (floor) {
    const width = Math.sqrt(radius ** 2 - floorY ** 2);
    for (const sign of [-1, 1])
      for (const [fraction, colour] of [
        [0.15, C.green],
        [0.27, C.blue],
        [0.32, C.cyan],
        [0.38, C.blue],
        [0.51, C.green],
        [0.55, C.cyan],
        [0.64, C.blue],
        [0.8, C.cyan],
        [0.91, C.blue],
        [1, C.cyan],
      ]) {
        const x = sign * fraction * width;
        d.path(
          Array.from({ length: 38 }, (_, i) => [x, floorY, -66 + i * 2]),
          colour,
          1.4,
        );
      }
    d.path(
      Array.from({ length: 38 }, (_, i) => [0, floorY, -66 + i * 2]),
      C.blue,
      1.6,
    );
    for (let z = -66; z <= 8; z += 2.6)
      d.path(
        [
          [-width, floorY, z],
          [width, floorY, z],
        ],
        C.blue,
        1.12,
      );
  } else if (id === 13) {
    return guardedCore(d);
  } else {
    const r = 3;
    d.mesh(new IcosahedronGeometry(r, 2), 0, 0, -8, C.pink, 1.35);
    d.mesh(new SphereGeometry(r * 0.83, 12, 8), 0, 0, -8, C.red, 1);
    for (let i = 0; i < 12; i++)
      d.path(
        [
          [r * Math.cos((i * TAU) / 12), r * Math.sin((i * TAU) / 12), -8],
          [
            (r + 0.55) * Math.cos((i * TAU) / 12),
            (r + 0.55) * Math.sin((i * TAU) / 12),
            -8,
          ],
        ],
        C.red,
        1.7,
      );
  }
}

export function makePlate(id) {
  // The avenue and transit pairs photograph the same city from two stations.
  const seedPlate =
    id === 2 || id === 29 ? 1 : id === 24 || id === 30 ? 23 : id;
  const d = new Drawing(458 + seedPlate);
  if (id === 27) return heroDiagram(d);
  if (id === 28) return complexityDiagram(d);
  if (id === 5) return proposal(d);
  let eye = [0, 0, 14],
    target = [0, 0, 0],
    fov = 38;
  if ([1, 2, 3, 8, 18, 19, 20, 22, 23, 24, 26, 29, 30].includes(id)) {
    return { d, ...city(d, id) };
  } else if ([12, 13, 14].includes(id)) {
    const animate = tunnel(d, id);
    return { d, eye: [0.25, 0, 7], target: [0, 0, -8], fov: 52, animate };
  } else if (id === 4 || id === 9) {
    return { d, ...corridor(d, id) };
  } else if (id === 7) {
    return { d, ...envelope(d) };
  } else if (id === 16) {
    return { d, ...boundedPassage(d) };
  } else if (id === 25) maintenance(d);
  else instrument(d, id);
  return { d, eye, target, fov };
}
