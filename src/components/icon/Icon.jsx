import React from "react";
import PropTypes from "prop-types";
import styles from "./Icon.module.css";

const Icon = ({
  name = "",
  size = "medium",
  className = "",
  color = "black",
}) => {
  return (
    <span
      className={`${styles["cp-icon"]} ${styles[size]} ${styles[color]} ${className}`}
    >
      {name}
    </span>
  );
};

Icon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["black", "white", "gray"]),
};

export default Icon;
