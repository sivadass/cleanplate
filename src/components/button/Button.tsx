import React from "react";
import Icon from "../icon";
import type { MaterialIconName } from "../icon/material-icon-names";
import styles from "./Button.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";

export type ButtonSize = "small" | "medium" | "large";

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
  prefixIcon?: MaterialIconName;
  suffixIcon?: MaterialIconName;
  margin?: ButtonMargin;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      isLoading = false,
      isDisabled = false,
      isFluid = false,
      size = "medium",
      variant = "solid",
      prefixIcon,
      suffixIcon,
      margin = "0",
      onClick,
      className = "",
      type = "button",
      ...rest
    },
    ref,
  ) {
    const prototypeEnabled = usePrototypeAttributes();
    const dataCp = emitDataCp(
      prototypeEnabled,
      "Button",
      {
        variant,
        size,
        isLoading,
        isDisabled,
        isFluid,
        margin,
        type,
        prefixIcon,
        suffixIcon,
      },
      {
        variant: "solid",
        size: "medium",
        isLoading: false,
        isDisabled: false,
        isFluid: false,
        margin: "0",
        type: "button",
        prefixIcon: undefined,
        suffixIcon: undefined,
      },
    );

    const marginClass = getSpacingClass(margin, utilStyles, "cp-m");
    const isIconOnly = variant === "icon";
    const hasPrefix = Boolean(isLoading || prefixIcon);
    const hasSuffix = Boolean(suffixIcon);
    const showChildren = !isIconOnly || (!prefixIcon && !isLoading);

    const buttonClasses = getClassNames(
      styles["cp-button"],
      styles[`cp-button--${size}`],
      variant !== "solid" ? styles[`cp-button--${variant}`] : "",
      {
        [styles["cp-button--fluid"]]: isFluid,
        [styles["cp-button--disabled"]]: isDisabled,
        [styles["cp-button--loading"]]: isLoading,
        [styles["cp-button--has-prefix"]]: hasPrefix && !isIconOnly,
        [styles["cp-button--has-suffix"]]: hasSuffix && !isIconOnly,
      },
      marginClass,
      className,
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <button
        {...dataCp}
        ref={ref}
        className={buttonClasses}
        type={type}
        disabled={isDisabled || isLoading}
        {...rest}
        onClick={handleClick}
      >
        {isLoading && (
          <Icon
            name="progress_activity"
            className={styles["cp-button-loader"]}
            aria-hidden={true}
          />
        )}
        {prefixIcon && !isLoading && (
          <Icon
            name={prefixIcon}
            className={styles["cp-button__prefix-icon"]}
            aria-hidden={true}
          />
        )}
        {showChildren ? children : null}
        {suffixIcon && (
          <Icon
            name={suffixIcon}
            className={styles["cp-button__suffix-icon"]}
            aria-hidden={true}
          />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
