import {
  IcosahedronGeometry,
  OctahedronGeometry,
  TetrahedronGeometry,
  Vector3,
} from "three";
import { C, TAU } from "./drawing.js";

const mint = "#81ffd2",
  amber = "#ffac36",
  lilac = "#ff78d6",
  underlay = "#33695c";
const at = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const diamond = (x, y, z, r) => [
  [x - r, y, z],
  [x, y + r, z],
  [x + r, y, z],
  [x, y - r, z],
];

function floor(d) {
  const tile = (x, z) => [x * 0.94 + z * 0.342, -3.15, -x * 0.342 + z * 0.94];
  for (let i = -14; i <= 14; i += 1.4) {
    d.path([tile(i, -14), tile(i, 14)], underlay, 0.34);
    d.path([tile(-14, i), tile(14, i)], underlay, 0.34);
  }
  for (let i = 0; i < 120; i++) {
    const x = (d.random() - 0.5) * 21,
      y = (d.random() - 0.4) * 9,
      z = -5 - d.random() * 3;
    d.path(
      [
        [x, y, z],
        [x + 0.025, y + 0.013, z],
      ],
      mint,
      0.52,
    );
  }
}

// Build the silhouette, depth mask and lettering in one chassis coordinate system.
function chassis(d, x, y, yaw, colour) {
  const cos = Math.cos(yaw),
    sin = Math.sin(yaw);
  const point = (u, v, z) => [x + cos * u + sin * z, y + v, cos * z - sin * u];
  const stroke = (points, ink = colour, power = 1) =>
    d.path(
      points.map((p) => point(...p)),
      ink,
      power,
    );
  function housing(u, v, width, height, back, front, bevel, ink = colour) {
    const ring = (z, inset) => {
      const w = width / 2 - inset,
        h = height / 2 - inset;
      const c = Math.min(bevel, w / 2, h / 2);
      return [
        [-w + c, -h],
        [w - c, -h],
        [w, -h + c],
        [w, h - c],
        [w - c, h],
        [-w + c, h],
        [-w, h - c],
        [-w, -h + c],
      ].map(([a, b]) => point(u + a, v + b, z));
    };
    const rim = Math.min(bevel / 2, (front - back) / 3);
    const rings = [ring(back, 0), ring(front - rim, 0), ring(front, rim)];
    d.face(rings[0]);
    d.face(rings[2]);
    rings.forEach((vertices, j) => {
      d.loop(vertices, ink, j === 2 ? 1.55 : 0.85);
      if (!j) return;
      vertices.forEach((p, i) => {
        const next = (i + 1) % vertices.length,
          prev = rings[j - 1];
        d.face([p, vertices[next], prev[next], prev[i]]);
        d.path([p, prev[i]], ink, 0.9);
      });
    });
    return rings[2];
  }
  function legend(text, u, v, z, size, ink = colour) {
    label(d, text, ...point(u, v, z + 0.012), size, ink);
    Object.assign(d.labels.at(-1), { surface: true, yaw });
  }
  return { point, stroke, housing, legend };
}

function label(d, text, x, y, z, size, colour = mint) {
  d.label(text, x, y, z, size, colour);
  d.labels.at(-1).font = "500 48px monospace";
}
function bit(d, value, x, y, z, s) {
  if (value)
    d.path(
      [
        [x - s * 0.2, y + s * 0.28, z],
        [x, y + s * 0.5, z],
        [x, y - s * 0.5, z],
      ],
      mint,
      1.05,
    );
  else
    d.loop(
      [
        [-0.25, -0.35],
        [-0.25, 0.35],
        [0, 0.5],
        [0.25, 0.35],
        [0.25, -0.35],
        [0, -0.5],
      ].map(([u, v]) => [x + u * s, y + v * s, z]),
      mint,
      1.05,
    );
}
function funnel(d) {
  const mouth = [-6.45, 0.32, 0],
    throat = [-4.02, 0.32, 0.11];
  for (let j = 0; j < 16; j++) {
    const a = (TAU * j) / 16;
    d.path(
      [
        [mouth[0], mouth[1] + 1.5 * Math.sin(a), mouth[2] + 1.28 * Math.cos(a)],
        throat,
      ],
      mint,
      0.65,
    );
  }
  for (const t of [0, 0.09, 0.42, 0.72]) {
    const p = at(mouth, throat, t);
    d.loop(
      Array.from({ length: 16 }, (_, j) => [
        p[0],
        p[1] + 1.5 * (1 - t) * Math.sin((TAU * j) / 16),
        p[2] + 1.28 * (1 - t) * Math.cos((TAU * j) / 16),
      ]),
      mint,
      t === 0 ? 1.5 : 0.64,
    );
  }
  for (let col = 0; col < 15; col++)
    for (let row = -3; row <= 3; row++) {
      const t = col / 15;
      bit(
        d,
        d.random() > 0.52,
        -7.85 + 3.55 * t,
        0.32 + row * 0.32 * (1 - t * 0.88),
        0.4,
        0.21 * (1 - t * 0.69),
      );
    }
}

