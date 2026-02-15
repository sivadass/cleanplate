import React from "react";
import type { MaterialIconName } from "./material-icon-names";
import styles from "./Icon.module.css";

export type IconSize = "small" | "medium" | "large";

export type IconColor = "black" | "white" | "gray" | "blue" | "green" | "red" | "yellow" | "orange";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: MaterialIconName;
  size?: IconSize;
  className?: string;
  color?: IconColor;
}

const Icon: React.FC<IconProps> = ({
  name = "",
  size = "medium",
  className = "",
  color = "#222222",
  ...rest
}) => {
  return (
    <span
      className={`${styles["cp-icon"]} ${styles[size]} ${styles[color]} ${className}`}
      {...rest}
    >
      {name}
    </span>
  );
};

export default Icon;
