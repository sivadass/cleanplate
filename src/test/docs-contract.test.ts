import { readFileSync, existsSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const EXPORTS = [
  "AppShell",
  "Typography",
  "Modal",
  "ConfirmDialog",
  "Button",
  "Badge",
  "Icon",
  "Container",
  "MediaObject",
  "Alert",
  "Avatar",
  "Stepper",
  "Toast",
  "Animated",
  "BreadCrumb",
  "Header",
  "PageHeader",
  "Footer",
  "FeedbackState",
  "MenuList",
  "Spinner",
  "Statistic",
  "ProgressBar",
  "Accordion",
  "BottomSheet",
  "Drawer",
  "Table",
  "Pagination",
  "Pills",
  "Dropdown",
];

describe("docs contract", () => {
  it("has a markdown file per top-level component", () => {
    const missing = EXPORTS.filter((name) => !existsSync(`docs/${name}.md`));
    expect(missing).toEqual([]);
    expect(existsSync("docs/FormControls.md")).toBe(true);
  });

  it("does not teach prefixed spacing in docs or llms.txt", () => {
    const files = [
      "llms.txt",
      "AGENTS.md",
      ...readdirSync("docs")
        .filter((f) => f.endsWith(".md"))
        .map((f) => `docs/${f}`),
    ];
    const hits: string[] = [];
    for (const f of files) {
      if (f.startsWith("docs/superpowers") || f === "docs/MIGRATION-v1.md") {
        continue;
      }
      const text = readFileSync(f, "utf8");
      if (
        /margin=\{?"m-/.test(text) ||
        /padding=\{?"p-/.test(text) ||
        /gap=\{?"g-/.test(text)
      ) {
        hits.push(f);
      }
    }
    expect(hits, `prefixed spacing in ${hits.join(", ")}`).toEqual([]);
  });
});
