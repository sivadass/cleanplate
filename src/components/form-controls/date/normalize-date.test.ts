import { describe, expect, it } from "vitest";
import {
  calendarDatesEqual,
  formatISODate,
  toCalendarDate,
} from "./normalize-date";

describe("toCalendarDate", () => {
  it("normalizes time to local start of calendar day", () => {
    const d = new Date(2026, 4, 10, 15, 30, 45);
    const cal = toCalendarDate(d);
    expect(cal.getFullYear()).toBe(2026);
    expect(cal.getMonth()).toBe(4);
    expect(cal.getDate()).toBe(10);
    expect(cal.getHours()).toBe(0);
    expect(cal.getMinutes()).toBe(0);
    expect(cal.getSeconds()).toBe(0);
    expect(cal.getMilliseconds()).toBe(0);
  });
});

describe("calendarDatesEqual", () => {
  it("matches same calendar day ignoring time", () => {
    expect(
      calendarDatesEqual(new Date(2026, 0, 5, 3), new Date(2026, 0, 5, 22)),
    ).toBe(true);
  });
  it("returns false for different days", () => {
    expect(calendarDatesEqual(new Date(2026, 0, 5), new Date(2026, 0, 6))).toBe(
      false,
    );
  });
});

describe("formatISODate", () => {
  it("formats as YYYY-MM-DD", () => {
    expect(formatISODate(new Date(2026, 4, 10))).toBe("2026-05-10");
  });
  it("zero-pads month and day", () => {
    expect(formatISODate(new Date(2026, 0, 2))).toBe("2026-01-02");
  });
});
