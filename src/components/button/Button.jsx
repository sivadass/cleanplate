import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import styles from "./Button.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

const Button = ({
  children,
  isLoading = false,
  isDisabled = false,
  isFluid = false,
  size = "medium",
  variant = "solid",
  margin = "m-0",
  onClick,
  className = "",
  type = "button",
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const buttonClasses = getClassNames(
    styles["button"],
    styles[size],
    styles[variant],
    {
      [styles["fluid"]]: isFluid,
      [styles["disabled"]]: isDisabled,
      [styles["loading"]]: isLoading,
    },
    marginClass,
    className
  );

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
      className={buttonClasses}
      onClick={(e) => handleClick(e)}
      type={type}
    >
      {isLoading && (
        <Icon name="progress_activity" className={styles["cp-button-loader"]} />
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(["small", "medium"]),
  variant: PropTypes.oneOf(["solid", "outline", "ghost"]),
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  isFluid: PropTypes.bool,
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Button;
