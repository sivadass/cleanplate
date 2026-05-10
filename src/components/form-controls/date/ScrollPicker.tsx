import React from "react";
import getClassNames from "../../../utils/get-class-names";
import styles from "../FormControls.module.scss";

export interface ScrollPickItem<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface ScrollPickerProps<T> {
  items: ScrollPickItem<T>[];
  onPick: (value: T) => void;
  activePredicate?: (value: T) => boolean;
  /** When set, labels the listbox (preferred over `aria-label`). */
  ariaLabelledBy?: string;
}

const ScrollPicker = <T,>({
  items,
  onPick,
  activePredicate,
  ariaLabelledBy,
}: ScrollPickerProps<T>): React.ReactElement => (
  <ul
    className={styles["cp-date-picker-scroll"]}
    role="listbox"
    aria-labelledby={ariaLabelledBy}
    aria-label={ariaLabelledBy ? undefined : "Choose option"}
  >
    {items.map((item, idx) => {
      const active = Boolean(activePredicate?.(item.value));
      return (
        <li key={`${String(item.value)}-${String(idx)}`}>
          <button
            type="button"
            role="option"
            aria-selected={active}
            aria-disabled={item.disabled || undefined}
            tabIndex={-1}
            disabled={item.disabled}
            className={getClassNames(
              styles["cp-date-picker-scroll-item"],
              active && styles["cp-date-picker-scroll-item-active"],
            )}
            data-row={idx}
            onClick={(e) => {
              e.stopPropagation();
              if (!item.disabled) onPick(item.value);
            }}
          >
            {item.label}
          </button>
        </li>
      );
    })}
  </ul>
);

export default ScrollPicker;
