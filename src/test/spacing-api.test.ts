import { describe, expect, it } from "vitest";
import { getSpacingClass } from "../utils/common";

const styles = {
  "m-b-2": "m-b-2-hash",
  "m-0": "m-0-hash",
  "m-m-0": undefined,
  "cp-m-b-2": "cp-m-b-2-hash",
  "cp-m-0": "cp-m-0-hash",
};

describe("getSpacingClass", () => {
  it("maps suffix b-2 with prefix m to m-b-2 (legacy keys, pre-rename)", () => {
    expect(getSpacingClass("b-2", styles, "m")).toBe("m-b-2-hash");
  });

  it("maps suffix 0 with prefix m to m-0", () => {
    expect(getSpacingClass("0", styles, "m")).toBe("m-0-hash");
  });

  it("throws in tests when value is already prefixed", () => {
    expect(() => getSpacingClass("m-0", styles, "m")).toThrow(/suffix-only/);
  });

  it("returns empty string for unknown suffix rather than the string 'm-0'", () => {
    expect(getSpacingClass("nope", styles, "m")).toBe("");
  });
});
