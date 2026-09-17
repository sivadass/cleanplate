import React from "react";
import styles from "./Typography.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";

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
  margin = "0",
  className = "",
  isBold = false,
  align = "left",
  wordBreak = "normal",
  ...otherProps
}) => {
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(
    prototypeEnabled,
    "Typography",
    { variant, margin, isBold, align, wordBreak },
    { margin: "0", isBold: false, align: "left", wordBreak: "normal" },
  );
  const marginClass = getSpacingClass(margin, utilStyles, "cp-m");
  const alignClass = `cp-typography--align-${align}`;
  const wordBreakClass = `cp-typography--word-break-${wordBreak}`;
  const typographyClasses = getClassNames(
    styles["cp-typography"],
    {
      [styles[`cp-typography--${variant}`]]: variant,
      [styles["cp-typography--bold"]]: isBold,
      [styles[alignClass]]: align,
      [styles[wordBreakClass]]: wordBreak,
    },
    marginClass,
    className
  );

  switch (variant) {
    case "h1":
      return (
        <h1 {...dataCp} className={typographyClasses} {...otherProps}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 {...dataCp} className={typographyClasses} {...otherProps}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 {...dataCp} className={typographyClasses} {...otherProps}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 {...dataCp} className={typographyClasses} {...otherProps}>
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 {...dataCp} className={typographyClasses} {...otherProps}>
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6 {...dataCp} className={typographyClasses} {...otherProps}>
          {children}
        </h6>
      );
    case "span":
      return (
        <span {...dataCp} className={typographyClasses} {...otherProps}>
          {children}
        </span>
      );
    case "small":
      return (
        <small {...dataCp} className={typographyClasses} {...otherProps}>
          {children}
        </small>
      );
    default:
      return (
        <p {...dataCp} className={typographyClasses} {...otherProps}>
          {children}
        </p>
      );
  }
};

export default Typography;
