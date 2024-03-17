import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import styles from "./MediaObject.module.css";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";

const MediaObject = ({
  children,
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
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  onClick: PropTypes.func,
};

export default MediaObject;
