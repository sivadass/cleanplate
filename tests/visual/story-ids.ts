import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type StorybookEntry = {
  type?: string;
  id?: string;
  children?: Record<string, StorybookEntry>;
};

/**
 * Discover every CSF story id from storybook-static/index.json (built output).
 * Skips docs-only entries (they are not type "story").
 */
export function loadStoryIds(): string[] {
  const indexPath = join(process.cwd(), "storybook-static/index.json");
  if (!existsSync(indexPath)) {
    throw new Error(
      "storybook-static/index.json not found. Run npm run build-storybook first.",
    );
  }
  const index = JSON.parse(readFileSync(indexPath, "utf8")) as {
    entries: Record<string, StorybookEntry>;
  };
  const stories: string[] = [];

  function walk(entries: Record<string, StorybookEntry>) {
    for (const val of Object.values(entries)) {
      if (val.type === "story" && val.id) {
        stories.push(val.id);
      } else if (val.children) {
        walk(val.children);
      }
    }
  }

  walk(index.entries);
  return stories.sort();
}
