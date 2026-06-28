import React, { useId, useState } from "react";
import styles from "./FormControls.module.scss";
import {
  DEFAULT_FORM_FIELD_MARGIN,
  getFormFieldMarginClass,
  type FormFieldMargin,
} from "./form-field-margin";
import getClassNames from "../../utils/get-class-names";

export type RadioValue = string | number;

export interface RadioOption {
  /** Visible label next to the radio control. */
  label: string;
  /** Submitted value when the option is selected. */
  value: RadioValue;
  /** Disable just this option (group-level `isDisabled` overrides this). */
  isDisabled?: boolean;
  /** Optional helper text rendered below the option label. */
  description?: string;
  /**
   * Optional leading visual. Pass any node — a CleanPlate `<Icon>`, an image
   * (e.g. brand logo), an emoji, or custom SVG.
   */
  icon?: React.ReactNode;
  /** Maps to `data-testid` on this option's underlying `<input>`. */
  dataTestId?: string;
  /** Optional explicit id for this option (otherwise derived from name + value). */
  id?: string;
}

export interface RadioProps {
  /** At least one option; use a one-element array for a single radio. */
  options: [RadioOption, ...RadioOption[]];
  /** Shared `name` for every radio in the group (form submission + grouping). */
  name: string;
  /** Group label rendered in `<legend>`. Required `*` is appended here when `isRequired`. */
  label: string;
  /** Stable id used to derive option ids and the legend / error ids. */
  id?: string;
  /** Controlled selected value. */
  value?: RadioValue;
  /** Uncontrolled initial value. */
  defaultValue?: RadioValue;
  /** Fires with the next value (and the underlying change event). */
  onChange?: (value: RadioValue, e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Disable every option in the group. */
  isDisabled?: boolean;
  /**
   * Mark the group as required. Renders `*` on the legend, sets `required` /
   * `aria-required` on the first enabled option (HTML5 group validation only
   * needs one input in the group to carry `required`).
   */
  isRequired?: boolean;
  /** Full-width wrapper. */
  isFluid?: boolean;
  /** Layout direction for the options. */
  orientation?: "vertical" | "horizontal";
  /**
   * Visual style for each option.
   * - `default`: stacked rows with the ring inline.
   * - `card`: tile with optional `icon`, primary-brand border + tint when selected.
   */
  variant?: "default" | "card";
  /**
   * When `variant="card"`, places the radio ring in the tile corner.
   * - `end` (default): top-inline-end (right in LTR).
   * - `start`: top-inline-start (left in LTR).
   */
  cardControlAlign?: "start" | "end";
  /** Error message rendered under the group. */
  error?: string;
  /** Spacing suffix for outer margin. @default "b-4" */
  margin?: FormFieldMargin;
  className?: string;
  /**
   * Root `data-testid` on the `<fieldset>`. When set, related elements also get
   * suffixed ids: `-options`, `-option-{value}`, `-input-{value}`, `-label-{value}`.
   * Per-option `dataTestId` on `RadioOption` overrides the group `-input-{value}` id.
   */
  dataTestId?: string;
}

const toKey = (v: RadioValue | undefined | null): string => {
  if (v === undefined || v === null) return "option";
  return String(v).replace(/\W/g, "-") || "option";
};

function radioFieldTestId(
  base: string | undefined,
  suffix: string,
): string | undefined {
  return base ? `${base}-${suffix}` : undefined;
}

const Radio: React.FC<RadioProps> = ({
  options,
  name,
  id,
  label,
  value,
  defaultValue,
  onChange,
  isDisabled = false,
  isRequired = false,
  isFluid = false,
  orientation = "vertical",
  variant = "default",
  cardControlAlign = "end",
  error = "",
  margin = DEFAULT_FORM_FIELD_MARGIN,
  className = "",
  dataTestId,
}) => {
  const generatedId = useId();
  const fieldId = id ?? name ?? generatedId;
  const legendId = `${fieldId}-legend`;
  const errorId = `${fieldId}-error`;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<RadioValue | undefined>(
    defaultValue
  );

  const selectedValue: RadioValue | undefined = isControlled
    ? value
    : internalValue;

  const wrapperClassName = getClassNames(
    styles["cp-form-field"],
    styles["cp-radio-field"],
    { [styles["cp-form-field-fluid"]]: isFluid },
    getFormFieldMarginClass(margin),
    className
  );

  const optionsClassName = getClassNames(
    styles["cp-radio-options"],
    orientation === "horizontal"
      ? styles["cp-radio-options-horizontal"]
      : styles["cp-radio-options-vertical"],
    variant === "card" ? styles["cp-radio-options-card"] : ""
  );

  const handleChange = (
    next: RadioValue,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next, e);
  };

