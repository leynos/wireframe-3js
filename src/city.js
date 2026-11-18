import { packetTrip, rampTrip, transitAnimation } from "./transit.js";
import { C, Drawing, TAU } from "./drawing.js";
import {
  block,
  building,
  deck,
  mix,
  prism,
  rect,
  samples,
} from "./civic-geometry.js";
import { cityGlobe, civicPanorama } from "./landmarks.js";

const ice = "#60bfff",
  cobalt = "#648cff",
  mint = "#56efa5",
  steel = "#4079b6";
const axial = (across, t, v, y) => (across ? [t, y, v] : [v, y, t]);
function line(d, across, v, start, end, y, c, p) {
  d.path(
    samples(Math.max(1, Math.ceil(Math.abs(end - start) / 5)), (t) =>
      axial(across, mix(start, end, t), v, y),
    ),
    c,
    p,
  );
}

const avenuePeriod = 120; // Ten intersections, each twelve units apart.
const approach = { eye: [0, 5.8, 15], target: [0, 0, -2.2], fov: 48 };
const street = { eye: [0, 4.25, -5.5], target: [0, 0, -17.8], fov: 48 };

function flightCamera(seconds, camera) {
  const t = Math.max(0, seconds - 0.6);
  const u = Math.min(t / 6, 1);
  const eased = u * u * (3 - 2 * u);
  const cruise = Math.max(0, t - 6);
  const speed = ((approach.eye[2] - street.eye[2]) * 1.5) / 6;
  let z =
    mix(approach.eye[2], street.eye[2], u * u * (1.5 - 0.5 * u)) -
    cruise * speed;
  const travelled = approach.eye[2] - z;
  // Both stations see identical geometry for the whole draw distance.
  if (z < -79) z = -79 - ((-79 - z) % avenuePeriod);
  const y = mix(approach.eye[1], street.eye[1], eased);
  const pitch =
    mix(5.8 / 17.2, 4.25 / 12.3, eased) -
    0.19 * (1 - Math.exp((-cruise * cruise) / 32));
  camera.position.set(0, y, z);
  camera.lookAt(0, y - 12 * pitch, z - 12);
  return Math.max(74, 165 - 0.85 * travelled);
}

