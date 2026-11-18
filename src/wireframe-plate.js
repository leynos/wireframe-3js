import { catalog } from "./catalog.js";
import { PlateRenderer } from "./renderer.js";

const SCAN_SECONDS = 3.2;

class WireframePlate extends HTMLElement {
  static observedAttributes = ["plate", "paused", "low-glow"];
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML =
      '<style>:host{display:block;position:relative;aspect-ratio:16/9;background:#040911;overflow:hidden}canvas,slot{position:absolute;inset:0;width:100%;height:100%}::slotted(img){width:100%;height:100%;object-fit:cover}canvas[hidden]{display:none}</style><slot></slot><canvas hidden aria-hidden="true"></canvas>';
    this.canvas = root.querySelector("canvas");
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
    this.clock = 0;
    this.scanTime = 0;
  }
  connectedCallback() {
    this.canvas.addEventListener("webglcontextlost", this.lost);
    this.canvas.addEventListener("webglcontextrestored", this.restored);
    this.intersection = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.schedule();
    });
    this.intersection.observe(this);
    this.resize = new ResizeObserver(() => {
      this.resized = true;
      this.schedule();
    });
    this.resize.observe(this);
    document.addEventListener("visibilitychange", this.schedule);
    this.reduced.addEventListener("change", this.schedule);
    this.setPlate();
  }
  lost = (e) => {
    e.preventDefault();
    this.failed = true;
    this.canvas.hidden = true;
    this.state("fallback");
    this.schedule();
  };
  restored = () => {
    this.failed = false;
    this.resized = true;
    this.schedule();
  };
  setPlate() {
    const id = this.getAttribute("plate") ?? "01";
    this.plate = catalog.find((p) => p.id === id.padStart(2, "0"));
    this.canvas.hidden = true;
    if (
      this.plate &&
      !this.hasAttribute("aria-labelledby") &&
      !this.hasAttribute("aria-hidden")
    ) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", this.plate.caption);
    }
    this.dirty = true;
    this.replay();
  }
  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "plate") this.setPlate();
    else this.schedule();
  }
  replay() {
    this.scanTime = 0;
    this.clock = 0;
    this.schedule();
  }
  state(value) {
    if (this.dataset.state === value) return;
    this.dataset.state = value;
    this.dispatchEvent(new CustomEvent("plate-state", { detail: value }));
  }
  schedule = () => {
    cancelAnimationFrame(this.frame);
    this.last = null;
    if (!this.plate || this.failed) {
      this.state("fallback");
      return;
    }
    if (this.isConnected && this.visible && !document.hidden)
      this.frame = requestAnimationFrame(this.tick);
  };
  tick = (now) => {
    const w = this.clientWidth,
      h = this.clientHeight;
    if (!w || !h) return;
    try {
      if (!this.renderer) {
        this.renderer = new PlateRenderer(this.canvas, +this.plate.id);
        this.dirty = false;
        this.resized = true;
      }
      if (this.dirty) {
        this.renderer.setPlate(+this.plate.id);
        this.dirty = false;
      }
      if (this.resized) {
        this.renderer.size(w, h);
        this.resized = false;
      }
    } catch (error) {
      console.warn("Vector plate unavailable", error);
      this.failed = true;
      this.canvas.hidden = true;
      this.state("fallback");
      return;
    }
    if (this.last !== null && now - this.last < 1000 / 30 - 1) {
      this.frame = requestAnimationFrame(this.tick);
      return;
    }
    const dt =
      this.last === null ? 0 : Math.min(0.25, (now - this.last) / 1000);
    const paused = this.hasAttribute("paused"),
      reduced = this.reduced.matches;
    if (reduced) this.scanTime = SCAN_SECONDS;
    else if (!paused) {
      this.clock += dt;
      this.scanTime += dt;
    }
    const progress = Math.min(1, this.scanTime / SCAN_SECONDS);
    this.renderer.draw(
      reduced ? 0 : this.clock,
      progress === 1 ? 1.02 : progress,
      this.hasAttribute("low-glow") === false,
      reduced ? Infinity : Math.max(0, this.clock - SCAN_SECONDS),
    );
    this.canvas.hidden = false;
    this.state(
      reduced
        ? "still"
        : paused
          ? "paused"
          : progress === 1
            ? "stable"
            : "scanning",
    );
    this.last = now;
    if (!reduced && !paused) this.frame = requestAnimationFrame(this.tick);
  };
  disconnectedCallback() {
    cancelAnimationFrame(this.frame);
    this.visible = false;
    this.intersection.disconnect();
    this.resize.disconnect();
    document.removeEventListener("visibilitychange", this.schedule);
    this.reduced.removeEventListener("change", this.schedule);
    this.canvas.removeEventListener("webglcontextlost", this.lost);
    this.canvas.removeEventListener("webglcontextrestored", this.restored);
    this.renderer?.dispose();
    this.renderer = null;
    this.failed = false;
    // A fresh canvas owns the next context if the element is reinserted.
    const fresh = this.canvas.cloneNode(false);
    fresh.hidden = true;
    this.canvas.replaceWith(fresh);
    this.canvas = fresh;
  }
}
if (!customElements.get("wireframe-plate"))
  customElements.define("wireframe-plate", WireframePlate);
