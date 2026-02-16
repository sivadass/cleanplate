import React from "react";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";

export interface CheckboxProps {
  name?: string;
  id?: string;
  onChange?: (checked: boolean) => void;
  defaultValue?: boolean;
  value?: boolean;
  label?: string;
  isDisabled?: boolean;
  className?: string;
  isFluid?: boolean;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  id,
  onChange,
  value,
  label = "",
  isDisabled = false,
  className = "",
  isFluid = false,
  error = "",
}) => {
  const fieldWrapperClassName = getClassNames(
    styles["cp-form-field"],
    styles["cp-checkbox-field"],
    { [styles["cp-form-field-fluid"]]: isFluid },
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
        <label htmlFor={id ?? name} className={styles["cp-form-label"]}>
          <Icon name={value ? "check_box" : "check_box_outline_blank"} />
          <span>{label}</span>
        </label>
      )}
      <input
        className={formControlFieldClassName}
        type="checkbox"
        disabled={isDisabled}
        name={name}
        id={id ?? name}
        checked={value}
        hidden
        onChange={(e) => onChange?.(e.target.checked)}
      />
      {error && (
        <p className={styles["cp-form-error-message"]}>{error}</p>
      )}
    </div>
  );
};

export default Checkbox;
