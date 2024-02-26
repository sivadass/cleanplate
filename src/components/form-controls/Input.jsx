import React from "react";
import styles from "./FormControls.module.css";

const Input = ({
  name,
  id,
  onChange,
  defaultValue,
  value,
  label = "",
  isDisabled = false,
  isRequired = false,
  type = "text",
  className = "",
  placeholder = "",
  error = "",
}) => {
  const fieldWrapperClassName = `${styles["cp-form-field"]} ${className}`;
  const fieldErrorClassName = error ? `${styles["cp-form-control-error"]}` : "";
  const formControlFieldClassName = `${styles["cp-form-control"]} ${fieldErrorClassName}`;
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
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
      />
      {error && <p className={styles["cp-form-error-message"]}>{error}</p>}
    </div>
  );
};

export default Input;
