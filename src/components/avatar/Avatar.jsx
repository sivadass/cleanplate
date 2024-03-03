import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import styles from "./Avatar.module.css";

const Avatar = ({
  children,
  isLoading = false,
  isDisabled = false,
  isFluid = false,
  size = "medium",
  variant = "solid",
  marginTop = "none",
  marginRight = "none",
  marginBottom = "none",
  marginLeft = "none",
  onClick,
}) => {
  const fluidButtonClass = `${isFluid ? styles["cp-button-fluid"] : ""}`;
  const marginTopClass = `margin-top-${marginTop}`;
  const marginRightClass = `margin-right-${marginRight}`;
  const marginBottomClass = `margin-bottom-${marginBottom}`;
  const marginLeftClass = `margin-left-${marginLeft}`;

  const margin = `${styles[marginTopClass]} ${styles[marginRightClass]} ${styles[marginBottomClass]} ${styles[marginLeftClass]}`;

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
      className={`${styles["cp-button"]} ${fluidButtonClass} ${
        styles[variant]
      } ${styles[size]} ${isDisabled ? styles["disabled"] : ""}  ${
        isLoading ? styles["loading"] : ""
      } ${margin}`}
      onClick={(e) => handleClick(e)}
    >
      {isLoading && (
        <Icon name="progress_activity" className={styles["cp-button-loader"]} />
      )}
      {children}
    </button>
  );
};

Avatar.propTypes = {
  size: PropTypes.oneOf(["small", "medium"]),
  variant: PropTypes.oneOf(["solid", "outline"]),
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
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
  onClick: PropTypes.func,
};

export default Avatar;
