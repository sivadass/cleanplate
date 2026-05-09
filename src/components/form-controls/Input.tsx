import React, { useId, useLayoutEffect, useRef, useState } from "react";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";

export interface InputProps {
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  value?: string;
  label?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isFluid?: boolean;
  type?: string;
  className?: string;
  placeholder?: string;
  error?: string;
  dataTestId?: string;
  /** Native `autocomplete` attribute (e.g. `"email"`, `"current-password"`, `"off"`). */
  autoComplete?: string;
  /** Hard cap on the number of characters the user can type. */
  maxLength?: number;
  /**
   * Numeric lower bound (inclusive). Applied via the native `min` attribute
   * (used by HTML5 form validation) and clamped on `blur` for `type="number"`
   * since our text-mapped numeric input doesn't get native min/max enforcement.
   */
  min?: number | string;
  /** Numeric upper bound — see `min`. */
  max?: number | string;
  /**
   * Short text rendered inside the field on the leading edge — currency symbol
   * (`$`), country code (`+91`), etc. Soft-capped at 4 characters; longer
   * strings are truncated to keep the layout predictable. Exposed to assistive
   * tech via `aria-describedby` so e.g. `$500` is announced as "dollars 500".
   * Ignored when `type="search"` (the search icon already occupies that slot).
   */
  prefix?: string;
  /**
   * Short text rendered inside the field on the trailing edge — unit (`kg`,
   * `%`), TLD (`.com`), etc. Same 4-character cap and a11y wiring as `prefix`.
   * Ignored when `type="search"` (the clear button already occupies that slot).
   */
  suffix?: string;
  /**
   * Optional spoken label for screen readers (`aria-label` on the prefix span).
   * Use when the visible affix is a symbol or abbreviation that wouldn't read
   * well on its own (e.g. `prefix="$"`, `prefixA11yLabel="dollars"`).
   */
  prefixA11yLabel?: string;
  /** See `prefixA11yLabel`. */
  suffixA11yLabel?: string;
}

/* Soft cap for prefix/suffix text — keeps the inline layout predictable. */
const MAX_AFFIX_LENGTH = 4;
const truncateAffix = (s?: string): string | undefined =>
  s ? s.slice(0, MAX_AFFIX_LENGTH) : undefined;

/* Per HTML spec, `setSelectionRange` is only supported on these input types
 * (and `<textarea>`). Calling it on `email`, `number`, `date`, etc. throws
 * `InvalidStateError`. */
const SELECTION_SUPPORTED_TYPES = new Set([
  "text",
  "search",
  "url",
  "tel",
  "password",
]);

const safeSetSelectionRange = (
  el: HTMLInputElement,
  start: number,
  end: number
) => {
  if (!SELECTION_SUPPORTED_TYPES.has(el.type)) return;
  try {
    el.setSelectionRange(start, end);
  } catch {
    /* Some browsers throw even on supported types in odd states (e.g. before
     * the element is in the DOM) — never propagate to the consumer. */
  }
};

