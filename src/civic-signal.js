import { C } from "./drawing.js";
import { turnShell } from "./phosphor.js";

export function civicSignal(d, shellStart, shellEnd) {
  const focus = [8.05, -0.35, 2];
  d.halo([0, 0, 0], 10.7, "#8c61ff", 0.12, 0.79);
  d.halo([0, -1.35, 0], 5.8, "#35cfff", 0.075);
  d.halo(focus, 1.25, "#b4a0ff", 0.82);
  d.halo(focus, 0.65, "#dbffff", 1.45);
  d.halo([-5.9, 3.1, 1], 1.2, "#8d9dfd", 0.58);
  // A fine layer of suspended specks gives the brighter trails depth.
  for (let i = 0; i < 360; i++) {
    const y = (d.random() - 0.5) * 16,
      angle = d.random() * Math.PI * 2;
    const band = Math.sqrt(8.2 ** 2 - y * y),
      x = Math.cos(angle) * band,
      z = Math.sin(angle) * band;
    const len = 0.02 + 0.065 * d.random() ** 2;
    d.path(
      [
        [x, y, z],
        [x + len, y + 0.015, z],
      ],
      "#cdb6ff",
      0.8,
    );
  }
  const start = d.positions.length,
    packets = [];
  // A pair of sloping streams meet at the bright contact on the shell.
  // Wrap beyond the frame; short segments share the tangent of their stream.
  const track = (x, lane) =>
    -0.35 +
    (x < 8.05
      ? (8.05 - x) * (lane ? 0.305 : 0.243)
      : (x - 8.05) * (lane ? 0.67 : 0.48));
  const span = 64;
  for (let i = 0; i < 185; i++) {
    const phase = d.random() * span,
      lane = i % 2,
      x = phase - span / 2;
    const spread = (d.random() - 0.5) * (0.25 + 0.03 * Math.abs(x - 8.05)),
      z = 2.6 + d.random() * 1.8;
    const length = 0.055 + 0.52 * d.random() ** 2;
    const color = [C.cyan, "#e79dff", "#8dffc9", "#ad9dff"][i % 4];
    d.path(
      [
        [x, track(x, lane) + spread, z],
        [x + length, track(x + length, lane) + spread, z],
      ],
      color,
      1.6,
    );
    packets.push({ phase, lane, spread, length });
  }
  return (position, seconds) => {
    const t = Number.isFinite(seconds) ? seconds : 0;
    turnShell(
      d.positions,
      position.array,
      shellStart,
      shellEnd,
      0.13 * Math.sin(t * 0.19),
      0,
    );
    packets.forEach(({ phase, lane, spread, length }, i) => {
      const x = ((phase + t * (lane ? 0.49 : 0.67)) % span) - span / 2,
        k = start + 6 * i;
      position.array[k] = x;
      position.array[k + 1] = track(x, lane) + spread;
      position.array[k + 3] = x + length;
      position.array[k + 4] = track(x + length, lane) + spread;
    });
    position.needsUpdate = true;
  };
}
