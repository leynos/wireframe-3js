import { build, context } from "esbuild";
import { cp, mkdir, watch } from "node:fs/promises";

await mkdir("dist", { recursive: true });
const copyDemo = () => cp("demo", "dist", { recursive: true });
await copyDemo();
const options = {
  entryPoints: ["src/wireframe-plate.js", "src/gallery.js"],
  outdir: "dist",
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
