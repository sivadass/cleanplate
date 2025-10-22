import React from "react";
import PropTypes from "prop-types";
import styles from "./Avatar.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass, getInitials, getAvatarBgColor } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";

const Avatar = ({
  size = "medium",
  margin = "m-0",
  onClick,
  name = "",
  image = "",
  icon = "",
  className = "",
}) => {
  const initials = getInitials(name);
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const avatarClasses = getClassNames(
    styles["avatar"],
    styles[size],
    marginClass,
    className,
    {
      [styles["image"]]: image,
      [styles["icon"]]: icon,
    }
  );
  const handleClick = (e) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  const bgColor = getAvatarBgColor(name);
  return (
    <div className={avatarClasses} onClick={(e) => handleClick(e)} title={name} style={{ backgroundColor: bgColor }}>
      {!icon && image && <img src={image} alt={name} />}
      {!image && icon && <Icon size="medium" name={icon} />}
      {!image && !icon && initials}
    </div>
  );
};

Avatar.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  onClick: PropTypes.func,
};

export default Avatar;
