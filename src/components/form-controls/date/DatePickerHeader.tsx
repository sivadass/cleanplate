import React from "react";
import type { Locale } from "date-fns";
import { format } from "date-fns/format";
import Icon from "../../icon";
import styles from "../FormControls.module.scss";

export interface DatePickerHeaderProps {
  displayedMonth: Date;
  locale: Locale;
  monthLabelShort: string;
  yearLabel: string;
  prevMonthDisabled: boolean;
  nextMonthDisabled: boolean;
  prevYearDisabled: boolean;
  nextYearDisabled: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onOpenMonth: () => void;
  onOpenYear: () => void;
}

const DatePickerHeader: React.FC<DatePickerHeaderProps> = ({
  displayedMonth,
  locale,
  monthLabelShort,
  yearLabel,
  prevMonthDisabled,
  nextMonthDisabled,
  prevYearDisabled,
  nextYearDisabled,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
  onOpenMonth,
  onOpenYear,
}) => (
  <div className={styles["cp-date-picker-header"]}>
    <div className={styles["cp-date-picker-header-cluster"]}>
      <button
        type="button"
        className={styles["cp-date-picker-nav-hit"]}
        aria-label="Previous month"
        disabled={prevMonthDisabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!prevMonthDisabled) onPrevMonth();
        }}
      >
        <Icon name="keyboard_arrow_left" aria-hidden />
      </button>
      <button
        type="button"
        className={styles["cp-date-picker-label-hit"]}
        aria-label={`Choose month, ${format(displayedMonth, "MMMM yyyy", { locale })}`}
        onClick={(e) => {
          e.stopPropagation();
          onOpenMonth();
        }}
      >
        <span>{monthLabelShort}</span>
        <Icon name="arrow_drop_down" size="small" aria-hidden />
      </button>
      <button
        type="button"
        className={styles["cp-date-picker-nav-hit"]}
        aria-label="Next month"
        disabled={nextMonthDisabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!nextMonthDisabled) onNextMonth();
        }}
      >
        <Icon name="keyboard_arrow_right" aria-hidden />
      </button>
    </div>
    <div className={styles["cp-date-picker-header-cluster"]}>
      <button
        type="button"
        className={styles["cp-date-picker-nav-hit"]}
        aria-label="Previous year"
        disabled={prevYearDisabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!prevYearDisabled) onPrevYear();
        }}
      >
        <Icon name="keyboard_arrow_left" aria-hidden />
      </button>
      <button
        type="button"
        className={styles["cp-date-picker-label-hit"]}
        aria-label={`Choose year, ${yearLabel}`}
        onClick={(e) => {
          e.stopPropagation();
          onOpenYear();
        }}
      >
        <span>{yearLabel}</span>
        <Icon name="arrow_drop_down" size="small" aria-hidden />
      </button>
      <button
        type="button"
        className={styles["cp-date-picker-nav-hit"]}
        aria-label="Next year"
        disabled={nextYearDisabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!nextYearDisabled) onNextYear();
        }}
      >
        <Icon name="keyboard_arrow_right" aria-hidden />
      </button>
    </div>
  </div>
);

export default DatePickerHeader;
