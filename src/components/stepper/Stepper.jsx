import React from "react";
import PropTypes from "prop-types";
import styles from "./Stepper.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";

const StepperItem = ({ step, order, onClick }) => {
  const stepperItemClasses = getClassNames(styles["stepper-item"], {
    [styles["active"]]: step.isActive,
    [styles["completed"]]: step.isCompleted,
  });
  return (
    <div className={stepperItemClasses}>
      <span className={styles["stepper-count"]} onClick={(e) => onClick(e)}>
        {step.isCompleted ? (
          <Icon name="done" className={styles["stepper-count-icon"]} />
        ) : (
          order
        )}
      </span>
      <span className={styles.separator} />
      <a
        className={styles["stepper-link"]}
        onClick={(e) => onClick(e)}
        href={step.key}
      >
        {step.label}
      </a>
    </div>
  );
};

const Stepper = ({
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
      [styles[variant]]: variant,
    },
    marginClass,
    className
  );
  const handleClick = (e, step) => {
    e.preventDefault();
    if (typeof onClick === "function") {
      onClick(step);
    }
  };
  return (
    <div className={stepperClasses}>
      {config.map((step, index) => {
        return (
          <StepperItem
            order={index + 1}
            onClick={(e) => handleClick(e, step)}
            key={step.key}
            step={step}
          />
        );
      })}
    </div>
  );
};

Stepper.propTypes = {
  variant: PropTypes.oneOf(["horizontal", "vertical"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  config: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      isCompleted: PropTypes.bool,
      isActive: PropTypes.bool,
    })
  ).isRequired,
};

export default Stepper;
