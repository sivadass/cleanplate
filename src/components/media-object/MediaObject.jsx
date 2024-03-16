import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import styles from "./MediaObject.module.css";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";

const MediaObject = ({
  children,
  isLoading = false,
  isDisabled = false,
  isFluid = false,
  size = "medium",
  variant = "solid",
  margin = "m-0",
  onClick,
}) => {
  const fluidButtonClass = `${isFluid ? styles["cp-button-fluid"] : ""}`;

  const marginClass = getSpacingClass(margin, utilStyles, "m");

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
      } ${marginClass}`}
      onClick={(e) => handleClick(e)}
    >
      {isLoading && (
        <Icon name="progress_activity" className={styles["cp-button-loader"]} />
      )}
      {children}
    </button>
  );
};

MediaObject.propTypes = {
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

export default MediaObject;