// Sample distance along a polyline, so packets keep their speed around corners.
function track(points) {
  const vertices = points.map((p) => new Vector3(...p));
  const distances = [0];
  for (let i = 1; i < vertices.length; i++)
    distances.push(distances[i - 1] + vertices[i].distanceTo(vertices[i - 1]));
  return (t) => {
    const dist = Math.min(1, Math.max(0, t)) * distances.at(-1);
    let i = 1;
    while (i < distances.length - 1 && distances[i] < dist) i++;
    return at(
      points[i - 1],
      points[i],
      (dist - distances[i - 1]) / (distances[i] - distances[i - 1]),
    );
  };
}
function dashed(d, points, c, power) {
  const path = track(points);
  for (let j = 0; j < 45; j++)
    d.path([path(j / 45), path((j + 0.55) / 45)], c, power);
}
function tracer(d, points, c, request = false) {
  const path = track(points),
    start = d.positions.length;
  const origin = [0, 0, 0];
  d.path([origin, origin], c, 4);
  d.loop(diamond(0, 0, 0, 0.09), lilac, 2.8);
  if (request) d.loop([origin, origin, origin, origin], amber, 2.7);
  return (out, t) => {
    const active = t >= 0 && t <= 1,
      head = path(t),
      tail = path(active ? t - 0.035 : t);
    head[2] += 0.1;
    tail[2] += 0.1;
    out.set(tail, start);
    out.set(head, start + 3);
    const tagged = active && (!request || head[0] >= -1.03);
    const tag = diamond(
      head[0],
      head[1] + (tagged ? 0.24 : 0),
      head[2],
      tagged ? 0.105 : 0,
    );
    writeLoop(out, start + 6, tag);
    if (request) {
      const framed = active && head[0] >= -3.33;
      const box = [
        [-0.22, -0.14],
        [0.22, -0.14],
        [0.22, 0.14],
        [-0.22, 0.14],
      ];
      writeLoop(
        out,
        start + 30,
        box.map(([x, y]) => [
          head[0] + (framed ? x : 0),
          head[1] + (framed ? y : 0),
          head[2],
        ]),
      );
    }
  };
}
function writeLoop(buffer, start, points) {
  points.forEach((p, i) => {
    buffer.set(p, start + i * 6);
    buffer.set(points[(i + 1) % points.length], start + i * 6 + 3);
  });
}

// Slide a short, two-intensity reflection along an existing conductor.
function edgeGlint(d, points, colour, period, offset) {
  const sample = track(points);
  const start = d.positions.length;
  d.path([sample(0), sample(0.1)], colour, 1.4);
  d.path([sample(0), sample(0.03)], colour, 3.4);
  return (buffer, time) => {
    const head = ((time / period + offset) % 1) * 1.23;
    buffer.set(sample(head - 0.23), start);
    buffer.set(sample(head), start + 3);
    buffer.set(sample(head - 0.055), start + 6);
    buffer.set(sample(head), start + 9);
  };
}

