import React from "react";
import PropTypes from "prop-types";
import styles from "./Stepper.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import Icon from "../icon";

const Separator = () => {
  return <span className={styles.separator} />;
};

const StepperItem = ({
  children,
  isActive = false,
  order,
  onClick,
  isCompleted = false,
}) => {
  const stepperClasses = getClassNames(styles["stepper-item"], {
    [styles["active"]]: isActive,
  });
  return (
    <div className={stepperClasses} onClick={() => onClick()}>
      <span className={styles["stepper-count"]}>
        {isCompleted ? (
          <Icon name="done" className={styles["stepper-count-icon"]} />
        ) : (
          order
        )}
      </span>
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
  onClick,
  defaultActiveIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(defaultActiveIndex);
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const stepperClasses = getClassNames(
    styles["stepper"],
    {
      [styles[variant]]: variant,
    },
    marginClass,
    className
  );
  const handleClick = (index) => {
    setActiveIndex(index);
    if (typeof onClick === "function") {
      onClick(index);
    }
  };
  return (
    <div className={stepperClasses}>
      {config.map((step, index) => {
        return (
          <StepperItem
            isActive={index === activeIndex}
            order={index + 1}
            onClick={() => handleClick(index)}
            isCompleted={step.isCompleted || false}
          >
            {typeof customRender === "function" ? (
              customRender(step, index)
            ) : (
              <a href={step.link}>{step.label}</a>
            )}
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
  config: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.number.isRequired,
      isCompleted: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default Stepper;
