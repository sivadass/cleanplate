import React from "react";
import PropTypes from "prop-types";
import styles from "./Animated.module.scss";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { getSpacingClass } from "../../utils/common";
import utilStyles from "../../styles/utils.module.scss";

const Animated = ({
  animationType = "fade-up",
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
    styles[animationType],
    styles[delayClass],
    {
      [styles["is-visible"]]: isVisible,
      [styles["is-hidden"]]: !isVisible,
      [styles["is-block"]]: isBlock,
    },
    marginClass,
    className
  );

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // In your case there's only one element to observe:
      if (entries[0].isIntersecting) {
        // Not possible to set it back to false like this:
        setVisible(true);

        // No need to keep observing:
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
  delay: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]),
  animationType: PropTypes.oneOf([
    "fade-up",
    "fade-in-left",
    "fade-out-left",
    "fade-in-right",
    "fade-out-right",
    "fade-in-top",
    "fade-out-top",
    "fade-in-bottom",
    "fade-out-bottom",
  ]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Animated;
