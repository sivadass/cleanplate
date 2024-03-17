import React from "react";
import PropTypes from "prop-types";
import styles from "./Avatar.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass, getInitials } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

const Avatar = ({
  size = "medium",
  margin = "m-0",
  onClick,
  name = "",
  className = "",
}) => {
  const initials = getInitials(name);
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const avatarClasses = getClassNames(
    styles["avatar"],
    styles[size],
    marginClass,
    className
  );
  const handleClick = (e) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  return (
    <div className={avatarClasses} onClick={(e) => handleClick(e)} title={name}>
      {initials}
    </div>
  );
};

Avatar.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  onClick: PropTypes.func,
};

export default Avatar;
