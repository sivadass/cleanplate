import React from "react";
import Container from "../container";
import Icon from "../icon";
import styles from "./Spinner.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";

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
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(
    prototypeEnabled,
    "Spinner",
    { size, variant, icon, margin },
    { size: "medium", variant: "light", icon: "progress_activity", margin: "0" },
  );
  const marginClass = getSpacingClass(margin, utilStyles, "cp-m");
  const iconClasses = getClassNames(
    styles[`cp-spinner--${size}`],
    variant === "dark" ? styles["cp-spinner--dark"] : "",
    marginClass,
    className
  );

  return (
    <Container {...dataCp} className={getClassNames(styles["cp-spinner"], iconClasses)}>
      <Icon name={icon} className={styles["cp-spinner-icon"]} />
    </Container>
  );
};

export default Spinner;
