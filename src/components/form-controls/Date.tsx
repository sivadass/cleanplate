import React, { useEffect, useId, useMemo, useRef } from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  type Placement,
} from "@floating-ui/react";
import type { Locale } from "date-fns";
import { format } from "date-fns/format";
import { enUS } from "date-fns/locale/en-US";
import Icon from "../icon";
import getClassNames from "../../utils/get-class-names";
import styles from "./FormControls.module.scss";
import DatePickerPanel from "./date/DatePickerPanel";
import type { Constraints } from "./date/date-types";
import {
  coerceToCalendarDate,
  coerceToCalendarDates,
  formatISODate,
  toCalendarDate,
} from "./date/normalize-date";
import { useDatePickerState } from "./date/use-date-picker-state";
import { useMediaQuery } from "./date/use-media-query";

const DATE_PICKER_SHEET_MEDIA = "(max-width: 768px)";

const DATE_MOBILE_SHEET_SURFACE_STYLE: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  top: "auto",
  width: "100%",
  maxWidth: "100vw",
  margin: 0,
  zIndex: 1100,
};

export interface DateProps {
  /** Controlled value. Omit for uncontrolled (use `defaultValue`). */
  value?: Date | null;
  /** Uncontrolled starting value when `value` is omitted. */
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  dateFormat?: string;
  id?: string;
  name?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[];
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  clearable?: boolean;
  isDisabled?: boolean;
  /** When true, value cannot change and the picker does not open. */
  readOnly?: boolean;
  label?: string;
  error?: string;
  isFluid?: boolean;
  dataTestId?: string;
  isRequired?: boolean;
  popoverPlacement?: Placement;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
}

