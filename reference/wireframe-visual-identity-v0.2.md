# Wireframe | Visual identity and design language

**Version 0.2 · Revised concept specification · 18 November 2026**  
**Visual authority:** *Wireframe: The Common Signal*, 36-page mood book, 17 November 2026  
**Creative thesis:** *Make the invisible protocol legible. What we connect, we should understand.*

Wireframe's visual world joins the geometry of early-1980s **X-Y vector arcade displays** to the patient, optimistic storytelling of a **California Bay Area public-television documentary about civil engineering and the common good**. Roads become channels. Interchanges become routing decisions. Gauges reveal finite capacity. Diagnostic traces make maintenance visible. An engineered system becomes a place a viewer can explore and understand.

This is not a claim that Wireframe operates municipal infrastructure. It is an editorial method for explaining a Rust binary-protocol library. A city is the *metaphor*; frames, codecs, routes, budgets and connection lifecycles are the *subject*.

> **Identity principle:** A public service in phosphor and perspective. Make connections visible, crossings purposeful, limits intelligible, and maintenance ordinary. Keep the spectacle in the image and the precision in the explanation.

The mood book supplies the authoritative **art direction, narrative register, seven-colour palette and four-part visual progression**. This specification translates that direction into website, documentation, identity and interface guidance. Its code samples, component dimensions, fonts, implementation tokens and proposed logo work remain subject to independent technical and production validation.

## 0. What changed from version 0.1

| Area | Earlier concept | Revised direction |
| --- | --- | --- |
| Governing metaphor | Engineering laboratory meets green vector arcade | **Civic infrastructure documentary**: the city as a legible network and maintenance as a public virtue |
| Primary field | Deep green-black | **Near-black void** with midnight-blue supporting surfaces |
| Chromatic hierarchy | Mint primary, cyan secondary, amber traffic, rare magenta | **Cobalt structure, cyan signal, green flow, magenta capacity, red halt, yellow notice**, all against the void |
| Composition | Mostly isolated routes, framed panels and product diagrams | **Large urban perspectives**, orthographic grids, purposeful junctions, followed by diagrams, gauges and civic-scale context |
| Tone | Exploratory developer tool | **Warm, exact, curious and restrained**; explanatory documentary rather than cyberpunk spectacle |
| Logotype status | Prior constructed lowercase mint concept treated as the defining form | **Still a candidate**, not established by the mood book; bold uppercase documentary titling is a separate, demonstrable treatment |
| Motion | Beam-trace emphasis | **Patient camera movement, deliberate reveals and long holds** in editorial media; limited, responsive motion in working interfaces |
| Evidence | Concept art paired with API explanations | **Explicit distinction** between illustrated RFC/proposal imagery and verified product behaviour |

The underlying technical definitions, code-verification policy and accessibility obligations from version 0.1 remain in force unless a revised section explicitly changes their presentation.

## 1. Product truth and scope

**Wireframe is a Rust library for building asynchronous servers and clients that communicate using arbitrary frame-based binary wire protocols.** The existing technical reference describes a transport-facing `FrameCodec`, routable `Envelope` / `Packet` abstractions, message IDs and optional correlation IDs, serialization adapters, a `WireframeApp` route registry, middleware, connection lifecycle management, fragmentation, message assembly, streaming and back-pressure. The API takes inspiration from Actix Web's ergonomics, but Wireframe is **not an HTTP router**.

The editorial narrative should make these concepts comprehensible without recasting the library as a smart-city platform, network operations centre, infrastructure-as-code product, Kubernetes operator, or cloud-hosting service. “Configuration as code” means declarative Rust composition of codecs, routes, handlers, middleware, budgets and client options, **not** YAML deployment manifests.

| Product concept | Real meaning | Civic/vector treatment |
| --- | --- | --- |
| Bytes on a wire | Binary transport input/output | Discrete pulses travelling along a clearly marked conduit |
| Frame | A transport unit emitted/consumed by `FrameCodec` | An enclosing contour or gated section of a channel |
| Fragment | A bounded subdivision of a larger payload | Numbered sections travelling in order, shown reassembling only when applicable |
| Envelope | Routable `id`, optional `correlation_id`, payload | A labelled header band enclosing the carried data |
| Router | Selection by message ID | An interchange with a single highlighted chosen exit |
| Handler | Application function selected by a route | A named terminal, facility or destination |
| Middleware | Cross-cutting request/response work | Ordered checkpoints or control planes, with entry and exit identified |
| Streaming/back-pressure | Incremental data and bounded consumption | Metered pulses passing along a constrained channel |
| Connection lifecycle | Establishment, activity and closure | A route opened, operated and then deliberately closed |
| Resource budget | A bounded allocation, with scope defined by the actual API | A labelled gauge and explicit limit, never a decorative percentage |
| Observability | Inspection of actual states, traces or diagnostics | A legible status instrument with labelled source and units |

These mappings are **illustrative analogies**, not API definitions. Whenever a diagram purports to describe Wireframe's implementation, show its true processing stages and data types. The mood book's RFC 0005, 0007, 0008, 0009 and proposal/PR imagery illustrate an architectural programme; a plate is **not evidence that an RFC has landed, a PR has merged, or a capability has shipped**.

**Copy accuracy is part of the design system.** Never invent throughput figures, uptime percentages, resource usage, supported cloud regions, benchmarks or features. Never publish a generated Rust fragment as a verified, compiling example without checking it against a pinned revision.

