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

  const committedMs = committed?.getTime() ?? null;
  const minBoundMs = args.constraints.minDate?.getTime();
  const maxBoundMs = args.constraints.maxDate?.getTime();
  const disabledDowKey =
    args.constraints.disabledDaysOfWeek?.join(",") ?? "";
  const disabledDatesTimes =
    args.constraints.disabledDates
      ?.map((d) => toCalendarDate(d).getTime())
      .join("|") ?? "";

  useEffect(() => {
    if (isOpen) return;
    const anchor = committed ?? new Date();
    const c = args.constraints;
    setDisplayedMonth(clampDisplayedMonth(startOfMonth(anchor), c));
  }, [
    isOpen,
    committed,
    committedMs,
    controlled,
    minBoundMs,
    maxBoundMs,
    disabledDowKey,
    disabledDatesTimes,
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
