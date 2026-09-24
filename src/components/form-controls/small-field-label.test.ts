import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const formScss = readFileSync(
  resolve("src/components/form-controls/FormControls.module.scss"),
  "utf8",
);
const filterScss = readFileSync(
  resolve("src/components/filter-bar/FilterBar.module.scss"),
  "utf8",
);
const docs = readFileSync(resolve("docs/FormControls.md"), "utf8");

describe("small field label size", () => {
  it("sets a 12px label token on small fields and 16px otherwise", () => {
    expect(formScss).toMatch(
      /\.cp-form-field--small\s*\{[^}]*--cp-form-label-font:\s*var\(--cp-font-size-xs\)/,
    );
    expect(formScss).toMatch(
      /\.cp-form-field--medium\s*\{[^}]*--cp-form-label-font:\s*var\(--font-size\)/,
    );
    expect(formScss).toMatch(
      /\.cp-form-field--large\s*\{[^}]*--cp-form-label-font:\s*var\(--font-size\)/,
    );
    expect(formScss).toMatch(
      /\.cp-form-label\s*\{[^}]*font-size:\s*var\(--cp-form-label-font,\s*var\(--font-size\)\)/,
    );
  });

  it("matches the filter bar spacer to the small label box", () => {
    expect(filterScss).toMatch(
      /\.cp-filter-bar__button-label\s*\{[^}]*font-size:\s*var\(--cp-font-size-xs\)/,
    );
    expect(filterScss).toMatch(
      /\.cp-filter-bar__button-label\s*\{[^}]*line-height:\s*1;/,
    );
  });

  it("documents scaled labels", () => {
    expect(docs).toContain("12px on small");
    expect(docs).not.toContain("Field labels (`.cp-form-label`) do not scale.");
  });

  it("sets small trigger icons to 20px with a selector that beats Icon sizes", () => {
    expect(formScss).toMatch(
      /\.cp-form-field--small\s*\{[^}]*--cp-form-control-icon:\s*20px/,
    );
    expect(formScss).toContain(".cp-select-field-arrow.cp-icon.cp-icon");
    expect(formScss).toContain(".cp-input-search-clear .cp-icon.cp-icon");
    expect(formScss).toContain(".cp-stepper-btn .cp-icon.cp-icon");
    expect(formScss).toContain(".cp-file-trigger-button .cp-icon.cp-icon");
    expect(formScss).toContain(".cp-select-trigger-clear .cp-icon.cp-icon");
    expect(formScss).toMatch(
      /\.cp-form-field--small \.cp-select-trigger-clear\s*\{[^}]*width:\s*24px/,
    );
    expect(formScss).toMatch(
      /\.cp-form-field--small \.cp-select-trigger-clear \.cp-icon\.cp-icon\s*\{[^}]*font-size:\s*16px/,
    );
  });
});
