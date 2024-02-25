import React from "react";
import PropTypes from "prop-types";
import styles from "./Container.module.css";

const Container = ({
  children,
  marginTop = "none",
  marginRight = "none",
  marginBottom = "none",
  marginLeft = "none",
  onClick,
}) => {
  const marginTopClass = `margin-top-${marginTop}`;
  const marginRightClass = `margin-right-${marginRight}`;
  const marginBottomClass = `margin-bottom-${marginBottom}`;
  const marginLeftClass = `margin-left-${marginLeft}`;

  const margin = `${styles[marginTopClass]} ${styles[marginRightClass]} ${styles[marginBottomClass]} ${styles[marginLeftClass]}`;

  const handleClick = (e) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  return (
    <div
      className={`${styles["cp-container"]} ${margin}`}
      onClick={(e) => handleClick(e)}
    >
      {children}
    </div>
  );
};

Container.propTypes = {
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

export default Container;
