import React from "react";
import PropTypes from "prop-types";
import styles from "./Typography.module.css";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";

const Typography = ({ children, variant, margin = "m-0", className = "" }) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  switch (variant) {
    case "h1":
      return (
        <h1
          className={`${styles["cp-typography"]} ${styles[variant]} ${marginClass} ${className}`}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin} ${className}`}
        >
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin} ${className}`}
        >
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin} ${className}`}
        >
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin} ${className}`}
        >
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin} ${className}`}
        >
          {children}
        </h6>
      );
    default:
      return (
        <p
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin} ${className}`}
        >
          {children}
        </p>
      );
  }
};

Typography.propTypes = {
  variant: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "p"]),
  marginTop: PropTypes.oneOf([
    "none",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  marginRight: PropTypes.oneOf([
    "none",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  marginBottom: PropTypes.oneOf([
    "none",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  marginLeft: PropTypes.oneOf([
    "none",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
};

export default Typography;
