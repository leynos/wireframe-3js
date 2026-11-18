import { haloField } from "./phosphor.js";
import * as T from "three";
import { makePlate } from "./plates.js";

const lineVertex = `
attribute float stroke;
#ifdef AVENUE_FLIGHT
attribute vec2 horizon;
uniform float drawDistance;
varying float arrival;
#endif
varying float travel;
varying vec3 light;
uniform float attenuation;
void main(){
  #ifdef AVENUE_FLIGHT
  arrival=(drawDistance - (cameraPosition.z-horizon.x))/14. - horizon.y;
  #endif
  travel=stroke;
  light=color;
  vec4 view=modelViewMatrix*vec4(position,1.);
  light*=.045+.955*exp(-attenuation*length(view.xyz));
  gl_Position=projectionMatrix*view;
}`;
const lineFragment = `
#ifdef AVENUE_FLIGHT
varying float arrival;
#endif
varying float travel;
varying vec3 light;
uniform float scan;
uniform float transmission;
void main(){
  if(travel>scan) discard;
  float hot=1.-smoothstep(0.,.009,scan-travel);
  #ifdef AVENUE_FLIGHT
  if(arrival<0.) discard;
  hot=max(hot, .88*(1.-smoothstep(0.,.12,arrival)));
  #endif
  gl_FragColor=vec4((light*(.73+1.7*hot)+vec3(.22*hot))*transmission,1.);
}`;
// Sample the beam buffer in screen space. Additive crossings feed both halo radii.
const glassFragment = `
uniform sampler2D beams;
uniform vec2 pixel;
uniform float glow;
uniform float wideBloom;
varying vec2 uvScreen;
void main(){
  vec2 centered=uvScreen*2.-1.;
  vec2 uv=.5+.5*centered*(1.+.021*dot(centered,centered));
  vec3 core=texture2D(beams,uv).rgb, halo=vec3(0.);
  for(int i=0;i<8;i++){
    float a=float(i)*.785398;
    vec2 delta=vec2(cos(a),sin(a))*pixel;
    halo+=texture2D(beams,uv+delta*1.5).rgb*.13;
    halo+=texture2D(beams,uv+delta*3.5).rgb*.085;
    halo+=texture2D(beams,uv+delta*6.5).rgb*.038;
  }
  // Coarser levels average progressively wider areas of the actual beams.
  // Retain the fine lattice and allow the bright knots to spill across it.
  if(wideBloom*glow>0.){
    halo+=wideBloom*(textureLod(beams,uv,2.7).rgb*1.55+textureLod(beams,uv,4.2).rgb*1.7);
  }
  float vignette=1.-.19*dot(centered,centered);
  vec3 rgb=(core+glow*halo*.32)*vignette;
  vec3 bg=vec3(.0014,.003,.006)+vec3(.0005,.0015,.0025)*vignette;
  float inside=step(0.,uv.x)*step(uv.x,1.)*step(0.,uv.y)*step(uv.y,1.);
  gl_FragColor=vec4(bg+inside*rgb,1.);
  #include <colorspace_fragment>
}`;

function labelSprite(label) {
  const canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");
  const font =
    label.font ??
    (label.editorial ? "bold 48px sans-serif" : "600 48px monospace");
  ctx.font = font;
  canvas.width = Math.ceil(ctx.measureText(label.text).width) + 16;
  canvas.height = 64;
  ctx.font = font;
  if (label.editorial) {
    ctx.fillStyle = "#040911";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.fillStyle = label.colour;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label.text, canvas.width / 2, 32);
  const map = new T.CanvasTexture(canvas);
  map.colorSpace = T.SRGBColorSpace;
  const sprite = label.surface
    ? new T.Mesh(
        new T.PlaneGeometry(1, 1),
        new T.MeshBasicMaterial({ map, transparent: true, depthWrite: false }),
      )
    : new T.Sprite(new T.SpriteMaterial({ map, depthTest: false }));
  if (label.surface) sprite.rotation.y = label.yaw ?? 0;
  sprite.renderOrder = 2;
  sprite.position.set(label.x, label.y, label.z);
  sprite.scale.set((label.size * canvas.width) / 48, (label.size * 64) / 48, 1);
  return sprite;
}

