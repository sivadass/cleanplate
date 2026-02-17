import React from "react";
import Icon from "../icon";
import styles from "./MenuList.module.scss";
import Animated from "../animated";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";
import Typography from "../typography";
import type { MaterialIconName } from "../icon/material-icon-names";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type MenuListSize = "small" | "medium" | "large";

export type MenuListVariant = "light" | "dark";

export type MenuListDirection = "horizontal" | "vertical";

export type MenuListMargin = string | SpacingOption[];

export interface MenuListItem {
  label: string;
  value: string;
  icon?: MaterialIconName;
}

export interface MenuListProps {
  /** List of menu items; each has label, value, and optional icon */
  items: MenuListItem[];
  /** Value of the currently active item (matches item.value) */
  activeItem?: string;
  /** Size of menu items */
  size?: MenuListSize;
  /** Visual variant (light, dark) */
  variant?: MenuListVariant;
  /** Layout direction of the list */
  direction?: MenuListDirection;
  /** Spacing suffix(s) for outer margin; component adds m- prefix */
  margin?: MenuListMargin;
  /** Additional class names for the root element */
  className?: string;
  /** Called when a menu item is clicked; receives the clicked item */
  onMenuClick?: (item: MenuListItem) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  items,
  activeItem,
  size,
  variant,
  margin,
  className = "",
  direction = "horizontal",
  onMenuClick,
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const menuListClassNames = getClassNames(
    styles["cp-menu-list"],
    size && styles[size],
    variant && styles[variant],
    marginClass,
    className
  );

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, menuItem: MenuListItem) => {
    e.preventDefault();
    onMenuClick?.(menuItem);
  };

  return (
    <div className={menuListClassNames}>
      <div className={styles.wrapper}>
        <ul className={styles[direction]}>
          {items?.map((item, index) => {
            const isActive = item.value === activeItem;
            const delay = index * 100;
            return (
              <Animated
                as="li"
                key={item.value}
                className={isActive ? styles.active : undefined}
                delay={delay}
                animationType="fade-in-left"
              >
                <a href={item.value} onClick={(e) => handleMenuClick(e, item)}>
                  {item?.icon && (
                    <Icon className={styles.menuItemIcon} name={item.icon} />
                  )}
                  <Typography variant="span" className={styles.menuItemLabel}>
                    {item.label}
                  </Typography>
                </a>
              </Animated>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

MenuList.displayName = "MenuList";

export default MenuList;
