import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import Button from "../button";
import styles from "./MenuList.module.scss";
import Animated from "../animated";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";

const MenuList = ({
  items,
  activeItem,
  size,
  variant,
  margin,
  className,
  direction = "horizontal",
  onMenuClick,
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const menuListClassNames = getClassNames(
    styles["cp-menu-list"],
    styles[size],
    styles[variant],
    marginClass,
    className
  );

  const handleMenuClick = (e, menuItem) => {
    e.preventDefault();
    onMenuClick(menuItem);
  };

  return (
    <div className={menuListClassNames}>
      <div className={styles.wrapper}>
        <ul className={styles[direction]}>
          {items?.map((item) => {
            const isActive = item.value === activeItem;
            return (
              <li key={item.value} className={isActive ? styles.active : null}>
                <a href={item.value} onClick={(e) => handleMenuClick(e, item)}>
                  {item?.icon && <Icon name={item.icon} />}
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

MenuList.propTypes = {
  className: PropTypes.string,
  activeItem: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["light", "dark"]),
  direction: PropTypes.oneOf(["horizontal", "vertical"]),
  onMenuClick: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default MenuList;
