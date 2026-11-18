// Convex horizontal roof plans. The depth faces leave only the visible contours
// of the solid in the beam buffer, including when one structure hides another.
export function prism(d, foot, y, h, c, power = 1, roofScale = 1) {
  const cx = foot.reduce((v, p) => v + p[0], 0) / foot.length,
    cz = foot.reduce((v, p) => v + p[1], 0) / foot.length;
  const base = foot.map(([x, z]) => [x, y, z]);
  const roof = foot.map(([x, z]) => [
    cx + (x - cx) * roofScale,
    y + h,
    cz + (z - cz) * roofScale,
  ]);
  d.face(base);
  d.face(roof);
  d.loop(base, c, power);
  d.loop(roof, c, power);
  base.forEach((p, i) => {
    const j = (i + 1) % base.length;
    d.face([p, base[j], roof[j], roof[i]]);
    d.path([p, roof[i]], c, power);
  });
}

export function rect(x, z, w, l = w) {
  return [
    [x - w / 2, z - l / 2],
    [x + w / 2, z - l / 2],
    [x + w / 2, z + l / 2],
    [x - w / 2, z + l / 2],
  ];
}
export function block(d, x, z, w, l, h, c, p = 1, y = 0) {
  prism(d, rect(x, z, w, l), y, h, c, p);
}
export function building(d, x, z, w, l, h, c, p = 1, style = 0, y = 0) {
  block(d, x, z, w, l, h, c, p, y);
  if (style === 1) block(d, x, z, w * 0.65, l * 0.66, h * 0.17, c, p, y + h);
  if (style === 2) prism(d, rect(x, z, w, l), y + h, h * 0.35, c, p, 0.48);
  if (style === 3) {
    for (const side of [-1, 1])
      for (const u of [-0.26, 0.26])
        d.path(
          [
            [x + u * w, y, z + (side * l) / 2],
            [x + u * w, y + h, z + (side * l) / 2],
          ],
          c,
          p * 0.48,
        );
  }
}

// Every sampled cross-section has the same centre and surface normal as its
// neighbours. Curves, lanes and depth faces therefore meet on the same deck.
export function deck(
  d,
  points,
  width,
  c,
  { lanes = [], power = 1, solid = true } = {},
) {
  const sections = points.map((p, i) => {
    const a = points[Math.max(0, i - 1)],
      b = points[Math.min(points.length - 1, i + 1)];
    const dx = b[0] - a[0],
      dz = b[2] - a[2],
      len = Math.hypot(dx, dz);
    return (offset) => [
      p[0] - (offset * dz) / len,
      p[1],
      p[2] + (offset * dx) / len,
    ];
  });
  if (solid)
    for (let i = 1; i < sections.length; i++) {
      const a = sections[i - 1],
        b = sections[i];
      d.face([a(-width), a(width), b(width), b(-width)]);
    }
  for (const offset of [-width, -width * 0.9, width * 0.9, width])
    d.path(
      sections.map((s) => s(offset)),
      c,
      power,
    );
  for (const [offset, colour, strength] of lanes)
    d.path(
      sections.map((s) => s(offset * width)),
      colour,
      strength,
    );
}
export function samples(n, point) {
  return Array.from({ length: n + 1 }, (_, i) => point(i / n));
}
export const mix = (a, b, t) => a + (b - a) * t;
