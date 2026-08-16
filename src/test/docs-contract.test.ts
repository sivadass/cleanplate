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

const V1_HTML_PROTOTYPE_DOCS = [
  "Button",
  "Typography",
  "Icon",
  "Container",
  "Alert",
  "Badge",
  "Avatar",
  "Spinner",
] as const;

const TIER1_HTML_PROTOTYPE_DOCS = [
  "Accordion",
  "MenuList",
  "Stepper",
  "Pills",
  "MediaObject",
  "BreadCrumb",
  "Header",
  "Footer",
  "PageHeader",
  "FeedbackState",
  "Statistic",
  "ProgressBar",
  "Animated",
  "Pagination",
] as const;

const TIER3_HTML_PROTOTYPE_DOCS = ["Table", "AppShell"] as const;

const TIER2_HTML_PROTOTYPE_DOCS = [
  "Modal",
  "Drawer",
  "ConfirmDialog",
  "Toast",
  "BottomSheet",
] as const;

const TIER4_HTML_PROTOTYPE_DOCS = ["Dropdown"] as const;

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

  it("v1 docs include HTML prototype section", () => {
    for (const name of V1_HTML_PROTOTYPE_DOCS) {
      const text = readFileSync(`docs/${name}.md`, "utf8");
      expect(text, `docs/${name}.md`).toMatch(/## HTML prototype/);
    }
    const formControls = readFileSync("docs/FormControls.md", "utf8");
    expect(formControls).toMatch(/### HTML prototype \(Input\)/);
  });

  it("Tier 1 Wave B docs include HTML prototype section", () => {
    for (const name of TIER1_HTML_PROTOTYPE_DOCS) {
      const text = readFileSync(`docs/${name}.md`, "utf8");
      expect(text, `docs/${name}.md`).toMatch(/## HTML prototype/);
    }
  });

  it("Tier 3 docs include HTML prototype section", () => {
    for (const name of TIER3_HTML_PROTOTYPE_DOCS) {
      const text = readFileSync(`docs/${name}.md`, "utf8");
      expect(text, `docs/${name}.md`).toMatch(/## HTML prototype/);
      expect(text).toMatch(/data-cp-recipe/);
    }
  });

  it("Tier 2 overlay docs include HTML prototype section", () => {
    for (const name of TIER2_HTML_PROTOTYPE_DOCS) {
      const text = readFileSync(`docs/${name}.md`, "utf8");
      expect(text, `docs/${name}.md`).toMatch(/## HTML prototype/);
      expect(text).toMatch(/artboard root/i);
    }
  });

  it("Tier 4 floater docs include HTML prototype section", () => {
    for (const name of TIER4_HTML_PROTOTYPE_DOCS) {
      const text = readFileSync(`docs/${name}.md`, "utf8");
      expect(text, `docs/${name}.md`).toMatch(/## HTML prototype/);
    }
    const formControls = readFileSync("docs/FormControls.md", "utf8");
    expect(formControls).toMatch(/### HTML prototype \(Select\)/);
    expect(formControls).toMatch(/### HTML prototype \(Date\)/);
    expect(formControls).toMatch(/### HTML prototype \(ColorPicker\)/);
  });
});
