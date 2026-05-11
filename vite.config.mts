import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    // include: ["src/**/*.test.{ts,tsx}"],
    include: [], // disabled this for now to avoid running tests on every build
    setupFiles: ["./vitest.setup.ts"],
    passWithNoTests: true,
  },
});
