import React from "react";
import styles from "./Container.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

const GAP_OPTIONS = SPACING_OPTIONS.slice(0, 10);

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type ContainerDisplay = "inline-block" | "block" | "flex";

export type ContainerWidth =
  | "small"
  | "medium"
  | "large"
  | "extra-large"
  | "quarter"
  | "half"
  | "three-quarters"
  | "full";

export type ContainerJustify =
  | "space-between"
  | "center"
  | "space-around"
  | "space-evenly"
  | "flex-end"
  | "flex-start";

export type ContainerAlign = "start" | "center" | "end";

export type ContainerSpacing = string | SpacingOption[];

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  margin?: ContainerSpacing;
  padding?: ContainerSpacing;
  /** Base display or empty string for unset */
  display?: ContainerDisplay | "";
  /** Base align or empty string for unset */
  align?: ContainerAlign | "";
  /** Base justify or empty string for unset */
  justify?: ContainerJustify | "";
  /** Base width or empty string for unset */
  width?: ContainerWidth | "";
  showBorder?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  gap?: ContainerSpacing;
}

const Container: React.FC<ContainerProps> = ({
  children,
  margin = "m-0",
  padding = "p-4",
  display = "",
  align = "",
  justify = "",
  width = "",
  showBorder = false,
  className = "",
  onClick,
  style,
  gap = "4",
  ...rest
}) => {
  const displayClass = `display-${display}`;
  const justifyClass = `justify-${justify}`;
  const alignClass = `align-${align}`;
  const widthClass = `width-${width}`;

  const marginStyles = getSpacingClass(margin, utilStyles, "m");
  const paddingStyles = getSpacingClass(padding, utilStyles, "p");
  const gapStyles = getSpacingClass(gap, utilStyles, "g");

  const containerClasses = getClassNames(
    styles["container"],
    paddingStyles,
    marginStyles,
    {
      [styles["border"]]: showBorder,
      [styles[widthClass]]: width,
      [styles[displayClass]]: display,
      [styles[justifyClass]]: justify,
      [styles[alignClass]]: align,
    },
    gapStyles,
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Container;
