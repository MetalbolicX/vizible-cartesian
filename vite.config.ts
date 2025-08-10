import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "VizibleCartesian",
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["d3"],
      output: {
        globals: {
          d3: "d3",
        },
      },
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist/types",
      insertTypesEntry: true,
    }),
  ],
});
