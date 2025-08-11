import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { join } from "node:path";

const dirname = import.meta.dirname ?? ".";

export default defineConfig({
  build: {
    lib: {
      entry: join(dirname, "src", "index.ts"),
      name: "VizibleCartesian",
      formats: ["es", "umd", "cjs"],
      fileName: (format) => `vizible-cartesian.${format}.js`,
    },
    rollupOptions: {
      external: ["d3"],
      output: {
        globals: {
          d3: "d3",
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    minify: true,
  },
  plugins: [
    dts({
      entryRoot: "src",
      insertTypesEntry: true,
    }),
  ],
});
