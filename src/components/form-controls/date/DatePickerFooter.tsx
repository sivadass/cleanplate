import React from "react";
import Button from "../../button";
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
    <Button
      type="button"
      size="medium"
      variant="ghost"
      className={`${styles["cp-date-picker-footer-button"]} ${styles["cancel"]}`}
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      Cancel
    </Button>
    <Button
      type="button"
      size="medium"
      variant="outline"
      className={styles["cp-date-picker-footer-button"]}
      onClick={(e) => {
        e.stopPropagation();
        onOk();
      }}
    >
      Done
    </Button>
  </div>
);

export default DatePickerFooter;
