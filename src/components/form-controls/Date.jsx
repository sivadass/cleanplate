import React from "react";
import styles from "./FormControls.module.scss";
import Select from "./Select.jsx";
import {
  DAY_OPTIONS,
  MONTH_OPTIONS,
  YEAR_OPTIONS,
} from "../../constants/common";

const Date = ({
  onChange,
  defaultValue = "--",
  label = "",
  isDisabled = false,
  className = "",
  error = "",
  isFluid = false,
}) => {
  const [defaultDay = "", defaultMonth = "", defaultYear = ""] =
    defaultValue.split("-");
  const [day, setDay] = React.useState(defaultDay);
  const [month, setMonth] = React.useState(defaultMonth);
  const [year, setYear] = React.useState(defaultYear);

  const selectedMonth = MONTH_OPTIONS.find((f) => f.value === month);
  const monthLabel = (selectedMonth && selectedMonth.label) || "";

  const fluidFormFieldClassName = `${
    isFluid ? styles["cp-form-field-fluid"] : ""
  }`;
  const fieldWrapperClassName = `${styles["cp-form-field"]} ${styles["cp-date-field"]} ${fluidFormFieldClassName} ${className}`;
  const fieldErrorClassName = error ? `${styles["cp-form-control-error"]}` : "";
  const formControlFieldClassName = `${styles["cp-form-control"]} ${fieldErrorClassName}`;

  const handleChangeDay = (day) => {
    setDay(day.value);
  };
  const handleChangeMonth = (month) => {
    setMonth(month.value);
  };
  const handleChangeYear = (year) => {
    setYear(year.value);
  };

  React.useEffect(() => {
    if (
      day &&
      day.length === 2 &&
      month &&
      month.length === 2 &&
      year &&
      year.length === 4
    ) {
      const dateValue = `${day}-${month}-${year}`;
      if (typeof onChange === "function") {
        onChange(dateValue);
      }
    }
  }, [day, month, year]);

  return (
    <div className={fieldWrapperClassName}>
      {label && <label className={styles["cp-form-label"]}>{label}</label>}
      <div className={styles["cp-date-field-wrapper"]}>
        <Select
          className={styles["cp-date-field-day"]}
          placeholder="DD"
          triggerClassName={styles["custom-field"]}
          triggerActiveClassName={styles["custom-field-open"]}
          options={DAY_OPTIONS}
          onChange={(val) => handleChangeDay(val)}
          value={{
            label: day,
            value: day,
          }}
        />
        <Select
          className={styles["cp-date-field-month"]}
          triggerClassName={styles["custom-field"]}
          triggerActiveClassName={styles["custom-field-open"]}
          contentsClassName={styles["custom-field-open-content"]}
          placeholder="MMM"
          options={MONTH_OPTIONS}
          onChange={(val) => handleChangeMonth(val)}
          value={{
            label: monthLabel,
            value: month,
          }}
        />
        <Select
          className={styles["cp-date-field-year"]}
          triggerClassName={styles["custom-field"]}
          triggerActiveClassName={styles["custom-field-open"]}
          placeholder="YYYY"
          options={YEAR_OPTIONS}
          onChange={(val) => handleChangeYear(val)}
          value={{
            label: year,
            value: year,
          }}
        />
      </div>
      {error && <p className={styles["cp-form-error-message"]}>{error}</p>}
    </div>
  );
};

export default Date;
