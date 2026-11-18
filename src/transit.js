// A ramp starts tangent to a north/south deck and exits onto an east/west
// deck. Continue to the edge of the city before wrapping a packet around.
export function rampTrip(route, length, eastEnd) {
  const start = route(0),
    end = route(1);
  const sx = Math.sign(end[0] - start[0]),
    sz = Math.sign(start[2] - end[2]);
  const approach = 40 - sz * start[2];
  const exit = sx * ((sx > 0 ? eastEnd : -40) - end[0]);
  return {
    start,
    end,
    sx,
    sz,
    approach,
    length,
    total: approach + length + exit,
    point(distance) {
      if (distance < approach)
        return [start[0], start[1], sz * (40 - distance)];
      const along = distance - approach;
      if (along <= length) return route(along / length);
      return [end[0] + sx * (along - length), end[1], end[2]];
    },
  };
}

// Some packets already on an approach or exit belong to the same stream as
// the ramp traffic. Their initial positions still match the source plate.
export function packetTrip(
  ramps,
  ramp,
  route,
  length,
  distance,
  origin,
  ordinal,
) {
  if (ramp) return { path: ramp, offset: ramp.approach + distance };
  const [x, y, z] = origin;
  const choices = [];
  for (const r of ramps) {
    if (x === r.start[0] && y === r.start[1] && r.sz * (z - r.start[2]) >= 0)
      choices.push({ path: r, offset: 40 - r.sz * z });
    if (z === r.end[2] && y === r.end[1] && r.sx * (x - r.end[0]) >= 0)
      choices.push({
        path: r,
        offset: r.approach + r.length + r.sx * (x - r.end[0]),
      });
  }
  if (choices.length && ordinal % 3 === 0)
    return choices[Math.floor(ordinal / 3) % choices.length];
  return {
    path: { total: length, point: (s) => route(s / length) },
    offset: distance,
  };
}

function translate(original, buffer, begin, end, dx, dy, dz) {
  for (let i = begin; i < end; i += 3) {
    buffer[i] = original[i] + dx;
    buffer[i + 1] = original[i + 1] + dy;
    buffer[i + 2] = original[i + 2] + dz;
  }
}

export function transitAnimation(d, groups) {
  let previous = 0;
  return (lines, seconds, faces, halos) => {
    const t = Number.isFinite(seconds) ? seconds : 0;
    if (t === previous) return;
    previous = t;
    for (const packets of groups) {
      for (const p of packets) {
        const [x, y, z] = p.path.point((p.offset + t * 1.45) % p.path.total);
        const dx = x - p.origin[0],
          dy = y - p.origin[1],
          dz = z - p.origin[2];
        translate(d.positions, lines.array, p.line, p.lineEnd, dx, dy, dz);
        translate(d.faces, faces.array, p.face, p.faceEnd, dx, dy, dz);
        const center = d.halos[p.halo].center;
        for (let j = 0; j < 6; j++)
          halos.setXYZ(
            p.halo * 6 + j,
            center[0] + dx,
            center[1] + dy,
            center[2] + dz,
          );
      }
      const first = packets[0],
        last = packets.at(-1);
      lines.addUpdateRange(first.line, last.lineEnd - first.line);
      faces.addUpdateRange(first.face, last.faceEnd - first.face);
    }
    lines.needsUpdate = faces.needsUpdate = halos.needsUpdate = true;
  };
}