function avenue(d, id) {
  const flying = id === 29;
  const gridEnd = flying ? -303 : -123;
  const towers = [];
  let repeatSeed;
  // The same boulevard seen from two stations. The nearest block is open in
  // the approach view. From the second station its towers flank the camera.
  for (let i = -80; i <= 80; i += 5)
    line(d, false, i, gridEnd, 20, -0.12, steel, 0.14);
  for (let z = gridEnd; z < 20; z += 5)
    line(d, true, z, -80, 80, -0.12, steel, 0.14);
  line(d, false, 0, flying ? -305 : -190, 20, 0.05, "#489dff", 2.8);
  for (let z = 5; z >= (flying ? -295 : -151); z -= 12) {
    if (flying && z === -43) repeatSeed = d.seed;
    if (flying && z < -43 && (-43 - z) % avenuePeriod === 0)
      d.seed = repeatSeed;
    for (const sign of [-1, 1]) {
      for (const spread of [0, 0.09, 0.16, 0.21]) {
        const edge = 1.08 + spread;
        d.path(
          [
            [sign * edge, 0.07, z + 10.4],
            [sign * edge, 0.07, z + 1.6],
            [sign * (edge + 0.1), 0.07, z + 1.14],
            [sign * (edge + 0.33), 0.07, z + 0.9],
            [sign * (edge + 0.73), 0.07, z + 0.78],
            [sign * 4.8, 0.07, z + 0.78],
          ],
          "#469fff",
          2.65,
        );
      }
      for (const spread of [0, 0.09, 0.16, 0.21]) {
        const edge = 1.08 + spread;
        d.path(
          [
            [sign * 4.8, 0.07, z - 0.78],
            [sign * (edge + 0.73), 0.07, z - 0.78],
            [sign * (edge + 0.33), 0.07, z - 0.9],
            [sign * (edge + 0.1), 0.07, z - 1.14],
            [sign * edge, 0.07, z - 1.6],
          ],
          "#469fff",
          2.65,
        );
      }
      for (const side of [-1, 1]) {
        for (const edge of [0.78, 0.98])
          line(
            d,
            true,
            z + side * edge,
            sign * 1.81,
            sign * 40,
            0.05,
            mint,
            0.97,
          );
        for (const offset of [0, 0.2]) {
          const r = 2.1 + offset;
          const bend = samples(15, (t) => {
            const a = (t * Math.PI) / 2;
            return [
              sign * (4.8 - r * Math.cos(a)),
              0.04,
              z + side * (2.9 - r * Math.sin(a)),
            ];
          });
          d.path(
            [
              [sign * (4.8 - r), 0.04, z + side * 6],
              ...bend,
              [sign * 44, 0.04, bend.at(-1)[2]],
            ],
            mint,
            2.25,
          );
        }
      }
      for (const x of [8.5, 14, 23])
        line(d, false, sign * x, z - 6, z + 6, 0.01, mint, 0.68);
      d.junction([sign * 1.55, 0.07, z + 0.91], ice);
    }
    for (const side of [-1, 1]) {
      for (let lot = 0; lot < 4; lot++) {
        const x = side * (4.9 + lot * 5.4 + (d.random() - 0.5)),
          tz = z - 4.6 + d.random();
        const front = z >= -7;
        const height = 2.5 + d.random() * 10;
        const h = front
          ? 0.65 + d.random() * 0.8
          : height * (lot > 1 && z > -32 ? 0.32 : 1);
        const w = 2.2 + d.random() * 1.4,
          depth = 2 + d.random() * 1.6;
        const first = d.times.length;
        building(
          d,
          x,
          tz,
          w,
          depth,
          h,
          front ? steel : ice,
          front ? 0.67 : 1.35,
          front ? 0 : Math.floor(d.random() * 2),
        );
        if (!front) {
          const surround = rect(x, tz, w + 0.045, depth + 0.045);
          d.loop(
            surround.map(([a, b]) => [a, h - 0.075, b]),
            ice,
            0.6,
          );
          for (const [a, b] of surround)
            d.path(
              [
                [a, 0.06, b],
                [a, h - 0.075, b],
              ],
              ice,
              0.5,
            );
        }
        if (flying) towers.push([first, d.times.length, tz]);
      }
    }
  }
  for (const side of [-1, 1]) {
    building(d, side * 5.1, -14, 2.7, 3.15, side < 0 ? 7.3 : 8.8, ice, 1.3, 1);
    building(d, side * 4.3, -10, 2.1, 2.35, side < 0 ? 1.25 : 3.2, ice, 1, 0);
  }
  if (flying) {
    // Roads reveal by distance. Each tower traces in its original pen order,
    // independently of its neighbours, as its lot enters the horizon band.
    const horizon = new Float32Array(d.times.length * 2);
    for (let i = 0; i < d.times.length; i++)
      horizon[2 * i] = d.positions[3 * i + 2];
    for (const [first, end, z] of towers) {
      const length = d.times[end - 1] - d.times[first];
      for (let i = first; i < end; i++) {
        horizon[2 * i] = z;
        horizon[2 * i + 1] = (d.times[i] - d.times[first]) / length;
      }
    }
    // Spend the opening scan on visible streets. The continuation beyond
    // the first horizon gets its own beam reveal during flight.
    let length = 0,
      junction = 0;
    for (let i = 0; i < d.times.length; i += 2) {
      const end = d.times[i + 1];
      const visible =
        Math.max(horizon[2 * i], horizon[2 * (i + 1)]) > approach.eye[2] - 165;
      const distance = visible ? end - d.times[i] : 0;
      d.times[i] = length;
      length += distance;
      d.times[i + 1] = length;
      while (junction < d.junctions.length && d.junctions[junction].at <= end)
        d.junctions[junction++].at = length;
    }
    d.length = length;
    return { ...approach, flightCamera, horizon };
  }
  return id === 1 ? approach : street;
}

