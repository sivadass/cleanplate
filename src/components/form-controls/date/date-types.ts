/** 0 Sun … 6 Sat — matches date-fns `getDay`. */
export type Constraints = {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
};
