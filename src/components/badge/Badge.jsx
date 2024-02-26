import React from "react";
import PropTypes from "prop-types";
import styles from "./Badge.module.css";

const Badge = ({ label, variant = "default" }) => {
  return <p className={`${styles["cp-badge"]} ${styles[variant]}`}>{label}</p>;
};

Badge.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["default", "info", "warning", "error", "success"]),
};

export default Badge;
