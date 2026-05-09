import React, { useId, useState, useEffect } from "react";
import styles from "./FormControls.module.scss";
import getClassNames from "../../utils/get-class-names";
import Select from "./Select";
import {
  DAY_OPTIONS,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
} from "../../constants/common";
import type { SelectOption } from "./Select";

export interface DateProps {
  id?: string;
  onChange?: (dateValue: string) => void;
  defaultValue?: string;
  label?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
  error?: string;
  isFluid?: boolean;
  dataTestId?: string;
}

const Date: React.FC<DateProps> = ({
  id,
  onChange,
  defaultValue = "--",
  label = "",
  isDisabled = false,
  isRequired = false,
  className = "",
  error = "",
  isFluid = false,
  dataTestId,
}) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;

  const [defaultDay = "", defaultMonth = "", defaultYear = ""] =
    defaultValue.split("-");
  const [day, setDay] = useState(defaultDay);
  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  const selectedMonth = MONTH_OPTIONS.find((f) => f.value === month);
  const monthLabel = selectedMonth?.label ?? "";

  const fieldWrapperClassName = getClassNames(
    styles["cp-form-field"],
    styles["cp-date-field"],
    { [styles["cp-form-field-fluid"]]: isFluid },
    className
  );

  const handleChangeDay = (val: SelectOption | SelectOption[]) => {
    const option = Array.isArray(val) ? val[0] : val;
    if (option) setDay(String(option.value));
  };
  const handleChangeMonth = (val: SelectOption | SelectOption[]) => {
    const option = Array.isArray(val) ? val[0] : val;
    if (option) setMonth(String(option.value));
  };
  const handleChangeYear = (val: SelectOption | SelectOption[]) => {
    const option = Array.isArray(val) ? val[0] : val;
    if (option) setYear(String(option.value));
  };

  useEffect(() => {
    if (
      day &&
      day.length === 2 &&
      month &&
      month.length === 2 &&
      year &&
      year.length === 4
    ) {
      const dateValue = `${day}-${month}-${year}`;
      onChange?.(dateValue);
    }
  }, [day, month, year, onChange]);

  return (
    <div
      className={fieldWrapperClassName}
      role="group"
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? true : undefined}
      aria-required={isRequired || undefined}
      aria-disabled={isDisabled || undefined}
      data-testid={dataTestId}
    >
      {label && (
        <label id={labelId} className={styles["cp-form-label"]}>
          {label}{" "}
          {isRequired && <span aria-hidden="true">*</span>}
        </label>
      )}
      <div className={styles["cp-date-field-wrapper"]}>
        <Select
          id={`${fieldId}-day`}
          className={styles["cp-date-field-day"]}
          placeholder="DD"
          triggerClassName={styles["custom-field"]}
          triggerActiveClassName={styles["custom-field-open"]}
          options={DAY_OPTIONS}
          onChange={(val) => handleChangeDay(val)}
          value={{ label: day, value: day }}
          isDisabled={isDisabled}
          dataTestId={dataTestId ? `${dataTestId}-day` : undefined}
        />
        <Select
          id={`${fieldId}-month`}
          className={styles["cp-date-field-month"]}
          triggerClassName={styles["custom-field"]}
          triggerActiveClassName={styles["custom-field-open"]}
          contentsClassName={styles["custom-field-open-content"]}
          placeholder="MMM"
          options={MONTH_OPTIONS}
          onChange={(val) => handleChangeMonth(val)}
          value={{ label: monthLabel, value: month }}
          isDisabled={isDisabled}
          dataTestId={dataTestId ? `${dataTestId}-month` : undefined}
        />
        <Select
          id={`${fieldId}-year`}
          className={styles["cp-date-field-year"]}
          triggerClassName={styles["custom-field"]}
          triggerActiveClassName={styles["custom-field-open"]}
          placeholder="YYYY"
          options={YEAR_OPTIONS}
          onChange={(val) => handleChangeYear(val)}
          value={{ label: year, value: year }}
          isDisabled={isDisabled}
          dataTestId={dataTestId ? `${dataTestId}-year` : undefined}
        />
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className={styles["cp-form-error-message"]}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Date;