const Input: React.FC<InputProps> = ({
  name,
  id,
  onChange,
  onKeyDown,
  onBlur,
  defaultValue,
  value,
  label = "",
  isDisabled = false,
  isRequired = false,
  isFluid = false,
  type = "text",
  className = "",
  placeholder = "",
  error = "",
  dataTestId,
  autoComplete,
  maxLength,
  min,
  max,
  prefix,
  suffix,
  prefixA11yLabel,
  suffixA11yLabel,
}) => {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  /** Saved across `onChange` → parent re-render so caret isn’t forced to end (Storybook `useArgs`, async parents). */
  const pendingSelectionRef = useRef<{
    start: number;
    end: number;
  } | null>(null);

  /**
   * `type="number"` has well-known UX issues (scroll-wheel mutates value,
   * spinner buttons, accepts `e`/`+`/`-`, awkward mobile keyboards on some
   * devices). The industry-standard fix is `type="text"` + `inputmode="numeric"`
   * + `pattern="[0-9]*"` for digit-only entry — keeps a numeric keypad on
   * mobile, lets HTML5 validate against the pattern, and behaves predictably
   * on the desktop. Consumers still pass `type="number"` at the API boundary.
   */
  const isNumeric = type === "number";
  const isSearch = type === "search";
  const resolvedType = isNumeric ? "text" : type;
  const inputMode = isNumeric ? "numeric" : undefined;
  const pattern = isNumeric ? "[0-9]*" : undefined;
  /* Caret-preservation only applies on selection-aware types — skipping the
   * book-keeping for `email`, `date`, etc. avoids `InvalidStateError` from
   * `setSelectionRange` and saves a no-op layout effect each render. */
  const supportsSelection = SELECTION_SUPPORTED_TYPES.has(resolvedType);

  /* Track current value so the search clear button can show/hide correctly
   * regardless of controlled / uncontrolled usage. */
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? ""
  );
  const currentValue = isControlled ? value ?? "" : internalValue;
  const showClear = isSearch && !isDisabled && currentValue.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    /* Safety net for numeric inputs — `onBeforeInput` covers typing/paste/IME
     * on every modern browser, but if any non-digit slips through (drag-drop
     * text, programmatic .value mutation, older Safari), strip it here. */
    if (isNumeric && /\D/.test(el.value)) {
      const cleaned = el.value.replace(/\D/g, "");
      const removed = el.value.length - cleaned.length;
      const caret = (el.selectionStart ?? cleaned.length) - removed;
      el.value = cleaned;
      const safe = Math.max(0, Math.min(caret, cleaned.length));
      safeSetSelectionRange(el, safe, safe);
    }
    if (isControlled && supportsSelection) {
      pendingSelectionRef.current = {
        start: el.selectionStart ?? el.value.length,
        end: el.selectionEnd ?? el.value.length,
      };
    }
    if (!isControlled) {
      setInternalValue(el.value);
    }
    onChange?.(e);
  };

  useLayoutEffect(() => {
    if (!isControlled || !supportsSelection) return;
    const el = inputRef.current;
    const sel = pendingSelectionRef.current;
    pendingSelectionRef.current = null;
    if (!el || !sel || document.activeElement !== el) return;
    const len = el.value.length;
    const start = Math.max(0, Math.min(sel.start, len));
    const end = Math.max(0, Math.min(sel.end, len));
    safeSetSelectionRange(el, start, end);
  }, [value, isControlled, supportsSelection]);

  /**
   * Block non-digit insertions for `type="number"` at the keystroke / paste / IME
   * level. `pattern="[0-9]*"` only validates on submit, and `inputmode="numeric"`
   * only hints the mobile keypad — neither prevents typing letters on a hardware
   * keyboard or pasting `"abc"`. Deletes carry `data === null` and pass through.
   */
  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (!isNumeric) return;
    const data = (e.nativeEvent as InputEvent).data;
    if (data && /\D/.test(data)) {
      e.preventDefault();
    }
  };

  /**
   * Clear via the native `value` setter + a bubbling `input` event so React's
   * normal change pipeline picks it up. This avoids a direct `el.value = ""`
   * mutation that React would revert (and momentarily flicker) on a controlled
   * input, and the natural `handleChange` path will save the new caret state.
   */
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

  const handleClear = () => {
    dispatchNativeValue("");
    inputRef.current?.focus();
  };

  /**
   * Numeric clamp on blur — our `type="number"` is mapped to `type="text"`, so
   * native `min`/`max` only act as HTML5 form-validation hints and don't clamp
   * the live value. Clamping on blur (vs. on every keystroke) is the least
   * surprising UX: the user can finish typing `99` even if `max=50`, then the
   * field snaps to the bound when they leave it.
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isNumeric && e.target.value !== "" && (min !== undefined || max !== undefined)) {
      const num = Number(e.target.value);
      if (!Number.isNaN(num)) {
        const lo = min !== undefined ? Number(min) : -Infinity;
        const hi = max !== undefined ? Number(max) : Infinity;
        const clamped = Math.min(hi, Math.max(lo, num));
        if (clamped !== num) {
          dispatchNativeValue(String(clamped));
        }
      }
    }
    onBlur?.(e);
  };

  /* Affixes are mutually exclusive with the search variant — search already
   * uses both edges (icon + clear). For all other types we render an inline
   * prefix/suffix; the wrapper takes over the visible field styling so the
   * affixes sit truly _inside_ the input. */
  const prefixText = truncateAffix(prefix);
  const suffixText = truncateAffix(suffix);
  const hasAffix = !isSearch && Boolean(prefixText || suffixText);

  const fieldWrapperClassName = getClassNames(
    styles["cp-form-field"],
    {
      [styles["cp-form-field-fluid"]]: isFluid,
    },
    className
  );
  const fieldErrorClassName = error ? styles["cp-form-control-error"] : "";
  const formControlFieldClassName = getClassNames(
    styles["cp-form-control"],
    fieldErrorClassName,
    isSearch ? styles["cp-input-search-control"] : "",
    isSearch && showClear ? styles["cp-input-search-control-cleanable"] : "",
    hasAffix ? styles["cp-input-affix-control"] : ""
  );

  const affixWrapperClassName = getClassNames(
    styles["cp-form-control"],
    styles["cp-input-affix-wrapper"],
    fieldErrorClassName,
    isDisabled ? styles["cp-input-affix-wrapper-disabled"] : ""
  );

  const prefixId = prefixText ? `${inputId}-prefix` : undefined;
  const suffixId = suffixText ? `${inputId}-suffix` : undefined;
  const describedBy =
    [error ? errorId : undefined, prefixId, suffixId]
      .filter(Boolean)
      .join(" ") || undefined;

  const inputElement = (
    <input
      ref={inputRef}
      className={formControlFieldClassName}
      type={resolvedType}
      inputMode={inputMode}
      pattern={pattern}
      disabled={isDisabled}
      required={isRequired}
      aria-required={isRequired || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      name={name}
      id={inputId}
      placeholder={placeholder}
      autoComplete={autoComplete || undefined}
      maxLength={maxLength}
      min={min}
      max={max}
      {...(isControlled
        ? { value: value ?? "" }
        : defaultValue !== undefined
          ? { defaultValue }
          : {})}
      onChange={handleChange}
      onKeyDown={(e) => onKeyDown?.(e)}
      onBlur={handleBlur}
      onBeforeInput={isNumeric ? handleBeforeInput : undefined}
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
      {isSearch ? (
        <div className={styles["cp-input-search-wrapper"]}>
          <Icon
            name="search"
            size="medium"
            aria-hidden={true}
            className={styles["cp-input-search-icon"]}
          />
          {inputElement}
          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              className={styles["cp-input-search-clear"]}
              aria-label="Clear search"
              data-testid={dataTestId ? `${dataTestId}-clear` : undefined}
            >
              <Icon name="close" size="small" aria-hidden={true} />
            </button>
          )}
        </div>
      ) : hasAffix ? (
        <div className={affixWrapperClassName}>
          {prefixText && (
            <span
              id={prefixId}
              className={styles["cp-input-prefix"]}
              aria-label={prefixA11yLabel}
              data-testid={dataTestId ? `${dataTestId}-prefix` : undefined}
            >
              {prefixText}
            </span>
          )}
          {inputElement}
          {suffixText && (
            <span
              id={suffixId}
              className={styles["cp-input-suffix"]}
              aria-label={suffixA11yLabel}
              data-testid={dataTestId ? `${dataTestId}-suffix` : undefined}
            >
              {suffixText}
            </span>
          )}
        </div>
      ) : (
        inputElement
      )}
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

export default Input;
