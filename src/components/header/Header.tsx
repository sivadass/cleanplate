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
  /**
   * When true (default), renders `menuItems` as the center nav on wide viewports.
   * Set false when primary nav lives elsewhere (e.g. AppShell sidebar) while
   * keeping `menuItems` for the mobile hamburger menu.
   */
  showCenterMenu?: boolean;
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
  showCenterMenu = true,
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
        <div className={styles["header-left"]}>
          <Button
            className={styles["mobile-menu-trigger"]}
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
        <div className={styles["header-center"]}>
          {headerCenter ??
            (showCenterMenu ? (
              <MenuList
                items={menuItems}
                activeItem={activeMenuItem}
                onMenuClick={handleMenuItem}
              />
            ) : null)}
        </div>
        <div className={styles["header-right"]}>{headerRight}</div>
      </div>
      {isMobileMenuOpen && (
        <Animated animationType={animationType} className={styles["mobile-menu"]}>
          <Button
            className={getClassNames(
              styles["mobile-menu-trigger"],
              styles["mobile-menu-close"],
            )}
            variant="icon"
            onClick={handleCloseMobileMenu}
          >
            <Icon name="close" />
          </Button>
          <div className={styles["mobile-menu-nav"]}>
            <MenuList
              direction="vertical"
              items={menuItems}
              activeItem={activeMenuItem}
              onMenuClick={handleMenuItem}
            />
          </div>
        </Animated>
      )}
    </div>
  );
};

Header.displayName = "Header";

export default Header;
