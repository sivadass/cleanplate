import React from "react";
import PropTypes from "prop-types";
import styles from "./Animated.module.scss";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { getSpacingClass } from "../../utils/common";
import utilStyles from "../../styles/utils.module.scss";

const Animated = ({
  animationType = "fadeUp",
  as: Component = "span",
  children,
  margin = ["0"],
  delay = 0,
  className = "",
  isBlock = false,
}) => {
  const domRef = React.useRef();
  const [isVisible, setVisible] = React.useState(false);
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const delayClass = `delay-${delay}`;

  const animatedClasses = getClassNames(
    styles["animated"],
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
    <Component ref={domRef} className={animatedClasses}>
      {children}
    </Component>
  );
};

Animated.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  delay: PropTypes.oneOf([200, 400, 600, 800, 1000]),
  animationType: PropTypes.oneOf(["fadeUp", "fadeDown"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Animated;
