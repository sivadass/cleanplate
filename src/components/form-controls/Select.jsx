import React, { useState, useRef, useEffect } from "react";
import Icon from "../icon";
import styles from "./FormControls.module.css";

const Select = ({
  name,
  id,
  onChange,
  defaultValue,
  value,
  label = "",
  isDisabled = false,
  className = "",
  options = [],
  isRequired = false,
  placeholder = "Select an option",
  error = "",
}) => {
  const fieldWrapperClassName = `cp-form-field cp-input-field ${className}`;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownTop, setIsDropdownTop] = useState(false);
  const dropdownRef = useRef(null);

  const selectHeaderOpenClass = isOpen
    ? `${styles["cp-select-field-header-open"]}`
    : "";
  const selectOptionsPositionClass = isDropdownTop
    ? `${styles["cp-select-field-options-top"]}`
    : `${styles["cp-select-field-options-bottom"]}`;
  const selectHeaderWrapperClass = `${styles["cp-select-field-header"]} ${selectHeaderOpenClass}`;

  const handleOptionClick = (event, optionValue) => {
    event.stopPropagation();
    event.preventDefault();
    setSelectedOption(optionValue);
    if (typeof onChange === "function") {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      setIsDropdownTop(dropdownRect.bottom > viewportHeight);
    }
  }, [isOpen]);

  return (
    <div className={fieldWrapperClassName}>
      {label && (
        <label className={styles["cp-form-label"]}>
          {label} {isRequired && <span>*</span>}
        </label>
      )}
      <div className={styles["cp-select-field"]} ref={dropdownRef}>
        <div
          className={selectHeaderWrapperClass}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption.label || placeholder}</span>
          <Icon
            name={isOpen ? "arrow_drop_up" : "arrow_drop_down"}
            className={`arrow ${isOpen ? "up" : "down"}`}
          />
        </div>
        {isOpen && (
          <div
            className={`${styles["cp-select-field-options"]} ${selectOptionsPositionClass}`}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={styles["cp-select-field-option"]}
                onClick={(e) => handleOptionClick(e, option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className={styles["cp-form-error-message"]}>{error}</p>}
    </div>
  );
};

export default Select;
