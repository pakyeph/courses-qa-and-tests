/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // ou "istanbul"
      reporter: ["text", "html"], // text = console, html = rapport visuel
      all: true, // inclut même les fichiers sans tests
    },
  },
});
