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
