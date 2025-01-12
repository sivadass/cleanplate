import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import Avatar from "../avatar";
import styles from "./Header.module.scss";
import Animated from "../animated";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";

import utilStyles from "../../styles/utils.module.scss";
import Button from "../button";

const Header = ({
  logoUrl,
  className,
  headerLeft,
  headerRight,
  headerCenter,
  size,
  variant,
  margin,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [animationType, setAnimationType] = React.useState(false);
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const headerClassNames = getClassNames(
    styles["cp-header"],
    styles[size],
    styles[variant],
    marginClass,
    className
  );

  const handleOpenMobileMenu = () => {
    setAnimationType("fade-in-left");
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setAnimationType("fade-out-left");
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 300);
  };

  return (
    <div className={headerClassNames}>
      <div className={styles.wrapper}>
        <div className={styles.headerLeft}>
          <Button
            className={styles.mobileMenuTrigger}
            variant="icon"
            onClick={() => handleOpenMobileMenu()}
          >
            <Icon name="menu" />
          </Button>
          {headerLeft ? (
            headerLeft
          ) : (
            <img className={styles.logo} src={logoUrl} />
          )}
        </div>
        <div className={styles.headerCenter}>{headerCenter}</div>
        <div className={styles.headerRight}>{headerRight}</div>
      </div>
      {isMobileMenuOpen && (
        <Animated animationType={animationType} className={styles.mobileMenu}>
          <Button
            className={[styles.mobileMenuTrigger, styles.mobileMenuClose]}
            variant="icon"
            onClick={() => handleCloseMobileMenu()}
          >
            <Icon name="close" />
          </Button>
        </Animated>
      )}
    </div>
  );
};

Header.propTypes = {
  logoUrl: PropTypes.string,
  className: PropTypes.string,
  headerLeft: PropTypes.elementType,
  headerRight: PropTypes.elementType,
  headerCenter: PropTypes.elementType,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["light", "dark"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Header;
