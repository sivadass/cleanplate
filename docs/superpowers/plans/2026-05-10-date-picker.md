# Date picker (`Date` form control) implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three-`Select` `Date` field with a calendar date picker that matches `docs/superpowers/specs/2026-05-10-date-picker-design.md` (staged OK/Cancel, popover + mobile sheet like `Select.tsx`, `date-fns` + tests).

**Architecture:** Pure `date-constraints` + `calendar-matrix` modules (unit-tested first), then `use-date-picker-state` (hook tests), then presentational pieces (`DatePickerHeader`, `DatePickerGrid`, `DatePickerFooter`, month/year lists), then `Date.tsx` composing **Floating UI** shell copied from the `Select.tsx` pattern (same `max-width: 768px` breakpoint, portal, backdrop, `translateY`, body scroll lock). No new UI framework.

**Tech Stack:** React 18, `date-fns` (granular imports), `@floating-ui/react`, SCSS modules (`FormControls.module.scss`), Vitest, `@testing-library/react`, jsdom, `@vitejs/plugin-react` for TSX tests.

**Spec:** `docs/superpowers/specs/2026-05-10-date-picker-design.md`

---

## File structure (creates / modifies)

| Path | Role |
|------|------|
| `package.json` | Add `date-fns`; add devDeps `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`, `@vitejs/plugin-react`, `vite`; add script `"test": "vitest run"`, `"test:watch": "vitest"` |
| `vitest.config.mts` | Vitest + React plugin + `environment: 'jsdom'` |
| `src/components/form-controls/date/date-types.ts` | Shared internal types (`CalendarCell`, constraint bag) |
| `src/components/form-controls/date/normalize-date.ts` | `toCalendarDate`, `calendarDatesEqual`, `formatISODate` |
| `src/components/form-controls/date/date-constraints.ts` | `isDateUnavailable`, navigation helpers |
| `src/components/form-controls/date/date-constraints.test.ts` | Unit tests |
| `src/components/form-controls/date/calendar-matrix.ts` | `buildCalendarWeeks` |
| `src/components/form-controls/date/calendar-matrix.test.ts` | Unit tests |
| `src/components/form-controls/date/use-date-picker-state.ts` | State machine |
| `src/components/form-controls/date/use-date-picker-state.test.tsx` | `renderHook` tests |
| `src/components/form-controls/date/ScrollPicker.tsx` | Reusable scroll list for month/year |
| `src/components/form-controls/date/DatePickerHeader.tsx` | Arrows + month/year buttons |
| `src/components/form-controls/date/DatePickerGrid.tsx` | `role="grid"` month |
| `src/components/form-controls/date/DatePickerFooter.tsx` | Cancel / OK |
| `src/components/form-controls/date/DatePickerPanel.tsx` | Composes header/grid/footer + subviews |
| `src/components/form-controls/date/use-date-picker-shell.ts` | Floating + mobile transitions (mirrors Select numbers) |
| `src/components/form-controls/Date.tsx` | Public API |
| `src/components/form-controls/FormControls.module.scss` | `.cp-date-picker-*` (+ reuse select tokens where possible) |
| `src/stories/form-controls/form-controls.stories.tsx` | New `Date` stories |
| `CHANGELOG.md` or `README` section | Breaking change note |

---

## Constants (keep aligned with Select)

Copy from `src/components/form-controls/Select.tsx`:

- Media query string: **`(max-width: 768px)`**
- `SELECT_MOBILE_SHEET_MS = 300`, desktop fade `200`

Either **duplicate** in `use-date-picker-shell.ts` / `Date.tsx` with a comment `// Keep in sync with Select.tsx`, or extract `form-controls/constants.ts` in a small refactor task (optional YAGNI: duplicate first).

---

### Task 0: Dependencies and Vitest scaffolding

**Files:**

- Modify: `package.json`
- Create: `vitest.config.mts`

- [ ] **Step 1: Apply `package.json` changes**

Merge into `dependencies`:

```json
"date-fns": "^4.1.0"
```

Merge into `devDependencies`:

