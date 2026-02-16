import React, { useState, useEffect, useRef } from "react";
import styles from "./Animated.module.scss";
import {
  ANIMATION_DELAY_OPTIONS,
  ANIMATION_TYPE_OPTIONS,
  SPACING_OPTIONS,
} from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { getSpacingClass } from "../../utils/common";
import utilStyles from "../../styles/utils.module.scss";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type AnimatedMargin = string | SpacingOption[];

export type AnimationType = (typeof ANIMATION_TYPE_OPTIONS)[number];

export type AnimationDelay = (typeof ANIMATION_DELAY_OPTIONS)[number];

export interface AnimatedProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  /** Animation type applied when element is in view */
  animationType?: AnimationType;
  /** Root element or component to render (default "span") */
  as?: React.ElementType;
  /** Margin spacing (suffix or array of spacing suffixes; component adds m- prefix) */
  margin?: AnimatedMargin;
  /** Delay in ms; maps to delay-{delay} class (e.g. 200 → delay-200) */
  delay?: number;
  /** Additional class names for the root element */
  className?: string;
  /** If true, applies block display */
  isBlock?: boolean;
}

const Animated: React.FC<AnimatedProps> = ({
  animationType = "fade-in-bottom",
  as: Component = "span",
  children,
  margin = ["0"],
  delay = 0,
  className = "",
  isBlock = false,
  ...otherProps
}) => {
  const domRef = useRef<HTMLElement>(null);
  const [isVisible, setVisible] = useState(false);
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

  useEffect(() => {
    const el = domRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(el);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Component ref={domRef} className={animatedClasses} {...otherProps}>
      {children}
    </Component>
  );
};

export default Animated;
