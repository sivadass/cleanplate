import React, { useId, useState } from "react";
import styles from "./FormControls.module.scss";
import {
  DEFAULT_FORM_FIELD_MARGIN,
  getFormFieldMarginClass,
  type FormFieldMargin,
} from "./form-field-margin";
import getClassNames from "../../utils/get-class-names";

export interface ToggleProps {
  name?: string;
  id?: string;
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  checked?: boolean;
  label?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
  isFluid?: boolean;
  /** Spacing suffix for outer margin. @default "b-4" */
  margin?: FormFieldMargin;
  error?: string;
  /**
   * Maps to `data-testid` on the native switch `<input>`.
   * When set, `-label` (clickable track/label) and `-error` are also added.
   */
  dataTestId?: string;
}

function toggleFieldTestId(
  base: string | undefined,
  suffix: string,
): string | undefined {
  return base ? `${base}-${suffix}` : undefined;
}

const Toggle: React.FC<ToggleProps> = ({
  name,
  id,
  onChange,
  defaultChecked = false,
  checked: checkedProp,
  label = "",
  isDisabled = false,
  isRequired = false,
  className = "",
  isFluid = false,
  margin = DEFAULT_FORM_FIELD_MARGIN,
  error = "",
  dataTestId,
}) => {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const errorId = `${inputId}-error`;

  const isControlled = checkedProp !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = isControlled ? Boolean(checkedProp) : internalChecked;

  const fieldWrapperClassName = getClassNames(
    styles["cp-form-field"],
    styles["cp-toggle-field"],
    { [styles["cp-form-field-fluid"]]: isFluid },
    getFormFieldMarginClass(margin),
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  return (
    <div
      className={fieldWrapperClassName}
      data-invalid={error ? "true" : undefined}
    >
      <div className={styles["cp-toggle-row"]}>
        <input
          className={getClassNames(
            styles["cp-visually-hidden"],
            styles["cp-toggle-native"]
          )}
          type="checkbox"
          role="switch"
          disabled={isDisabled}
          required={isRequired}
          aria-required={isRequired || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-label={!label ? name : undefined}
          name={name}
          id={inputId}
          onChange={handleChange}
          data-testid={dataTestId}
          {...(isControlled ? { checked } : { defaultChecked })}
        />
        <label
          htmlFor={inputId}
          className={styles["cp-toggle-ui"]}
          data-testid={toggleFieldTestId(dataTestId, "label")}
        >
          <span className={styles["cp-toggle-track"]} aria-hidden="true">
            <span className={styles["cp-toggle-thumb"]} />
          </span>
          {label && (
            <span>
              {label}
              {isRequired && (
                <>
                  {" "}
                  <span aria-hidden="true">*</span>
                </>
              )}
            </span>
          )}
        </label>
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className={styles["cp-form-error-message"]}
          data-testid={toggleFieldTestId(dataTestId, "error")}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Toggle;
