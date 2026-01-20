import React from "react";
import Icon from "../icon";
import styles from "./Button.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

export type ButtonSize = "small" | "medium";

export type ButtonVariant = "solid" | "outline" | "ghost" | "icon";

export type SpacingOption = typeof SPACING_OPTIONS[number];

export type ButtonMargin = string | SpacingOption[];

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> {
  children?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  isFluid?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  margin?: ButtonMargin;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  isDisabled = false,
  isFluid = false,
  size = "medium",
  variant = "solid",
  margin = "m-0",
  onClick,
  className = "",
  type = "button",
  ...rest
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const buttonClasses = getClassNames(
    styles["button"],
    styles[size],
    styles[variant],
    {
      [styles["fluid"]]: isFluid,
      [styles["disabled"]]: isDisabled,
      [styles["loading"]]: isLoading,
    },
    marginClass,
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled || isLoading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      type={type}
      disabled={isDisabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <Icon name="progress_activity" className={styles["cp-button-loader"]} />
      )}
      {children}
    </button>
  );
};

export default Button;
