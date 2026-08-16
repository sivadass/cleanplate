import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HASHED_CLASS_RE } from "./css-modules-name";

const DIST_CSS = "dist/index.css";

const ALLOWED_NON_CP_SELECTORS = new Set([
  "open",
  "active",
  "from",
  "to",
]);

describe("public CSS contract (post-unhash)", () => {
  it("dist/index.css contains no CSS-module hashes", () => {
    expect(existsSync(DIST_CSS)).toBe(true);
    const css = readFileSync(DIST_CSS, "utf8");
    expect(css).not.toMatch(HASHED_CLASS_RE);
    expect(css).toContain(".cp-button");
  });

  it("component class selectors are cp- prefixed", () => {
    const css = readFileSync(DIST_CSS, "utf8");
    const selectors = [...css.matchAll(/\.([a-z][\w-]*)/gi)].map((m) => m[1]);
    const forbidden = selectors.filter(
      (s) =>
        !s.startsWith("cp-") &&
        !s.startsWith("toast-portal") &&
        !ALLOWED_NON_CP_SELECTORS.has(s),
    );
    expect(
      forbidden,
      `non-cp selectors: ${forbidden.slice(0, 20).join(", ")}`,
    ).toEqual([]);
  });
});