  const firstEnabledIdx = options.findIndex(
    (opt) => !opt.isDisabled && !isDisabled
  );

  return (
    <fieldset
      className={wrapperClassName}
      disabled={isDisabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      data-invalid={error ? "true" : undefined}
      data-variant={variant}
      data-card-control-align={
        variant === "card" ? cardControlAlign : undefined
      }
      data-testid={dataTestId}
    >
      <legend
        id={legendId}
        className={getClassNames(
          styles["cp-form-label"],
          styles["cp-radio-legend"]
        )}
      >
        {label}
        {isRequired && (
          <>
            {" "}
            <span aria-hidden="true">*</span>
          </>
        )}
      </legend>

      <div
        className={optionsClassName}
        role="radiogroup"
        aria-labelledby={legendId}
        aria-required={isRequired || undefined}
        data-testid={radioFieldTestId(dataTestId, "options")}
      >
        {options.map((opt, idx) => {
          const valueKey = toKey(opt.value);
          const optionId = opt.id ?? `${fieldId}-${valueKey}-${idx}`;
          const optionDescId = opt.description
            ? `${optionId}-desc`
            : undefined;
          const optionDisabled = isDisabled || Boolean(opt.isDisabled);
          const isOptionRequired = isRequired && idx === firstEnabledIdx;
          const isChecked =
            selectedValue !== undefined &&
            String(selectedValue) === String(opt.value);

          return (
            <div
              key={optionId}
              className={styles["cp-radio-row"]}
              data-testid={radioFieldTestId(dataTestId, `option-${valueKey}`)}
            >
              <input
                className={getClassNames(
                  styles["cp-visually-hidden"],
                  styles["cp-radio-native"]
                )}
                type="radio"
                name={name}
                id={optionId}
                value={String(opt.value)}
                checked={isChecked}
                disabled={optionDisabled}
                required={isOptionRequired}
                aria-required={isOptionRequired || undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={
                  [error ? errorId : undefined, optionDescId]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                aria-label={!opt.label ? String(opt.value) : undefined}
                data-testid={
                  opt.dataTestId ??
                  radioFieldTestId(dataTestId, `input-${valueKey}`)
                }
                onChange={(e) => handleChange(opt.value, e)}
              />
              <label
                htmlFor={optionId}
                className={getClassNames(
                  styles["cp-form-label"],
                  styles["cp-form-label-inline"]
                )}
                data-testid={radioFieldTestId(dataTestId, `label-${valueKey}`)}
              >
                <span
                  className={styles["cp-radio-visual"]}
                  aria-hidden="true"
                >
                  <span className={styles["cp-radio-dot"]} />
                </span>
                {opt.icon !== undefined && opt.icon !== null && (
                  <span className={styles["cp-radio-icon"]} aria-hidden="true">
                    {opt.icon}
                  </span>
                )}
                {opt.label && (
                  <span className={styles["cp-radio-label-text"]}>
                    <span className={styles["cp-radio-label-title"]}>
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span
                        id={optionDescId}
                        className={styles["cp-radio-description"]}
                      >
                        {opt.description}
                      </span>
                    )}
                  </span>
                )}
              </label>
            </div>
          );
        })}
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
    </fieldset>
  );
};

export default Radio;