const DatePicker: React.FC<DateProps> = ({
  value,
  defaultValue = null,
  onChange,
  placeholder = "Select date",
  dateFormat = "MMM dd, yyyy",
  id,
  name,
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  locale = enUS,
  weekStartsOn = 0,
  clearable = true,
  isDisabled = false,
  readOnly = false,
  label = "",
  error = "",
  isFluid = false,
  dataTestId,
  isRequired = false,
  popoverPlacement = "bottom-start",
  onOpen,
  onClose,
  className = "",
}) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;
  const triggerId = `${fieldId}-trigger`;
  const panelDomId = `${fieldId}-date-panel`;
  const gridLabelId = `${fieldId}-grid-caption`;

  const resolvedMinDate = coerceToCalendarDate(minDate);
  const resolvedMaxDate = coerceToCalendarDate(maxDate);
  const resolvedDisabledDates = useMemo(
    () => coerceToCalendarDates(disabledDates),
    [disabledDates],
  );

  /** Storybook Controls may pass timestamps for `value` / `defaultValue`. */
  const resolvedValue =
    value === undefined
      ? undefined
      : value === null
        ? null
        : coerceToCalendarDate(value) ?? null;
  const resolvedDefaultValue =
    defaultValue === undefined
      ? undefined
      : defaultValue === null
        ? null
        : coerceToCalendarDate(defaultValue) ?? null;

  const isControlled = value !== undefined;

  const disabledDatesStamp =
    resolvedDisabledDates
      ?.map((d) => toCalendarDate(d).getTime())
      .join("|") ?? "";
  const disabledDowStamp = disabledDaysOfWeek?.join(",") ?? "";

  const constraints: Constraints = useMemo(
    () => ({
      minDate: resolvedMinDate,
      maxDate: resolvedMaxDate,
      disabledDates: resolvedDisabledDates,
      disabledDaysOfWeek,
    }),
    [
      resolvedMinDate?.getTime(),
      resolvedMaxDate?.getTime(),
      disabledDatesStamp,
      disabledDowStamp,
      disabledDates,
      disabledDaysOfWeek,
    ],
  );

  const picker = useDatePickerState({
    value: isControlled ? resolvedValue : undefined,
    defaultValue: isControlled ? undefined : resolvedDefaultValue,
    onChange,
    constraints,
  });

  const prevOpenRef = useRef(picker.isOpen);
  useEffect(() => {
    if (picker.isOpen && !prevOpenRef.current) onOpen?.();
    if (!picker.isOpen && prevOpenRef.current) onClose?.();
    prevOpenRef.current = picker.isOpen;
  }, [onOpen, onClose, picker.isOpen]);

  const cancelRef = useRef(picker.cancel);
  cancelRef.current = picker.cancel;
  useEffect(() => {
    if ((!isDisabled && !readOnly) || !picker.isOpen) return;
    cancelRef.current();
  }, [isDisabled, readOnly, picker.isOpen]);

  const isMobileSheetViewport = useMediaQuery(DATE_PICKER_SHEET_MEDIA);

  const floatingMiddleware = useMemo(
    () =>
      isMobileSheetViewport
        ? []
        : [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    [isMobileSheetViewport],
  );

  const { refs, floatingStyles, context } = useFloating({
    open: picker.isOpen && !isDisabled && !readOnly,
    placement: isMobileSheetViewport ? "bottom" : popoverPlacement,
    strategy: "fixed",
    transform: !isMobileSheetViewport,
    middleware: floatingMiddleware,
    whileElementsMounted:
      isMobileSheetViewport ? undefined : autoUpdate,
    onOpenChange(openNext) {
      if (isDisabled || readOnly) return;
      if (openNext) {
        picker.open();
        return;
      }
      if (picker.isOpen) picker.cancel();
    },
  });

  useEffect(() => {
    if (!isMobileSheetViewport) return undefined;
    if (!picker.isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileSheetViewport, picker.isOpen]);

  const click = useClick(context, { enabled: !isDisabled && !readOnly });
  const dismiss = useDismiss(context, {
    ancestorScroll: !isMobileSheetViewport,
    bubbles: false,
    outsidePressEvent: "pointerdown",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const formattedValue =
    picker.committed != null
      ? format(toCalendarDate(picker.committed), dateFormat, { locale })
      : "";

  const handleClear = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDisabled) return;
    picker.clearCommitted();
  };

  const handlePanelPointerDown = (event: React.PointerEvent) => {
    const t = event.target as HTMLElement | null;
    if (t?.closest("button, input, textarea, select, a")) return;
    event.preventDefault();
  };

  const panelMounted = picker.isOpen;

  const floatingSurfaceClass = getClassNames(
    styles["cp-select-field-options"],
    isMobileSheetViewport && styles["cp-select-mobile-sheet"],
    styles["cp-date-picker-floating-shell"],
    isMobileSheetViewport
      ? styles["cp-select-mobile-sheet-entered"]
      : styles["cp-select-dropdown-panel"],
    !isMobileSheetViewport && styles["cp-select-dropdown-panel-entered"],
  );

  return (
    <div
      className={getClassNames(
        styles["cp-form-field"],
        {
          [styles["cp-form-field-fluid"]]: isFluid,
          [styles["cp-form-field-disabled"]]: isDisabled,
        },
        className,
      )}
      data-testid={dataTestId}
    >
      {label ? (
        <label id={labelId} htmlFor={triggerId} className={styles["cp-form-label"]}>
          {label}{" "}
          {isRequired ? <span aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <div
        className={styles["cp-select-field"]}
        data-invalid={error ? "true" : undefined}
      >
        <div
          ref={refs.setReference}
          {...getReferenceProps({
            id: triggerId,
            className: getClassNames(
              styles["cp-select-field-header"],
              picker.isOpen && styles["cp-select-field-header-open"],
            ),
            role: "combobox",
            tabIndex: isDisabled || readOnly ? -1 : 0,
            "aria-expanded": picker.isOpen,
            "aria-controls": picker.isOpen ? panelDomId : undefined,
            "aria-haspopup": "dialog",
            "aria-labelledby": label ? labelId : undefined,
            "aria-disabled": isDisabled || undefined,
            "aria-required": isRequired || undefined,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? errorId : undefined,
            "aria-readonly": readOnly || undefined,
            onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
              if (event.defaultPrevented || isDisabled || readOnly) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (!picker.isOpen) picker.open();
              }
              if (
                picker.isOpen &&
                (event.key === "Escape" ||
                  event.key === "Esc")
              ) {
                event.preventDefault();
                picker.cancel();
              }
            },
          })}
        >
          <div className={styles["cp-select-trigger-main"]}>
            {formattedValue ? (
              <span className={styles["cp-select-value"]}>{formattedValue}</span>
            ) : (
              <span className={styles["cp-select-placeholder"]}>
                {placeholder}
              </span>
            )}
          </div>
          <div className={styles["cp-select-trigger-actions"]}>
            {clearable && picker.committed && !isDisabled && !readOnly ? (
              <button
                type="button"
                tabIndex={-1}
                className={styles["cp-select-trigger-clear"]}
                aria-label="Clear selection"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={handleClear}
              >
                <Icon name="close" size="small" color="gray" />
              </button>
            ) : null}
            <Icon
              name="calendar_month"
              size="small"
              color="gray"
              aria-hidden
            />
          </div>
        </div>
        {panelMounted ? (
          <FloatingPortal>
            {isMobileSheetViewport ? (
              <div
                className={styles["cp-select-mobile-backdrop"]}
                data-visible="true"
                aria-hidden
              />
            ) : null}
            <div
              ref={refs.setFloating}
              {...getFloatingProps({
                id: panelDomId,
                role: "dialog",
                "aria-modal": isMobileSheetViewport || undefined,
                "aria-labelledby": label ? labelId : undefined,
                className: floatingSurfaceClass,
                style: isMobileSheetViewport
                  ? DATE_MOBILE_SHEET_SURFACE_STYLE
                  : floatingStyles,
                onPointerDown: handlePanelPointerDown,
              })}
            >
              <DatePickerPanel
                panelId={panelDomId}
                gridLabelId={gridLabelId}
                locale={locale}
                weekStartsOn={weekStartsOn}
                constraints={constraints}
                picker={picker}
              />
            </div>
          </FloatingPortal>
        ) : null}
      </div>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={
            picker.committed ? formatISODate(picker.committed) : ""
          }
        />
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className={styles["cp-form-error-message"]}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default DatePicker;
