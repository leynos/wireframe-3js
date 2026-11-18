import * as T from "three";

export const C = {
  blue: "#477cf8",
  cyan: "#63ebf4",
  violet: "#c9a2ff",
  green: "#38f49d",
  pink: "#f04fa5",
  red: "#fe536c",
  yellow: "#ffeb39",
  white: "#d6e7ff",
};
export const TAU = Math.PI * 2;
export class Drawing {
  faces = [];
  positions = [];
  colours = [];
  times = [];
  labels = [];
  junctions = [];
  halos = [];
  length = 0;
  constructor(seed) {
    this.seed = seed;
  }
  random() {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return this.seed / 4294967296;
  }
  path(points, colour = C.blue, power = 1) {
    const c = new T.Color(colour);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i];
      this.positions.push(...a, ...b);
      this.times.push(this.length);
      this.length += Math.hypot(...b.map((v, j) => v - a[j]));
      this.times.push(this.length);
      for (let j = 0; j < 2; j++)
        this.colours.push(c.r * power, c.g * power, c.b * power);
    }
  }
  loop(points, c, k) {
    this.path([...points, points[0]], c, k);
  }
  box(x, y, z, w, h, d, c, k = 1) {
    const ring = (yy) => [
      [x - w / 2, yy, z - d / 2],
      [x + w / 2, yy, z - d / 2],
      [x + w / 2, yy, z + d / 2],
      [x - w / 2, yy, z + d / 2],
    ];
    const bottom = ring(y),
      top = ring(y + h);
    this.loop(bottom, c, k);
    this.loop(top, c, k);
    top.forEach((p, i) => this.path([p, bottom[i]], c, k));
  }
  circle(x, y, z, r, c, k = 1, n = 64, start = 0, end = TAU) {
    this.path(
      Array.from({ length: n + 1 }, (_, i) => {
        const a = start + ((end - start) * i) / n;
        return [x + r * Math.cos(a), y + r * Math.sin(a), z];
      }),
      c,
      k,
    );
  }
  mesh(geometry, x, y, z, c, k) {
    const edges = new T.EdgesGeometry(geometry, 1);
    const p = edges.attributes.position;
    for (let i = 0; i < p.count; i += 2)
      this.path(
        [i, i + 1].map((j) => [x + p.getX(j), y + p.getY(j), z + p.getZ(j)]),
        c,
        k,
      );
    edges.dispose();
    geometry.dispose();
  }
  face(points) {
    for (let i = 2; i < points.length; i++)
      this.faces.push(...points[0], ...points[i - 1], ...points[i]);
  }
  halo(center, radius, color, power, ring = 0) {
    this.halos.push({ center, radius, color, power, ring, at: this.length });
  }
  junction(point, colour) {
    this.junctions.push({ point, colour, at: this.length });
  }
  label(text, x, y, z, size = 0.45, colour = C.white) {
    this.labels.push({ text, x, y, z, size, colour, at: this.length });
  }
}
