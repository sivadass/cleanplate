import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import styles from "./Alert.module.css";

const Alert = ({
  children,
  isLoading = false,
  isDisabled = false,
  size = "medium",
  variant = "solid",
  onClick,
}) => {
  const handleClick = (e) => {
    if (isDisabled || isLoading) {
      e.preventDefault();
      return;
    }
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  return (
    <button
      className={`${styles["cp-button"]} ${styles[variant]} ${styles[size]} ${
        isDisabled ? styles["disabled"] : ""
      }  ${isLoading ? styles["loading"] : ""}`}
      onClick={(e) => handleClick(e)}
    >
      {isLoading && (
        <Icon name="progress_activity" className={styles["cp-button-loader"]} />
      )}
      {children}
    </button>
  );
};

Alert.propTypes = {
  size: PropTypes.oneOf(["small", "medium"]),
  variant: PropTypes.oneOf(["solid", "outline"]),
};

export default Alert;
