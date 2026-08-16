import React from "react";
import styles from "./Stepper.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";
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
  const stepperItemClasses = getClassNames(styles["cp-stepper-item"], {
    [styles["cp-stepper-item--active"]]: step.isActive,
    [styles["cp-stepper-item--completed"]]: step.isCompleted,
  });
  return (
    <div className={stepperItemClasses}>
      <span className={styles["cp-stepper-count"]} onClick={onClick}>
        {step.isCompleted ? (
          <Icon name="done" className={styles["cp-stepper-count-icon"]} />
        ) : (
          order
        )}
      </span>
      <span className={styles["cp-stepper-separator"]} />
      <a
        className={styles["cp-stepper-link"]}
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
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(
    prototypeEnabled,
    "Stepper",
    { variant, margin, config },
    { variant: undefined, margin: "0" },
  );
  const marginClass = getSpacingClass(margin, utilStyles, "cp-m");
  const stepperClasses = getClassNames(
    styles["cp-stepper"],
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
    <div {...dataCp} className={stepperClasses}>
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
