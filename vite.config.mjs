import { join } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const dirname = import.meta.dirname ?? ".";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: join(dirname, "src", "index.ts"),
      name: "index",
      formats: ["es", "cjs"],
      fileName: (format) => format === "es" ? "index.mjs" : "index.cjs",
    }
  }
});
