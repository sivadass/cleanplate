import React from "react";
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
}) => {
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
        <label className={styles["cp-form-label"]}>
          {label} {isRequired && <span>*</span>}
        </label>
      )}
      <textarea
        className={formControlFieldClassName}
        disabled={isDisabled}
        name={name}
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e)}
      />
      {error && (
        <p className={styles["cp-form-error-message"]}>{error}</p>
      )}
    </div>
  );
};

export default TextArea;