## 2. Creative foundation: the public machine

### 2.1 The core story

The visual narrative proceeds from familiar civic form to underlying software mechanism:

1. **Make the network recognizable.** Begin with streets, blocks, intersections and horizons. A viewer recognizes that paths have destinations and crossings have rules.
2. **Reveal the apparatus.** Move beneath the streets to frames, route choices, codecs, flush boundaries and transports. Name each stage.
3. **Explain the limits.** Show bounded channels, independent capacity, measured buffers and the consequences of exhaustion.
4. **Show the work of care.** Finish with diagnostics, verification, stewardship and maintenance. Reliability requires continuous attention, not perpetual triumph.

The camera should seem more interested in **how a system serves and remains understandable** than in how intimidating or futuristic it looks. The dominant emotional register is curious, civic-minded, exact and quietly optimistic.

### 2.2 Four visual movements

The mood book establishes four movements. Use them as an organizing framework for campaign pages, animations, product tours, documentation illustrations and presentation decks. The mappings below are proposed applications of the reference imagery, not additional product claims.

| Movement | Narrative question | Visual grammar | Mood-book anchors |
| --- | --- | --- | --- |
| **I. The Visible City** | Where do signals go? | Aerial grids, street-level routes, junctions, boundaries and horizon lines | Plates 01–04, 23, 24 and 26; PDF pp. 4–10 |
| **II. The Public Machine** | What makes each crossing work? | Named components, framed units, corridors, flush barriers and distinct transports | Plates 05–11; PDF pp. 12–18 |
| **III. Bounds and Budgets** | What controls demand and protects capacity? | Tunnel geometry, guarded cores, independently labelled budgets and gauges | Plates 12–17 and 21; PDF pp. 20–26 |
| **IV. Operations in the Open** | How can we inspect, verify and maintain it? | Diagnostic states, wider civic context, service intersections and maintenance tools | Plates 18–20, 22 and 25; PDF pp. 28–32 |

A documentation page need not reproduce the four chapters in sequence. An editorial launch piece or narrated overview should benefit from the progression. A reference page should begin with the exact mechanism the reader needs.

### 2.3 Useful tension: where are the people?

The supplied artwork contains almost no people. This helps isolate topology and mechanism, but it can turn into an empty city of beautiful lines if the copy never explains why reliable systems matter. Use calm narration to connect **legibility, bounded failure, diagnosability and maintenance** to the broader discipline of trustworthy engineering. Do not imply that Wireframe itself provides a public utility or that a particular civic deployment exists.

## 3. Brand character, headlines and voice

Five qualities govern the presentation:

1. **Legibility.** Every active route, crossing and label has a reason to appear.
2. **Structure.** Plans, frames, orthographic grids and depth reveal relationships rather than merely add atmosphere.
3. **Stewardship.** Show guardrails, capacity and maintenance as normal engineering responsibilities.
4. **Restraint.** Use bright colour to explain a selected meaning against a broad, quiet dark field.
5. **Precision.** Keep technical nouns, code, state indicators and source captions accurate.

### 3.1 Documentary voice

**The camera is patient. The narrator is curious.** The mood book's voiceover moves from an illuminated city to purposeful crossings, framed messages, enforced limits and the continuing work of care (PDF p. 34). Translate that into the following copy rules:

- Write with warmth and measured confidence. Explain first; celebrate only when the mechanism merits it.
- Prefer concrete actions and observations: “A codec finds the frame boundary”; “A route selects its handler”; “A budget stops an allocation before it exceeds its limit”.
- Use a short, evocative headline, followed immediately by a technically verifiable statement.
- In editorial media, let images establish the question before a caption supplies the answer. In documentation, reverse that priority.
- Avoid the diction of weapons trailers, cybernetic threats, financial trading terminals, surveillance products, techno-utopian manifestos and generic SaaS launch copy.
- Never let a grand civic metaphor obscure who is doing what in code. A flush barrier is a flush barrier, not a dam, until the reader can see the correspondence.

### 3.2 Brand phrases and sample treatment

**Editorial framing:** *The Common Signal.*  
**Preferred supporting statement:** *Binary protocols. Clear routes.*  
**Creative principle:** *What we connect, we should understand.*

Other legitimate editorial lines include “Frame. Route. Handle.” and “Complex protocols. Simple interfaces.” These are **phrases**, not performance or compatibility promises. The mood-book closing line is suitable for a documentary outro or an illustration, not a replacement for the product's precise definition.

A useful website sequence might read:

> **THE VISIBLE CITY**  
> Every route has a destination. Every crossing follows a rule.  
>  
> **FRAME. ROUTE. HANDLE.**  
> Wireframe provides Rust abstractions for framing binary messages and dispatching them to application handlers.

A public-television manner does not require period-accurate narration everywhere. Buttons, API pages, errors and examples should remain straightforward and concise.

## 4. Logotype, title system and symbols

### 4.1 Distinguish the editorial title from the product wordmark

The mood book consistently uses **bold uppercase sans-serif documentary titling** such as “WIREFRAME”, “THE VISIBLE CITY” and “THE PUBLIC MACHINE”. It demonstrates a strong **title treatment** but does **not** establish a reusable production logo or SVG master.

