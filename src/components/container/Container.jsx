import React from "react";
import PropTypes from "prop-types";
import styles from "./Container.module.css";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";

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
}) => {
  const displayClass = display ? `display-${display}` : "";
  const justifyClass = display ? `justify-${justify}` : "";
  const alignClass = align ? `align-${align}` : "";
  const widthClass = width ? `width-${width}` : "";
  const borderClass = showBorder ? `border` : "";

  const displayStyle = displayClass ? `${styles[displayClass]}` : "";
  const alignStyle = alignClass ? `${styles[alignClass]}` : "";
  const justifyStyle = justifyClass ? `${styles[justifyClass]}` : "";
  const widthStyle = widthClass ? `${styles[widthClass]}` : "";
  const borderStyle = borderClass ? `${styles[borderClass]}` : "";

  const marginStyles = getSpacingClass(margin, utilStyles, "m");
  const paddingStyles = getSpacingClass(padding, utilStyles, "p");

  const handleClick = (e) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  return (
    <div
      className={`${styles["cp-container"]} ${widthStyle} ${marginStyles} ${paddingStyles} ${borderStyle} ${displayStyle} ${alignStyle} ${justifyStyle} ${className}`}
      onClick={(e) => handleClick(e)}
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
  ]),
  align: PropTypes.oneOf(["start", "center", "end"]),
  marginTop: PropTypes.oneOf([
    "none",
    "auto",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  marginRight: PropTypes.oneOf([
    "none",
    "auto",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  marginBottom: PropTypes.oneOf([
    "none",
    "auto",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  marginLeft: PropTypes.oneOf([
    "none",
    "auto",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  paddingTop: PropTypes.oneOf([
    "none",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  paddingRight: PropTypes.oneOf([
    "none",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  paddingBottom: PropTypes.oneOf([
    "none",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  paddingLeft: PropTypes.oneOf([
    "none",
    "small",
    "medium",
    "large",
    "extra-large",
  ]),
  onClick: PropTypes.func,
};

export default Container;
