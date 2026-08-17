import React, { useId } from "react";
import styles from "./FormControls.module.scss";
import {
  DEFAULT_FORM_FIELD_MARGIN,
  getFormFieldMarginClass,
  type FormFieldMargin,
} from "./form-field-margin";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";

export interface TextAreaProps {
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  defaultValue?: string;
  value?: string;
  label?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isFluid?: boolean;
  /** Spacing suffix for outer margin. @default "b-4" */
  margin?: FormFieldMargin;
  className?: string;
  placeholder?: string;
  error?: string;
  /**
   * Maps to `data-testid` on the native `<textarea>` (use for `.fill()`).
   * When set, `-error` is added on the validation message.
   */
  dataTestId?: string;
}

function textAreaFieldTestId(
  base: string | undefined,
  suffix: string,
): string | undefined {
  return base ? `${base}-${suffix}` : undefined;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  id,
  onChange,
  defaultValue,
  value,
  label = "",
  isDisabled = false,
  isRequired = false,
  isFluid = false,
  margin = DEFAULT_FORM_FIELD_MARGIN,
  className = "",
  placeholder = "",
  error = "",
  dataTestId,
}) => {
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(
    prototypeEnabled,
    "FormControls.TextArea",
    {
      name,
      id,
      defaultValue,
      value,
      label,
      isDisabled,
      isRequired,
      isFluid,
      margin,
      placeholder,
      error,
      dataTestId,
    },
    {
      label: "",
      isDisabled: false,
      isRequired: false,
      isFluid: false,
      margin: DEFAULT_FORM_FIELD_MARGIN,
      placeholder: "",
      error: "",
      dataTestId: undefined,
      name: undefined,
      id: undefined,
      defaultValue: undefined,
      value: undefined,
    },
  );
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const errorId = `${inputId}-error`;

  const fieldWrapperClassName = getClassNames(
    styles["cp-form-field"],
    { [styles["cp-form-field-fluid"]]: isFluid },
    getFormFieldMarginClass(margin),
    className
  );
  const fieldErrorClassName = error ? styles["cp-form-control-error"] : "";
  const formControlFieldClassName = getClassNames(
    styles["cp-form-control"],
    styles["cp-textarea-field"],
    fieldErrorClassName
  );

  return (
    <div {...dataCp} className={fieldWrapperClassName}>
      {label && (
        <label className={styles["cp-form-label"]} htmlFor={inputId}>
          {label}{" "}
          {isRequired && <span aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        className={formControlFieldClassName}
        disabled={isDisabled}
        required={isRequired}
        aria-required={isRequired || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        name={name}
        id={inputId}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e)}
        data-testid={dataTestId}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className={styles["cp-form-error-message"]}
          data-testid={textAreaFieldTestId(dataTestId, "error")}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
