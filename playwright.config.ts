import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL: "http://127.0.0.1:6006",
    screenshot: "only-on-failure",
    trace: "off",
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.001,
    },
  },
  webServer: [
    {
      command: "npx http-server storybook-static -p 6006 -s",
      url: "http://127.0.0.1:6006",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: "npx http-server . -p 6007 -s",
      url: "http://127.0.0.1:6007/docs/html/kit.html",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
