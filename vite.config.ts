import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "VizibleCartesian",
      fileName: (format) => `vizible-cartesian.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["d3"],
      output: {
        globals: {
          d3: "d3",
        },
        exports: "named",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: true,
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist/types",
      insertTypesEntry: true,
    }),
  ],
});
