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

/**
 * Bounds and lists often arrive as plain `Date` at runtime — but Storybook Controls
 * `date` knobs and serialized props may pass milliseconds (`number`) or ISO strings.
 * Returns `undefined` when the value cannot be parsed.
 */
export function coerceToCalendarDate(input: unknown): Date | undefined {
  if (input == null || input === "") return undefined;
  if (input instanceof Date) {
    const t = input.getTime();
    return Number.isNaN(t) ? undefined : toCalendarDate(input);
  }
  if (typeof input === "number" && Number.isFinite(input)) {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? undefined : toCalendarDate(d);
  }
  if (typeof input === "string" && input.trim() !== "") {
    const trimmed = input.trim();
    if (/^-?\d+$/.test(trimmed)) {
      const num = Number(trimmed);
      if (Number.isFinite(num)) {
        const d = new Date(num);
        return Number.isNaN(d.getTime()) ? undefined : toCalendarDate(d);
      }
    }
    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? undefined : toCalendarDate(d);
  }
  return undefined;
}

/** Coerces each entry; drops unparseable items. Returns `undefined` if the array is empty/omitted. */
export function coerceToCalendarDates(inputs: unknown[] | undefined): Date[] | undefined {
  if (!inputs?.length) return undefined;
  const out: Date[] = [];
  for (const x of inputs) {
    const d = coerceToCalendarDate(x);
    if (d) out.push(d);
  }
  return out.length ? out : undefined;
}
