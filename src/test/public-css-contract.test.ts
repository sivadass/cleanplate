import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HASHED_CLASS_RE } from "./css-modules-name";

const DIST_CSS = "dist/index.css";

describe("public CSS contract (post-unhash)", () => {
  // enable in Task 12
  it.skipIf(!existsSync(DIST_CSS))(
    "dist/index.css contains no CSS-module hashes",
    () => {
      const css = readFileSync(DIST_CSS, "utf8");
      expect(css).not.toMatch(HASHED_CLASS_RE);
    },
  );

  // enable in Task 12
  it.skipIf(!existsSync(DIST_CSS))(
    "component class selectors are cp- prefixed",
    () => {
      const css = readFileSync(DIST_CSS, "utf8");
      const selectors = [...css.matchAll(/\.([a-z][\w-]*)/gi)].map((m) => m[1]);
      const forbidden = selectors.filter(
        (s) =>
          !s.startsWith("cp-") &&
          !s.startsWith("toast-portal") &&
          s !== "open" &&
          s !== "active",
      );
      expect(
        forbidden,
        `non-cp selectors: ${forbidden.slice(0, 20).join(", ")}`,
      ).toEqual([]);
    },
  );
});
