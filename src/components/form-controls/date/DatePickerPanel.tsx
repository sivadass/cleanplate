import React, { useMemo } from "react";
import type { Locale } from "date-fns";
import { addDays } from "date-fns/addDays";
import { addMonths } from "date-fns/addMonths";
import { addYears } from "date-fns/addYears";
import { format } from "date-fns/format";
import { startOfMonth } from "date-fns/startOfMonth";
import { startOfWeek } from "date-fns/startOfWeek";
import { enUS } from "date-fns/locale/en-US";
import { buildCalendarWeeks } from "./calendar-matrix";
import type { Constraints } from "./date-types";
import DatePickerFooter from "./DatePickerFooter";
import DatePickerGrid from "./DatePickerGrid";
import DatePickerHeader from "./DatePickerHeader";
import ScrollPicker from "./ScrollPicker";
import {
  isDateUnavailable,
  isMonthFullyAfterMax,
  isMonthFullyBeforeMin,
} from "./date-constraints";
import { toCalendarDate } from "./normalize-date";
import type { UseDatePickerStateReturn } from "./use-date-picker-state";
import Icon from "../../icon";
import styles from "../FormControls.module.scss";

export interface DatePickerPanelProps {
  panelId: string;
  gridLabelId: string;
  locale?: Locale;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  constraints: Constraints;
  picker: UseDatePickerStateReturn;
  /** Footer Cancel / OK callbacks (defaults to picker cancel/confirm); use for coordinated close animations. */
  onRequestCancel?: () => void;
  onRequestConfirm?: () => void;
}

