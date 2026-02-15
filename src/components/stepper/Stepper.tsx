import React from "react";
import styles from "./Stepper.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type StepperVariant = "horizontal" | "vertical";

export type StepperMargin = string | SpacingOption[];

export interface StepperStepConfig {
  /** Display label for the step */
  label: string;
  /** Unique key (e.g. used as href fragment or route path) */
  key: string;
  /** Whether this step is completed */
  isCompleted?: boolean;
  /** Whether this step is currently active */
  isActive?: boolean;
}

export interface StepperProps {
  /** Layout direction */
  variant?: StepperVariant;
  /** Spacing suffix for outer margin. Component adds the m- prefix (e.g. "0" → m-0). */
  margin?: StepperMargin;
  /** Additional class names for the root element */
  className?: string;
  /** Step definitions (label, key, isCompleted, isActive) */
  config: StepperStepConfig[];
  /** Called when a step is clicked; receives the step config */
  onClick?: (step: StepperStepConfig) => void;
}

interface StepperItemProps {
  step: StepperStepConfig;
  order: number;
  onClick: (e: React.MouseEvent) => void;
}

const StepperItem: React.FC<StepperItemProps> = ({ step, order, onClick }) => {
  const stepperItemClasses = getClassNames(styles["stepper-item"], {
    [styles["active"]]: step.isActive,
    [styles["completed"]]: step.isCompleted,
  });
  return (
    <div className={stepperItemClasses}>
      <span className={styles["stepper-count"]} onClick={onClick}>
        {step.isCompleted ? (
          <Icon name="done" className={styles["stepper-count-icon"]} />
        ) : (
          order
        )}
      </span>
      <span className={styles.separator} />
      <a
        className={styles["stepper-link"]}
        onClick={onClick}
        href={step.key}
      >
        {step.label}
      </a>
    </div>
  );
};

const Stepper: React.FC<StepperProps> = ({
  variant,
  margin = "0",
  className = "",
  config,
  onClick,
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const stepperClasses = getClassNames(
    styles["stepper"],
    {
      [styles[variant ?? ""]]: !!variant,
    },
    marginClass,
    className
  );

  const handleClick = (e: React.MouseEvent, step: StepperStepConfig) => {
    e.preventDefault();
    if (typeof onClick === "function") {
      onClick(step);
    }
  };

  return (
    <div className={stepperClasses}>
      {config.map((step, index) => (
        <StepperItem
          key={step.key}
          step={step}
          order={index + 1}
          onClick={(e) => handleClick(e, step)}
        />
      ))}
    </div>
  );
};

export default Stepper;
