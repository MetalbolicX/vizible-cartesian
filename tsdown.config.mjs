import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: ["esm", "cjs", "umd"],
  minify: true,
  dts: true,
  platform: "browser",
  clean: true,
  outDir: "dist",
  tsconfig: true,
  outputOptions: {
    name: "VizibleCartesian",
    globals: {
      d3: "d3"
    }
  }
});
