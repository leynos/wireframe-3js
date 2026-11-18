import { build, context } from "esbuild";
import { atlas, archive } from "../src/gallery-collections.js";
import { cp, mkdir, readFile, writeFile, watch } from "node:fs/promises";

const pages = process.argv.includes("--pages");
const output = pages ? "." : "dist";
await mkdir(output, { recursive: true });
async function copyDemo() {
  const template = await readFile("demo/gallery.html.in", "utf8");
  if (!pages)
    await cp("demo", output, {
      recursive: true,
      filter: (path) => !path.endsWith(".html.in"),
    });
  for (const [collection, plates] of Object.entries({ atlas, archive })) {
    const archived = collection === "archive";
    const page = {
      ...plates[0],
      media: pages ? "./demo" : ".",
      modules: pages ? "./assets" : ".",
      collection,
      count: plates.length,
      heading: archived ? "Plate archive" : "Signal atlas",
      summary: archived
        ? "Retired plates from the Wireframe signal atlas."
        : "A collection of vector CRT scenes exploring the shapes of Wireframe, a Rust binary-protocol library.",
      otherUrl: archived ? "./" : "./archive.html",
      otherTitle: archived ? "Signal atlas" : "Plate archive",
    };
    await writeFile(
      `${output}/${archived ? "archive" : "index"}.html`,
      template.replace(/{{(\w+)}}/g, (_, key) => page[key]),
    );
  }
}
await copyDemo();
const options = {
  entryPoints: ["src/wireframe-plate.js", "src/gallery.js"],
  outdir: pages ? "assets" : output,
  bundle: true,
  format: "esm",
  minify: true,
  target: "es2022",
};
if (process.argv.includes("--serve")) {
  const ctx = await context(options);
  await ctx.watch();
  const { port } = await ctx.serve({
    servedir: "dist",
    host: "127.0.0.1",
    port: Number(process.env.PORT || 5173),
  });
  console.log(`Wireframe demo at http://localhost:${port}`);
  for await (const _ of watch("demo", { recursive: true })) await copyDemo();
} else {
  await build(options);
}
