import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: "[local]",
    },
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    passWithNoTests: true,
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
});
