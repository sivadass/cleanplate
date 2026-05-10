import { describe, expect, it } from "vitest";
import {
  clampDateToConstraints,
  isDateUnavailable,
  isMonthFullyBeforeMin,
  isMonthFullyAfterMax,
} from "./date-constraints";
import { toCalendarDate } from "./normalize-date";

const constraints = {
  minDate: toCalendarDate(new Date(2026, 4, 5)),
  maxDate: toCalendarDate(new Date(2026, 4, 20)),
  disabledDates: [toCalendarDate(new Date(2026, 4, 12))],
  disabledDaysOfWeek: [0, 6] as number[],
};

describe("isDateUnavailable", () => {
  it("disables before min", () => {
    expect(isDateUnavailable(new Date(2026, 4, 4), constraints)).toBe(true);
  });
  it("disables after max", () => {
    expect(isDateUnavailable(new Date(2026, 4, 21), constraints)).toBe(true);
  });
  it("disables weekday Sunday", () => {
    expect(isDateUnavailable(new Date(2026, 4, 10), constraints)).toBe(true); // Sun
  });
  it("allows enabled weekday inside range", () => {
    expect(isDateUnavailable(new Date(2026, 4, 7), constraints)).toBe(false); // Thu
  });
  it("disables explicit blacklist", () => {
    expect(isDateUnavailable(new Date(2026, 4, 12), constraints)).toBe(true);
  });
});

describe("clampDateToConstraints", () => {
  it("returns min when before", () => {
    const d = clampDateToConstraints(new Date(2026, 3, 1), constraints);
    expect(d.getTime()).toBe(constraints.minDate.getTime());
  });
  it("returns max when after", () => {
    const d = clampDateToConstraints(new Date(2027, 0, 1), constraints);
    expect(d.getTime()).toBe(constraints.maxDate.getTime());
  });
});

describe("month navigation helpers", () => {
  it("detects month before min", () => {
    expect(isMonthFullyBeforeMin(new Date(2026, 3, 1), constraints.minDate)).toBe(
      true,
    );
  });
  it("detects month after max", () => {
    expect(isMonthFullyAfterMax(new Date(2026, 6, 1), constraints.maxDate)).toBe(
      true,
    );
  });
});
