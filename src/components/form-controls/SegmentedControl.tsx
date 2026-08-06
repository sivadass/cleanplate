import React, { useId, useState } from "react";
import styles from "./FormControls.module.scss";
import {
  DEFAULT_FORM_FIELD_MARGIN,
  getFormFieldMarginClass,
  type FormFieldMargin,
} from "./form-field-margin";
import getClassNames from "../../utils/get-class-names";

export type SegmentedControlValue = string | number;
export type SegmentedControlSize = "small" | "medium";

export interface SegmentedControlOption {
  /** Visible text for this segment. Omit for icon-only options. */
  label?: string;
  /** Submitted/selected value for this segment. */
  value: SegmentedControlValue;
  /** Optional leading visual (Icon, SVG, image, etc.). */
  icon?: React.ReactNode;
  /**
   * Accessible name for icon-only options. When provided, this value is used as
   * `aria-label` on the underlying input.
   */
  ariaLabel?: string;
  /** Disable just this segment (group-level `isDisabled` overrides this). */
  isDisabled?: boolean;
  /** Overrides group-derived `-input-{value}` test id on this option input. */
  dataTestId?: string;
  /** Optional explicit id for this option (otherwise derived from field id + value). */
  id?: string;
}

export interface SegmentedControlProps {
  /** At least one option; recommended 2-5 for compact segmented usage. */
  options: [SegmentedControlOption, ...SegmentedControlOption[]];
  /** Shared `name` across all radios in the segmented group. */
  name: string;
  /** Group label rendered in `<legend>`. */
  label: string;
  /** Stable id used to derive legend / option / error ids. */
  id?: string;
  /** Controlled selected value. */
  value?: SegmentedControlValue;
  /** Uncontrolled initial value. */
  defaultValue?: SegmentedControlValue;
  /** Fires with next selected value and native change event. */
  onChange?: (
    value: SegmentedControlValue,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  /** Segment density. @default "medium" */
  size?: SegmentedControlSize;
  /** Disable the full group. */
  isDisabled?: boolean;
  /**
   * Mark group as required. Renders `*` on legend and sets `required` /
   * `aria-required` on first enabled input for native radio-group validation.
   */
  isRequired?: boolean;
  /** Full-width wrapper. */
  isFluid?: boolean;
  /** Validation message shown below the segmented track. */
  error?: string;
  /** Spacing suffix for outer margin. @default "b-4" */
  margin?: FormFieldMargin;
  className?: string;
  /**
   * Root `data-testid` on the `<fieldset>`. Related elements get suffixed ids:
   * `-options`, `-option-{value}`, `-input-{value}`, `-label-{value}`, `-error`.
   * Per-option `dataTestId` overrides only that option's input test id.
   */
  dataTestId?: string;
}

const toKey = (v: SegmentedControlValue | undefined | null): string => {
  if (v === undefined || v === null) return "option";
  return String(v).replace(/\W/g, "-") || "option";
};

function segmentedFieldTestId(
  base: string | undefined,
  suffix: string
): string | undefined {
  return base ? `${base}-${suffix}` : undefined;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  name,
  label,
  id,
  value,
  defaultValue,
  onChange,
  size = "medium",
  isDisabled = false,
  isRequired = false,
  isFluid = false,
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
  const [internalValue, setInternalValue] = useState<
    SegmentedControlValue | undefined
  >(defaultValue);
  const selectedValue: SegmentedControlValue | undefined = isControlled
    ? value
    : internalValue;

  const firstEnabledIdx = options.findIndex(
    (opt) => !isDisabled && !opt.isDisabled
  );

  const wrapperClassName = getClassNames(
    styles["cp-form-field"],
    styles["cp-segmented-control-field"],
    styles[`cp-segmented-control--${size}`],
    { [styles["cp-form-field-fluid"]]: isFluid },
    getFormFieldMarginClass(margin),
    className
  );

  const handleChange = (
    next: SegmentedControlValue,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next, e);
  };

  return (
    <fieldset
      className={wrapperClassName}
      disabled={isDisabled}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      data-invalid={error ? "true" : undefined}
      data-testid={dataTestId}
    >
      <legend
        id={legendId}
        className={getClassNames(
          styles["cp-form-label"],
          styles["cp-segmented-control-legend"]
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
        className={styles["cp-segmented-control-options"]}
        role="radiogroup"
        aria-labelledby={legendId}
        aria-required={isRequired || undefined}
        data-testid={segmentedFieldTestId(dataTestId, "options")}
      >
        {options.map((opt, idx) => {
          const valueKey = toKey(opt.value);
          const optionId = opt.id ?? `${fieldId}-${valueKey}-${idx}`;
          const optionDisabled = isDisabled || Boolean(opt.isDisabled);
          const isOptionRequired = isRequired && idx === firstEnabledIdx;
          const isChecked =
            selectedValue !== undefined &&
            String(selectedValue) === String(opt.value);
          const ariaLabel =
            opt.ariaLabel ?? (!opt.label ? String(opt.value) : undefined);

          return (
            <div
              key={optionId}
              className={styles["cp-segmented-control-option"]}
              data-testid={segmentedFieldTestId(dataTestId, `option-${valueKey}`)}
            >
              <input
                className={getClassNames(
                  styles["cp-visually-hidden"],
                  styles["cp-segmented-control-native"]
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
                aria-describedby={error ? errorId : undefined}
                aria-label={ariaLabel}
                data-testid={
                  opt.dataTestId ??
                  segmentedFieldTestId(dataTestId, `input-${valueKey}`)
                }
                onChange={(e) => handleChange(opt.value, e)}
              />
              <label
                htmlFor={optionId}
                className={getClassNames(
                  styles["cp-form-label"],
                  styles["cp-segmented-control-segment"]
                )}
                data-testid={segmentedFieldTestId(dataTestId, `label-${valueKey}`)}
              >
                {opt.icon !== undefined && opt.icon !== null && (
                  <span
                    className={styles["cp-segmented-control-icon"]}
                    aria-hidden="true"
                  >
                    {opt.icon}
                  </span>
                )}
                {opt.label && (
                  <span className={styles["cp-segmented-control-text"]}>
                    {opt.label}
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
          data-testid={segmentedFieldTestId(dataTestId, "error")}
        >
          {error}
        </p>
      )}
    </fieldset>
  );
};

export default SegmentedControl;
