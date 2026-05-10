import { describe, expect, it } from "vitest";
import { buildCalendarWeeks } from "./calendar-matrix";

describe("buildCalendarWeeks", () => {
  it("returns 6 rows for May 2026 starting Sunday", () => {
    const may = new Date(2026, 4, 1);
    const weeks = buildCalendarWeeks(may, 0);
    expect(weeks.length >= 5).toBe(true);
    const flat = weeks.flat();
    expect(flat.some((c) => c.inCurrentMonth && c.date.getDate() === 1)).toBe(true);
    expect(flat.some((c) => c.inCurrentMonth && c.date.getDate() === 31)).toBe(true);
  });
  it("marks outside-month cells", () => {
    const may = new Date(2026, 4, 1);
    const weeks = buildCalendarWeeks(may, 0);
    const outs = weeks.flat().filter((c) => !c.inCurrentMonth);
    expect(outs.length).toBeGreaterThan(0);
  });
});