export function heroDiagram(d) {
  floor(d);
  // A receding wire lattice catches stray light well behind the hardware.
  for (let i = -6; i <= 6; i++) {
    const x = i * 1.8,
      z = -7 + x * 0.16;
    d.path(
      [
        [x, -3.14, z],
        [x, 6, z],
      ],
      "#307f67",
      0.36,
    );
    for (let j = 0; j < 4; j++) d.junction([x, -2.6 + j * 2, z], "#458d73");
  }
  for (let j = 0; j < 4; j++)
    d.path(
      [
        [-10.8, -2.6 + j * 2, -8.728],
        [10.8, -2.6 + j * 2, -5.272],
      ],
      "#307f67",
      0.36,
    );

  funnel(d);
  const glints = [];
  for (const side of [-1, 1]) {
    const rail = [
      [-7.83, 0.32 + side * 1.16, 0.34],
      [-6.28, 0.32 + side * 0.82, 0.35],
      [-4.06, 0.33, 0.36],
    ];
    d.path(rail, amber, 1.65);
    glints.push(edgeGlint(d, rail, "#ffe4a2", 4.8, side === 1 ? 0.18 : 0.27));
  }
  const codec = chassis(d, -3.42, 0.35, -0.49, mint);
  const codecRim = codec.housing(0, 0, 2.12, 3.38, -0.82, 0.34, 0.21);
  codec.legend("FrameCodec", 0, 1.12, 0.34, 0.29);
  codec.legend("cuts frames", 0, -1.15, 0.34, 0.25);
  // The raised jaws leave a narrow channel for the incoming stream.
  for (const side of [-1, 1]) {
    codec.housing(0, side * 0.42, 1.66, 0.52, 0.34, 0.74, 0.09);
    codec.stroke(
      [
        [-0.7, side * 0.22, 0.75],
        [0.7, side * 0.22, 0.75],
      ],
      amber,
      1.7,
    );
  }
  const envelope = chassis(d, -0.96, 0.35, -0.38, mint);
  envelope.housing(0, 0, 1.71, 1.36, -0.53, 0.58, 0.17);
  envelope.legend("Envelope", 0, 0.16, 0.58, 0.31);
  envelope.legend("id 2 · corr 7", 0, -0.32, 0.58, 0.19, lilac);
  envelope.stroke([
    [-0.72, -0.08, 0.59],
    [0.72, -0.08, 0.59],
  ]);
  const router = chassis(d, 1.55, 0.35, -0.51, mint);
  const routerRim = router.housing(0, 0, 2, 4.17, -0.95, 0.39, 0.23);
  router.legend("Router", 0, 1.52, 0.39, 0.43);
  router.legend("route by ID", 0, -1.56, 0.39, 0.25);
  const outlets = [1.03, 0, -1.03].map((v, i) => {
    const ink = i === 1 ? amber : mint;
    router.housing(0.78, v, 0.51, 0.38, -0.3, 0.65, 0.08, ink);
    router.stroke(
      [
        [-0.72, 0, 0.41],
        [-0.25, 0, 0.41],
        [0.18, v, 0.41],
        [0.59, v, 0.41],
      ],
      ink,
      1.4,
    );
    return router.point(1.04, v, 0.54);
  });

  const rows = [
    ["Login", 2.55, TetrahedronGeometry],
    ["Telemetry", 0.35, IcosahedronGeometry],
    ["Control", -1.85, OctahedronGeometry],
  ];
  const inlets = rows.map(([name, y, Shape], i) => {
    const selected = i === 1,
      colour = selected ? mint : "#65b49c";
    const unit = chassis(d, 6.05, y, 0.38, colour);
    const unitRim = unit.housing(0, 0, 3.24, 1.54, -0.86, 0.36, 0.17);
    unit.housing(-1.02, 0, 0.85, 0.98, 0.36, 0.52, 0.14);
    d.mesh(
      new Shape(0.32, 0).rotateY(0.38),
      ...unit.point(-1.02, 0, 0.71),
      colour,
      1.35,
    );
    unit.legend(
      "ID " + (i + 1),
      0.43,
      0.39,
      0.36,
      0.24,
      selected ? lilac : colour,
    );
    unit.legend(name, 0.5, -0.04, 0.36, 0.32);
    for (let j = 0; j < 10; j++) {
      const u = -0.28 + j * 0.16;
      unit.stroke(
        [
          [u, -0.54, 0.38],
          [u, -0.44 + 0.09 * Math.sin(j * 1.7 + i), 0.38],
        ],
        selected ? amber : colour,
        1.1,
      );
    }
    const inlet = unit.point(-1.62, 0, -0.32);
    const branch = [
      outlets[i],
      [3.04, outlets[i][1], 0.18],
      [3.84, y, -0.12],
      inlet,
    ];
    // Paired rails and transverse divisions read as packet cells even at rest.
    for (const side of [-1, 1]) {
      const rail = branch.map(([x, v, z]) => [x, v + side * 0.13, z]);
      d.path(rail, selected ? amber : "#dc9447", selected ? 1.05 : 0.63);
      if (side === 1)
        glints.push(edgeGlint(d, rail, "#ffce85", 5.2 + i, 0.3 * i));
    }
    const sample = track(branch);
    for (const t of [0.23, 0.46, 0.69, 0.92]) {
      const [x, v, z] = sample(t);
      d.path(
        [
          [x, v - 0.13, z],
          [x, v + 0.13, z],
        ],
        amber,
        selected ? 0.95 : 0.48,
      );
    }
    glints.push(
      edgeGlint(d, [unitRim[5], unitRim[4]], "#baffdd", 6.7, 0.31 * i),
    );
    return inlet;
  });
  const outbound = [
    [-7.83, 0.33, 0.23],
    [-4.95, 0.33, 0.36],
    codec.point(-0.98, 0, 0.48),
    codec.point(0.98, 0, 0.48),
    envelope.point(0, 0, 0),
    router.point(-0.94, 0, 0.44),
    router.point(0.78, 0, 0.44),
    outlets[1],
    [3.48, 0.49, 0.45],
    inlets[1],
  ];
  const reply = [
    [5.4, -0.4, 0.3],
    [4.14, -0.86, 1.28],
    [3.45, -2.39, 2.12],
    [-2.97, -2.39, 2.12],
    [-5.05, -1.8, 0.62],
    [-5.5, -1.1, 0.35],
  ];
  d.path(outbound, amber, 2.6);
  d.path(
    outbound.map(([x, y, z]) => [x, y - 0.075, z]),
    amber,
    1.05,
  );
  dashed(d, reply, lilac, 1.35);
  for (const x of [3.04, 3.24])
    d.loop(
      [
        [x, -0.03, 0.67],
        [x, 0.79, 0.67],
        [x, 0.79, 0.03],
        [x, -0.03, 0.03],
      ],
      amber,
      1.45,
    );
  label(d, "middleware", 3.32, -0.28, 0.75, 0.24);
  label(d, "reply · correlation 7", 0.22, -2.94, 2.25, 0.33, lilac);
  for (const port of [codec.point(-0.88, 0, 0.5), outlets[1], inlets[1]])
    d.halo(port, 0.72, amber, 0.29);
  for (const [i, rim] of [codecRim, routerRim].entries()) {
    glints.push(edgeGlint(d, [rim[7], rim[6]], "#c0ffe4", 7.1, 0.35 + i * 0.3));
    d.halo(rim[6], 0.34, mint, 0.13);
  }
  const pulseStart = d.positions.length / 3;
  const send = tracer(d, outbound, amber, true);
  const replyStart = d.positions.length / 3;
  const receive = tracer(d, reply, lilac);
  const animate = (position, seconds) => {
    const phase = Number.isFinite(seconds) ? (seconds % 7) / 7 : 0.42;
    for (const glint of glints)
      glint(position.array, Number.isFinite(seconds) ? seconds : 0);
    send(position.array, phase / 0.62);
    receive(position.array, (phase - 0.62) / 0.38);
    position.needsUpdate = true;
  };
  return {
    d,
    eye: [0.9, 3.9, 24],
    target: [0, 0, 0],
    fov: 23.2,
    pulses: [
      { vertex: pulseStart, color: amber, radius: 0.44, power: 0.29 },
      { vertex: replyStart, color: lilac, radius: 0.44, power: 0.29 },
    ],
    wideBloom: 0.27,
    animate,
  };
}

