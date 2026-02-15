import React from "react";
import styles from "./Avatar.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass, getInitials, getAvatarBgColor } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";
import type { MaterialIconName } from "../icon/material-icon-names";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type AvatarSize = "small" | "medium";

export type AvatarMargin = string | SpacingOption[];

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Display name; used for initials and title when no image/icon */
  name?: string;
  /** Image URL; when set, shows image instead of initials */
  image?: string;
  /** Material icon name; when set (and no image), shows icon instead of initials */
  icon?: MaterialIconName;
  size?: AvatarSize;
  margin?: AvatarMargin;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  size = "medium",
  margin = "m-0",
  onClick,
  name = "",
  image = "",
  icon,
  className = "",
  ...rest
}) => {
  const initials = getInitials(name);
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const avatarClasses = getClassNames(
    styles["avatar"],
    styles[size],
    marginClass,
    className,
    {
      [styles["image"]]: !!image,
      [styles["icon"]]: !!icon,
    }
  );
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  const bgColor = getAvatarBgColor(name);
  return (
    <div
      className={avatarClasses}
      onClick={handleClick}
      title={name}
      style={{ backgroundColor: bgColor }}
      {...rest}
    >
      {!icon && image && <img src={image} alt={name} />}
      {!image && icon && <Icon size="medium" name={icon} />}
      {!image && !icon && initials}
    </div>
  );
};

export default Avatar;
