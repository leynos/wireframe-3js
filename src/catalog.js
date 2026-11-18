export const movements = [
  "The visible city",
  "The public machine",
  "Bounds and budgets",
  "Operations in the open",
  "Website diagrams",
];
const plates = [
  [
    "Signal avenue",
    0,
    "A cobalt boulevard carries a signal through a city of green crossings.",
  ],
  [
    "Street level",
    0,
    "A closer view follows parallel channels between the towers.",
  ],
  [
    "System architecture",
    0,
    "An elevated crossing reveals the street plan beneath the city.",
  ],
  [
    "The threshold",
    0,
    "A cyan road passes through a monumental rectangular gate.",
  ],
  [
    "Proposal 845",
    1,
    "A rising yellow trace splits a grid of blocks, scattering wireframe fragments along the diagonal.",
  ],
  [
    "Seven proposals",
    1,
    "Seven proposal nodes surround a shared architectural core.",
  ],
  [
    "The envelope",
    1,
    "A framed message sits inside a recessed equipment cabinet.",
  ],
  [
    "Routing table",
    1,
    "An overhead street plan connects a row of square junctions.",
  ],
  [
    "Queued frames",
    1,
    "Red frame contours queue along the lanes of a dark corridor.",
  ],
  [
    "Flush barrier",
    1,
    "Three processing lanes meet a marked transition boundary.",
  ],
  [
    "Streams and datagrams",
    1,
    "A continuous stream sits above three separate datagram frames.",
  ],
  [
    "Inside the channel",
    2,
    "Parallel paths converge inside a cylindrical lattice.",
  ],
  ["Guarded core", 2, "A magenta core sits inside a protective blue mesh."],
  [
    "Capacity boundary",
    2,
    "A closer view reveals the concentric boundaries around the core.",
  ],
  [
    "Independent budgets",
    2,
    "Three separate channel gauges illustrate independently bounded capacity.",
  ],
  [
    "The bounded passage",
    2,
    "An octagonal conduit encloses a single red frame.",
  ],
  [
    "Buffer instruments",
    2,
    "Segmented instruments depict allocation and outbound capacity.",
  ],
  ["Civic sphere", 3, "A geodesic shell encloses an illuminated skyline."],
  [
    "System diagnostic",
    3,
    "Diagnostic markers trace a signal through an elevated crossing.",
  ],
  [
    "Signal orbit",
    3,
    "An orbital trace connects a small city with its surroundings.",
  ],
  [
    "Conformance harness",
    2,
    "A fixture bank connects through a checking stage to a toy server.",
  ],
  [
    "Service interchange",
    3,
    "Coloured service routes cross on separate decks.",
  ],
  [
    "City in transit",
    0,
    "Signals follow the lanes of a layered urban interchange.",
  ],
  [
    "Network panorama",
    0,
    "A wider aerial view reveals intersecting roads and ramps.",
  ],
  ["Maintenance", 3, "A wrench and hammer form a maintenance emblem."],
  [
    "The common signal",
    0,
    "Bridges and civic landmarks link a multicoloured cityscape.",
  ],
  [
    "One request’s path",
    4,
    "FrameCodec cuts the byte stream into frames. The envelope carries message ID 2 and correlation ID 7. The router sends it through middleware to Telemetry, whose reply carries the same correlation ID.",
  ],
  [
    "Complexity, reduced",
    4,
    "Hand-written framing, parsing, dispatch and state give way to three named layers: codec, routes and middleware.",
  ],
  [
    "Avenue fly-through",
    0,
    "Signal Avenue draws into view. The camera descends to street level and follows the cobalt lanes as distant towers trace themselves into the skyline.",
  ],
  [
    "Transit panorama",
    0,
    "Coloured packets travel along the interchange as the view pulls back from street traffic to the full network.",
  ],
];
export const catalog = plates.map(([title, movement, caption], index) => ({
  id: String(index + 1).padStart(2, "0"),
  title,
  movement,
  caption,
}));
