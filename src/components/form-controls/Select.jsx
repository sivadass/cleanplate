import React, { useState, useRef, useEffect } from "react";
import Icon from "../icon";
import styles from "./FormControls.module.css";
import getClassNames from "../../utils/get-class-names";

const Select = ({
  onChange,
  value,
  label = "",
  isDisabled = false,
  className = "",
  options = [],
  isRequired = false,
  placeholder = "Select an option",
  error = "",
  isFluid = false,
  isMulti = false,
}) => {
  const fieldWrapperClassName = getClassNames(
    styles["cp-form-field"],
    {
      [styles["cp-form-field-fluid"]]: isFluid,
      [styles["cp-form-field-disabled"]]: isDisabled,
    },
    className
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const [isDropdownTop, setIsDropdownTop] = useState(false);
  const dropdownRef = useRef(null);
  const multiSelectionValue =
    selectedOption && selectedOption.length > 0
      ? selectedOption.map((s) => s.label).join(", ")
      : "";
  const singleSelectValue =
    selectedOption && selectedOption.label ? selectedOption.label : "";
  const selectedValue = isMulti ? multiSelectionValue : singleSelectValue;

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
    if (isMulti) {
      const values = selectedOption.map((s) => s.value);
      if (values.includes(optionValue.value)) {
        const selection = [...selectedOption].filter(
          (f) => f.value !== optionValue.value
        );
        setSelectedOption(selection);
      } else {
        const selection = [...selectedOption, optionValue];
        setSelectedOption(selection);
      }
    } else {
      setSelectedOption(optionValue);
    }
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
          {isMulti && selectedOption && selectedOption.length > 0 && (
            <span className={styles["cp-select-count"]}>
              {selectedOption.length}
            </span>
          )}
          <span className={styles["cp-select-placeholder"]}>
            {selectedValue || placeholder}
          </span>
          <Icon
            name={isOpen ? "arrow_drop_up" : "arrow_drop_down"}
            className={`arrow ${isOpen ? "up" : "down"}`}
          />
        </div>
        {isOpen && (
          <div
            className={`${styles["cp-select-field-options"]} ${selectOptionsPositionClass}`}
          >
            {options.map((option) => {
              console.log("selectedOption", selectedOption);
              const isSelected = isMulti
                ? selectedOption.map((s) => s.value).includes(option.value)
                : selectedOption && option.value === selectedOption.value;

              return (
                <div
                  key={option.value}
                  className={styles["cp-select-field-option"]}
                  onClick={(e) => handleOptionClick(e, option)}
                >
                  {option.label}
                  {isSelected && (
                    <Icon
                      name="done"
                      className={styles["cp-select-field-option-selected"]}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && <p className={styles["cp-form-error-message"]}>{error}</p>}
    </div>
  );
};

export default Select;
