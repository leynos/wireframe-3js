import { C, TAU } from "./drawing.js";
import { turnShell } from "./phosphor.js";

export function guardedCore(d) {
  const centerZ = -8,
    radius = 3.43;
  // Offset the latitude grid from the viewer's axis. The near and far wires
  // cross at different angles, leaving the middle of the core open.
  const point = (lat, lon, r) => {
    const x = r * Math.cos(lat) * Math.cos(lon),
      y = r * Math.sin(lat),
      z = r * Math.cos(lat) * Math.sin(lon);
    const tiltedY = y * 0.91 - z * 0.415,
      tiltedZ = y * 0.415 + z * 0.91;
    return [
      0.963 * x - 0.27 * tiltedY,
      0.27 * x + 0.963 * tiltedY,
      centerZ + tiltedZ,
    ];
  };
  // Close the distant tunnel behind the core so the red inner mesh reads
  // against darkness instead of the tightly packed blue lines at infinity.
  d.face(
    Array.from({ length: 72 }, (_, i) => {
      const a = (TAU * i) / 72;
      return [4.4 * Math.cos(a), 4.4 * Math.sin(a), -12.2];
    }),
  );
  const start = d.positions.length;
  for (let layer = 0; layer < 2; layer++) {
    const r = radius * (layer ? 0.81 : 1),
      color = layer ? "#ff345d" : "#ff4ba7";
    for (let j = 1; j < 8; j++) {
      const lat = (j / 8 - 0.5) * Math.PI;
      d.path(
        Array.from({ length: 73 }, (_, i) =>
          point(lat, (i * TAU) / 72 + layer * 0.19, r),
        ),
        color,
        1.55,
      );
    }
    for (let j = 0; j < 12; j++) {
      d.path(
        Array.from({ length: 35 }, (_, i) =>
          point((i / 34 - 0.5) * Math.PI, (j * TAU) / 12 + layer * 0.28, r),
        ),
        color,
        1.5,
      );
    }
  }
  const end = d.positions.length;
  d.halo([0, 0, centerZ], 5.3, "#ff2581", 0.22, 0.66);
  d.halo([0, 0, centerZ], 3.85, "#ec164e", 0.075);
  // Short, uneven discharges mark the boundary without filling in its mesh.
  for (let j = 0; j < 15; j++) {
    const a = (TAU * j) / 15 + 0.06 * Math.sin(j * 3);
    const root = [radius * Math.cos(a), radius * Math.sin(a), centerZ + 0.65];
    const tip = root.map((v, k) =>
      k < 2 ? v * (1.09 + 0.05 * d.random()) : v,
    );
    d.path([root, tip], "#ff8394", 2.45);
    d.halo(root, 0.76, "#ff496d", 0.84);
  }
  for (const [x, y, z] of [
    [-6.6, 1.65, -9],
    [6.6, 1.65, -5.5],
  ]) {
    d.circle(x, y, z, 0.06, "#fff3c4", 2.9, 12);
    d.path(
      [
        [x - 0.28, y, z],
        [x + 0.28, y, z],
      ],
      C.red,
      1.6,
    );
    d.path(
      [
        [x, y - 0.24, z],
        [x, y + 0.24, z],
      ],
      C.red,
      1.6,
    );
    d.halo([x, y, z], 0.91, "#ff323e", 0.57);
  }
  return (position, seconds) => {
    const t = Number.isFinite(seconds) ? seconds : 0;
    turnShell(
      d.positions,
      position.array,
      start,
      end,
      0.16 * Math.sin(t * 0.26),
      centerZ,
      1 + 0.015 * Math.sin(t * 0.83),
    );
    position.needsUpdate = true;
  };
}
