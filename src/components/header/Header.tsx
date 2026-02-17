import React, { useState } from "react";
import Icon from "../icon";
import styles from "./Header.module.scss";
import Animated from "../animated";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";
import Button from "../button";
import MenuList from "../menu-list";
import type { MenuListItem } from "../menu-list";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type HeaderSize = "small" | "medium" | "large";

export type HeaderVariant = "light" | "dark";

export type HeaderMargin = string | SpacingOption[];

export interface HeaderProps {
  /** URL for the logo image (shown when headerLeft is not provided) */
  logoUrl?: string;
  /** Value of the currently active menu item */
  activeMenuItem?: string;
  /** Called when a menu item is clicked */
  onMenuItemClick?: (item: MenuListItem) => void;
  /** Additional class names for the root element */
  className?: string;
  /** Custom content for the left area (replaces logo when provided) */
  headerLeft?: React.ReactNode;
  /** Custom content for the right area */
  headerRight?: React.ReactNode;
  /** Custom content for the center area (replaces MenuList when provided) */
  headerCenter?: React.ReactNode;
  /** Menu items for the center/vertical menu */
  menuItems: MenuListItem[];
  /** Size of the header */
  size?: HeaderSize;
  /** Visual variant */
  variant?: HeaderVariant;
  /** Spacing suffix(s) for outer margin; component adds m- prefix */
  margin?: HeaderMargin;
}

const Header: React.FC<HeaderProps> = ({
  logoUrl,
  activeMenuItem,
  onMenuItemClick,
  className = "",
  headerLeft,
  headerRight,
  headerCenter,
  size,
  variant,
  margin,
  menuItems,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animationType, setAnimationType] = useState<"fade-in-left" | "fade-out-left">("fade-in-left");
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const headerClassNames = getClassNames(
    styles["cp-header"],
    size && styles[size],
    variant && styles[variant],
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

  const handleMenuItem = (menuItem: MenuListItem) => {
    onMenuItemClick?.(menuItem);
    handleCloseMobileMenu();
  };

  return (
    <div className={headerClassNames}>
      <div className={styles.wrapper}>
        <div className={styles.headerLeft}>
          <Button
            className={styles.mobileMenuTrigger}
            variant="icon"
            onClick={handleOpenMobileMenu}
          >
            <Icon name="menu" />
          </Button>
          {headerLeft ? (
            headerLeft
          ) : logoUrl ? (
            <img className={styles.logo} src={logoUrl} alt="" />
          ) : null}
        </div>
        <div className={styles.headerCenter}>
          {headerCenter ?? (
            <MenuList
              items={menuItems}
              activeItem={activeMenuItem}
              onMenuClick={handleMenuItem}
            />
          )}
        </div>
        <div className={styles.headerRight}>{headerRight}</div>
      </div>
      {isMobileMenuOpen && (
        <Animated animationType={animationType} className={styles.mobileMenu}>
          <Button
            className={getClassNames(styles.mobileMenuTrigger, styles.mobileMenuClose)}
            variant="icon"
            onClick={handleCloseMobileMenu}
          >
            <Icon name="close" />
          </Button>
          <MenuList
            direction="vertical"
            items={menuItems}
            activeItem={activeMenuItem}
            onMenuClick={handleMenuItem}
          />
        </Animated>
      )}
    </div>
  );
};

Header.displayName = "Header";

export default Header;