export function complexityDiagram(d) {
  floor(d);
  const center = -4.22,
    start = d.positions.length,
    nodes = [];
  // Local neighbours form the exterior cage; longer diagonals cross its volume.
  for (let z = 0; z < 3; z++)
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) {
        const jitter = () => (d.random() - 0.5) * 0.68;
        nodes.push([
          center + (x - 1.5) * 1.05 + jitter(),
          (y - 1.5) * 1.08 + jitter() + 0.48,
          (z - 1) * 1.23 + jitter(),
        ]);
      }
  nodes.forEach((p, i) => {
    for (const j of [
      i % 4 < 3 ? i + 1 : -1,
      Math.floor(i / 4) % 4 < 3 ? i + 4 : -1,
      i < 32 ? i + 16 : -1,
    ]) {
      if (j >= 0) d.path([p, nodes[j]], mint, 0.88);
    }
    if (i % 2 === 0)
      d.path([p, nodes[(i * 13 + 19) % nodes.length]], C.cyan, 0.67);
  });
  const end = d.positions.length;
  const cx = 3.95;
  for (const [i, name] of ["codec", "routes", "middleware"].entries()) {
    const y = 1.98 - i * 1.3;
    const top = [
      [cx - 2, y, -0.1],
      [cx, y + 0.6, -1.25],
      [cx + 2, y, -0.1],
      [cx, y - 0.6, 1.2],
    ];
    const bottom = top.map(([x, y, z]) => [x, y - 0.19, z]);
    d.face(top);
    d.loop(top, mint, 1.85);
    d.loop(bottom, mint, 1.05);
    for (let j = 0; j < 4; j++) d.path([top[j], bottom[j]], mint, 1.15);
    label(d, name, cx, y + 0.31, 1.46, 0.36);
  }
  // A common axis aligns the three trays while the older wiring turns.
  d.path(
    [
      [cx, 2.58, -1.25],
      [cx, -0.62, -0.1],
    ],
    amber,
    0.82,
  );
  for (const x of [cx - 2, cx + 2])
    d.path(
      [
        [x, 1.98, -0.1],
        [x, -0.81, -0.1],
      ],
      mint,
      0.38,
    );
  d.path(
    [
      [-1, 0.52, 0.7],
      [1.05, 0.52, 0.7],
    ],
    amber,
    2.1,
  );
  d.path(
    [
      [0.62, 0.86, 0.7],
      [1.05, 0.52, 0.7],
      [0.62, 0.18, 0.7],
    ],
    amber,
    2.1,
  );
  d.halo([1.02, 0.52, 0.7], 0.62, amber, 0.12);
  label(d, "BY HAND", center, -2.38, 0.8, 0.48);
  label(d, "framing · parsing", center, -2.97, 1, 0.32);
  label(d, "dispatch · state", center, -3.37, 1, 0.32);
  label(d, "WITH WIREFRAME", cx, -2.38, 0.8, 0.48);
  const transfer = track([
    [-1, 0.52, 0.78],
    [1.05, 0.52, 0.78],
  ]);
  const tick = d.positions.length;
  d.path([transfer(0), transfer(0.15)], "#ffdc91", 2.6);
  const animate = (position, seconds) => {
    const t = Number.isFinite(seconds) ? seconds : 0;
    // Rotate about the tangle's own centre. The layer stack remains registered.
    const angle = 0.49 + 0.13 * Math.sin(t * 0.31),
      c = Math.cos(angle),
      s = Math.sin(angle);
    for (let i = start; i < end; i += 3) {
      const x = d.positions[i] - center,
        z = d.positions[i + 2];
      position.array[i] = center + x * c + z * s;
      position.array[i + 2] = z * c - x * s;
    }
    const u = (t % 3.4) / 3.4;
    position.array.set(transfer(u), tick);
    position.array.set(transfer(Math.min(1, u + 0.15)), tick + 3);
    position.needsUpdate = true;
  };
  return {
    d,
    eye: [0.55, 4.8, 23],
    target: [0, 0, 0],
    fov: 21.6,
    pulses: [{ vertex: tick / 3, color: amber, radius: 0.37, power: 0.25 }],
    wideBloom: 0.32,
    animate,
  };
}
