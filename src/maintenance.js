import { Path, ShapeUtils, Vector2 } from "three";
import { C } from "./drawing.js";

// Front-elevation drafting coordinates keep the two jaws, claw and poll in
// register with their internal facets. Heights are measured out of that plane.
const scale = 0.0188;
const project = ([x, y], z) => [(x - 452) * scale, (251 - y) * scale, z];
const mirrorJaw = ([x, y]) => [897 - x, 509 - y];

function tooling(d, outline, z) {
  const polygon = outline.map(([x, y]) => new Vector2(x, y));
  const winding = Math.sign(ShapeUtils.area(polygon));
  const rim = outline.map((p) => project(p, z));
  const back = outline.map((p) => project(p, z - 0.13));
  // Intersect the two inward edge offsets at each vertex for a continuous bevel.
  const face = polygon.map((p, i) => {
    const prev = polygon[(i + polygon.length - 1) % polygon.length];
    const next = polygon[(i + 1) % polygon.length];
    const a = p.clone().sub(prev).normalize(),
      b = next.clone().sub(p).normalize();
    const offset = (1.7 * winding) / Math.max(0.45, 1 + a.dot(b));
    return project(
      [p.x - (a.y + b.y) * offset, p.y + (a.x + b.x) * offset],
      z + 0.035,
    );
  });
  d.loop(back, C.white, 0.65);
  d.loop(rim, C.white, 2.6);
  d.loop(face, C.white, 1.8);
  for (const triangle of ShapeUtils.triangulateShape(polygon, [])) {
    d.face(triangle.map((i) => face[i]));
  }
  rim.forEach((p, i) => {
    const j = (i + 1) % rim.length;
    d.face([p, rim[j], face[j], face[i]]);
    d.face([p, back[i], back[j], rim[j]]);
  });
  return (points, power = 0.88) =>
    d.path(
      points.map((p) => project(p, z + 0.041)),
      C.white,
      power,
    );
}

function spanner(d) {
  const jaw = new Path();
  jaw.moveTo(382, 217);
  jaw.quadraticCurveTo(374, 208, 360, 211);
  jaw.bezierCurveTo(320, 215, 294, 184, 303, 144);
  jaw.lineTo(336, 178);
  jaw.lineTo(362, 169);
  jaw.lineTo(370, 142);
  jaw.lineTo(338, 110);
  jaw.bezierCurveTo(375, 98, 408, 130, 404, 168);
  jaw.quadraticCurveTo(402, 179, 412, 189);
  const head = jaw.getPoints(10).map((p) => p.toArray());
  const stroke = tooling(d, [...head, ...head.map(mirrorJaw)], 0);
  const facets = [
    [
      [332, 204],
      [336, 178],
      [364, 207],
      [362, 169],
      [390, 195],
    ],
    [
      [362, 169],
      [398, 174],
      [370, 142],
      [394, 132],
    ],
    [
      [370, 142],
      [399, 148],
    ],
    [
      [362, 169],
      [380, 201],
    ],
    [
      [374, 207],
      [389, 198],
      [401, 181],
    ],
  ];
  for (const facet of facets) {
    stroke(facet);
    stroke(facet.map(mirrorJaw));
  }
  for (const [a, b] of [
    [
      [380, 207],
      [499, 319],
    ],
    [
      [389, 198],
      [508, 311],
    ],
    [
      [398, 190],
      [517, 302],
    ],
  ])
    stroke([a, b], 1.05);
}

function hammer(d) {
  const profile = new Path();
  profile.moveTo(449, 121);
  profile.bezierCurveTo(484, 98, 517, 97, 548, 121);
  profile.lineTo(579, 150);
  profile.quadraticCurveTo(581, 174, 600, 177);
  profile.lineTo(618, 193);
  profile.quadraticCurveTo(622, 197, 616, 202);
  profile.lineTo(591, 227);
  profile.quadraticCurveTo(586, 232, 582, 226);
  profile.lineTo(569, 213);
  profile.quadraticCurveTo(569, 198, 554, 190);
  profile.quadraticCurveTo(540, 184, 528, 194);
  profile.lineTo(348, 388);
  profile.quadraticCurveTo(337, 401, 320, 386);
  profile.quadraticCurveTo(302, 371, 312, 356);
  profile.lineTo(505, 176);
  profile.quadraticCurveTo(521, 150, 509, 139);
  profile.quadraticCurveTo(492, 120, 458, 126);
  profile.quadraticCurveTo(451, 127, 449, 121);
  const points = profile.getPoints(10);
  points.pop(); // The profile closes on its starting point.
  const stroke = tooling(
    d,
    points.map((p) => p.toArray()),
    0.24,
  );
  for (const facet of [
    [
      [469, 114],
      [480, 123],
      [496, 106],
      [491, 125],
      [514, 108],
      [504, 131],
      [534, 114],
      [515, 142],
      [546, 122],
    ],
    [
      [515, 142],
      [555, 184],
      [546, 122],
      [576, 169],
      [555, 184],
      [569, 191],
    ],
    [
      [507, 175],
      [525, 194],
      [555, 184],
    ],
    [
      [576, 160],
      [569, 192],
      [599, 179],
      [570, 210],
      [585, 225],
    ],
    [
      [569, 192],
      [595, 217],
    ],
    [
      [579, 204],
      [600, 182],
      [616, 197],
    ],
    [
      [313, 358],
      [343, 387],
    ],
    [
      [314, 372],
      [513, 180],
    ],
    [
      [324, 383],
      [520, 186],
    ],
    [
      [337, 389],
      [526, 192],
    ],
  ])
    stroke(facet);
}

export function maintenance(d) {
  for (const [radius, depth, light] of [
    [224, -0.2, 0.75],
    [224, 0, 2.7],
    [222.5, 0.022, 1.85],
  ]) {
    d.circle(0, 0, depth, radius * scale, C.white, light, 180);
  }
  spanner(d);
  hammer(d);
}
