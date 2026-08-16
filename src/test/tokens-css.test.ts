import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("tokens.css", () => {
  it("source tokens.css exposes spacing and brand tokens", () => {
    const css = readFileSync("src/styles/tokens.css", "utf8");
    expect(css).toContain("--space-4");
    expect(css).toContain("--primary-brand");
    expect(css).not.toContain(".cp-button");
    expect(css).not.toMatch(/^\* \{/m);
  });

  it("dist/tokens.css is copied by build-package", () => {
    expect(existsSync("dist/tokens.css")).toBe(true);
    const css = readFileSync("dist/tokens.css", "utf8");
    expect(css).toContain("--space-4");
    expect(css).toContain("--primary-brand");
    expect(css).not.toContain(".cp-button");
  });
});
