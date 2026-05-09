import React, { useId } from "react";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";

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
  className?: string;
  placeholder?: string;
  error?: string;
  dataTestId?: string;
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
  className = "",
  placeholder = "",
  error = "",
  dataTestId,
}) => {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const errorId = `${inputId}-error`;

  const fieldWrapperClassName = getClassNames(
    styles["cp-form-field"],
    { [styles["cp-form-field-fluid"]]: isFluid },
    className
  );
  const fieldErrorClassName = error ? styles["cp-form-control-error"] : "";
  const formControlFieldClassName = getClassNames(
    styles["cp-form-control"],
    styles["cp-textarea-field"],
    fieldErrorClassName
  );

  return (
    <div className={fieldWrapperClassName}>
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
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
