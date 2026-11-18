// Recycle each lane only after the cubes have passed below the camera.
const horizon = -109,
  speed = 3.2,
  paintDistance = speed * 1.2;

export function queueMotion(d, packets, period) {
  let previous = 0;
  return (lines, seconds, faces, centers, profiles) => {
    const time = Number.isFinite(seconds) ? seconds : 0;
    if (time === previous) return;
    previous = time;
    for (const p of packets) {
      const travelled = p.z - horizon + speed * time;
      const distance = travelled % period;
      const dz = horizon + distance - p.z;
      // The first generation is painted by the scene-wide visibility scan.
      const ink =
        travelled < period ? 1 : Math.min(1, distance / paintDistance);
      const from = d.times[p.line / 3],
        to = d.times[p.end / 3 - 1];
      const pen = from + (to - from) * ink;
      for (let i = p.line; i < p.end; i += 6) {
        const progress =
          ink === 1
            ? 1
            : Math.max(
                0,
                Math.min(
                  1,
                  (pen - d.times[i / 3]) /
                    (d.times[i / 3 + 1] - d.times[i / 3]),
                ),
              );
        lines.array[i + 2] = d.positions[i + 2] + dz;
        for (let axis = 0; axis < 3; axis++) {
          const a = d.positions[i + axis],
            b = d.positions[i + 3 + axis];
          lines.array[i + 3 + axis] =
            a + (b - a) * progress + (axis === 2 ? dz : 0);
        }
      }
      // Delay the invisible depth mask until the outline closes.
      for (let i = p.face + 2; i < p.faceEnd; i += 3)
        faces.array[i] = ink === 1 ? d.faces[i] + dz : 20;
      const { center, power } = d.halos[p.halo];
      for (let i = p.halo * 6; i < (p.halo + 1) * 6; i++) {
        centers.setZ(i, center[2] + dz);
        profiles.setZ(i, power * ink);
      }
    }
    lines.needsUpdate =
      faces.needsUpdate =
      centers.needsUpdate =
      profiles.needsUpdate =
        true;
  };
}
