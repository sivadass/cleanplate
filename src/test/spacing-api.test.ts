import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { getSpacingClass } from "../utils/common";

const styles = {
  "cp-m-b-2": "cp-m-b-2-hash",
  "cp-m-0": "cp-m-0-hash",
};

describe("getSpacingClass", () => {
  it("looks up cp-m-b-2", () => {
    expect(getSpacingClass("b-2", { "cp-m-b-2": "x" }, "cp-m")).toBe("x");
  });

  it("maps suffix 0 with prefix cp-m to cp-m-0", () => {
    expect(getSpacingClass("0", styles, "cp-m")).toBe("cp-m-0-hash");
  });

  it("throws in tests when value is already prefixed", () => {
    expect(() => getSpacingClass("m-0", styles, "cp-m")).toThrow(/suffix-only/);
  });

  it("returns empty string for unknown suffix", () => {
    expect(getSpacingClass("nope", styles, "cp-m")).toBe("");
  });

  it("no getSpacingClass still uses prefix m/p/g without cp-", () => {
    const out = execSync(
      `rg -n "getSpacingClass\\([^,]+,[^,]+,\\s*\\"(m|p|g)\\"" src || true`,
      { encoding: "utf8" },
    );
    expect(out.trim()).toBe("");
  });
});
