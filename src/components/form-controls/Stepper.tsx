import React, { useId, useRef, useState } from "react";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";

/**
 * - `default` — value field first, then decrease and increase (current layout).
 * - `split-controls` — decrease, value, increase (classic numeric stepper).
 * - `trailing-stacked-chevrons` — value first; increase/decrease as an up/down
 *   chevron column on the trailing edge (same column).
 */
export type FormControlsStepperLayout =
  | "default"
  | "split-controls"
  | "trailing-stacked-chevrons";

export interface FormControlsStepperProps {
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  value?: string;
  label?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isFluid?: boolean;
  className?: string;
  placeholder?: string;
  error?: string;
  dataTestId?: string;
  /** Lower bound (inclusive). */
  min?: number | string;
  /** Upper bound (inclusive). */
  max?: number | string;
  /** Increment/decrement step. Defaults to `1`. */
  step?: number | string;
  /**
   * Arrangement of the value field and step buttons.
   * @default "default"
   */
  layout?: FormControlsStepperLayout;
}

const SELECTION_SUPPORTED_TYPES = new Set(["text", "search", "url", "tel", "password"]);

const safeSetSelectionRange = (
  el: HTMLInputElement,
  start: number,
  end: number
) => {
  if (!SELECTION_SUPPORTED_TYPES.has(el.type)) return;
  try {
    el.setSelectionRange(start, end);
  } catch {
    /* ignore */
  }
};

