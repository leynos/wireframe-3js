import { atlas, archive } from "./gallery-collections.js";
import { movements } from "./catalog.js";
const byId = (id) => document.getElementById(id);
const display = byId("display"),
  list = byId("list"),
  filter = byId("filter");
const posterDir = new URL(".", byId("poster").src);
const posterUrl = (id) => new URL(id + ".webp", posterDir).href;
const archived = document.body.dataset.collection === "archive";
const collection = archived ? archive : atlas;
for (const [i, name] of movements.entries())
  if (collection.some((p) => p.movement === i)) filter.add(new Option(name, i));
let active;
function renderList() {
  list.replaceChildren();
  for (const p of collection.filter(matches)) {
    const button = document.createElement("button");
    button.className = "row";
    button.type = "button";
    button.setAttribute("aria-current", String(p === active));
    button.dataset.id = p.id;
    button.innerHTML = `<img alt="" src="${posterUrl(p.id)}" loading="lazy"><span><small>Plate ${p.id}</small><strong>${p.title}</strong></span>`;
    button.onclick = () => choose(p);
    list.append(button);
  }
}
function matches(p) {
  return filter.value === "all" || p.movement === Number(filter.value);
}
function choose(p) {
  active = p;
  display.removeAttribute("paused");
  display.setAttribute("plate", p.id);
  byId("poster").src = posterUrl(p.id);
  byId("screen-id").textContent = "FIG. " + p.id;
  byId("chapter").textContent = "Plate " + p.id + " / " + movements[p.movement];
  byId("title").textContent = p.title;
  byId("caption").textContent = p.caption;
  for (const row of list.children)
    row.setAttribute("aria-current", String(row.dataset.id === p.id));
}
filter.onchange = () => {
  if (!matches(active)) choose(collection.find(matches));
  renderList();
  list.scrollTop = 0;
};
const states = {
  stable: "Signal stable",
  scanning: "Tracing vectors",
  still: "Still frame",
  paused: "Motion paused",
  fallback: "Static plate",
};
function sync() {
  const state = display.dataset.state;
  byId("status").textContent = states[state] ?? "Loading";
  const paused = display.hasAttribute("paused");
  const pause = byId("pause");
  pause.setAttribute("aria-label", paused ? "Resume motion" : "Pause motion");
  pause.title = pause.getAttribute("aria-label");
  pause.firstElementChild.textContent = paused ? "▷" : "Ⅱ";
  pause.disabled = byId("replay").disabled =
    state === "fallback" || state === "still";
  byId("glow").disabled = state === "fallback";
}
display.addEventListener("plate-state", sync);
byId("pause").onclick = () => {
  display.toggleAttribute("paused");
  sync();
};
byId("replay").onclick = () => {
  display.removeAttribute("paused");
  display.replay();
};
byId("glow").onclick = () =>
  byId("glow").setAttribute(
    "aria-pressed",
    String(!display.toggleAttribute("low-glow")),
  );
const initialPlate = new URLSearchParams(location.search).get("plate");
const otherPage = archived ? atlas : archive;
if (otherPage.some((p) => p.id === initialPlate)) {
  const dest = new URL(archived ? "./" : "./archive.html", location.href);
  dest.search = location.search;
  dest.hash = location.hash;
  location.replace(dest);
} else {
  choose(collection.find((p) => p.id === initialPlate) ?? collection[0]);
  renderList();
  if (initialPlate === active.id) {
    const row = list.querySelector('[aria-current="true"]');
    list.scrollTop +=
      row.getBoundingClientRect().top - list.getBoundingClientRect().top;
  }
  sync();
}
