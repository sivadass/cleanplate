import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { cssModulesScopedName } from "./src/test/css-modules-name";

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: cssModulesScopedName,
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
  },
});
