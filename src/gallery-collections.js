import { catalog } from "./catalog.js";

const archived = new Set(["01", "02", "14", "20", "22", "23", "24"]);
export const archive = catalog.filter((plate) => archived.has(plate.id));

// Plate IDs are permanent embed addresses. Only the gallery order changes.
const order = (id) => (id === "29" ? 1 : id === "30" ? 23 : Number(id));
export const atlas = catalog
  .filter((plate) => !archived.has(plate.id))
  .sort((a, b) => order(a.id) - order(b.id));