The earlier, custom-constructed lowercase “wireframe” mark remains a **separate logo candidate** from the 31 October concept. Its thin angular strokes, mint/green beam cores, internal lattice and faceted geometry may still work, but the mood book's void/cobalt/cyan/green hierarchy no longer supports treating *mint dominance* as a settled brand requirement. Review that candidate alongside a clear typographic lockup before choosing a master.

**Interim application rule:** use simple, legible **WIREFRAME** text in editorial layouts, and use a plainly labelled temporary lockup in website prototypes. Do not claim that the mood-book cover title is a finalized logo, nor that the earlier generated logo contains editable, trustworthy vector paths.

### 4.2 Candidate constructed wordmark

If the team retains the earlier lowercase mark:

- Preserve its distinct, readable letter silhouette before any decorative cross-bracing.
- Build the master with editable SVG paths and a consistent optical baseline, x-height and stroke weight.
- Test crisp **signal cyan**, **flow green** and flat light-text versions against the new void field. Do not default mechanically to the old mint hex.
- Keep the form horizontal and unwarped. Do not stretch, extrude, bevel, pixelate or simulate 3-D depth on the glyphs.
- Reduce construction details at navigation size; omit them for small icons.
- Verify legibility at hero, header, mobile, favicon, monochrome and print sizes.

### 4.3 Candidate emblem and documentary motifs

The prior **faceted rhombus** can still represent a framing junction or abstract node. Treat it as a candidate symbol, not an established mark. The mood book adds other useful *illustration motifs*: an urban interchange, a guarded core, a service intersection, a globe containing a city, and a tools emblem.

These motifs should not all become logos. In particular, the maintenance tools in Plate 25 (PDF p. 32) express stewardship in the story; they do not certify a product support service or a new brand insignia.

**Proposed lockups and assets:** a primary wordmark decision sheet, simplified navigation mark, candidate rhombus, one-colour reversal, flat print variants, favicons at 16/32/48 px, high-contrast social preview, documentary title-card system, plate-number captions and light-surface variants. All are future deliverables, not files this document claims already exist.

| Context | Treatment | Guardrail |
| --- | --- | --- |
| Documentary cover/section | Bold uppercase title, wide negative space and a secondary chapter code | Do not style every sentence as a title card |
| Website hero | Clear product name plus one large vector city/route illustration | Product definition must remain in the first viewport |
| Navigation | Simple lockup, no fragile construction strokes | Readable at normal desktop and mobile sizes |
| 24–32 px icon | Tested flat geometric symbol | No tiny nodes or ambient bloom |
| PDF/print | High-contrast vector lettering where possible; deliberate raster plates are acceptable artwork | Meaning must survive without simulated emission |
| Monochrome | Single-colour outline or silhouette | Shape, not hue, carries identity |

## 5. Colour system: a palette of responsibility

The previous emerald-black/mint-first palette yields to the seven named swatches on the mood book's **“A Palette of Responsibility”** page (PDF p. 33). The hex values below come from the **actual swatch fills in that PDF**. The mood book prints role names but not hex codes; these values document the source artwork accurately.

| Source swatch | CSS token | Extracted hex | Intended role |
| --- | --- | --- | --- |
| **Void** | `--wf-void` | `#040911` | Dark, quiet field and negative space |
| **Cobalt** | `--wf-cobalt` | `#477CF8` | Structural geometry, roads, frames and major route hierarchy |
| **Signal** | `--wf-signal` | `#63EBF4` | Active transmission, annotations, decoded or highlighted information |
| **Flow** | `--wf-flow` | `#38F49D` | A traversable/selected flow path and continuity |
| **Capacity** | `--wf-capacity` | `#F04FA5` | Budget, allocation, limit or protected-core visualizations |
| **Halt** | `--wf-halt` | `#FE536C` | Explicit stopped, rejected, exhausted or failed states when the data warrants them |
| **Notice** | `--wf-notice` | `#FFEB39` | Deliberate notices, proposal/title emphasis and exceptional attention |

**Hierarchy:** the void is the canvas; cobalt draws the world; cyan makes a particular signal legible; green marks a chosen flow. Magenta, red and yellow are **meaningful instruments**, not decorative colour options to scatter across cards. Colour roles carry across a *visual story*, but a real technical diagram still needs labels and a local legend.

### 5.1 Supporting interface colours

The following are **implementation proposals**, not mood-book swatches. They support legible text, panels and controls without displacing the seven source colours. `#11283A` also appears as the fill of the mood book's commentary panel on PDF p. 33; the other supporting values are proposed adaptations.

| UI token | Initial value | Role |
| --- | --- | --- |
| `--wf-bg` | `#040911` | Alias of Void; root background |
| `--wf-surface` | `#0B1928` | Quiet card, panel and code background |
| `--wf-surface-raised` | `#11283A` | Raised or highlighted surface |
| `--wf-text` | `#EDF6FF` | Main textual content |
| `--wf-text-muted` | `#BED0DE` | Captions, secondary explanation and metadata |
| `--wf-grid` | `#173149` | Low-emphasis plan/coordinate underdrawing |
| `--wf-border` | `#31566F` | Dividers and quiet panel outlines |
| `--wf-focus` | `#63EBF4` | Focus indicator, with an additional shape/outline cue |

As a starting check, opaque `--wf-text` on Void gives approximately **18.3:1** contrast, muted text approximately **12.6:1**, Cobalt approximately **5.2:1**, Capacity approximately **6.1:1**, and Halt approximately **6.3:1**. Cobalt on the proposed raised surface is only approximately **4.0:1**, below the 4.5:1 normal-text target; reserve that combination for non-text structural geometry or qualifying large text, or choose a lighter label colour. These checks do not establish contrast for translucent lines, blurred effects, small diagram labels or overlain artwork. Test actual rendered states.

