import React from "react";
import styles from "./Badge.module.scss";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";

export type BadgeVariant = "default" | "info" | "warning" | "error" | "success";

export interface BadgeProps {
  /** Text shown in the badge */
  label?: string;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Additional class names for the root element */
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  className = "",
}) => {
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(
    prototypeEnabled,
    "Badge",
    { label, variant },
    { variant: "default", label: undefined },
  );
  const badgeClasses = getClassNames(
    styles["cp-badge"],
    styles[`cp-badge--${variant}`],
    className
  );

  return <p {...dataCp} className={badgeClasses}>{label}</p>;
};

export default Badge;
