import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig(({ mode }) => ({
  base: "/daisy-web/",
  plugins: [svelte()],
  resolve: mode === "test" ? { conditions: ["browser"] } : undefined,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.js"],
  },
}));
