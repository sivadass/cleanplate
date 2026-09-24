import type { Option } from "../form-controls/Select";
import type {
  FilterBarDateRangeValue,
  FilterBarField,
  FilterBarFieldValue,
  FilterBarValues,
} from "./filter-bar-types";

export const DATE_RANGE_ERROR = "From must be on or before To";

export function emptyValue(field: FilterBarField): FilterBarFieldValue {
  switch (field.type) {
    case "search":
      return "";
    case "select":
      return null;
    case "multiSelect":
      return [];
    case "dateRange":
      return { from: null, to: null };
  }
}

export function readValue(field: FilterBarField, values: FilterBarValues): FilterBarFieldValue {
  if (!(field.id in values) || values[field.id] === undefined) {
    return emptyValue(field);
  }
  return values[field.id];
}

export function withFieldValue(
  values: FilterBarValues,
  id: string,
  next: FilterBarFieldValue,
): FilterBarValues {
  return { ...values, [id]: next };
}

function calendarParts(date: Date): [number, number, number] {
  return [date.getFullYear(), date.getMonth(), date.getDate()];
}

export function isCalendarDayAfter(from: Date, to: Date): boolean {
  const [fromYear, fromMonth, fromDay] = calendarParts(from);
  const [toYear, toMonth, toDay] = calendarParts(to);
  if (fromYear !== toYear) return fromYear > toYear;
  if (fromMonth !== toMonth) return fromMonth > toMonth;
  return fromDay > toDay;
}

export function sameCalendarDay(a: Date | null, b: Date | null): boolean {
  if (a === null || b === null) return a === b;
  return !isCalendarDayAfter(a, b) && !isCalendarDayAfter(b, a);
}

export function isDateRangeInvalid(value: FilterBarDateRangeValue): boolean {
  if (value.from === null || value.to === null) return false;
  return isCalendarDayAfter(value.from, value.to);
}

function isOption(value: FilterBarFieldValue): value is Option {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "value" in value &&
    !("from" in value)
  );
}

function isOptionArray(value: FilterBarFieldValue): value is Option[] {
  return Array.isArray(value);
}

function isDateRangeValue(value: FilterBarFieldValue): value is FilterBarDateRangeValue {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "from" in value &&
    "to" in value
  );
}

export function isFieldActive(field: FilterBarField, value: FilterBarFieldValue): boolean {
  switch (field.type) {
    case "search":
      return value !== "";
    case "select":
      return value !== null;
    case "multiSelect":
      return isOptionArray(value) && value.length > 0;
    case "dateRange":
      return isDateRangeValue(value) && (value.from !== null || value.to !== null);
  }
}

export function activeDrawerCount(fields: FilterBarField[], values: FilterBarValues): number {
  return fields.filter(
    (field) => field.placement === "drawer" && isFieldActive(field, readValue(field, values)),
  ).length;
}

function optionValues(value: FilterBarFieldValue): Array<string | number> | null {
  if (!isOptionArray(value)) return null;
  return value.map((option) => option.value);
}

export function drawerDraftEqualsCommitted(
  fields: FilterBarField[],
  committed: FilterBarValues,
  draft: FilterBarValues,
): boolean {
  return fields
    .filter((field) => field.placement === "drawer")
    .every((field) => {
      const left = readValue(field, committed);
      const right = readValue(field, draft);
      switch (field.type) {
        case "search":
          return left === right;
        case "select": {
          if (left === null || right === null) return left === right;
          if (!isOption(left) || !isOption(right)) return false;
          return left.value === right.value;
        }
        case "multiSelect": {
          const leftValues = optionValues(left);
          const rightValues = optionValues(right);
          if (leftValues === null || rightValues === null) return false;
          if (leftValues.length !== rightValues.length) return false;
          return leftValues.every((item, index) => item === rightValues[index]);
        }
        case "dateRange": {
          if (!isDateRangeValue(left) || !isDateRangeValue(right)) return false;
          return sameCalendarDay(left.from, right.from) && sameCalendarDay(left.to, right.to);
        }
      }
    });
}

export function dedupeFields(fields: FilterBarField[]): {
  fields: FilterBarField[];
  duplicateIds: string[];
} {
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const unique: FilterBarField[] = [];
  for (const field of fields) {
    if (seen.has(field.id)) {
      if (!duplicateIds.includes(field.id)) duplicateIds.push(field.id);
      continue;
    }
    seen.add(field.id);
    unique.push(field);
  }
  return { fields: unique, duplicateIds };
}