```json
"@testing-library/jest-dom": "^6.6.3",
"@testing-library/react": "^16.3.0",
"@testing-library/user-event": "^14.6.1",
"@vitejs/plugin-react": "^4.7.0",
"@vitest/ui": "^3.2.0",
"jsdom": "^26.1.0",
"vite": "^6.4.1",
"vitest": "^3.2.0"
```

Add scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Run:

```bash
npm install
```

Expected: exits 0; `package-lock.json` updates.

- [ ] **Step 2: Add `vitest.config.mts`**

Create `vitest.config.mts`:

```typescript
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

Create `vitest.setup.ts` at repo root:

```typescript
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Verify empty test suite runs**

Create a throwaway `src/smoke.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("vitest", () => {
  it("runs", () => {
    expect(1).toBe(1);
  });
});
```

Run:

```bash
npm run test
```

Expected: **1 passed**.

Delete `src/smoke.test.ts`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vitest.config.mts vitest.setup.ts
git commit -m "chore: add date-fns, Vitest, and Testing Library"
```

---

### Task 1: `normalize-date.ts` — calendar-day helpers

**Files:**

- Create: `src/components/form-controls/date/normalize-date.ts`
- Create: `src/components/form-controls/date/normalize-date.test.ts`

- [ ] **Step 1: Write failing tests `normalize-date.test.ts`**

```typescript
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
```

Run:

```bash
npm run test -- src/components/form-controls/date/normalize-date.test.ts
```

Expected: **FAIL** (module missing).

- [ ] **Step 2: Implement `normalize-date.ts`**

```typescript
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
```

Run:

```bash
npm run test -- src/components/form-controls/date/normalize-date.test.ts
```

Expected: **PASS**.

- [ ] **Step 3: Commit**

```bash
git add src/components/form-controls/date/normalize-date.ts src/components/form-controls/date/normalize-date.test.ts
git commit -m "feat(date-picker): add calendar date normalization helpers"
```

---

### Task 2: `date-constraints.ts`

**Files:**

- Create: `src/components/form-controls/date/date-types.ts`
- Create: `src/components/form-controls/date/date-constraints.ts`
- Create: `src/components/form-controls/date/date-constraints.test.ts`

- [ ] **Step 1: Add `date-types.ts`**

```typescript
/** 0 Sun … 6 Sat — matches date-fns `getDay`. */
export type Constraints = {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
};
```

- [ ] **Step 2: Write failing tests (subset — expand inline if any fail during TDD)**

`src/components/form-controls/date/date-constraints.test.ts`:

```typescript
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
```

Run tests — expect **FAIL**.

- [ ] **Step 3: Implement `date-constraints.ts`**

```typescript
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
```

Adjust tests if `2026-4-10` weekday differs in local TZ — authors run tests in UTC or fix expected Sunday date. **Freeze expected dates using `new Date(year, monthIndex, day)`** (local) as above; if CI uses weird TZ, add `TZ=UTC` env in npm script optional.

Run:

```bash
npm run test -- src/components/form-controls/date/date-constraints.test.ts
```

Expected: **PASS**.

- [ ] **Step 4: Commit**

```bash
git add src/components/form-controls/date/date-types.ts src/components/form-controls/date/date-constraints.ts src/components/form-controls/date/date-constraints.test.ts
git commit -m "feat(date-picker): add date constraint helpers"
```

---

### Task 3: `calendar-matrix.ts`

**Files:**

- Create: `src/components/form-controls/date/calendar-matrix.ts`
- Create: `src/components/form-controls/date/calendar-matrix.test.ts`

- [ ] **Step 1: Failing tests**

```typescript
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
```

- [ ] **Step 2: Implementation**

```typescript
import { addDays } from "date-fns/addDays";
import { endOfMonth } from "date-fns/endOfMonth";
import { isSameMonth } from "date-fns/isSameMonth";
import { startOfMonth } from "date-fns/startOfMonth";
import { startOfWeek } from "date-fns/startOfWeek";

export type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
};

