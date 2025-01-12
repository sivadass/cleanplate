import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import styles from "./Header.module.scss";
import Animated from "../animated";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";

import utilStyles from "../../styles/utils.module.scss";
import Button from "../button";
import MenuList from "../menu-list";

const Header = ({
  logoUrl,
  activeMenuItem,
  onMenuItemClick,
  className,
  headerLeft,
  headerRight,
  headerCenter,
  size,
  variant,
  margin,
  menuItems,
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

  const handleMenuItem = (menuItem) => {
    onMenuItemClick(menuItem);
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
        <div className={styles.headerCenter}>
          {headerCenter || (
            <MenuList
              items={menuItems}
              activeItem={activeMenuItem}
              onMenuClick={(menuItem) => handleMenuItem(menuItem)}
            />
          )}
        </div>
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
          <MenuList
            direction="vertical"
            items={menuItems}
            activeItem={activeMenuItem}
            onMenuClick={(menuItem) => handleMenuItem(menuItem)}
          />
        </Animated>
      )}
    </div>
  );
};

Header.propTypes = {
  logoUrl: PropTypes.string,
  activeMenuItem: PropTypes.string,
  onMenuItemClick: PropTypes.func,
  className: PropTypes.string,
  headerLeft: PropTypes.elementType,
  headerRight: PropTypes.elementType,
  headerCenter: PropTypes.elementType,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["light", "dark"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Header;
