import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("tokens.css", () => {
  it("source tokens.css exposes spacing and brand tokens", () => {
    const css = readFileSync("src/styles/tokens.css", "utf8");
    expect(css).toContain("--space-4");
    expect(css).toContain("--primary-brand");
    expect(css).not.toContain(".cp-button");
    expect(css).not.toMatch(/^\* \{/m);
    expect(css).toContain("--cp-button-height-small: 32px");
    expect(css).toContain("--cp-button-height-medium: 44px");
    expect(css).toContain("--cp-button-height-large: 52px");
    expect(css).not.toContain("--cp-button-font-small");
    expect(css).not.toContain("--cp-button-pad-x-small");
    expect(css).not.toContain("--cp-button-icon-small");
    expect(css).not.toContain("--cp-button-gap-small");
  });

  it("dist/tokens.css is copied by build-package", () => {
    expect(existsSync("dist/tokens.css")).toBe(true);
    const css = readFileSync("dist/tokens.css", "utf8");
    expect(css).toContain("--space-4");
    expect(css).toContain("--primary-brand");
    expect(css).not.toContain(".cp-button");
  });
});