### 5.2 Colour semantics and migration

- **Cobalt is not an error or success state.** It represents the structure that lets other signals have meaning.
- **Green Flow is not automatically “success”.** A path can flow while a different path is halted.
- **Magenta Capacity is not automatically “selected”.** Keep it for quantities, containment, allocation and bounded cores in the editorial vocabulary.
- **Red Halt should mean a genuine stop or failure.** Do not use it as ordinary ambient traffic simply because an image is red; annotate historical imagery where necessary.
- **Yellow Notice is not a universal warning.** It can spotlight a proposal or an exceptional narrative fact. Distinguish it from an actual UI warning through text and iconography.
- Use more than hue to distinguish routes: line style, label, position, shape and state text must remain available.

**Legacy change:** replace the old green-first `--wf-mint`, `--wf-cyan`, `--wf-amber`, `--wf-magenta` and `--wf-error` identity assumptions with the seven role tokens above. If migrating an existing stylesheet, keep temporary compatibility aliases **only where old uses have been audited**. A generic substitution from old amber to new notice or old magenta to new capacity would change semantics and may be incorrect.

## 6. Typography and visual hierarchy

The mood book calls for **bold sans-serif public declarations** and **monospaced technical labels** (PDF p. 33). Maintain the earlier proposed font choices as a practical starting system while judging the documentary title treatment against the actual artwork.

| Job | Proposed face/treatment | Use |
| --- | --- | --- |
| Documentary title | **Sintony Bold 700**, uppercase, with restrained tracking; verify optical match | Chapter slates, large headings, hero headline |
| Body/interface/navigation | **Sintony Regular 400 / Bold 700** | Ordinary copy, UI, documentation prose |
| Code/diagnostic metadata | **Monaspace Krypton** | Rust, byte sequences, plate IDs, RFC numbers, labels and traces |
| Product logo | **Undecided**: candidate custom lowercase SVG or typographic lockup | Brand lockup only after review |

The mood book does not specify Sintony or Monaspace by name, so these choices remain **implementation decisions inherited from version 0.1**, not claims about the fonts used to compose the mood-book PDF.

### 6.1 Titles versus prose

Use uppercase for short public-facing title cards: “THE VISIBLE CITY”, “BOUNDS AND BUDGETS”, “OPERATIONS IN THE OPEN”. A cinematic section can pair one very large bold statement with a smaller, precise explanatory sentence. Do not render long documentation paragraphs, warnings or error messages in all caps.

| Element | Desktop starting point | Mobile starting point |
| --- | --- | --- |
| Editorial chapter/hero title | 48–72 px / 1.05–1.12, Bold | 34–44 px / 1.1–1.15 |
| Ordinary page title | 40–56 px / 1.10, Bold | 30–40 px / 1.12 |
| H2 | 30–36 px / 1.2, Bold | 26–30 px / 1.2 |
| H3 | 22–26 px / 1.25, Bold | 20–22 px / 1.3 |
| Body | 17–18 px / 1.55, Regular | 16 px / 1.55 |
| Navigation/buttons | 14–15 px / 1.35, Bold or Regular | 14–15 px / 1.35 |
| Caption/metadata | 13–14 px / 1.45 | 13–14 px / 1.45 |
| Monospaced diagram label | 12–14 px / 1.35–1.5 | Prefer staged diagrams to shrinking labels |

Short uppercase metadata labels can use 0.06–0.10 em tracking. Use a restrained blue or cyan rule to connect plate IDs to titles, as the mood book does. Keep ordinary body text in sentence case.

### 6.2 Technical type and font delivery

Use Monaspace Krypton at 14–15 px with 1.5–1.6 line-height in code blocks, and 13–14 px for compact machine data. Preserve selectable text, indentation and horizontal scrolling. Do not decorate individual Rust tokens with blur. Disable ligature substitutions that impede recognition of `!=`, `->`, `=>`, `::`, `<` or `>`.

Prefer standard Sintony weights `400` and `700`; do not synthesize a nominal `600` if the installed release lacks it. Self-host properly licensed `woff2` where available, with `font-display: swap`, sensible fallbacks and visual-regression checks. Verify the licence and actual font files selected for distribution. Do not embed font binaries in this specification.

## 7. Vector world-building: public infrastructure in light

This is **X-Y calligraphic geometry**, not a pixel-art game or a scanline filter. The core artwork uses drawn paths, active centreline strokes, luminous vertices, measured depth and large territories of near-black. The city must appear *planned and navigable*, not filled with arbitrary neon wiring.

### 7.1 Three-pass beam model

1. **Structural underdrawing:** low-contrast roads, grids, planes and receding geometry that explain position and topology.
2. **Crisp beam core:** a high-contrast continuous or segmented path (roughly 1–2 CSS px at standard desktop scale in reconstructed vector assets) carrying actual meaning.
3. **Restrained phosphor halo:** local bloom around active paths that never dissolves their central line or muddies adjacent text.

The original images are raster illustrations of a vector aesthetic. **Do not describe those PNGs as source SVG masters.** For new interactive diagrams, build semantic geometry as SVG or comparable vector primitives and treat glow as progressive enhancement. For editorial use, retain the original images as images when they best communicate the scene.