export function buildCalendarWeeks(
  displayedMonth: Date,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6,
): CalendarCell[][] {
  const monthStart = startOfMonth(displayedMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn });
  const monthEnd = endOfMonth(displayedMonth);

  const cells: CalendarCell[] = [];
  let cursor = gridStart;

  while (cells.length < 42) {
    cells.push({
      date: cursor,
      inCurrentMonth: isSameMonth(cursor, monthStart),
    });
    cursor = addDays(cursor, 1);
    if (cells.length >= 35 && cursor.getTime() > monthEnd.getTime()) {
      break;
    }
    if (cells.length === 42) break;
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      date: cursor,
      inCurrentMonth: isSameMonth(cursor, monthStart),
    });
    cursor = addDays(cursor, 1);
  }

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
```

If the loop logic fails tests (boundary), simplify to fixed **42 cells** (6 rows × 7) starting `startOfWeek(startOfMonth)` — always match Google Calendar style.

Run tests; fix implementation until **PASS**.

- [ ] **Step 3: Commit**

```bash
git add src/components/form-controls/date/calendar-matrix.ts src/components/form-controls/date/calendar-matrix.test.ts
git commit -m "feat(date-picker): build calendar week matrix"
```

---

### Task 4: `use-date-picker-state.ts` + hook tests

**Files:**

- Create: `src/components/form-controls/date/use-date-picker-state.ts`
- Create: `src/components/form-controls/date/use-date-picker-state.test.tsx`

**State rules:**

- **Controlled** when `value !== undefined`; **uncontrolled** when `value === undefined`, seed from `defaultValue ?? null`.
- On **open:** `staged = committed` (controlled: last `value`; uncontrolled: internal committed). If `committed` is null, `staged = firstAvailableFrom(today)` using `clampDateToConstraints(new Date(), c)` then forward **addDays** until `!isDateUnavailable` or **max 120** iterations (fallback: clamped date anyway).
- **confirm:** assign committed = staged (internal state); call `onChange(staged)`; `isOpen = false`; keep `displayedMonth` as-is unless you prefer syncing — **freeze:** `displayedMonth` unchanged on confirm.
- **cancel:** `staged = committed`; `isOpen = false` (committed comes from controlled `value` when controlled).
- **selectDay(d):** `staged = toCalendarDate(d)`; if day not in visible month bucket, **`displayedMonth = startOfMonth(d)`**.
- Month nav exposes `goPrevMonth` / `goNextMonth` mutating **`displayedMonth`** with **`addMonths`**, clamped so you never navigate into `isMonthFullyBeforeMin` / `isMonthFullyAfterMax` months (skip silently or clamp — **freeze:** clamp to nearest valid month).

- [ ] **Step 1: Write `use-date-picker-state.test.tsx`** (fail first)

Create `src/components/form-controls/date/use-date-picker-state.test.tsx`:

```tsx
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDatePickerState } from "./use-date-picker-state";

describe("useDatePickerState", () => {
  it("open copies committed calendar day to staged", () => {
    const d = new Date(2026, 4, 10);
    const { result } = renderHook(() =>
      useDatePickerState({
        value: d,
        defaultValue: undefined,
        onChange: vi.fn(),
        constraints: {},
      }),
    );
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.staged?.getFullYear()).toBe(2026);
    expect(result.current.staged?.getMonth()).toBe(4);
    expect(result.current.staged?.getDate()).toBe(10);
  });

  it("cancel restores staged from committed after selectDay", () => {
    const d = new Date(2026, 4, 10);
    const { result } = renderHook(() =>
      useDatePickerState({
        value: d,
        defaultValue: undefined,
        onChange: vi.fn(),
        constraints: {},
      }),
    );
    act(() => result.current.open());
    act(() => result.current.selectDay(new Date(2026, 4, 18)));
    expect(result.current.staged?.getDate()).toBe(18);
    act(() => result.current.cancel());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.staged?.getDate()).toBe(10);
  });

  it("confirm calls onChange and closes", () => {
    const d = new Date(2026, 4, 10);
    const fn = vi.fn();
    const { result } = renderHook(() =>
      useDatePickerState({
        value: d,
        defaultValue: undefined,
        onChange: fn,
        constraints: {},
      }),
    );
    act(() => result.current.open());
    act(() => result.current.selectDay(new Date(2026, 4, 12)));
    act(() => result.current.confirm());
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0].getDate()).toBe(12);
    expect(result.current.isOpen).toBe(false);
  });
});
```

Run:

```bash
npm run test -- src/components/form-controls/date/use-date-picker-state.test.tsx
```

Expected: **FAIL** (missing implementation).

- [ ] **Step 2: Implement `use-date-picker-state.ts`**

Create `src/components/form-controls/date/use-date-picker-state.ts`:

```typescript
import { addDays } from "date-fns/addDays";
import { addMonths } from "date-fns/addMonths";
import { startOfMonth } from "date-fns/startOfMonth";
import { useCallback, useEffect, useState } from "react";
import type { Constraints } from "./date-types";
import {
  clampDateToConstraints,
  isDateUnavailable,
  isMonthFullyAfterMax,
  isMonthFullyBeforeMin,
} from "./date-constraints";
import { toCalendarDate } from "./normalize-date";

