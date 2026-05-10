import React from "react";
import styles from "../FormControls.module.scss";

export interface DatePickerFooterProps {
  onCancel: () => void;
  onOk: () => void;
}

const DatePickerFooter: React.FC<DatePickerFooterProps> = ({
  onCancel,
  onOk,
}) => (
  <div className={styles["cp-date-picker-footer"]}>
    <button
      type="button"
      className={styles["cp-date-picker-footer-btn"]}
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      Cancel
    </button>
    <button
      type="button"
      className={`${styles["cp-date-picker-footer-btn"]} ${styles["cp-date-picker-footer-btn-primary"]}`}
      onClick={(e) => {
        e.stopPropagation();
        onOk();
      }}
    >
      OK
    </button>
  </div>
);

export default DatePickerFooter;
