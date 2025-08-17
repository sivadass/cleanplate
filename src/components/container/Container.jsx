import React from "react";
import PropTypes from "prop-types";
import styles from "./Container.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

const Container = ({
  children,
  margin = "m-0",
  padding = "p-0",
  display = "",
  align = "",
  justify = "",
  width = "",
  showBorder = false,
  className = "",
  onClick,
  style,
}) => {
  const displayClass = `display-${display}`;
  const justifyClass = `justify-${justify}`;
  const alignClass = `align-${align}`;
  const widthClass = `width-${width}`;

  const marginStyles = getSpacingClass(margin, utilStyles, "m");
  const paddingStyles = getSpacingClass(padding, utilStyles, "p");

  const containerClasses = getClassNames(
    styles["container"],
    paddingStyles,
    marginStyles,
    {
      [styles["border"]]: showBorder,
      [styles[widthClass]]: width,
      [styles[displayClass]]: display,
      [styles[justifyClass]]: justify,
      [styles[alignClass]]: align,
    },
    className
  );

  const handleClick = (e) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  return (
    <div
      className={containerClasses}
      onClick={(e) => handleClick(e)}
      style={style}
    >
      {children}
    </div>
  );
};

Container.propTypes = {
  display: PropTypes.oneOf(["inline-block", "block", "flex"]),
  width: PropTypes.oneOf([
    "small",
    "medium",
    "large",
    "extra-large",
    "quarter",
    "half",
    "three-quarters",
    "full",
  ]),
  showBorder: PropTypes.bool,
  justify: PropTypes.oneOf([
    "space-between",
    "center",
    "space-around",
    "space-evenly",
    "flex-end",
    "flex-start",
  ]),
  align: PropTypes.oneOf(["start", "center", "end"]),
  onClick: PropTypes.func,
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  padding: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  style: PropTypes.object,
};

export default Container;
