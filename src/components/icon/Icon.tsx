import React from "react";
import styles from "./Icon.module.css";

export type IconSize = "small" | "medium" | "large";

export type IconColor = "black" | "white" | "gray" | "blue" | "green" | "red" | "yellow" | "orange";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  size?: IconSize;
  className?: string;
  color?: IconColor;
}

const Icon: React.FC<IconProps> = ({
  name = "",
  size = "medium",
  className = "",
  color = "black",
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