export type PanelView = "calendar" | "month" | "year";

export interface UseDatePickerStateArgs {
  value: Date | null | undefined;
  defaultValue: Date | null | undefined;
  onChange?: (d: Date | null) => void;
  constraints: Constraints;
}

export interface UseDatePickerStateReturn {
  isOpen: boolean;
  panelView: PanelView;
  setPanelView: (v: PanelView) => void;
  committed: Date | null;
  staged: Date | null;
  displayedMonth: Date;
  open: () => void;
  close: () => void;
  cancel: () => void;
  confirm: () => void;
  selectDay: (d: Date) => void;
  clearCommitted: () => void;
  goPrevMonth: () => void;
  goNextMonth: () => void;
  setDisplayedMonthFromYearMonth: (year: number, monthIndex: number) => void;
}

function firstSelectableFrom(seed: Date, c: Constraints): Date {
  let x = clampDateToConstraints(seed, c);
  for (let i = 0; i < 120; i += 1) {
    if (!isDateUnavailable(x, c)) return x;
    x = clampDateToConstraints(addDays(x, 1), c);
  }
  return x;
}

/** Snap a calendar month anchor so min/max ranges always show a navigable month. */
function clampDisplayedMonth(monthStart: Date, c: Constraints): Date {
  if (isMonthFullyBeforeMin(monthStart, c.minDate) && c.minDate != null) {
    return startOfMonth(c.minDate);
  }
  if (isMonthFullyAfterMax(monthStart, c.maxDate) && c.maxDate != null) {
    return startOfMonth(c.maxDate);
  }
  return monthStart;
}

