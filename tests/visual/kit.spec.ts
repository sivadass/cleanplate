import { test, expect } from "@playwright/test";

const KIT_BASE_URL = "http://127.0.0.1:6007";

const KIT_ROWS = [
  "button",
  "typography",
  "icon",
  "container",
  "alert",
  "badge",
  "avatar",
  "spinner",
  "input",
] as const;

test.describe("HTML kit visual (v1 primitives)", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${KIT_BASE_URL}/docs/html/kit.html`, {
      waitUntil: "networkidle",
    });
    await page.waitForFunction(() =>
      document.fonts.check('16px "Inter"'),
    );
    await page.waitForTimeout(300);
  });

  for (const row of KIT_ROWS) {
    test(`kit-row-${row}`, async ({ page }) => {
      await expect(page.locator(`#kit-row-${row}`)).toHaveScreenshot(
        `kit-row-${row}.png`,
      );
    });
  }
});