function district(
  d,
  { step = 8, count = 4, colour = steel, high = 5, plan = false } = {},
) {
  for (let i = -count; i < count; i++)
    for (let j = -count; j < count; j++) {
      const x = (i + 0.5) * step,
        z = (j + 0.5) * step;
      for (const side of [-1, 1]) {
        line(
          d,
          true,
          z + side * (step / 2 - 0.48),
          x - step / 2,
          x + step / 2,
          0.025,
          plan ? ice : cobalt,
          0.84,
        );
        line(
          d,
          false,
          x + side * (step / 2 - 0.48),
          z - step / 2,
          z + step / 2,
          0.025,
          plan ? ice : cobalt,
          0.84,
        );
      }
      d.loop(
        rect(x, z, step - 1.65).map(([x, z]) => [x, 0, z]),
        colour,
        0.62,
      );
      if (!plan && (i * 3 + j) % 5 === 0) {
        const polygon = samples(12, (t) => [
          x + step * 0.27 * Math.cos(t * TAU),
          z + step * 0.27 * Math.sin(t * TAU),
        ]).slice(0, -1);
        prism(d, polygon, 0, 1.5, colour, 1.05);
        continue;
      }
      for (let k = 0; k < 4; k++) {
        const tx = x + ((k % 2) - 0.5) * step * 0.4,
          tz = z + (Math.floor(k / 2) - 0.5) * step * 0.4;
        const c = plan
          ? [steel, "#6fc17e", "#ad5d63", "#7661af"][(k + Math.abs(i + j)) % 4]
          : colour;
        const w = step * (0.16 + d.random() * 0.19),
          l = step * (0.18 + d.random() * 0.17);
        building(
          d,
          tx,
          tz,
          w,
          l,
          0.5 + high * d.random() ** 2,
          c,
          1.08,
          Math.floor(d.random() * 4),
        );
        if (plan)
          block(
            d,
            tx + w * 0.28,
            tz + l * 0.37,
            w * 0.48,
            l * 0.52,
            0.55,
            c,
            0.9,
          );
      }
    }
}

function routingPlan(d) {
  district(d, { step: 8, high: 3.5, plan: true });
  for (let ix = -2; ix <= 2; ix++)
    for (let iz = -2; iz <= 2; iz++) {
      const x = ix * 8 + 4,
        z = iz * 8 + 4;
      for (const across of [true, false]) {
        const centre = across ? z : x,
          along = across ? x : z;
        for (const edge of [-0.21, 0.21])
          line(
            d,
            across,
            centre + edge,
            along - 3.6,
            along + 3.6,
            0.1,
            ice,
            0.98,
          );
      }
      for (const sx of [-1, 1])
        for (const sz of [-1, 1]) {
          const bx = x + sx * 2,
            bz = z + sz * 2;
          block(
            d,
            bx + sx * 0.8,
            bz + sz * 0.84,
            0.6,
            0.84,
            0.56,
            "#719da9",
            0.84,
          );
        }
    }
  for (let i = -4; i <= 4; i++) {
    const v = i * 8;
    for (const across of [true, false])
      for (const off of [-0.48, 0.48]) {
        line(d, across, v + off, -34, 34, 0.03, cobalt, 0.88);
      }
  }
  for (const across of [true, false]) {
    const positions = across ? [0] : [-8, 0, 8];
    for (const v of positions)
      for (const off of [-0.94, -0.75, -0.48, 0.48, 0.75, 0.94])
        line(d, across, v + off, -32, 32, 0.06, ice, 1.2);
  }
  for (const x of [-8, 0, 8])
    for (const w of [2.22, 1.88, 1.57])
      block(d, x, 0, w, w, 0.34, ice, 1.65, (2.22 - w) * 0.68);
  return { eye: [1.3, 23, 11.5], target: [0, 0.45, 0], fov: 31 };
}

function suspension(d, across, sign, colour, wide = false) {
  const p = (t, y, lateral) =>
    axial(across, sign * t, lateral, wide ? 3 + (y - 3) * 0.65 : y);
  for (const edge of [-1, 1]) {
    const rail = edge * 1.06;
    for (const t of [5.4, 8.9]) {
      const [x, , z] = p(t, 0, rail);
      block(d, x, z, 0.16, 0.16, wide ? 4.95 : 6, colour, 1.15);
    }
    d.path([p(5.4, 6, rail), p(8.9, 6, rail)], colour, 1.25);
    for (const [start, end, reverse] of [
      [1.8, 5.4, false],
      [8.9, 15.2, true],
    ]) {
      const cable = (t) => 3.14 + 2.86 * (reverse ? 1 - t : t) ** 2;
      d.path(
        samples(24, (t) => p(mix(start, end, t), cable(t), rail)),
        colour,
        1.45,
      );
      for (let i = 1; i < 12; i++) {
        const t = i / 12;
        d.path(
          [
            p(mix(start, end, t), 3.05, rail),
            p(mix(start, end, t), cable(t), rail),
          ],
          colour,
          0.85,
        );
      }
    }
    for (let i = 1; i < 9; i++) {
      const t = mix(5.4, 8.9, i / 9);
      d.path([p(t, 3.05, rail), p(t, 6, rail)], colour, 0.9);
    }
  }
}

