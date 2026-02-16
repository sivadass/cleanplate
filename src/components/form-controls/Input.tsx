import React from "react";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";

export interface InputProps {
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
}

const Input: React.FC<InputProps> = ({
  name,
  id,
  onChange,
  onKeyDown,
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
}) => {
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
    fieldErrorClassName
  );

  return (
    <div className={fieldWrapperClassName}>
      {label && (
        <label className={styles["cp-form-label"]}>
          {label} {isRequired && <span>*</span>}
        </label>
      )}
      <input
        className={formControlFieldClassName}
        type={type}
        disabled={isDisabled}
        name={name}
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e)}
        onKeyDown={(e) => onKeyDown?.(e)}
      />
      {error && <p className={styles["cp-form-error-message"]}>{error}</p>}
    </div>
  );
};

export default Input;