export function useDatePickerState(
  args: UseDatePickerStateArgs,
): UseDatePickerStateReturn {
  const controlled = args.value !== undefined;

  const [uncontrolledCommitted, setUncontrolledCommitted] =
    useState<Date | null>(() =>
      controlled ? null : args.defaultValue ?? null,
    );

  const committed = controlled ? args.value ?? null : uncontrolledCommitted;

  const [isOpen, setIsOpen] = useState(false);
  const [panelView, setPanelView] = useState<PanelView>("calendar");
  const [staged, setStaged] = useState<Date | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState<Date>(() =>
    clampDisplayedMonth(startOfMonth(committed ?? new Date()), args.constraints),
  );

  useEffect(() => {
    if (isOpen) return;
    const anchor = committed ?? new Date();
    setDisplayedMonth(
      clampDisplayedMonth(startOfMonth(anchor), args.constraints),
    );
  }, [
    args.constraints,
    isOpen,
    committed?.getFullYear?.(),
    committed?.getMonth?.(),
    committed?.getDate?.(),
    controlled,
    committed,
  ]);

  const pushCommitted = useCallback(
    (next: Date | null) => {
      if (!controlled) setUncontrolledCommitted(next);
      args.onChange?.(next);
    },
    [args, controlled],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setPanelView("calendar");
  }, []);

  const open = useCallback(() => {
    if (committed != null) {
      const cal = toCalendarDate(committed);
      setStaged(cal);
      setDisplayedMonth(
        clampDisplayedMonth(startOfMonth(cal), args.constraints),
      );
    } else {
      const seed = firstSelectableFrom(new Date(), args.constraints);
      setStaged(seed);
      setDisplayedMonth(
        clampDisplayedMonth(startOfMonth(seed), args.constraints),
      );
    }
    setPanelView("calendar");
    setIsOpen(true);
  }, [args.constraints, committed]);

  const cancel = useCallback(() => {
    setStaged(committed == null ? null : toCalendarDate(committed));
    close();
  }, [close, committed]);

  const confirm = useCallback(() => {
    if (staged == null) {
      pushCommitted(null);
    } else {
      const cal = clampDateToConstraints(staged, args.constraints);
      if (isDateUnavailable(cal, args.constraints)) {
        close();
        return;
      }
      pushCommitted(cal);
    }
    close();
  }, [args.constraints, close, pushCommitted, staged]);

  const selectDay = useCallback(
    (d: Date) => {
      const cal = clampDateToConstraints(toCalendarDate(d), args.constraints);
      setStaged(cal);
      setDisplayedMonth(
        clampDisplayedMonth(startOfMonth(cal), args.constraints),
      );
    },
    [args.constraints],
  );

  const clearCommitted = useCallback(() => {
    pushCommitted(null);
    setStaged(null);
    close();
  }, [close, pushCommitted]);

  const goPrevMonth = useCallback(() => {
    setDisplayedMonth((prev) =>
      clampDisplayedMonth(addMonths(prev, -1), args.constraints),
    );
  }, [args.constraints]);

  const goNextMonth = useCallback(() => {
    setDisplayedMonth((prev) =>
      clampDisplayedMonth(addMonths(prev, 1), args.constraints),
    );
  }, [args.constraints]);

  const setDisplayedMonthFromYearMonth = useCallback(
    (year: number, monthIndex: number) => {
      setDisplayedMonth(
        clampDisplayedMonth(
          startOfMonth(new Date(year, monthIndex, 1)),
          args.constraints,
        ),
      );
    },
    [args.constraints],
  );

  return {
    isOpen,
    panelView,
    setPanelView,
    committed,
    staged,
    displayedMonth,
    open,
    close,
    cancel,
    confirm,
    selectDay,
    clearCommitted,
    goPrevMonth,
    goNextMonth,
    setDisplayedMonthFromYearMonth,
  };
}
```

Run:

```bash
npm run test -- src/components/form-controls/date/use-date-picker-state.test.tsx
```

Expected: **PASS**. If **`confirm`** test fails because **`onChange`** is not invoked when controlled: in controlled mode **`pushCommitted` only forwards `args.onChange`** — parent updates **`value`**; re-render updates **`committed`**. **`uncontrolledCommitted`** stays unused when controlled (initial hook state `(controlled ? null : …)` avoids duplicating **`args.value`** in local state).

- [ ] **Step 3: Commit**

```bash
git add src/components/form-controls/date/use-date-picker-state.ts src/components/form-controls/date/use-date-picker-state.test.tsx
git commit -m "feat(date-picker): add useDatePickerState hook"
```

---

### Task 5: Presentational components

Implement in order (each file complete; each gets **one** RTL test file `DatePickerPanel.test.tsx` at end of task):

1. `ScrollPicker.tsx` — `role="listbox"` optional; scroll container; `onPick(value)`.
2. `DatePickerHeader.tsx` — props: `displayedMonth`, `locale`, `weekStartsOn` irrelevant here; `onPrevMonth`, `onNextMonth`, `prevDisabled`, `nextDisabled`, `onOpenMonth`, `onOpenYear`, `monthLabel`, `yearLabel`.
3. `DatePickerGrid.tsx` — props: `weeks`, `weekdayLabels`, `staged`, `today`, `isDateDisabled`, `onSelectDay`, `focusedDate`, `onRequestFocus` for keyboard.
4. `DatePickerFooter.tsx` — Cancel / OK buttons.
5. `DatePickerPanel.tsx` — switches `panelView` between `calendar | month | year`; wires children.

**Keyboard note:** Implement roving `tabIndex` on gridcells: only one `tabIndex={0}` at a time; arrows move `focusedDate`. Enter/Space stages day. PageUp/Down change month on grid. Home/End jump to first/last **navigable** day in month (skip disabled).

- [ ] **RTL test `DatePickerPanel.test.tsx`:** open panel (wrap with state), click day, click OK — expect `onChange` called once with that date.

- [ ] **Commit:** `feat(date-picker): add DatePickerPanel UI`

---

### Task 6: Shell — `useDatePickerFloating` inside `Date.tsx`

Mirror `Select.tsx` lines roughly **253–867** (`useFloating`, `FloatingPortal`, `useClick`, `useDismiss`, transition classes `selectPanelEntered` / `exitAnimating` pattern).

**Concrete requirements:**

- `useDismiss`: `outsidePress` → call state `cancel()` then `onClose` (mirror close sequence).
- **Escape:** `useDismiss` already listens; pipe to **cancel**.
- Desktop: **`width: 280`**, **`flip`, `shift`, `offset(4)`, `padding: 8`**, **`autoUpdate`** — **omit** Select’s `size` width-to-reference behavior (spec: fixed **280px**).
- Mobile: reuse classes **`cp-select-mobile-backdrop`**, **`cp-select-mobile-sheet`**, **`cp-select-mobile-sheet-entered`** OR duplicate with **`cp-date-picker-*`** aliases in SCSS that `@extend` select classes (preferred to avoid divergence).

- [ ] **Commit:** `feat(date-picker): add floating portal and mobile sheet`

---

### Task 7: `Date.tsx` public component

Replace `src/components/form-controls/Date.tsx`:

- Props per design spec §9 (**`isDisabled`**, **`readOnly`** optional, **`popoverPlacement`**, **`clearable`**, **`name` hidden ISO**, **`dateFormat`**, **`locale`**, etc.).
- Trigger: looks like `Select` trigger (reuse `cp-select-field-header` / create `cp-date-picker-trigger` matching height).
- `readOnly` + `isDisabled` block open.
- `useId` for ids; `aria-expanded`, `aria-controls`, `aria-invalid` from `error`.

- [ ] **Commit:** `feat(date-picker): replace Date form control with calendar picker`

---

### Task 8: SCSS

- Add **`cp-date-picker-*`** tokens; **`--cp-date-picker-panel`** width **280px** on desktop sheet/panel wrapper.
- Match wireframe: large radius, muted panel background — use existing form token colors where possible.
- **44px** min tap targets on header arrows and grid cells (`min-height` / `padding`).

- [ ] **Commit:** `style(date-picker): add panel and grid presentation`

---

### Task 9: Storybook

In `src/stories/form-controls/form-controls.stories.tsx`, add **`Date`** stories:

- Default controlled with `useState`.
- **`minDate` / `maxDate`** DOB example.
- **`disabledDaysOfWeek`**.

Manual: shrink viewport `< 768px` to visually verify sheet.

- [ ] **Commit:** `docs(storybook): add Date picker stories`

---

### Task 10: Barrel exports & migration note

- `src/components/form-controls/index.ts` — export **`DateProps`** reflecting new typings (remove old string `onChange`).
- Root `CHANGELOG.md` (**create** if missing): **Breaking:** `Date` API migration paragraph.

Run:

```bash
npm run type-check
npm run test
npm run storybook
```

Smoke Storybook `/Date` manually.

- [ ] **Commit:** `docs: document Date picker breaking API change`

---

## Spec coverage checklist (plan self-review)

| Spec section | Task |
|--------------|------|
| Staged OK / Cancel | Task 4, 5, 6 |
| Outside dismiss = Cancel | Task 6 (`useDismiss` + cancel) |
| min/max/disabled weekdays/dates | Task 2, wired in Tasks 5–7 |
| Popover 280px + flip/shift | Task 6 |
| Mobile sheet + scroll lock | Task 6–8 |
| Hidden `YYYY-MM-DD` | Task 7 |
| `date-fns` granular imports | Tasks 1–3, 7 |
| ARIA grid + Tab trap | Task 5 (Tab cycle within dialog: implement `onKeyDown` at panel root capturing Tab) |
| `isDisabled` naming | Task 7 |
| TDD order | Tasks 1–5 |

---

## Execution handoff

**Plan complete** and saved to `docs/superpowers/plans/2026-05-10-date-picker.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task; review between tasks (`superpowers:subagent-driven-development`).
2. **Inline execution** — run tasks in one session (`superpowers:executing-plans`).

Which approach do you want?