### 7.2 Two related geometric modes

**A. The civic environment.** Aerial plans, orthographic blocks, elevated views, receding roads, deep tunnels and vanishing points establish the public landscape. Cobalt typically carries the structural lattice; cyan and green reveal selected routes. Plates 01–04, 12, 23, 24 and 26 provide the strongest references.

**B. The explanatory instrument.** Flat, carefully labelled component diagrams, boxes, gates, routes, gauges and data budgets clarify an engineering mechanism. Plates 06, 07, 10, 11, 15, 17 and 21 demonstrate the more literal register.

The two modes may meet, but they should not compete in one viewport. A dramatic perspectival city can introduce a concept; an orthographic two-dimensional diagram should explain the actual data path.

### 7.3 Construction and depth

- Use an 8 px underlying construction grid with 4 px subdivisions for interface art. Perspective environments may project that grid in depth; they need not maintain a uniform screen-space cell size.
- Favour meaningful road centre-lines, nodes and crossings. Use orthographic projection for system plans and deliberate perspective for city passages.
- Preserve generous negative space around text; keep faint horizon grids away from small copy.
- Use a small number of chosen, fully labelled pathways rather than illuminating every route equally.
- Permit overlap and apparent depth in editorial art, but do not let perspective reverse direction, conceal a labelled branch or merge distinct processing phases in technical diagrams.
- Avoid CRT scanline overlays, pixel sprites, RGB fringing, fake terminal noise, decorative circuit-board filler and strobing/glitch effects as defaults.

### 7.4 Diagram grammar

| Shape/gesture | Intended meaning | Accuracy guardrail |
| --- | --- | --- |
| Cobalt road/grid | Persistent network structure | Do not imply the library owns a physical network |
| Cyan trace/beam | Highlighted signal or data path | Show actual direction and stage where relevant |
| Green chosen route | One selected branch or flowing stream | Do not imply broadcast or a guaranteed success state |
| Rectangular boundary | Transport frame, if labelled as such | Keep frame and envelope separate |
| Header band inside frame | Routable envelope | Include `id`, `correlation_id` only when relevant |
| Rhombus/junction | Routing decision or abstract emblem | Disambiguate with labels or context |
| Numbered segments | Fragments of a larger message | Distinguish fragmentation from message assembly |
| Paired markers | Correlation of request and response | Do not imply correlation is mandatory |
| Parallel gates/control planes | Middleware or negotiated stage transition | Label where read, execution and write stages meet |
| Magenta boundary/gauge | Capacity or resource budget | State unit, scope, limit and observed value if real |
| Red stop marker | Halt, rejection or exhaustion | Must correspond to the represented state |
| Tool/service mark | Diagnostics, verification or maintenance | Does not imply a commercial managed service |

**Critical routing rule:** a conventional route selects the appropriate handler. Do not depict every message splitting across three handlers unless the actual example describes fan-out.

## 8. Composition: title card, plate and working interface

### 8.1 Editorial plate system

The mood book repeatedly uses a recognizable pattern: **large image**, a narrow bottom **index/caption strip**, a **plate number**, an informative title, and a short explanation. A chapter opening uses an expansive dark field, a compact chapter code and a bold headline. Adapt this treatment for galleries, explainers and videos.

Recommended editorial anatomy:

1. Small location/series marker such as `WIREFRAME / THE COMMON SIGNAL` or a chapter number.
2. One bold heading or image, never two competing hero elements.
3. Large vector/civic illustration with controlled margins and no small prose floating over detail.
4. A lower-third caption containing **plate number, title, one-sentence interpretation and source/verification status**.
5. Optional short technical sidebar, clearly separated from the artistic interpretation.

Use the mood-book labels as **artwork titles**, not necessarily as terminology from the API. For example, “The Bounded Passage” can caption Plate 16, while the supporting documentation must identify the exact budget or frame limit depicted.

### 8.2 Website and documentation hierarchy

The website still needs an efficient reading path:

**Identity → verifiable product proposition → illustrated mechanism → authentic Rust example → capability explanation → documentation action.**

A workable landing-page composition:

1. Compact header with product lockup, Overview, Guide, API, Examples and GitHub.
2. First viewport: “Wireframe”, a precise Rust binary-protocol proposition and one dramatic but readable city/interchange image. No invented cloud-platform promise.
3. A short “follow the signal” explanation linking bytes, `FrameCodec`, envelope, route and handler. Use real names and one selected path.
4. Three or four verified capabilities: framing/codecs, routing/middleware, streaming and clients/servers, adjusted to the current release.
5. A real, pinned code example alongside a smaller, flat, annotated processing diagram.
6. A section on budgets/diagnostics only where current API and docs support the claims, with a distinct link to proposed work where appropriate.
7. Direct links to guide, API documentation, examples, repository and licence. No fabricated pricing or customer logos.

Desktop: use a 12-column grid, approximately 1200–1280 px maximum content width, 24–32 px gutters and generous 64–96 px editorial section intervals. Documentation prose should occupy roughly 68–82 characters per line. The mood book is landscape and cinematic; a working documentation page must remain comfortable to read and navigate.

On tablet, subordinate the world-view illustration to the headline. On mobile, choose a meaningful crop or simplified topology and replace any dense diagram with labelled stages. Never shrink a complex technical drawing until its labels become illegible.

