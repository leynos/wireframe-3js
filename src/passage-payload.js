import * as T from "three";
import { haloField } from "./phosphor.js";

// Give the payload its own pen clock so a replacement can be traced while
// the passage stays lit. Its vertices occupy the last strokes of the plate.
export function passagePayload(
  scene,
  drawing,
  { firstVertex, halo },
  geometry,
  beam,
) {
  geometry.setDrawRange(0, firstVertex);
  const wire = new T.BufferGeometry();
  const center = new T.Vector3(...halo.center);
  const firstStroke = drawing.times[firstVertex] / drawing.length;
  wire.setAttribute(
    "position",
    new T.Float32BufferAttribute(drawing.positions.slice(firstVertex * 3), 3),
  );
  wire.translate(-center.x, -center.y, -center.z);
  wire.setAttribute(
    "color",
    new T.Float32BufferAttribute(drawing.colours.slice(firstVertex * 3), 3),
  );
  wire.setAttribute(
    "stroke",
    new T.Float32BufferAttribute(
      drawing.times
        .slice(firstVertex)
        .map((t) => (t / drawing.length - firstStroke) / (1 - firstStroke)),
      1,
    ),
  );
  const material = beam.clone();
  // The opaque depth mask closes the throat. Let the signal transmit through
  // the barrel as it recedes, with the blue ribs still visible across it.
  material.depthTest = false;
  const cube = new T.LineSegments(wire, material);
  const glow = haloField(drawing, { value: 1.02 }, [
    { ...halo, center: [0, 0, 0], at: 0 },
  ]);
  scene.add(cube, glow);
  const flight = 2.8,
    paint = 1.35,
    hold = 0.32;
  return (seconds, scan, enabled, time) => {
    const t = Number.isFinite(seconds) ? seconds : 0;
    // The initial visibility scan already drew the first payload.
    const phase = (t + paint) % (paint + hold + flight);
    const u = Math.max(0, (phase - paint - hold) / flight);
    const progress = u * u;
    // Compensate for perspective compression near the far end so the
    // apparent motion continues accelerating all the way to the last bay.
    const depth = (60 * progress) / (4.6 - 3.6 * progress);
    const size = 1 - T.MathUtils.smoothstep(progress, 0.75, 1);
    const ink =
      scan < 1 ? (scan - firstStroke) / (1 - firstStroke) : phase / paint;
    cube.position.copy(center);
    cube.position.z -= depth;
    cube.scale.setScalar(size);
    cube.visible = ink > 0 && size > 0;
    material.uniforms.scan.value = ink >= 1 ? 1.02 : ink;
    material.uniforms.transmission.value =
      1 - 0.48 * T.MathUtils.smoothstep(depth, 1, 8);
    glow.position.copy(cube.position);
    glow.visible = enabled && cube.visible;
    glow.material.uniforms.time.value = time;
    // The halo shader sizes its quad in view space. Its reveal uniform lets
    // the light accumulate with the fresh strokes and die out at the far end.
    glow.material.uniforms.scan.value =
      -0.002 + 0.02 * T.MathUtils.clamp(ink, 0, 1) * size;
  };
}
