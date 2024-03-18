import React from "react";
import PropTypes from "prop-types";
import styles from "./Stepper.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

const Separator = () => {
  return <span className={styles.separator} />;
};

const StepperItem = ({ children, order }) => {
  return (
    <div className={styles["stepper-item"]}>
      <span className={styles["stepper-count"]}>{order}</span>
      <Separator />
      {children}
    </div>
  );
};

const Stepper = ({
  variant,
  margin = "m-0",
  className = "",
  config,
  customRender,
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const stepperClasses = getClassNames(
    styles["wrapper"],
    {
      [styles[variant]]: variant,
    },
    marginClass,
    className
  );
  return (
    <div className={stepperClasses}>
      {config?.map((step, index) => {
        const isLastItem = config?.length - 1 === index;
        if (typeof customRender === "function") {
          return customRender(step, index);
        }
        return (
          <StepperItem order={index + 1}>
            <a href={step.link}>{step.label}</a>
          </StepperItem>
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
};

export default Stepper;