### 8.3 Surfaces and rhythm

Use spacing units of 4, 8, 12, 16, 24, 32, 48, 64 and 96 px. Let many sections sit directly on Void, with isolated panels in quiet midnight blue. Cards can use a 1 px border, 16–24 px padding and minimal 0–4 px corner rounding. Do not mimic a dashboard of uniformly glowing bordered widgets.

The contrast between **open civic perspective** and **compact technical instrumentation** supplies the rhythm. Use ornamental grid lines in illustrations, not underneath dense text.

## 9. Interface component behaviour

| Component | Default visual treatment | Interaction and state |
| --- | --- | --- |
| Primary CTA | Quiet dark button, clear text, cyan or green accent | Crisp visible border on hover/focus; 2+ px focus indicator |
| Secondary CTA | Light text, restrained border | Explicit underline or border change; no heavy ambient halo |
| Navigation | Sintony, clear hit area, small cobalt/cyan rule | Underline/tick plus semantics mark current page |
| Code panel | Flat blue-black surface, Monaspace Krypton | Labelled copy action, horizontal scrolling, real syntax highlighting |
| Feature card | Simple icon and short verified explanation | No arbitrary multicolour neon panels |
| Technical callout | Text-first panel, optional coloured left rule | “Note”, “Warning”, “Error” and “Success” remain explicit words |
| Tabs | Small geometric indicator and readable title | Keyboard arrows, focus ring, selected-state semantics |
| Search/input | Clear inset surface with readable label | Error message, caret and focus treatment remain visible |
| Diagram node | Cobalt structure, legible label, optional active trace | Highlight remains identifiable without motion/colour |
| Budget gauge | Plain units and explicit bound plus optional magenta ring | Exhaustion needs its own red halt label/marker where appropriate |
| Diagnostic status | Prominent state text, related icon and clear timestamp/source when genuine | Never show “ACTIVE” as a fabricated live system status |

The mood book's fictional/illustrative status labels and numeric read-outs are valid **art references**, not live UI states. Separate genuinely wired telemetry from demonstrations and design mocks.

## 10. Motion, pacing and transitions

There are two motion systems. **Editorial cinematography** follows the mood book's slow dolly moves, deliberate reveals and long holds. **Product interaction** remains quick, responsive and reversible. Mixing them makes a button feel like a documentary establishing shot.

### 10.1 Editorial sequence

- Establish the city or routing plan before choosing one signal.
- Follow a beam or route with a deliberate camera movement. Do not race through a tunnel simply to suggest speed.
- Pause on a junction long enough for its annotation to become intelligible.
- Cut to a flat technical plate when the narrator introduces a real codec, budget or processing boundary.
- Finish on diagnostics or care, not an uncontrolled explosion of colour.

Avoid perpetual camera motion, rapid strobing, loud threat cues, arbitrary glitch cuts and simulated high-throughput speed lines. Any film timing must suit the finished narration; the mood book defines **pacing**, not mandatory animation durations.

### 10.2 Interface transition defaults

| Motion | Starting duration | Behaviour |
| --- | --- | --- |
| Button hover/focus | 120–180 ms | Crisp core brightens; optional local halo |
| Card/section reveal | 180–260 ms | Short opacity transition or 4–8 px translation |
| Route selection | 350–600 ms | A single discrete cyan/green pulse traverses the selected branch |
| Hero title/beam draw | 800–1400 ms, once | Strokes resolve into a stable, readable state |

These are **proposed UI timing values**, inherited or adapted from the previous specification, not measurements from the mood book. Do not use animation cadence to imply real throughput or latency. Respect `prefers-reduced-motion: reduce`: eliminate travelling pulses, camera moves and path-draw effects; display the final labelled state directly. Continuous motion must be opt-in and pause off-screen.

## 11. Icons, architectural diagrams and data

Icons should share a **24 × 24 logical grid** with a coherent ~1.5–2 px core stroke and minimal fill. Use recognizable framing gates, branch nodes, gauges, inspection lenses and service tools where meaningful. A wrench can symbolize maintenance; it should not become the generic button for an unrelated action.

**Technical diagrams must remain semantically correct.** Distinguish transport frames from routable envelopes and typed messages. Separate fragmentation from protocol-level message assembly. Mark optional correlation IDs only where they participate. Show incoming versus outgoing processing, including serialization, fragmentation and codec wrapping, and identify middleware placement rather than collapsing it into one luminous slab.

Where the mood book depicts RFC illustrations, use explicit editorial captions such as:

- “**Architecture illustration:** RFC 0005 negotiated transition and flush boundary. Not a claim about current release support.” (Plate 10, PDF p. 17)
- “**Architecture illustration:** RFC 0009 transport comparison, streams and datagrams. Verify exact support against the targeted revision.” (Plate 11, PDF p. 18)
- “**Resource-budget concept:** independently scoped channel capacity. Numeric values in the illustration are not benchmarks.” (Plate 15, PDF p. 23)
- “**Verification concept:** fixtures, scanning and a toy server. Confirm implementation status before describing these as shipped tooling.” (Plate 21, PDF p. 26)

Prefer an evidence label at the point of use: **Artwork/concept**, **Proposed RFC**, **Implemented API**, or **Measured result**. Do not silently promote one category into another. A compelling image earns attention; technical sourcing earns trust.

## 12. Code-sample presentation

