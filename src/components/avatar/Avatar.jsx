import React from "react";
import PropTypes from "prop-types";
import styles from "./Avatar.module.css";

const getInitials = (name) => {
  const initials = name.match(/^(\b\w)/g);
  if (initials) {
    return initials.join("").toUpperCase();
  }
  return ""; // Return null if no initials found
};

const Avatar = ({
  size = "medium",
  marginTop = "none",
  marginRight = "none",
  marginBottom = "none",
  marginLeft = "none",
  onClick,
  name = "",
}) => {
  const initials = getInitials(name);
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
    <div
      className={`${styles["cp-avatar"]} ${styles[size]} ${margin}`}
      onClick={(e) => handleClick(e)}
      title={name}
    >
      {initials}
    </div>
  );
};

Avatar.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium"]),
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
