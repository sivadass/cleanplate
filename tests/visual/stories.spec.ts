import { test, expect } from "@playwright/test";
import { loadStoryIds } from "./story-ids";
import { prepareStory } from "./prepare-story";

const STORY_IDS = loadStoryIds();

test.describe("Storybook CSF visual baselines", () => {
  for (const id of STORY_IDS) {
    test(id, async ({ page }, testInfo) => {
      await prepareStory(page, id);
      await expect(page).toHaveScreenshot(`${id}.png`);
    });
  }
});
