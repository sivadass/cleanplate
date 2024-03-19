import React from "react";
import styles from "./FormControls.module.scss";
import Icon from "../icon";

const Checkbox = ({
  name,
  id,
  onChange,
  defaultValue,
  value,
  label = "",
  isDisabled = false,
  className = "",
  isFluid = false,
  error = "",
}) => {
  const fluidFormFieldClassName = `${
    isFluid ? styles["cp-form-field-fluid"] : ""
  }`;
  const fieldWrapperClassName = `${styles["cp-form-field"]} ${styles["cp-checkbox-field"]} ${fluidFormFieldClassName} ${className}`;
  const fieldErrorClassName = error ? `${styles["cp-form-control-error"]}` : "";
  const formControlFieldClassName = `${styles["cp-form-control"]} ${fieldErrorClassName}`;

  return (
    <div className={fieldWrapperClassName}>
      {label && (
        <label htmlFor={name} className={styles["cp-form-label"]}>
          <Icon name={value ? "check_box" : "check_box_outline_blank"} />
          <span>{label}</span>
        </label>
      )}
      <input
        className={formControlFieldClassName}
        type="checkbox"
        disabled={isDisabled}
        name={name}
        id={id}
        checked={value}
        hidden
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.checked);
          }
        }}
      />
      {error && <p className={styles["cp-form-error-message"]}>{error}</p>}
    </div>
  );
};

export default Checkbox;
