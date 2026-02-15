import React from "react";
import Container from "../container";
import Icon from "../icon";
import styles from "./Spinner.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type SpinnerSize = "small" | "medium" | "large";

export type SpinnerVariant = "light" | "dark";

export type SpinnerMargin = string | SpacingOption[];

/** Icon shown as the spinner. All animate smoothly when rotated via CSS. */
export type SpinnerIcon =
  | "progress_activity"
  | "autorenew"
  | "sync"
  | "refresh"
  | "cached"
  | "loop";

export interface SpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Visual variant (light or dark) */
  variant?: SpinnerVariant;
  /** Icon to display as the spinner. Default "progress_activity". */
  icon?: SpinnerIcon;
  /** Spacing suffix for outer margin. Component adds the m- prefix (e.g. "0" → m-0). */
  margin?: SpinnerMargin;
  /** Additional class names for the wrapper */
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  variant = "light",
  icon = "progress_activity",
  margin = "0",
  className = "",
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const iconClasses = getClassNames(
    styles[size],
    styles[variant],
    marginClass,
    className
  );

  return (
    <Container className={getClassNames(styles["cp-spinner"], iconClasses)}>
      <Icon name={icon} className={styles["cp-spinner-icon"]} />
    </Container>
  );
};

export default Spinner;
