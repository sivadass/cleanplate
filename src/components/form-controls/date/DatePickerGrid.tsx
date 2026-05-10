import React, { useEffect, useMemo, useCallback } from "react";
import type { Locale } from "date-fns";
import { format } from "date-fns/format";
import getClassNames from "../../../utils/get-class-names";
import styles from "../FormControls.module.scss";
import type { CalendarCell } from "./calendar-matrix";
import { calendarDatesEqual, toCalendarDate } from "./normalize-date";

export interface DatePickerGridProps {
  weeks: CalendarCell[][];
  weekLabels: string[];
  locale: Locale;
  staged: Date | null;
  today: Date;
  isDayUnavailable: (d: Date) => boolean;
  onSelectDay: (d: Date) => void;
  onRequestPrevMonth?: () => void;
  onRequestNextMonth?: () => void;
  gridLabelId?: string;
}

function flatWeeks(weeks: CalendarCell[][]): CalendarCell[] {
  return weeks.flat();
}

const DatePickerGrid: React.FC<DatePickerGridProps> = ({
  weeks,
  weekLabels,
  locale,
  staged,
  today,
  isDayUnavailable,
  onSelectDay,
  onRequestPrevMonth,
  onRequestNextMonth,
  gridLabelId,
}) => {
  const flat = useMemo(() => flatWeeks(weeks), [weeks]);

  const navigableFlatIndexes = useMemo(() => {
    const out: number[] = [];
    flat.forEach((cell, idx) => {
      if (!isDayUnavailable(cell.date)) out.push(idx);
    });
    return out;
  }, [flat, isDayUnavailable]);

  const [focusedFlatIndex, setFocusedFlatIndex] = React.useState<number | null>(
    null,
  );

  useEffect(() => {
    if (staged) {
      const t = toCalendarDate(staged).getTime();
      const idx = flat.findIndex(
        (c) => toCalendarDate(c.date).getTime() === t,
      );
      if (idx >= 0) setFocusedFlatIndex(idx);
    }
  }, [flat, staged]);

  const moveFocusInNavigable = useCallback(
    (delta: number) => {
      if (navigableFlatIndexes.length === 0) return;
      const pos =
        focusedFlatIndex != null
          ? navigableFlatIndexes.indexOf(focusedFlatIndex)
          : null;
      const base =
        pos == null
          ? delta > 0
            ? -1
            : navigableFlatIndexes.length
          : pos;
      const next = Math.min(
        navigableFlatIndexes.length - 1,
        Math.max(0, base + delta),
      );
      setFocusedFlatIndex(navigableFlatIndexes[next]);
    },
    [focusedFlatIndex, navigableFlatIndexes],
  );

  const moveFocusRow = useCallback(
    (rowDelta: number) => {
      if (focusedFlatIndex == null) {
        if (navigableFlatIndexes[0] != null) {
          setFocusedFlatIndex(navigableFlatIndexes[0]);
        }
        return;
      }
      const row = Math.floor(focusedFlatIndex / 7);
      const col = focusedFlatIndex % 7;
      const targetRow = row + rowDelta;
      if (targetRow < 0) {
        onRequestPrevMonth?.();
        return;
      }
      if (targetRow >= weeks.length) {
        onRequestNextMonth?.();
        return;
      }
      const targetIndex = targetRow * 7 + col;
      if (targetIndex >= flat.length) return;
      if (isDayUnavailable(flat[targetIndex].date)) {
        const sign = rowDelta < 0 ? -1 : 1;
        let scan = targetIndex;
        while (scan >= 0 && scan < flat.length) {
          if (!isDayUnavailable(flat[scan].date)) {
            setFocusedFlatIndex(scan);
            return;
          }
          scan += sign;
        }
        return;
      }
      setFocusedFlatIndex(targetIndex);
    },
    [
      flat,
      focusedFlatIndex,
      isDayUnavailable,
      navigableFlatIndexes,
      onRequestNextMonth,
      onRequestPrevMonth,
      weeks.length,
    ],
  );

  const homeEndInMonth = useCallback(
    (toEnd: boolean) => {
      const inMonth = flat
        .map((cell, idx) => ({ cell, idx }))
        .filter(({ cell }) => cell.inCurrentMonth && !isDayUnavailable(cell.date));
      if (inMonth.length === 0) return;
      setFocusedFlatIndex(
        toEnd ? inMonth[inMonth.length - 1].idx : inMonth[0].idx,
      );
    },
    [flat, isDayUnavailable],
  );

  const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveFocusInNavigable(1);
        return;
      case "ArrowLeft":
        event.preventDefault();
        moveFocusInNavigable(-1);
        return;
      case "ArrowDown":
        event.preventDefault();
        moveFocusRow(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        moveFocusRow(-1);
        return;
      case "PageUp":
        event.preventDefault();
        onRequestPrevMonth?.();
        return;
      case "PageDown":
        event.preventDefault();
        onRequestNextMonth?.();
        return;
      case "Home":
        event.preventDefault();
        homeEndInMonth(false);
        return;
      case "End":
        event.preventDefault();
        homeEndInMonth(true);
        return;
      default:
        return;
    }
  };

  return (
    <div
      role="grid"
      aria-labelledby={gridLabelId}
      className={styles["cp-date-picker-grid"]}
      tabIndex={-1}
      onKeyDown={handleGridKeyDown}
    >
      <div role="row" className={styles["cp-date-picker-weekdays"]}>
        {weekLabels.map((abbr, col) => (
          <span
            key={`dow-${String(col)}-${abbr}`}
            role="columnheader"
            aria-label={abbr}
            className={styles["cp-date-picker-weekday"]}
          >
            {abbr}
          </span>
        ))}
      </div>
      {weeks.map((row, r) => (
        <div role="row" key={`w-${String(r)}`} className={styles["cp-date-picker-row"]}>
          {row.map((cell, cIdx) => {
            const flatIdx = r * row.length + cIdx;
            const disabled = isDayUnavailable(cell.date);
            const sel =
              staged != null && calendarDatesEqual(cell.date, staged);
            const isTodayCell = calendarDatesEqual(cell.date, today);
            const focused = focusedFlatIndex === flatIdx;
            return (
              <div
                key={String(cell.date.getTime())}
                role="gridcell"
                className={styles["cp-date-picker-cell"]}
              >
                <button
                  type="button"
                  aria-label={format(cell.date, "PPP", { locale })}
                  aria-selected={Boolean(sel)}
                  aria-disabled={disabled || undefined}
                  tabIndex={focused && !disabled ? 0 : -1}
                  disabled={disabled}
                  className={getClassNames(
                    styles["cp-date-picker-day"],
                    !cell.inCurrentMonth &&
                      styles["cp-date-picker-day-outside-month"],
                    isTodayCell && styles["cp-date-picker-day-today"],
                    sel && styles["cp-date-picker-day-selected"],
                  )}
                  data-flat-index={flatIdx}
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (!disabled) onSelectDay(cell.date);
                  }}
                  onKeyDown={(ev) => {
                    if (
                      ev.key !== "Enter" &&
                      ev.key !== " "
                    ) return;
                    ev.preventDefault();
                    if (!disabled) onSelectDay(cell.date);
                  }}
                  onFocus={() => {
                    if (!disabled) setFocusedFlatIndex(flatIdx);
                  }}
                >
                  {cell.date.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default DatePickerGrid;
