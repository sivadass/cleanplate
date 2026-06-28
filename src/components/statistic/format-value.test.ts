import { describe, expect, it } from "vitest";
import { formatStatisticValue } from "./format-value";

describe("formatStatisticValue", () => {
  it("groups integer digits with default comma separator", () => {
    expect(formatStatisticValue(112893)).toBe("112,893");
  });

  it("applies precision with trailing zeros", () => {
    expect(formatStatisticValue(112893, { precision: 2 })).toBe("112,893.00");
  });

  it("supports custom group and decimal separators", () => {
    expect(
      formatStatisticValue(1234.56, {
        precision: 2,
        groupSeparator: " ",
        decimalSeparator: ",",
      }),
    ).toBe("1 234,56");
  });

  it("formats negative numbers with grouping", () => {
    expect(formatStatisticValue(-1234.5, { precision: 1 })).toBe("-1,234.5");
  });

  it("returns em dash for non-finite numbers", () => {
    expect(formatStatisticValue(Number.NaN)).toBe("—");
    expect(formatStatisticValue(Number.POSITIVE_INFINITY)).toBe("—");
    expect(formatStatisticValue(Number.NEGATIVE_INFINITY)).toBe("—");
  });

  it("passes strings through unchanged", () => {
    expect(formatStatisticValue("¥112,893")).toBe("¥112,893");
    expect(formatStatisticValue("1.2M users")).toBe("1.2M users");
  });

  it("formats small integers without unnecessary separators", () => {
    expect(formatStatisticValue(42)).toBe("42");
    expect(formatStatisticValue(0, { precision: 2 })).toBe("0.00");
  });
});
