import React from "react";
import styles from "./FormControls.module.scss";

const TextArea = ({
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
  const fluidFormFieldClassName = `${
    isFluid ? styles["cp-form-field-fluid"] : ""
  }`;
  const fieldWrapperClassName = `${styles["cp-form-field"]} ${className} ${fluidFormFieldClassName}`;
  const fieldErrorClassName = error ? `${styles["cp-form-control-error"]}` : "";
  const formControlFieldClassName = `${styles["cp-form-control"]} ${styles["cp-textarea-field"]} ${fieldErrorClassName}`;
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
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
        }}
      ></textarea>
      {error && <p className={styles["cp-form-error-message"]}>{error}</p>}
    </div>
  );
};

export default TextArea;
