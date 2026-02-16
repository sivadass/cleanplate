import React from "react";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";

export interface FileProps {
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  value?: string;
  label?: string;
  isDisabled?: boolean;
  className?: string;
  isFluid?: boolean;
  error?: string;
}

const File: React.FC<FileProps> = ({
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
  const fieldWrapperClassName = getClassNames(
    styles["cp-form-field"],
    styles["cp-file-field"],
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
      {label && <label className={styles["cp-form-label"]}>{label}</label>}
      <input
        className={formControlFieldClassName}
        type="file"
        disabled={isDisabled}
        name={name}
        id={id}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => onChange?.(e)}
      />
      {error && (
        <p className={styles["cp-form-error-message"]}>{error}</p>
      )}
    </div>
  );
};

export default File;