Every public example must either compile against a pinned Wireframe revision or carry an explicit **API-shape illustration** or **pseudocode** label. Never copy textual material from generated illustrations as executable Rust. In particular, reject invented `App::new()` examples, HTTP-style `route("/login", ...)` samples or YAML deployment fragments as product demonstrations.

The earlier specification included this **API-shape illustration** using names from its supplied library guide. It remains illustrative here and has **not been recompiled or independently revalidated** during this visual-language revision:

```rust
use std::sync::Arc;
use wireframe::app::{Envelope, Handler, WireframeApp};

async fn ping(_env: &Envelope) {}

fn build_app() -> wireframe::Result<WireframeApp> {
    let handler: Handler<Envelope> =
        Arc::new(|env: &Envelope| Box::pin(ping(env)));

    WireframeApp::new()?.route(1, handler)
}
```

Present verified Rust in Monaspace Krypton, without glow across glyphs. Preserve indentation and syntax accuracy; include a labelled copy button, an “Open example” or “View API” link, and the pinned version/commit when verified. Keep lines around 80–100 columns where practicable.

**Caption taxonomy:**

- **Working example:** independently compiled/tested against a named, pinned revision.
- **API-shape illustration:** explanatory code using plausible/currently documented names, without a compile claim.
- **Pseudocode:** conceptual algorithm or non-executable syntax.

## 13. Content style, source hygiene and terminology

Use direct, technically literate, calm language. Lead with useful verbs: **Define a frame. Register a route. Handle a message. Stream a response.** One evocative documentary headline is enough; the next line should identify the actual mechanism.

Preferred nouns: *frame, codec, envelope, packet trait, message, fragment, route, handler, middleware, correlation ID, serializer, stream, client, server, back-pressure, budget, diagnostic, lifecycle*.

Avoid unsupported or misleading claims such as “deploy anywhere”, “cloud-native orchestration”, “infrastructure as code”, “microservice platform”, “zero-config everything”, unqualified “zero-copy”, “city-scale reliability” or “public infrastructure platform”. Do not invent customer installations or imply that an illustrated civic setting is a demonstrated application.

**Narrative and verification are complementary but distinct:**

- **Narrative caption:** what the scene helps the audience understand.
- **Technical annotation:** what component, RFC or behaviour the scene represents.
- **Source/status tag:** whether the subject is speculative, proposed, implemented or measured.

Use British English with Oxford **-ize** spellings in explanatory prose and exact upstream spellings in Rust identifiers and quotations. Keep source-asset filenames, RFC identifiers and revision names unchanged.

## 14. Accessibility and non-emissive modes

- Meet WCAG AA contrast targets: at least 4.5:1 for normal text, 3:1 for large text and 3:1 for essential non-text control boundaries. Audit rendered overlays and states, not just swatches.
- Maintain legibility when every phosphor halo, blur and glow filter is disabled.
- Do not rely on hue, motion or pulsing to distinguish a route, budget or diagnostic result; pair colour with text, line style, shape and topology.
- Provide keyboard focus, practical touch targets, semantic HTML, meaningful alternative text and visible error messages.
- Keep code scrollable. Do not shrink labels until a technical map becomes unreadable.
- For complex editorial images, supply an adjacent **descriptive caption** and, where technical interpretation matters, a separate **linear, labelled explanation**.
- Treat most background city perspectives as ornamental for assistive technology; do not force a screen reader through every invented building edge.
- Respect reduced motion and offer low-glow/high-contrast modes. Support CSS/SVG filter fallbacks and flat print/monochrome rendering.
- Do not let documentary lower-thirds reduce usable contrast against variable artwork. Use a consistent opaque or carefully tested caption surface.

## 15. Implementation tokens (proposed starting point)

The **seven role colours** below reproduce the PDF swatches. Surface colours, typography choices, geometry variables and component timing remain proposals that require browser/device tests. Do not interpret the stylesheet as a completed production design system.

```css
:root {
  /* Mood-book source swatches, page 33. */
  --wf-void: #040911;
  --wf-cobalt: #477cf8;
  --wf-signal: #63ebf4;
  --wf-flow: #38f49d;
  --wf-capacity: #f04fa5;
  --wf-halt: #fe536c;
  --wf-notice: #ffeb39;

  /* Proposed supporting UI colours and aliases. */
  --wf-bg: var(--wf-void);
  --wf-surface: #0b1928;
  --wf-surface-raised: #11283a;
  --wf-text: #edf6ff;
  --wf-text-muted: #bed0de;
  --wf-grid: #173149;
  --wf-border: #31566f;
  --wf-focus: var(--wf-signal);

  /* Typography and construction. */
  --wf-font-ui: "Sintony", Arial, sans-serif;
  --wf-font-code: "Monaspace Krypton", Consolas, monospace;
  --wf-radius: 3px;
  --wf-space-unit: 4px;
  --wf-line-ui: 1px;
  --wf-beam-core: 1.5px;
}

body {
  color: var(--wf-text);
  background: var(--wf-bg);
  font-family: var(--wf-font-ui);
  font-weight: 400;
  font-synthesis: none;
}

pre, code, kbd, samp {
  font-family: var(--wf-font-code);
  font-variant-ligatures: none;
}

pre {
  overflow-x: auto;
  line-height: 1.55;
}

/* Example semantics; component styles must still be designed and tested. */
.wf-diagram-structure { stroke: var(--wf-cobalt); }
.wf-diagram-signal { stroke: var(--wf-signal); }
.wf-diagram-flow { stroke: var(--wf-flow); }
.wf-diagram-capacity { stroke: var(--wf-capacity); }
.wf-diagram-halt { stroke: var(--wf-halt); }
.wf-diagram-notice { stroke: var(--wf-notice); }

:focus-visible {
  outline: 2px solid var(--wf-focus);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .wf-beam-trace,
  .wf-signal-pulse,
  .wf-editorial-dolly {
    animation: none;
    transition: none;
    transform: none;
  }
}

@media print {
  :root { --wf-focus: #000; }
  .wf-beam-halo { display: none; }
}
```

