import React from "react";
import styles from "./Avatar.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass, getInitials } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";
import Icon from "../icon";
import type { MaterialIconName } from "../icon/material-icon-names";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type AvatarSize = "small" | "medium";

export type AvatarMargin = string | SpacingOption[];

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  /** Display name; used for initials and title when no image/icon */
  name?: string;
  /** Optional alphanumeric text override (up to last 4 characters) for code-like labels */
  codeText?: string;
  /** Image URL; when set, shows image instead of initials */
  image?: string;
  /** Material icon name; when set (and no image), shows icon instead of initials */
  icon?: MaterialIconName;
  size?: AvatarSize;
  margin?: AvatarMargin;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    size = "medium",
    margin = "0",
    onClick,
    name = "",
    codeText = "",
    image = "",
    icon,
    className = "",
    ...rest
  },
  ref,
) {
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(
    prototypeEnabled,
    "Avatar",
    { size, margin, name, codeText, image, icon },
    { size: "medium", margin: "0", name: "", codeText: "", image: "", icon: undefined },
  );
  const getCodeText = (value: string) => {
    if (!value) return "";
    // Keep only letters and numbers, then display the last 4 chars.
    return value.replace(/[^a-z0-9]/gi, "").slice(-4).toUpperCase();
  };

  const displayCode = getCodeText(codeText);
  const initials = getInitials(name);
  const fallbackText = displayCode || initials;
  const avatarTitle = name || displayCode;
  const textLengthClass =
    fallbackText.length >= 4
      ? styles["cp-avatar--text-length-4"]
      : fallbackText.length === 3
        ? styles["cp-avatar--text-length-3"]
        : styles["cp-avatar--text-length-2"];
  const marginClass = getSpacingClass(margin, utilStyles, "cp-m");
  const avatarClasses = getClassNames(
    styles["cp-avatar"],
    styles[`cp-avatar--${size}`],
    textLengthClass,
    marginClass,
    className,
    {
      [styles["cp-avatar--image"]]: !!image,
      [styles["cp-avatar--icon"]]: !!icon,
    },
  );
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  return (
    <div
      {...dataCp}
      className={avatarClasses}
      onClick={handleClick}
      title={avatarTitle}
      {...rest}
      ref={ref}
    >
      {!icon && image && <img src={image} alt={name} />}
      {!image && icon && <Icon size="medium" name={icon} />}
      {!image && !icon && fallbackText}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
