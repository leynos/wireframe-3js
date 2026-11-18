# Wireframe vector plates

Thirty embeddable Three.js illustrations for the Wireframe Rust binary-protocol library. The first 26 plates each reinterpret the correspondingly numbered screenshot in `reference/`, in filename order. Plates 27 and 28 recreate the routing hero and “Complexity, reduced” figure from the [Wireframe preview](https://leynos.github.io/wireframe-www/). Open either directly with `?plate=27` or `?plate=28`, or embed it using the same numbered custom element. Plate 29 combines Signal avenue and Street level into a continuous flight. Open it with `?plate=29`. Plate 30 animates packets through City in transit and pulls back to the Network panorama framing. Open it with `?plate=30`. The gallery groups the reference plates into the four movements from the visual identity. Its diagrams and instruments are concept artwork.

[Open the live signal atlas](https://leynos.github.io/wireframe-3js/) · [Plate archive](https://leynos.github.io/wireframe-3js/archive.html)

## Run the gallery

With Node.js 22 or later, npm and Make installed, run:

```sh
make dev
```

Open <http://localhost:5173>. Set `PORT` to change the port. The development server rebuilds the modules when the source changes. The atlas opens on plate 29 and lists 23 current plates. The linked archive at `archive.html` holds the seven retired plates with their original embed IDs. Select a plate or filter either index by movement. The viewer has controls for pause, scan replay and phosphor glow.

## Publish to GitHub Pages

Run `make pages` after changing the gallery or scenes. Commit the generated `index.html`, `archive.html` and `assets/` alongside the source changes, then push to `main`. GitHub Pages serves the repository root with `.nojekyll` and uses the styles and posters in `demo/`.

## Embed a plate in a static site

Run `make build`. Copy `dist/wireframe-plate.js` and the desired WebP stills from `dist/posters/` into the site's static assets. The module includes Three.js. A production embed only needs that module and its chosen poster. The demo stylesheet and gallery script belong to the gallery.

For a Jinja template, pass `plate_assets` as the public URL of the copied asset directory, including any site base path. Load the module once in the layout:

```html
<script type="module" src="{{ plate_assets }}/wireframe-plate.js"></script>
```

Use the existing semantic figure class and supply an accessible caption:

```html
<figure class="wf-plate">
  <wireframe-plate plate="01" aria-labelledby="avenue-caption">
    <img src="{{ plate_assets }}/posters/01.webp"
         width="929" height="494" alt="">
  </wireframe-plate>
  <figcaption id="avenue-caption">
    Signal avenue. A central route connects a series of green crossings.
  </figcaption>
</figure>
```

Give each caption a unique ID. For a decorative backdrop, set `aria-hidden="true"` on the plate instead. To reserve space even before JavaScript loads, add the following to the host site's component layer:

```css
@layer components {
  .wf-plate wireframe-plate {
    display: block;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }
  .wf-plate wireframe-plate > img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
```

## Playback

- `plate` selects a scene from `01` to `30`. The demo index provides its title, movement and caption.
- On first intersection with the viewport, the beam traces the geometry over roughly 3.2 seconds of visible playback. The camera then continues its gentle drift. Scrolling away or hiding the tab suspends playback. Returning resumes the same trace.
- `element.replay()` restarts the trace. Changing `plate` also starts a new trace. Update the child poster and caption when switching plates in a template-controlled viewer.
- The boolean `paused` attribute freezes playback. The boolean `low-glow` attribute suppresses the halo and junction flares. Reduced-motion visitors see the completed scene immediately with a fixed camera.
- The element emits `plate-state` with a string in `event.detail` and reflects it to `data-state`. Values are `scanning`, `stable`, `paused`, `still` (reduced motion) and `fallback`. The slotted still covers unavailable WebGL and context loss, and works with JavaScript disabled.

The renderer draws three-dimensional line segments in stroke order into an additive beam buffer. A screen-space pass samples neighbouring light, bends the field and softens the edges of the glass. Labels inside the technical illustrations belong to the artwork. Keep essential explanations in the surrounding HTML.