function interchange(d, id) {
  const wide = id === 3,
    diagnostic = id === 19,
    colour = id === 22 ? cobalt : "#53d7e7";
  if (wide) district(d, { count: 5, high: 4.8, colour: "#61bda2" });
  else
    for (const [x, z, w, l, h] of [
      [-7, -7, 3, 4, 4],
      [-10, -5, 3, 3, 6],
      [7, 7, 2.6, 3.6, 4.2],
      [8, -8, 4, 3, 5.4],
      [-6, 8, 3, 3, 4.2],
      [-13, 9, 4, 5, 5],
      [16, -7, 4, 4, 6],
    ]) {
      building(d, x, z, w, l, h, steel, 0.85, 0);
    }
  for (const across of [false, true]) {
    const lanes = diagnostic
      ? []
      : [[0, wide ? mint : across ? C.red : C.green, 2.5]];
    deck(
      d,
      samples(32, (t) => axial(across, mix(-35, 35, t), 0, 3)),
      1.12,
      wide ? mint : colour,
      { lanes },
    );
    for (const sign of [-1, 1]) suspension(d, across, sign, colour, wide);
  }
  for (const [y, w, h] of [
    [2.15, 4.3, 0.34],
    [2.75, 4.6, 0.36],
    [3.15, 2.05, 0.22],
  ])
    block(d, 0, 0, w, w, h, colour, 1.55, y);
  block(d, 0, 0, 1.46, 1.46, 8.3, colour, 1.35);
  block(d, 0, 0, 1.7, 1.7, 0.22, ice, 2, 8.3);
  for (const w of [1.44, 1.17, 0.89])
    block(d, 0, 0, w, w, 0.05, ice, 2.3, 8.54);
  for (const sign of [-1, 1]) {
    d.path(
      [
        [sign * 0.54, 3.35, 0.735],
        [sign * 0.54, 8.32, 0.735],
      ],
      ice,
      0.9,
    );
    d.junction([sign * 0.83, 8.52, 0.83], C.cyan);
    d.junction([sign * 2.15, 3.11, 2.15], C.cyan);
  }
  if (wide) {
    // Anchor the two-line title in the upper right of the axonometric view.
    d.label("SYSTEM", 12, 16, -13, 2.12, ice);
    d.labels.at(-1).editorial = true;
    d.label("ARCHITECTURE", 11.4, 13.3, -12.4, 2.12, mint);
    d.labels.at(-1).editorial = true;
  }
  if (diagnostic) {
    for (const [x, z, r, n, c] of [
      [-9, 0, 0.48, 12, ice],
      [6, 0, 0.42, 12, mint],
      [0, -12, 0.48, 12, mint],
      [0, 10, 0.6, 3, mint],
      [-4, 2, 0.48, 3, mint],
      [9, -6, 0.8, 12, ice],
    ]) {
      beacon(d, x, 3.9, z, r, n, c);
      d.halo([x, 3.9, z], r * 2.5, c, 0.17);
    }
    d.halo([0, 8.54, 0], 1.65, ice, 0.23);
    d.label("SYSTEM DIAGNOSTIC: ACTIVE", 0, 3, 0, 1.15, C.cyan);
    d.labels.at(-1).editorial = true;
  }
  return { eye: [35, 32, 35], target: [0, 3, 0], span: wide ? 29 : 13.6 };
}

function beacon(d, x, y, z, r, n, c) {
  for (let i = 1; i < 6; i++) {
    const a = (i * Math.PI) / 6;
    d.loop(
      samples(n, (t) => [
        x + r * Math.sin(a) * Math.cos(t * TAU),
        y + r * Math.cos(a),
        z + r * Math.sin(a) * Math.sin(t * TAU),
      ]).slice(0, -1),
      c,
      1.3,
    );
  }
  for (let i = 0; i < n; i++)
    d.path(
      samples(8, (t) => [
        x + r * Math.cos((i * TAU) / n) * Math.sin(t * Math.PI),
        y + r * Math.cos(t * Math.PI),
        z + r * Math.sin((i * TAU) / n) * Math.sin(t * Math.PI),
      ]),
      c,
      1.1,
    );
}