const Stepper: React.FC<FormControlsStepperProps> = ({
  name,
  id,
  onChange,
  defaultValue,
  value,
  label = "",
  isDisabled = false,
  isRequired = false,
  isFluid = false,
  className = "",
  placeholder = "",
  error = "",
  dataTestId,
  min,
  max,
  step = 1,
  layout = "default",
}) => {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(() => defaultValue ?? "");
  const currentValue = isControlled ? (value ?? "") : internalValue;

  const stepNum = Number(step);
  const safeStep = Number.isFinite(stepNum) && stepNum > 0 ? stepNum : 1;
  const minNum = min !== undefined ? Number(min) : -Infinity;
  const maxNum = max !== undefined ? Number(max) : Infinity;

  const parseFieldInt = (raw: string): number | null => {
    if (raw === "" || raw === undefined) return null;
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? null : n;
  };

  const clamp = (n: number) => Math.min(maxNum, Math.max(minNum, n));

  const fieldWrapperClassName = getClassNames(
    styles["cp-form-field"],
    { [styles["cp-form-field-fluid"]]: isFluid },
    className
  );
  const fieldErrorClassName = error ? styles["cp-form-control-error"] : "";
  const shellClassName = getClassNames(
    styles["cp-form-control"],
    styles["cp-stepper-shell"],
    layout === "split-controls" && styles["cp-stepper-shell--split-controls"],
    layout === "trailing-stacked-chevrons" &&
      styles["cp-stepper-shell--trailing-stacked-chevrons"],
    fieldErrorClassName,
    isDisabled ? styles["cp-input-affix-wrapper-disabled"] : ""
  );
  const inputClassName = getClassNames(styles["cp-stepper-input"], fieldErrorClassName);

  const dispatchNativeValue = (next: string) => {
    const el = inputRef.current;
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    setter?.call(el, next);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    if (/\D/.test(el.value)) {
      const cleaned = el.value.replace(/\D/g, "");
      const removed = el.value.length - cleaned.length;
      const caret = (el.selectionStart ?? cleaned.length) - removed;
      el.value = cleaned;
      const safe = Math.max(0, Math.min(caret, cleaned.length));
      safeSetSelectionRange(el, safe, safe);
    }
    if (!isControlled) {
      setInternalValue(el.value);
    }
    onChange?.(e);
  };

  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const data = (e.nativeEvent as InputEvent).data;
    if (data && /\D/.test(data)) {
      e.preventDefault();
    }
  };

  const adjust = (delta: number) => {
    if (isDisabled) return;
    const el = inputRef.current;
    if (!el) return;

    let base = parseFieldInt(el.value);
    if (base === null) {
      base = Number.isFinite(minNum) ? minNum : 0;
    }
    const next = clamp(base + delta * safeStep);
    if (next === base) {
      return;
    }
    dispatchNativeValue(String(next));
  };

  const currentNum = parseFieldInt(currentValue);
  const atMin =
    min !== undefined &&
    currentNum !== null &&
    currentNum <= minNum &&
    Number.isFinite(minNum);
  const atMax =
    max !== undefined &&
    currentNum !== null &&
    currentNum >= maxNum &&
    Number.isFinite(maxNum);

  const describedBy = error ? errorId : undefined;

  const inputEl = (
    <input
      ref={inputRef}
      className={inputClassName}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      disabled={isDisabled}
      required={isRequired}
      aria-required={isRequired || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      name={name}
      id={inputId}
      placeholder={placeholder}
      value={currentValue}
      onChange={handleChange}
      onBeforeInput={handleBeforeInput}
      data-testid={dataTestId}
    />
  );

  return (
    <div className={fieldWrapperClassName}>
      {label && (
        <label className={styles["cp-form-label"]} htmlFor={inputId}>
          {label}{" "}
          {isRequired && <span aria-hidden="true">*</span>}
        </label>
      )}
      <div className={shellClassName}>
        {layout === "split-controls" ? (
          <>
            <button
              type="button"
              className={styles["cp-stepper-btn"]}
              disabled={isDisabled || atMin}
              aria-label="Decrease value"
              onClick={() => adjust(-1)}
              data-testid={dataTestId ? `${dataTestId}-decrement` : undefined}
            >
              <Icon name="remove" size="medium" color="gray" aria-hidden />
            </button>
            <span className={styles["cp-stepper-divider"]} aria-hidden />
            {inputEl}
            <span className={styles["cp-stepper-divider"]} aria-hidden />
            <button
              type="button"
              className={styles["cp-stepper-btn"]}
              disabled={isDisabled || atMax}
              aria-label="Increase value"
              onClick={() => adjust(1)}
              data-testid={dataTestId ? `${dataTestId}-increment` : undefined}
            >
              <Icon name="add" size="medium" color="gray" aria-hidden />
            </button>
          </>
        ) : layout === "trailing-stacked-chevrons" ? (
          <>
            {inputEl}
            <span className={styles["cp-stepper-divider"]} aria-hidden />
            <div
              className={styles["cp-stepper-actions-column"]}
              role="group"
              aria-label="Adjust value"
            >
              <button
                type="button"
                className={getClassNames(
                  styles["cp-stepper-btn"],
                  styles["cp-stepper-btn--stacked"]
                )}
                disabled={isDisabled || atMax}
                aria-label="Increase value"
                onClick={() => adjust(1)}
                data-testid={dataTestId ? `${dataTestId}-increment` : undefined}
              >
                <Icon name="expand_less" size="medium" color="gray" aria-hidden />
              </button>
              <span className={styles["cp-stepper-stack-divider"]} aria-hidden />
              <button
                type="button"
                className={getClassNames(
                  styles["cp-stepper-btn"],
                  styles["cp-stepper-btn--stacked"]
                )}
                disabled={isDisabled || atMin}
                aria-label="Decrease value"
                onClick={() => adjust(-1)}
                data-testid={dataTestId ? `${dataTestId}-decrement` : undefined}
              >
                <Icon name="expand_more" size="medium" color="gray" aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <>
            {inputEl}
            <span className={styles["cp-stepper-divider"]} aria-hidden />
            <button
              type="button"
              className={styles["cp-stepper-btn"]}
              disabled={isDisabled || atMin}
              aria-label="Decrease value"
              onClick={() => adjust(-1)}
              data-testid={dataTestId ? `${dataTestId}-decrement` : undefined}
            >
              <Icon name="remove" size="medium" color="gray" aria-hidden />
            </button>
            <span className={styles["cp-stepper-divider"]} aria-hidden />
            <button
              type="button"
              className={styles["cp-stepper-btn"]}
              disabled={isDisabled || atMax}
              aria-label="Increase value"
              onClick={() => adjust(1)}
              data-testid={dataTestId ? `${dataTestId}-increment` : undefined}
            >
              <Icon name="add" size="medium" color="gray" aria-hidden />
            </button>
          </>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className={styles["cp-form-error-message"]}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Stepper;
