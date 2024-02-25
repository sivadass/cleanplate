import React from "react";
import PropTypes from "prop-types";
import styles from "./Typography.module.css";

const Typography = ({
  children,
  variant,
  marginTop = "none",
  marginRight = "none",
  marginBottom = "none",
  marginLeft = "none",
}) => {
  const marginTopClass = `margin-top-${marginTop}`;
  const marginRightClass = `margin-right-${marginRight}`;
  const marginBottomClass = `margin-bottom-${marginBottom}`;
  const marginLeftClass = `margin-left-${marginLeft}`;

  const margin = `${styles[marginTopClass]} ${styles[marginRightClass]} ${styles[marginBottomClass]} ${styles[marginLeftClass]}`;

  switch (variant) {
    case "h1":
      return (
        <h1
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin}`}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin}`}
        >
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin}`}
        >
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin}`}
        >
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin}`}
        >
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin}`}
        >
          {children}
        </h6>
      );
    default:
      return (
        <p
          className={`${styles["cp-typography"]} ${styles[variant]} ${margin}`}
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
