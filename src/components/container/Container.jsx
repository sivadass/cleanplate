import React from "react";
import PropTypes from "prop-types";
import styles from "./Container.module.css";

const Container = ({
  children,
  marginTop = "",
  marginRight = "",
  marginBottom = "",
  marginLeft = "",
  paddingTop = "medium",
  paddingRight = "medium",
  paddingBottom = "medium",
  paddingLeft = "medium",
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

  const marginTopClass = marginTop ? `margin-top-${marginTop}` : "";
  const marginRightClass = marginRight ? `margin-right-${marginRight}` : "";
  const marginBottomClass = marginBottom ? `margin-bottom-${marginBottom}` : "";
  const marginLeftClass = marginLeft ? `margin-left-${marginLeft}` : "";

  const margin = `${marginTopClass ? styles[marginTopClass] : ""} ${
    marginRightClass ? styles[marginRightClass] : ""
  } ${marginBottomClass ? styles[marginBottomClass] : ""} ${
    marginLeftClass ? styles[marginLeftClass] : ""
  }`;

  const paddingTopClass = paddingTop ? `padding-top-${paddingTop}` : "";
  const paddingRightClass = paddingRight ? `padding-right-${paddingRight}` : "";
  const paddingBottomClass = paddingBottom
    ? `padding-bottom-${paddingBottom}`
    : "";
  const paddingLeftClass = paddingLeft ? `padding-left-${paddingLeft}` : "";

  const padding = `${paddingTopClass ? styles[paddingTopClass] : ""} ${
    paddingRightClass ? styles[paddingRightClass] : ""
  } ${paddingBottomClass ? styles[paddingBottomClass] : ""} ${
    paddingLeftClass ? styles[paddingLeftClass] : ""
  }`;

  const displayStyle = displayClass ? `${styles[displayClass]}` : "";
  const alignStyle = alignClass ? `${styles[alignClass]}` : "";
  const justifyStyle = justifyClass ? `${styles[justifyClass]}` : "";
  const widthStyle = widthClass ? `${styles[widthClass]}` : "";
  const borderStyle = borderClass ? `${styles[borderClass]}` : "";

  const handleClick = (e) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  return (
    <div
      className={`${styles["cp-container"]} ${widthStyle} ${margin} ${padding} ${borderStyle} ${displayStyle} ${alignStyle} ${justifyStyle} ${className}`}
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
