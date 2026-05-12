import React, { useCallback, useEffect, useState } from "react";
import type { Locale } from "date-fns";
import { format } from "date-fns/format";
import getClassNames from "../../../utils/get-class-names";
import styles from "../FormControls.module.scss";
import type { ScrollPickItem } from "./ScrollPicker";

const COLS = 3;

function nextEnabledIndex(
  months: ScrollPickItem<number>[],
  from: number,
  step: number,
): number | null {
  let i = from + step;
  let guard = 0;
  while (guard < 12) {
    if (i < 0 || i > 11) return null;
    if (!months[i]?.disabled) return i;
    i += step;
    guard += 1;
  }
  return null;
}

function firstEnabled(months: ScrollPickItem<number>[]): number | null {
  for (let i = 0; i < 12; i += 1) {
    if (!months[i]?.disabled) return i;
  }
  return null;
}

function lastEnabled(months: ScrollPickItem<number>[]): number | null {
  for (let i = 11; i >= 0; i -= 1) {
    if (!months[i]?.disabled) return i;
  }
  return null;
}

export interface MonthPickerGridProps {
  months: ScrollPickItem<number>[];
  selectedMonthIndex: number;
  locale: Locale;
  ariaLabelledBy: string;
  onPick: (monthIndex: number) => void;
}

const MonthPickerGrid: React.FC<MonthPickerGridProps> = ({
  months,
  selectedMonthIndex,
  locale,
  ariaLabelledBy,
  onPick,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(() => {
    const m = months[selectedMonthIndex];
    if (m && !m.disabled) return selectedMonthIndex;
    return firstEnabled(months) ?? 0;
  });

  useEffect(() => {
    setFocusedIndex((prev) => {
      if (months[prev] && !months[prev].disabled) return prev;
      const cur = months[selectedMonthIndex];
      if (cur && !cur.disabled) return selectedMonthIndex;
      return firstEnabled(months) ?? 0;
    });
  }, [months, selectedMonthIndex]);

  const move = useCallback(
    (step: number) => {
      setFocusedIndex((prev) => {
        const next = nextEnabledIndex(months, prev, step);
        return next ?? prev;
      });
    },
    [months],
  );

  const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        move(1);
        return;
      case "ArrowLeft":
        event.preventDefault();
        move(-1);
        return;
      case "ArrowDown":
        event.preventDefault();
        move(COLS);
        return;
      case "ArrowUp":
        event.preventDefault();
        move(-COLS);
        return;
      case "Home":
        event.preventDefault();
        {
          const fi = firstEnabled(months);
          if (fi != null) setFocusedIndex(fi);
        }
        return;
      case "End":
        event.preventDefault();
        {
          const li = lastEnabled(months);
          if (li != null) setFocusedIndex(li);
        }
        return;
      default:
        return;
    }
  };

  return (
    <div
      role="grid"
      aria-labelledby={ariaLabelledBy}
      className={styles["cp-date-picker-month-grid"]}
      tabIndex={-1}
      onKeyDown={handleGridKeyDown}
    >
      {Array.from({ length: 4 }, (_, row) => (
        <div
          role="row"
          key={`month-row-${String(row)}`}
          className={styles["cp-date-picker-month-row"]}
        >
          {Array.from({ length: COLS }, (_, col) => {
            const monthIndex = row * COLS + col;
            const item = months[monthIndex];
            if (!item) return null;
            const selected = monthIndex === selectedMonthIndex;
            const focused = monthIndex === focusedIndex;
            const ariaLabel = format(new Date(2000, monthIndex, 1), "MMMM", {
              locale,
            });
            return (
              <div
                key={String(monthIndex)}
                role="gridcell"
                className={styles["cp-date-picker-month-cell"]}
              >
                <button
                  type="button"
                  aria-label={ariaLabel}
                  aria-selected={selected}
                  aria-disabled={item.disabled || undefined}
                  tabIndex={focused && !item.disabled ? 0 : -1}
                  disabled={item.disabled}
                  className={getClassNames(
                    styles["cp-date-picker-month-btn"],
                    selected && styles["cp-date-picker-day-selected"],
                  )}
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (!item.disabled) onPick(monthIndex);
                  }}
                  onKeyDown={(ev) => {
                    if (ev.key !== "Enter" && ev.key !== " ") return;
                    ev.preventDefault();
                    if (!item.disabled) onPick(monthIndex);
                  }}
                  onFocus={() => {
                    if (!item.disabled) setFocusedIndex(monthIndex);
                  }}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MonthPickerGrid;