function motorway(d, id) {
  district(d, { count: 6, high: 7, colour: cobalt });
  const moving = id === 30;
  const eastEnd = moving ? 72 : 40;
  const routes = [];
  for (const across of [true, false])
    for (const pos of [-18, 0, 18]) {
      routes.push((t) =>
        axial(
          across,
          mix(-40, across ? eastEnd : 40, t),
          pos,
          across ? 6.7 : 5.2,
        ),
      );
    }
  const rampRoutes = new Set();
  // Tangent quarter-circle slip roads join the two levels at each end.
  for (const [x, z, sx, sz, r] of [
    [0, 0, 1, 1, 7.3],
    [0, 0, -1, -1, 10],
    [18, 0, -1, 1, 6],
    [0, -18, 1, 1, 7],
    [-18, 0, 1, -1, 6.5],
  ]) {
    const ramp = (t) => [
      x + sx * r * (1 - Math.cos((t * Math.PI) / 2)),
      mix(5.2, 6.7, t),
      z + sz * r * (1 - Math.sin((t * Math.PI) / 2)),
    ];
    routes.push(ramp);
    rampRoutes.add(ramp);
  }
  // Two signal-bearing boulevards follow the blocks at ground level, visible
  // through the gaps between elevated carriageways.
  for (const x of [-8, 8]) routes.push((t) => [x, 0.18, mix(-42, 42, t)]);
  if (moving) routes.push((t) => [36, 5.2, mix(-40, 40, t)]);
  // Extra traffic beyond the original decks has its own colour sequence.
  const extension = moving ? new Drawing(30) : null;
  const groups = [];
  const roads = routes.map((route) => {
    const points = samples(60, route);
    const len = points
      .slice(1)
      .reduce(
        (s, p, i) => s + Math.hypot(...p.map((v, j) => v - points[i][j])),
        0,
      );
    return {
      route,
      points,
      len,
      ramp:
        moving && rampRoutes.has(route) ? rampTrip(route, len, eastEnd) : null,
    };
  });
  const ramps = roads.map((road) => road.ramp).filter(Boolean);
  for (const { route, points, len, ramp } of roads) {
    deck(d, points, 0.92, "#6f9eff", {
      lanes: [
        [-0.7, cobalt, 1.15],
        [0.7, cobalt, 1.15],
        [0, ice, 0.8],
      ],
      power: 1.6,
    });
    const packets = [];
    for (let k = 0.9; k < len; k += 1.6) {
      const origin = route(k / len);
      const [x, y, z] = origin;
      const ink = moving && x > 40 ? extension : d;
      const c = [C.red, C.green, C.pink, C.yellow][
        Math.floor(ink.random() * 4)
      ];
      const radius = id === 24 ? 0.2 : 0.24;
      const line = d.positions.length,
        face = d.faces.length;
      prism(
        d,
        rect(x, z, radius * 2, radius * 2),
        y + 0.04,
        radius * 1.6,
        c,
        2,
        ink.random() > 0.55 ? 0.2 : 0.94,
      );
      if (moving)
        packets.push({
          ...packetTrip(ramps, ramp, route, len, k, origin, packets.length),
          origin,
          line,
          face,
          lineEnd: d.positions.length,
          faceEnd: d.faces.length,
          halo: d.halos.length,
        });
      d.halo([x, y + radius, z], radius * 3.4, c, 0.16);
    }
    if (moving) groups.push(packets);
    for (let k = 3; k < len; k += 7) {
      const [x, h, z] = route(k / len);
      block(d, x, z, 0.38, 0.55, h, cobalt, 0.8);
    }
  }
  const closeSpan = 20.5,
    panoramaSpan = 37;
  const view = {
    eye: [40, 48, 44],
    target: [2, 4, 2],
    span: id === 24 ? panoramaSpan : closeSpan,
  };
  if (!moving) return view;
  return {
    ...view,
    animate: transitAnimation(d, groups),
    animateSurfaces: true,
    spanAt(seconds) {
      const u = Math.min(1, Math.max(0, (seconds - 2) / 5));
      return mix(closeSpan, panoramaSpan, u * u * (3 - 2 * u));
    },
  };
}

export function city(d, id) {
  if (id <= 2 || id === 29) return avenue(d, id);
  if (id === 8) return routingPlan(d);
  if (id === 18 || id === 20) return cityGlobe(d, id);
  if ([23, 24, 30].includes(id)) return motorway(d, id);
  if (id === 26) return civicPanorama(d);
  return interchange(d, id);
}