export class PlateRenderer {
  constructor(canvas, id) {
    this.gpu = new T.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    this.buffer = new T.WebGLRenderTarget(1, 1, { depthBuffer: true });
    this.buffer.samples = Math.min(4, this.gpu.capabilities.maxSamples);
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(45, 1, 0.1, 300);
    this.glass = new T.ShaderMaterial({
      uniforms: {
        beams: { value: this.buffer.texture },
        pixel: { value: new T.Vector2() },
        glow: { value: 1 },
        wideBloom: { value: 0 },
      },
      vertexShader:
        "varying vec2 uvScreen; void main(){uvScreen=uv; gl_Position=vec4(position.xy,0.,1.);}",
      fragmentShader: glassFragment,
      depthTest: false,
      depthWrite: false,
    });
    this.screen = new T.Mesh(new T.PlaneGeometry(2, 2), this.glass);
    this.screen.frustumCulled = false;
    this.setPlate(id);
  }
  clearScene() {
    for (const obj of [...this.scene.children]) {
      this.scene.remove(obj);
      if (!obj.userData.sharedGeometry) obj.geometry?.dispose();
      obj.material.map?.dispose();
      obj.material.dispose();
    }
  }
  setPlate(id) {
    this.clearScene();
    const {
      d,
      eye,
      target,
      fov,
      span,
      spanAt,
      animateSurfaces,
      animate,
      pulse,
      flightCamera,
      horizon,
      wideBloom = 1,
    } = makePlate(id);
    this.flightCamera = flightCamera;
    this.halos = null;
    this.updatePulse = null;
    const hasHalos = d.halos.length > 0;
    this.glass.uniforms.wideBloom.value = hasHalos ? wideBloom : 0;
    if (this.buffer.texture.generateMipmaps !== hasHalos) {
      this.buffer.dispose();
      this.buffer.texture.generateMipmaps = hasHalos;
      this.buffer.texture.minFilter = hasHalos
        ? T.LinearMipmapLinearFilter
        : T.LinearFilter;
    }
    this.span = span;
    this.spanAt = spanAt;
    let facePositions;
    this.camera = span
      ? new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 320)
      : new T.PerspectiveCamera(45, 1, 0.1, 320);
    if (d.faces.length) {
      const faces = new T.BufferGeometry();
      facePositions = new T.Float32BufferAttribute(d.faces, 3);
      if (animateSurfaces) facePositions.setUsage(T.DynamicDrawUsage);
      faces.setAttribute("position", facePositions);
      // Draw only depth so distant roads and hidden building edges disappear.
      const mask = new T.MeshBasicMaterial({
        colorWrite: false,
        side: T.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 2,
      });
      this.scene.add(new T.Mesh(faces, mask));
    }
    this.eye = eye;
    this.target = target;
    this.fov = fov;
    const geom = new T.BufferGeometry();
    const position = new T.Float32BufferAttribute(d.positions, 3);
    this.animate = animate
      ? (seconds) =>
          animate(
            position,
            seconds,
            facePositions,
            this.halos?.geometry.attributes.position,
          )
      : null;
    if (animate) position.setUsage(T.DynamicDrawUsage);
    geom.setAttribute("position", position);
    geom.setAttribute("color", new T.Float32BufferAttribute(d.colours, 3));
    geom.setAttribute(
      "stroke",
      new T.Float32BufferAttribute(
        d.times.map((t) => t / d.length),
        1,
      ),
    );
    if (horizon)
      geom.setAttribute("horizon", new T.BufferAttribute(horizon, 2));
    this.beam = new T.ShaderMaterial({
      defines: flightCamera ? { AVENUE_FLIGHT: 1 } : {},
      vertexShader: lineVertex,
      fragmentShader: lineFragment,
      uniforms: {
        scan: { value: 0 },
        transmission: { value: 1 },
        drawDistance: { value: 165 },
        attenuation: {
          value: id <= 2 || flightCamera ? 0.023 : 0.006,
        },
      },
      vertexColors: true,
      transparent: true,
      blending: T.AdditiveBlending,
      depthTest: Boolean(d.faces.length),
      depthWrite: false,
    });
    this.scene.add(new T.LineSegments(geom, this.beam));
    // The avenue towers, threshold frame and interchange pylons transmit light.
    // Reuse the traced segments for a faint return from behind their faces.
    if ([1, 2, 3, 4, 19, 22, 29].includes(id)) {
      const throughGlass = this.beam.clone();
      throughGlass.uniforms.drawDistance = this.beam.uniforms.drawDistance;
      throughGlass.depthFunc = T.GreaterDepth;
      throughGlass.uniforms.scan = this.beam.uniforms.scan;
      throughGlass.uniforms.transmission.value =
        id === 4 ? 0.36 : id <= 2 || flightCamera ? 0.075 : 0.08;
      const underdrawing = new T.LineSegments(geom, throughGlass);
      underdrawing.userData.sharedGeometry = true;
      this.scene.add(underdrawing);
    }
    if (d.junctions.length) {
      const sparks = new T.BufferGeometry();
      sparks.setAttribute(
        "position",
        new T.Float32BufferAttribute(
          d.junctions.flatMap((j) => j.point),
          3,
        ),
      );
      sparks.setAttribute(
        "color",
        new T.Float32BufferAttribute(
          d.junctions.flatMap((j) => new T.Color(j.colour).toArray()),
          3,
        ),
      );
      sparks.setAttribute(
        "stroke",
        new T.Float32BufferAttribute(
          d.junctions.map((j) => j.at / d.length),
          1,
        ),
      );
      const phosphor = new T.ShaderMaterial({
        vertexColors: true,
        uniforms: this.beam.uniforms,
        transparent: true,
        blending: T.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        defines: this.beam.defines,
        vertexShader: `attribute float stroke; uniform float scan,drawDistance; varying vec3 tint;
          void main(){tint=stroke<=scan?color:vec3(0.);vec4 p=modelViewMatrix*vec4(position,1.);
          #ifdef AVENUE_FLIGHT
          tint*=smoothstep(0.,6.,drawDistance-(cameraPosition.z-position.z));
          #endif
          gl_PointSize=clamp(130./max(1.,-p.z),4.,15.);gl_Position=projectionMatrix*p;}`,
        fragmentShader: `varying vec3 tint;void main(){vec2 p=gl_PointCoord-.5;
          float r=dot(p,p);gl_FragColor=vec4(tint*(exp(-35.*r)*.42+exp(-185.*r)),1.);}`,
      });
      this.scene.add(new T.Points(sparks, phosphor));
    }
    if (hasHalos) {
      this.halos = haloField(d, this.beam.uniforms.scan);
      if (animateSurfaces)
        this.halos.geometry.attributes.position.setUsage(T.DynamicDrawUsage);
      this.scene.add(this.halos);
    }
    if (pulse) {
      const emitter = {
        ...pulse,
        center: [0, 0, 0],
        ring: 0,
        at: d.times[pulse.vertex],
      };
      const bloom = haloField(d, this.beam.uniforms.scan, [emitter]);
      bloom.material.depthTest = true;
      this.scene.add(bloom);
      const tail = new T.Vector3();
      this.updatePulse = (glow) => {
        tail.fromBufferAttribute(position, pulse.vertex);
        const head = bloom.position.fromBufferAttribute(
          position,
          pulse.vertex + 1,
        );
        // Inactive tracers collapse to a point during the reply.
        const length = head.distanceTo(tail);
        bloom.visible = glow && length > 0.001;
        head.lerp(tail, 0.3);
      };
    }
    this.labels = d.labels.map((l) => {
      const sprite = labelSprite(l);
      this.scene.add(sprite);
      return { sprite, at: l.at / d.length };
    });
  }
  size(w, h) {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75, 1800 / w);
    this.gpu.setPixelRatio(ratio);
    this.gpu.setSize(w, h, false);
    const width = this.gpu.domElement.width,
      height = this.gpu.domElement.height;
    this.buffer.setSize(width, height);
    this.glass.uniforms.pixel.value.set(1 / width, 1 / height);
    this.aspect = w / h;
  }
  draw(t, scan, glow, secondsAfterScan = Infinity) {
    this.animate?.(secondsAfterScan);
    this.updatePulse?.(glow);
    if (this.halos) {
      this.halos.visible = glow;
      this.halos.material.uniforms.time.value = t;
    }
    for (const obj of this.scene.children) if (obj.isPoints) obj.visible = glow;
    if (this.flightCamera) {
      this.beam.uniforms.drawDistance.value = this.flightCamera(
        Number.isFinite(secondsAfterScan) ? secondsAfterScan : 0,
        this.camera,
      );
    } else {
      const [x, y, z] = this.eye,
        drift = Math.sin(t * 0.16) * 0.012;
      const dx = x - this.target[0],
        dz = z - this.target[2];
      this.camera.position.set(
        x + dz * drift,
        y + 0.04 * Math.sin(t * 0.21),
        z - dx * drift,
      );
      this.camera.lookAt(...this.target);
    }
    this.camera.aspect = this.aspect;
    if (this.span) {
      const half =
        (this.spanAt ? this.spanAt(secondsAfterScan) : this.span) *
        0.5 *
        Math.max(1, 1.65 / this.aspect);
      this.camera.top = half;
      this.camera.bottom = -half;
      this.camera.right = half * this.aspect;
      this.camera.left = -this.camera.right;
    }
    this.camera.fov =
      (2 *
        Math.atan(
          Math.tan((this.fov * Math.PI) / 360) *
            Math.max(1, 1.65 / this.camera.aspect),
        ) *
        180) /
      Math.PI;
    this.camera.updateProjectionMatrix();
    this.beam.uniforms.scan.value = scan;
    this.labels.forEach(({ sprite, at }) => {
      sprite.visible = scan >= at;
    });
    this.glass.uniforms.glow.value = glow ? 1 : 0;
    this.gpu.setRenderTarget(this.buffer);
    this.gpu.render(this.scene, this.camera);
    this.gpu.setRenderTarget(null);
    this.gpu.render(this.screen, this.camera);
  }
  dispose() {
    this.clearScene();
    this.buffer.dispose();
    this.screen.geometry.dispose();
    this.glass.dispose();
    this.gpu.dispose();
    this.gpu.forceContextLoss();
  }
}
