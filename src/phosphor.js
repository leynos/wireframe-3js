import * as T from "three";

// Soft phosphor halos in the beam buffer. Camera-facing quads keep their world
// size at every viewport and reveal at the same scan position as the emitter.
export function haloField(d, scan, emitters = d.halos) {
  const centers = [],
    corners = [],
    profiles = [],
    colors = [];
  for (const { center, radius, ring, power, at, color } of emitters) {
    const tint = new T.Color(color);
    for (const [u, v] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      centers.push(...center);
      corners.push(u, v);
      profiles.push(radius, ring, power, at / d.length);
      colors.push(...tint.toArray());
    }
  }
  const geometry = new T.BufferGeometry();
  for (const [name, values, size] of [
    ["position", centers, 3],
    ["corner", corners, 2],
    ["profile", profiles, 4],
    ["color", colors, 3],
  ]) {
    geometry.setAttribute(name, new T.Float32BufferAttribute(values, size));
  }
  const material = new T.ShaderMaterial({
    uniforms: { scan, time: { value: 0 } },
    vertexColors: true,
    transparent: true,
    blending: T.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    vertexShader: `attribute vec2 corner; attribute vec4 profile;
    uniform float scan,time; varying vec2 uvHalo; varying vec3 tint; varying float rim;
    void main(){
      uvHalo=corner; rim=profile.y;
      float reveal=smoothstep(-.002,.018,scan-profile.w);
      tint=color*profile.z*reveal*(.94+.06*sin(time*.7+profile.x));
      vec4 view=modelViewMatrix*vec4(position,1.);
      view.xy+=corner*profile.x; gl_Position=projectionMatrix*view;
    }`,
    fragmentShader: `varying vec2 uvHalo; varying vec3 tint; varying float rim;
    void main(){
      float r=length(uvHalo);
      float fog=exp(-5.*r*r)+.7*exp(-32.*r*r);
      if(rim>0.)fog=.68*exp(-120.*(r-rim)*(r-rim))+.16*exp(-2.6*r*r);
      gl_FragColor=vec4(tint*fog*(1.-smoothstep(.82,1.,r)),1.);
    }`,
  });
  const mesh = new T.Mesh(geometry, material);
  mesh.frustumCulled = false;
  return mesh;
}

// Pose a contiguous batch of traced lines from its rest coordinates. The city
// and tunnel retain their fixed geometry while the shell turns around them.
export function turnShell(
  original,
  output,
  begin,
  end,
  angle,
  zCenter,
  scale = 1,
) {
  const c = Math.cos(angle),
    s = Math.sin(angle);
  for (let i = begin; i < end; i += 3) {
    const x = original[i],
      z = original[i + 2] - zCenter;
    output[i] = scale * (x * c + z * s);
    output[i + 1] = scale * original[i + 1];
    output[i + 2] = zCenter + scale * (z * c - x * s);
  }
}
