import React, { useId, useState } from "react";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";

export type CheckboxValue = string | number;

export interface CheckboxOption {
  /** Visible label next to the checkbox. */
  label: string;
  /** Submitted value when the option is checked. */
  value: CheckboxValue;
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

export interface CheckboxProps {
  /** At least one option; use a one-element array for a single checkbox. */
  options: [CheckboxOption, ...CheckboxOption[]];
  /** Shared `name` for every checkbox in the group (form submission + grouping). */
  name: string;
  /** Group label rendered in `<legend>`. Required `*` is appended here when `isRequired`. */
  label: string;
  /** Stable id used to derive option ids and the legend / error ids. */
  id?: string;
  /** Controlled selected values (multi-select). */
  value?: CheckboxValue[];
  /** Uncontrolled initial values. */
  defaultValue?: CheckboxValue[];
  /** Fires with the next array of selected values (and the underlying change event). */
  onChange?: (
    value: CheckboxValue[],
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  /** Disable every option in the group. */
  isDisabled?: boolean;
  /**
   * Mark the group as required. Renders `*` on the legend and sets
   * `aria-required` on the radiogroup. Native HTML5 "at least one" validation
   * for checkbox groups requires custom validation logic at the form layer.
   */
  isRequired?: boolean;
  /** Full-width wrapper. */
  isFluid?: boolean;
  /** Layout direction for the options. */
  orientation?: "vertical" | "horizontal";
  /**
   * Visual style for each option.
   * - `default`: stacked rows with the box inline.
   * - `card`: tile with the box in the top-right, icon on the left, primary-brand
   *   border + tint when checked.
   */
  variant?: "default" | "card";
  /** Error message rendered under the group. */
  error?: string;
  className?: string;
  /**
   * Root `data-testid` on the `<fieldset>`. When set, related elements also get
   * suffixed ids: `-options`, `-option-{value}`, `-input-{value}`, `-label-{value}`.
   * Per-option `dataTestId` on `CheckboxOption` overrides the group `-input-{value}` id.
   */
  dataTestId?: string;
}

const toKey = (v: CheckboxValue | undefined | null): string => {
  if (v === undefined || v === null) return "option";
  return String(v).replace(/\W/g, "-") || "option";
};

function checkboxFieldTestId(
  base: string | undefined,
  suffix: string,
): string | undefined {
  return base ? `${base}-${suffix}` : undefined;
}

const Checkbox: React.FC<CheckboxProps> = ({
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
  error = "",
  className = "",
  dataTestId,
}) => {
  const generatedId = useId();
  const fieldId = id ?? name ?? generatedId;
  const legendId = `${fieldId}-legend`;
  const errorId = `${fieldId}-error`;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<CheckboxValue[]>(
    defaultValue ?? []
  );
  const selectedValues: CheckboxValue[] = isControlled
    ? (value as CheckboxValue[])
    : internalValue;

  const wrapperClassName = getClassNames(
    styles["cp-form-field"],
    styles["cp-checkbox-field"],
    { [styles["cp-form-field-fluid"]]: isFluid },
    className
  );

  const optionsClassName = getClassNames(
    styles["cp-checkbox-options"],
    orientation === "horizontal"
      ? styles["cp-checkbox-options-horizontal"]
      : styles["cp-checkbox-options-vertical"],
    variant === "card" ? styles["cp-checkbox-options-card"] : ""
  );

  const handleChange = (
    optValue: CheckboxValue,
    nextChecked: boolean,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const current = selectedValues;
    const next = nextChecked
      ? Array.from(new Set([...current, optValue]))
      : current.filter((v) => String(v) !== String(optValue));
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
      data-variant={variant}
      data-testid={dataTestId}
    >
      <legend
        id={legendId}
        className={getClassNames(
          styles["cp-form-label"],
          styles["cp-checkbox-legend"]
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
        role="group"
        aria-labelledby={legendId}
        aria-required={isRequired || undefined}
        data-testid={checkboxFieldTestId(dataTestId, "options")}
      >
        {options.map((opt, idx) => {
          const valueKey = toKey(opt.value);
          const optionId = opt.id ?? `${fieldId}-${valueKey}-${idx}`;
          const optionDescId = opt.description
            ? `${optionId}-desc`
            : undefined;
          const optionDisabled = isDisabled || Boolean(opt.isDisabled);
          const isChecked = selectedValues.some(
            (v) => String(v) === String(opt.value)
          );

          return (
            <div
              key={optionId}
              className={styles["cp-checkbox-row"]}
              data-testid={checkboxFieldTestId(dataTestId, `option-${valueKey}`)}
            >
              <input
                className={getClassNames(
                  styles["cp-visually-hidden"],
                  styles["cp-checkbox-native"]
                )}
                type="checkbox"
                name={name}
                id={optionId}
                value={String(opt.value)}
                checked={isChecked}
                disabled={optionDisabled}
                aria-invalid={error ? true : undefined}
                aria-describedby={
                  [error ? errorId : undefined, optionDescId]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                aria-label={!opt.label ? String(opt.value) : undefined}
                data-testid={
                  opt.dataTestId ??
                  checkboxFieldTestId(dataTestId, `input-${valueKey}`)
                }
                onChange={(e) => handleChange(opt.value, e.target.checked, e)}
              />
              <label
                htmlFor={optionId}
                className={getClassNames(
                  styles["cp-form-label"],
                  styles["cp-form-label-inline"]
                )}
                data-testid={checkboxFieldTestId(dataTestId, `label-${valueKey}`)}
              >
                <span
                  className={styles["cp-checkbox-visual"]}
                  aria-hidden="true"
                >
                  <span className={styles["cp-checkbox-tick"]} />
                </span>
                {opt.icon !== undefined && opt.icon !== null && (
                  <span
                    className={styles["cp-checkbox-icon"]}
                    aria-hidden="true"
                  >
                    {opt.icon}
                  </span>
                )}
                {opt.label && (
                  <span className={styles["cp-checkbox-label-text"]}>
                    <span className={styles["cp-checkbox-label-title"]}>
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span
                        id={optionDescId}
                        className={styles["cp-checkbox-description"]}
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

export default Checkbox;
