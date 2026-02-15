import React from "react";
import styles from "./Badge.module.scss";
import getClassNames from "../../utils/get-class-names";

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
  const badgeClasses = getClassNames(
    styles["badge"],
    styles[variant],
    className
  );

  return <p className={badgeClasses}>{label}</p>;
};

export default Badge;
