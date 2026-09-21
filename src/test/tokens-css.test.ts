import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("tokens.css", () => {
  it("source tokens.css exposes spacing and brand tokens", () => {
    const css = readFileSync("src/styles/tokens.css", "utf8");
    expect(css).toContain("--space-4");
    expect(css).toContain("--primary-brand");
    expect(css).not.toContain(".cp-button");
    expect(css).not.toMatch(/^\* \{/m);
    expect(css).toContain("--cp-form-control-radius-small: var(--radius-medium)");
    expect(css).toContain("--cp-form-control-radius-medium: var(--radius-large)");
    expect(css).toContain("--cp-form-control-radius-large: var(--radius-x-large)");
    expect(css).toContain("--cp-form-control-height-small: 32px");
    expect(css).toContain("--cp-form-control-height-medium: 44px");
    expect(css).toContain("--cp-form-control-height-large: 52px");
    expect(css).not.toContain("--cp-button-height-small");
    expect(css).not.toContain("--cp-button-font-small");
    expect(css).not.toContain("--cp-button-pad-x-small");
    expect(css).not.toContain("--cp-button-icon-small");
    expect(css).not.toContain("--cp-button-gap-small");
    expect(css).not.toContain("--cp-form-control-font-small");
    expect(css).not.toContain("--cp-form-control-pad-x-small");
    expect(css).not.toContain("--cp-form-control-icon-small");
    expect(css).not.toContain("--cp-form-control-textarea-min-small");
  });

  it("dist/tokens.css is copied by build-package", () => {
    expect(existsSync("dist/tokens.css")).toBe(true);
    const css = readFileSync("dist/tokens.css", "utf8");
    expect(css).toContain("--space-4");
    expect(css).toContain("--primary-brand");
    expect(css).not.toContain(".cp-button");
  });
});
