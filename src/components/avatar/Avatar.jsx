import React from "react";
import PropTypes from "prop-types";
import styles from "./Avatar.module.css";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";

const getInitials = (name) => {
  const initials = name.match(/^(\b\w)/g);
  if (initials) {
    return initials.join("").toUpperCase();
  }
  return ""; // Return null if no initials found
};

const Avatar = ({ size = "medium", margin = "m-0", onClick, name = "" }) => {
  const initials = getInitials(name);
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
    <div
      className={`${styles["cp-avatar"]} ${styles[size]} ${marginClass}`}
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
