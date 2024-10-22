import { defineConfig } from "tsup";
import packagejson from "./package.json"; // Adjust the path as necessary

const outDir = "./lib"; // Adjust the output directory as necessary

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife"],
  target: ["chrome89", "firefox86", "edge89", "safari14"],
  minify: true,
  dts: true,
  outDir,
  sourcemap: true,
  treeshake: true,
  globalName: "IAM",
  splitting: true,
  noExternal: Object.entries(packagejson.dependencies)
    .filter(([_key, value]) => value.includes("workspace:"))
    .map(([key]) => key),
});