The print block above is a **minimal example**, not a complete light-print theme; a production print stylesheet must also switch foreground/background contrasts and retain all critical diagram labels. Self-host the selected font files and define real `@font-face` entries once final licensing and distribution choices are made. No font files are bundled here.

## 16. Deliverables, validation and acceptance

### 16.1 Visual work still required

1. **Brand-mark decision:** compare the prior constructed lowercase concept with a documentary-compatible typographic lockup, then design exact vector masters and optical size variants.
2. **Palette migration:** audit existing green-first colour usage and retag it by structural/signal/flow/capacity/halt/notice semantics; do not perform a blind global find/replace.
3. **Illustration kit:** build reusable civic street grid, junction, corridor, bounded passage and gauge primitives with explicit legends and SVG fallback paths.
4. **Editorial kit:** create four chapter slates, plate frame, lower-third caption, source/status badge treatment and social preview templates.
5. **Documentation system:** deliver responsive code cards, stage diagrams and a compact mechanism-first illustration variant for each large civic hero.
6. **Reference gallery:** index all 26 source images with plate number, original filename, mood-book page, visual purpose and whether accompanying text is artwork or verified technical content.
7. **Accessibility and QA:** test contrast, low-glow, reduced-motion, mobile diagram breakdowns, print, typography fallback and input focus.
8. **Technical review:** pin the relevant Wireframe revision and review each published diagram, RFC label, API snippet and capability description against it.

### 16.2 Acceptance checklist

- [ ] The first viewport makes clear that Wireframe is a **Rust binary-protocol library**, not municipal infrastructure software or a cloud platform.
- [ ] The visual hierarchy matches the mood book: **Void → Cobalt structure → Cyan signal / Green flow → exceptional Capacity / Halt / Notice**.
- [ ] Aerial grids, civic intersections, perspectival corridors and labelled instruments feel like a coherent family, not unrelated neon stock graphics.
- [ ] The four movements inform editorial storytelling without dictating documentation navigation.
- [ ] Documentary headings are bold, brief and legible; technical annotations use stable monospaced labels.
- [ ] Logo treatment remains explicitly provisional until a real vector master and size variants have been reviewed.
- [ ] Code, diagrams and source captions distinguish concept art, proposed RFCs, implemented APIs and measured results.
- [ ] The rendering works without bloom, remains accessible and respects reduced motion.
- [ ] Every displayed metric has a genuine source, unit and scope; no illustration is presented as live telemetry.
- [ ] The website offers genuine guide/API/example paths instead of invented deployment or pricing stories.

## 17. References and provenance

### 17.1 Primary visual authority

***Wireframe: The Common Signal***, 36-page mood book, 17 November 2026, assembled from 26 illustrations supplied as `Wireframe Screenshots.zip`. Local reference: [`Wireframe_The_Common_Signal_Mood_Book.pdf`](Wireframe_The_Common_Signal_Mood_Book.pdf).

- **Creative premise:** p. 2. “The city is the interface”; engineering/public computation as the organizing metaphor.
- **The Visible City:** pp. 3–10, Plates 01–04, 23, 24 and 26.
- **The Public Machine:** pp. 11–18, Plates 05–11.
- **Bounds and Budgets:** pp. 19–26, Plates 12–17 and 21.
- **Operations in the Open:** pp. 27–32, Plates 18–20, 22 and 25.
- **“A Palette of Responsibility”:** p. 33, including the seven role names and their swatches.
- **Documentary voice:** p. 34, including the patient-camera/curious-narrator principle.
- **Source image register:** p. 35; **closing phrase:** p. 36.

The mood book is a **creative treatment, not a technical specification** (explicit on p. 2). Its captions explain visual intent. Its RFC numbers, mock interfaces, gauges and proposal artwork do not certify implementation state or measured performance.

### 17.2 Earlier concept and technical sources

The 31 October 2026 version of this specification drew on a Wireframe identity blueprint and a corrected binary-protocol landing-page concept, along with the supplied *Design of wireframe: A Rust Router for Binary Protocols* and *Wireframe library guide*. The older green-first logo concept remains a **candidate**. The earlier library guide supplied the API-shape example above; validate current APIs against a pinned source before publishing.

### 17.3 Typography references

- [Sintony typeface and licence](https://fontsource.org/fonts/sintony/about)
- [Monaspace project and family guidance](https://github.com/githubnext/monaspace)
- [Monaspace Krypton typeface and licence](https://fontsource.org/fonts/monaspace-krypton/about)

**Governance:** This is a **proposed identity and presentation specification**. The seven colour swatches and the mood book's four-part narrative have direct visual provenance. Logo selection, supplementary token values, fonts, UI behaviour, component implementations and technical feature assertions need separate approval or verification. This revision **does not change Wireframe's implementation or roadmap**.
