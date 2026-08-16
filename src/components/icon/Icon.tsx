import React from "react";
import type { MaterialIconName } from "./material-icon-names";
import styles from "./Icon.module.css";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";

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
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(
    prototypeEnabled,
    "Icon",
    { name, size, color },
    { name: "", size: "medium", color: "#222222" },
  );
  return (
    <span
      {...dataCp}
      className={`${styles["cp-icon"]} ${styles[`cp-icon--${size}`]} ${styles[`cp-icon--${color}`]} ${className}`}
      {...rest}
    >
      {name}
    </span>
  );
};

export default Icon;
