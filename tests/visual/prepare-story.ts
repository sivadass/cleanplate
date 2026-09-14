import type { Page } from "@playwright/test";

const OVERLAY_OPEN_PATTERNS = [
  /-modal-playground-/,
  /-drawer-playground-/,
  /-confirmdialog-playground-/,
  /-bottomsheet-playground-/,
  /-dropdown-playground-/,
  /-toast-playground-/,
];

/** Stories that auto-open panels in render (no click needed). */
const AUTO_OPEN_STORY_SUFFIXES = [
  "--default", // Modal, Drawer, ConfirmDialog defaults start open
  "--color-picker-active-state",
];

async function clickFirstVisibleButton(page: Page, name?: RegExp) {
  const locator = name
    ? page.getByRole("button", { name }).first()
    : page.getByRole("button").first();
  if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
    await locator.click();
    return true;
  }
  return false;
}

async function openOverlayIfNeeded(page: Page, id: string) {
  if (id.includes("-toast-playground-")) {
    // Single toast card — click first variant trigger once.
    await clickFirstVisibleButton(page);
    await page.waitForTimeout(400);
    return;
  }

  if (id.includes("-dropdown-playground-")) {
    const dialog = page.locator('[role="menu"], [role="listbox"]').first();
    if (!(await dialog.isVisible().catch(() => false))) {
      await clickFirstVisibleButton(page, /menu|open|account|select|more|trigger/i);
      await page.waitForTimeout(400);
    }
    return;
  }

  if (
    /-modal-playground-|-drawer-playground-|-confirmdialog-playground-|-bottomsheet-playground-/.test(
      id,
    )
  ) {
    const dialog = page.locator('[role="dialog"]').first();
    if (!(await dialog.isVisible().catch(() => false))) {
      await clickFirstVisibleButton(page, /open/i);
      await page.waitForTimeout(500);
    }
    return;
  }

  // FormControls Select / Date / ColorPicker: open panel when story is not auto-open.
  if (id.includes("-formcontrols-playground-")) {
    if (id.includes("color-picker-active-state")) {
      await page.waitForTimeout(500);
      return;
    }
    const listbox = page.locator('[role="listbox"], [role="dialog"]').first();
    if (!(await listbox.isVisible().catch(() => false))) {
      const trigger = page
        .locator(
          '[data-testid$="-trigger"], [aria-haspopup="listbox"], [aria-haspopup="dialog"], button',
        )
        .first();
      if (await trigger.isVisible({ timeout: 2000 }).catch(() => false)) {
        await trigger.click();
        await page.waitForTimeout(500);
      }
    }
  }
}

/**
 * Prepare a story frame before screenshot: wait for fonts, open overlays when required.
 */
export async function prepareStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`, {
    waitUntil: "networkidle",
  });

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const needsOverlayOpen = OVERLAY_OPEN_PATTERNS.some((re) => re.test(id));
  const isAutoOpen =
    AUTO_OPEN_STORY_SUFFIXES.some((suffix) => id.endsWith(suffix)) &&
    (id.includes("-modal-playground-") ||
      id.includes("-drawer-playground-") ||
      id.includes("-confirmdialog-playground-"));

  if (needsOverlayOpen && !isAutoOpen) {
    await openOverlayIfNeeded(page, id);
  } else if (needsOverlayOpen && isAutoOpen) {
    // Default open stories — ensure dialog rendered.
    await page.waitForTimeout(300);
  }

  // Stabilize floating UI / transitions after open.
  await page.waitForTimeout(200);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}
