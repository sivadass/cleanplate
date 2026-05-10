import { endOfMonth } from "date-fns/endOfMonth";
import { getDay } from "date-fns/getDay";
import { startOfMonth } from "date-fns/startOfMonth";
import type { Constraints } from "./date-types";
import { calendarDatesEqual, toCalendarDate } from "./normalize-date";

function hasMin(minDate?: Date): minDate is Date {
  return minDate != null;
}

function hasMax(maxDate?: Date): maxDate is Date {
  return maxDate != null;
}

/** True if selecting this calendar date is forbidden. */
export function isDateUnavailable(d: Date, c: Constraints): boolean {
  const day = toCalendarDate(d).getTime();
  if (hasMin(c.minDate) && day < toCalendarDate(c.minDate).getTime()) {
    return true;
  }
  if (hasMax(c.maxDate) && day > toCalendarDate(c.maxDate).getTime()) {
    return true;
  }
  const dow = getDay(toCalendarDate(d));
  if (c.disabledDaysOfWeek?.includes(dow)) {
    return true;
  }
  if (
    c.disabledDates?.some((bd) =>
      calendarDatesEqual(toCalendarDate(bd), toCalendarDate(d)),
    )
  ) {
    return true;
  }
  return false;
}

export function clampDateToConstraints(d: Date, c: Constraints): Date {
  let x = toCalendarDate(d);
  if (hasMin(c.minDate) && x.getTime() < toCalendarDate(c.minDate).getTime()) {
    x = toCalendarDate(c.minDate);
  }
  if (hasMax(c.maxDate) && x.getTime() > toCalendarDate(c.maxDate).getTime()) {
    x = toCalendarDate(c.maxDate);
  }
  return x;
}

export function isMonthFullyBeforeMin(month: Date, minDate?: Date): boolean {
  if (!hasMin(minDate)) return false;
  const end = endOfMonth(month);
  return end.getTime() < toCalendarDate(minDate).getTime();
}

export function isMonthFullyAfterMax(month: Date, maxDate?: Date): boolean {
  if (!hasMax(maxDate)) return false;
  const start = startOfMonth(month);
  return start.getTime() > toCalendarDate(maxDate).getTime();
}
