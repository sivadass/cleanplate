import { format } from "date-fns/format";
import { startOfDay } from "date-fns/startOfDay";

/** Local calendar midnight for comparisons and hidden-field values. */
export function toCalendarDate(d: Date): Date {
  return startOfDay(d);
}

export function calendarDatesEqual(a: Date | null, b: Date | null): boolean {
  if (a == null || b == null) return a === b;
  const ca = toCalendarDate(a).getTime();
  const cb = toCalendarDate(b).getTime();
  return ca === cb;
}

export function formatISODate(d: Date): string {
  return format(toCalendarDate(d), "yyyy-MM-dd");
}
