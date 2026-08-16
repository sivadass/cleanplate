import React from "react";
import PropTypes from "prop-types";
import Container from "../container";
import styles from "./ProgressBar.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";

const ProgressBar = ({
  size = "medium",
  variant = "default",
  margin = "0",
  className = "progress-bar",
  trackClassName = "progress-bar-track",
  value,
}) => {
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(
    prototypeEnabled,
    "ProgressBar",
    { size, variant, margin, trackClassName, value },
    {
      size: "medium",
      variant: "default",
      margin: "0",
      className: "progress-bar",
      trackClassName: "progress-bar-track",
      value: undefined,
    },
  );
  const marginClass = getSpacingClass(margin, utilStyles, "cp-m");

  const progressBarClasses = getClassNames(
    styles[`cp-progress-bar--${size}`],
    styles[`cp-progress-bar--${variant}`],
    marginClass,
    className
  );

  const filledStyle = {
    width: `${value}%`,
  };

  return (
    <Container {...dataCp} className={[styles["cp-progress-bar"], progressBarClasses]}>
      <Container
        className={[styles["cp-progress-bar-track"], trackClassName]}
      ></Container>
      <Container
        className={[styles["cp-progress-bar-fill"], trackClassName]}
        style={filledStyle}
      ></Container>
    </Container>
  );
};

ProgressBar.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "info",
    "error",
    "warning",
  ]),
  value: (props, propName, componentName) => {
    const value = props[propName];
    if (typeof value !== "number" || value < 0 || value > 100) {
      return new Error(
        `${propName} in ${componentName} must be a number between 0 and 100.`
      );
    }
    return null;
  },
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  className: PropTypes.string,
  trackClassName: PropTypes.string,
};

export default ProgressBar;