const DatePickerPanel: React.FC<DatePickerPanelProps> = ({
  panelId,
  gridLabelId,
  locale = enUS,
  weekStartsOn,
  constraints,
  picker,
  onRequestCancel,
  onRequestConfirm,
}) => {
  const loc = locale;
  const weeks = useMemo(
    () => buildCalendarWeeks(picker.displayedMonth, weekStartsOn),
    [picker.displayedMonth, weekStartsOn],
  );

  const weekLabels = useMemo(() => {
    const monthStart = startOfMonth(picker.displayedMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn });
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(gridStart, i), "EEEEE", { locale: loc }),
    );
  }, [loc, picker.displayedMonth, weekStartsOn]);

  const monthLabelShort = format(picker.displayedMonth, "MMM", { locale: loc });
  const yearLabel = format(picker.displayedMonth, "yyyy", { locale: loc });

  const today = useMemo(() => toCalendarDate(new Date()), []);

  const isDayUnavailable = (d: Date) => isDateUnavailable(d, constraints);

  const prevMonthAnchor = startOfMonth(
    addMonths(picker.displayedMonth, -1),
  );
  const nextMonthAnchor = startOfMonth(
    addMonths(picker.displayedMonth, 1),
  );
  const prevMonthDisabled = isMonthFullyBeforeMin(
    prevMonthAnchor,
    constraints.minDate,
  );
  const nextMonthDisabled = isMonthFullyAfterMax(
    nextMonthAnchor,
    constraints.maxDate,
  );

  const prevYearAnchor = startOfMonth(
    addYears(picker.displayedMonth, -1),
  );
  const nextYearAnchor = startOfMonth(
    addYears(picker.displayedMonth, 1),
  );
  const prevYearDisabled = isMonthFullyBeforeMin(
    prevYearAnchor,
    constraints.minDate,
  );
  const nextYearDisabled = isMonthFullyAfterMax(
    nextYearAnchor,
    constraints.maxDate,
  );

  const onPrevYear = () => {
    picker.setDisplayedMonthFromYearMonth(
      picker.displayedMonth.getFullYear() - 1,
      picker.displayedMonth.getMonth(),
    );
  };

  const onNextYear = () => {
    picker.setDisplayedMonthFromYearMonth(
      picker.displayedMonth.getFullYear() + 1,
      picker.displayedMonth.getMonth(),
    );
  };

  const yearItems = useMemo(() => {
    const yMin =
      constraints.minDate?.getFullYear() ??
      picker.displayedMonth.getFullYear() - 100;
    const yMax =
      constraints.maxDate?.getFullYear() ??
      picker.displayedMonth.getFullYear() + 100;
    const items: { value: number; label: string; disabled?: boolean }[] = [];
    for (let y = yMin; y <= yMax; y += 1) {
      const anchor = startOfMonth(new Date(y, picker.displayedMonth.getMonth(), 1));
      const disabled =
        isMonthFullyBeforeMin(anchor, constraints.minDate) ||
        isMonthFullyAfterMax(anchor, constraints.maxDate);
      items.push({ value: y, label: String(y), disabled });
    }
    return items;
  }, [
    constraints.maxDate,
    constraints.minDate,
    picker.displayedMonth,
  ]);

  const monthItems = useMemo(() => {
    const y = picker.displayedMonth.getFullYear();
    return Array.from({ length: 12 }, (_, mi) => {
      const anchor = startOfMonth(new Date(y, mi, 1));
      const disabled =
        isMonthFullyBeforeMin(anchor, constraints.minDate) ||
        isMonthFullyAfterMax(anchor, constraints.maxDate);
      return {
        value: mi,
        label: format(new Date(2000, mi, 1), "MMM", { locale: loc }),
        disabled,
      };
    });
  }, [constraints.maxDate, constraints.minDate, loc, picker.displayedMonth]);

  const monthSubviewTitleId = `${panelId}-subview-month-title`;
  const yearSubviewTitleId = `${panelId}-subview-year-title`;
  const monthSubviewYear = format(picker.displayedMonth, "yyyy", { locale: loc });
  const yearSubviewMonthName = format(picker.displayedMonth, "MMMM", {
    locale: loc,
  });

  return (
    <div id={panelId} className={styles["cp-date-picker-panel-inner"]}>
      {picker.panelView === "calendar" ? (
        <>
          <span id={gridLabelId} className={styles["cp-date-picker-sr-only"]}>
            {format(picker.displayedMonth, "MMMM yyyy", { locale: loc })}
          </span>
          <DatePickerHeader
            displayedMonth={picker.displayedMonth}
            locale={loc}
            monthLabelShort={monthLabelShort}
            yearLabel={yearLabel}
            prevMonthDisabled={prevMonthDisabled}
            nextMonthDisabled={nextMonthDisabled}
            prevYearDisabled={prevYearDisabled}
            nextYearDisabled={nextYearDisabled}
            onPrevMonth={picker.goPrevMonth}
            onNextMonth={picker.goNextMonth}
            onPrevYear={onPrevYear}
            onNextYear={onNextYear}
            onOpenMonth={() => picker.setPanelView("month")}
            onOpenYear={() => picker.setPanelView("year")}
          />
          <DatePickerGrid
            weeks={weeks}
            weekLabels={weekLabels}
            locale={loc}
            staged={picker.staged}
            today={today}
            isDayUnavailable={isDayUnavailable}
            onSelectDay={(d) => picker.selectDay(d)}
            gridLabelId={gridLabelId}
            onRequestPrevMonth={picker.goPrevMonth}
            onRequestNextMonth={picker.goNextMonth}
          />
          <DatePickerFooter
            onCancel={onRequestCancel ?? picker.cancel}
            onOk={onRequestConfirm ?? picker.confirm}
          />
        </>
      ) : null}

      {picker.panelView === "month" ? (
        <div className={styles["cp-date-picker-subview"]}>
          <div className={styles["cp-date-picker-subview-head"]}>
            <button
              type="button"
              className={styles["cp-date-picker-subview-back"]}
              aria-label="Back to calendar"
              onClick={(e) => {
                e.stopPropagation();
                picker.setPanelView("calendar");
              }}
            >
              <Icon name="arrow_back" aria-hidden />
            </button>
            <span
              id={monthSubviewTitleId}
              className={styles["cp-date-picker-subview-title"]}
            >
              <span className={styles["cp-date-picker-subview-title-line"]}>
                Select a month of {monthSubviewYear}
              </span>
            </span>
          </div>
          <ScrollPicker
            ariaLabelledBy={monthSubviewTitleId}
            items={monthItems}
            activePredicate={(mi) =>
              mi === picker.displayedMonth.getMonth()
            }
            onPick={(mi) => {
              picker.setDisplayedMonthFromYearMonth(
                picker.displayedMonth.getFullYear(),
                mi as number,
              );
              picker.setPanelView("calendar");
            }}
          />
        </div>
      ) : null}

      {picker.panelView === "year" ? (
        <div className={styles["cp-date-picker-subview"]}>
          <div className={styles["cp-date-picker-subview-head"]}>
            <button
              type="button"
              className={styles["cp-date-picker-subview-back"]}
              aria-label="Back to calendar"
              onClick={(e) => {
                e.stopPropagation();
                picker.setPanelView("calendar");
              }}
            >
              <Icon name="arrow_back" aria-hidden />
            </button>
            <span
              id={yearSubviewTitleId}
              className={styles["cp-date-picker-subview-title"]}
            >
              <span className={styles["cp-date-picker-subview-title-line"]}>
                Select a year for {yearSubviewMonthName}
              </span>
            </span>
          </div>
          <ScrollPicker
            ariaLabelledBy={yearSubviewTitleId}
            items={yearItems}
            activePredicate={(y) => y === picker.displayedMonth.getFullYear()}
            onPick={(y) => {
              picker.setDisplayedMonthFromYearMonth(
                y as number,
                picker.displayedMonth.getMonth(),
              );
              picker.setPanelView("calendar");
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DatePickerPanel;
