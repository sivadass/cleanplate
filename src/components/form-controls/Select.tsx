import React, { useState, useRef, useEffect } from "react";
import Icon from "../icon";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps {
  onChange?: (option: SelectOption | SelectOption[]) => void;
  value?: SelectOption | SelectOption[] | null;
  label?: string;
  isDisabled?: boolean;
  className?: string;
  triggerClassName?: string;
  triggerActiveClassName?: string;
  contentsClassName?: string;
  options?: SelectOption[];
  isRequired?: boolean;
  placeholder?: string;
  error?: string;
  isFluid?: boolean;
  isMulti?: boolean;
}

const Select: React.FC<SelectProps> = ({
  onChange,
  value,
  label = "",
  isDisabled = false,
  className = "",
  triggerClassName = "",
  triggerActiveClassName = "",
  contentsClassName = "",
  options = [],
  isRequired = false,
  placeholder = "Select an option",
  error = "",
  isFluid = false,
  isMulti = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    SelectOption | SelectOption[] | null | undefined
  >(value);
  const [isDropdownTop, setIsDropdownTop] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedArray = Array.isArray(selectedOption) ? selectedOption : [];
  const multiSelectionValue =
    selectedArray.length > 0
      ? selectedArray.map((s) => s.label).join(", ")
      : "";
  const singleSelectValue =
    selectedOption && !Array.isArray(selectedOption) && selectedOption.label
      ? selectedOption.label
      : "";
  const selectedValue = isMulti ? multiSelectionValue : singleSelectValue;

  const selectHeaderOpenClass = isOpen
    ? `${styles["cp-select-field-header-open"]} ${triggerActiveClassName}`
    : "";
  const selectOptionsPositionClass = isDropdownTop
    ? styles["cp-select-field-options-top"]
    : styles["cp-select-field-options-bottom"];
  const selectHeaderWrapperClass = `${styles["cp-select-field-header"]} ${selectHeaderOpenClass} ${triggerClassName}`;

  const handleOptionClick = (
    event: React.MouseEvent,
    optionValue: SelectOption
  ) => {
    event.stopPropagation();
    event.preventDefault();
    if (isMulti) {
      const current = Array.isArray(selectedOption) ? selectedOption : [];
      const values = current.map((s) => s.value);
      if (values.includes(optionValue.value)) {
        const selection = current.filter((f) => f.value !== optionValue.value);
        setSelectedOption(selection);
        onChange?.(selection);
      } else {
        const selection = [...current, optionValue];
        setSelectedOption(selection);
        onChange?.(selection);
      }
    } else {
      setSelectedOption(optionValue);
      onChange?.(optionValue);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const el = dropdownRef.current;
      const target = event.target as Node | null;
      if (el && target && !el.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const el = dropdownRef.current;
    if (el && isOpen) {
      const dropdownRect = el.getBoundingClientRect();
      setIsDropdownTop(dropdownRect.bottom > window.innerHeight);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  return (
    <div
      className={getClassNames(styles["cp-form-field"], {
        [styles["cp-form-field-fluid"]]: isFluid,
        [styles["cp-form-field-disabled"]]: isDisabled,
      }, className)}
    >
      {label && (
        <label className={styles["cp-form-label"]}>
          {label} {isRequired && <span>*</span>}
        </label>
      )}
      <div className={styles["cp-select-field"]} ref={dropdownRef}>
        <div
          className={selectHeaderWrapperClass}
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
        >
          {isMulti && selectedArray.length > 0 && (
            <span className={styles["cp-select-count"]}>
              {selectedArray.length}
            </span>
          )}
          {selectedValue ? (
            <span className={styles["cp-select-value"]}>{selectedValue}</span>
          ) : (
            <span className={styles["cp-select-placeholder"]}>
              {placeholder}
            </span>
          )}
          <Icon
            name={isOpen ? "arrow_drop_up" : "arrow_drop_down"}
            className={`arrow ${isOpen ? "up" : "down"}`}
          />
        </div>
        {isOpen && (
          <div
            className={getClassNames(
              styles["cp-select-field-options"],
              selectOptionsPositionClass,
              contentsClassName
            )}
          >
            {options.map((option) => {
              const isSelected = isMulti
                ? selectedArray.some((s) => s.value === option.value)
                : selectedOption &&
                  !Array.isArray(selectedOption) &&
                  option.value === selectedOption.value;

              return (
                <div
                  key={String(option.value)}
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
      {error && (
        <p className={styles["cp-form-error-message"]}>{error}</p>
      )}
    </div>
  );
}

export default Select;
