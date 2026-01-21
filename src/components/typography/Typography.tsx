import React from "react";
import styles from "./Typography.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

export type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "small";

export type TypographyAlign = "left" | "right" | "center";

export type TypographyWordBreak = "normal" | "all" | "wrap";

export type SpacingOption = typeof SPACING_OPTIONS[number];

export type TypographyMargin = string | SpacingOption[];

export interface TypographyProps {
  children?: React.ReactNode;
  variant?: TypographyVariant;
  margin?: TypographyMargin;
  className?: string;
  isBold?: boolean;
  align?: TypographyAlign;
  wordBreak?: TypographyWordBreak;
  [key: string]: any; // Allow other HTML attributes to be passed through
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant,
  margin = "m-0",
  className = "",
  isBold = false,
  align = "left",
  wordBreak = "normal",
  ...otherProps
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const alignClass = `align-${align}`;
  const wordBreakClass = `word-break-${wordBreak}`;
  const typographyClasses = getClassNames(
    styles["typography"],
    {
      [styles[variant || ""]]: variant,
      [styles["bold"]]: isBold,
      [styles["align"]]: align,
      [styles[alignClass]]: align,
      [styles[wordBreakClass]]: wordBreak,
    },
    marginClass,
    className
  );

  switch (variant) {
    case "h1":
      return (
        <h1 className={typographyClasses} {...otherProps}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 className={typographyClasses} {...otherProps}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 className={typographyClasses} {...otherProps}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className={typographyClasses} {...otherProps}>
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 className={typographyClasses} {...otherProps}>
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6 className={typographyClasses} {...otherProps}>
          {children}
        </h6>
      );
    case "span":
      return (
        <span className={typographyClasses} {...otherProps}>
          {children}
        </span>
      );
    case "small":
      return (
        <small className={typographyClasses} {...otherProps}>
          {children}
        </small>
      );
    default:
      return (
        <p className={typographyClasses} {...otherProps}>
          {children}
        </p>
      );
  }
};

export default Typography;
