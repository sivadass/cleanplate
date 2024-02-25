import React from "react";
import styles from "./FormControls.module.css";

const Select = ({
  name,
  id,
  onChange,
  defaultValue,
  value,
  label = "",
  isDisabled = false,
  type = "text",
  className = "",
}) => {
  const fieldWrapperClassName = `cp-form-field cp-input-field ${className}`;
  return (
    <div className={fieldWrapperClassName}>
      {label && <label className="cp-form-label">{label}</label>}
      <input
        className="cp-form-control"
        type={type}
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
    </div>
  );
};

export default Select;
