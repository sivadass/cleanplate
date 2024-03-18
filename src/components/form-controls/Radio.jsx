import React from "react";
import styles from "./FormControls.module.scss";

const Radio = ({
  name,
  id,
  onChange,
  defaultValue,
  value,
  label = "",
  isDisabled = false,
  type = "text",
  className = "",
  isFluid = false,
  error = "",
}) => {
  const fluidFormFieldClassName = `${
    isFluid ? styles["cp-form-field-fluid"] : ""
  }`;
  const fieldWrapperClassName = `${styles["cp-form-field"]} ${styles["cp-radio-field"]} ${fluidFormFieldClassName} ${className}`;
  const fieldErrorClassName = error ? `${styles["cp-form-control-error"]}` : "";
  const formControlFieldClassName = `${styles["cp-form-control"]} ${fieldErrorClassName}`;

  return (
    <div className={fieldWrapperClassName}>
      {label && <label className={styles["cp-form-label"]}>{label}</label>}
      <input
        className={formControlFieldClassName}
        type="radio"
        disabled={isDisabled}
        name={name}
        id={id}
        defaultValue={defaultValue}
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

export default Radio;
