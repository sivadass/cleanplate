import React from "react";
import PropTypes from "prop-types";
import styles from "./Animated.module.scss";
import {
  ANIMATION_DELAY_OPTIONS,
  ANIMATION_TYPE_OPTIONS,
  SPACING_OPTIONS,
} from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { getSpacingClass } from "../../utils/common";
import utilStyles from "../../styles/utils.module.scss";

const Animated = ({
  animationType = "fade-in-bottom",
  as: Component = "span",
  children,
  margin = ["0"],
  delay = 0,
  className = "",
  isBlock = false,
  ...otherProps
}) => {
  const domRef = React.useRef();
  const [isVisible, setVisible] = React.useState(false);
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const delayClass = `delay-${delay}`;

  const animatedClasses = getClassNames(
    styles["animated"],
    {
      [styles[animationType]]: isVisible,
      [styles["is-block"]]: isBlock,
    },
    styles[delayClass],
    marginClass,
    className
  );

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(domRef.current);
      }
    });
    observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Component ref={domRef} className={animatedClasses} {...otherProps}>
      {children}
    </Component>
  );
};

Animated.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  delay: PropTypes.oneOf(ANIMATION_DELAY_OPTIONS),
  animationType: PropTypes.oneOf(ANIMATION_TYPE_OPTIONS),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Animated;
