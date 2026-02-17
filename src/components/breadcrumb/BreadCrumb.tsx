import React from "react";
import Icon from "../icon";
import getClassNames from "../../utils/get-class-names";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import utilStyles from "../../styles/utils.module.scss";
import styles from "./BreadCrumb.module.scss";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type BreadCrumbMargin = string | SpacingOption[];
export type BreadCrumbSeparator = "slash" | "chevron";

export interface BreadCrumbItem {
  /** Display label for the crumb */
  label: string;
  /** URL for the crumb. Omit for the current page (last item). */
  href?: string;
}

export interface BreadCrumbProps {
  /** List of breadcrumb items. Last item is treated as current page when it has no href. */
  items: BreadCrumbItem[];
  /** Visual separator between items */
  separator?: BreadCrumbSeparator;
  /** Accessible label for the navigation landmark (default: "Breadcrumb") */
  ariaLabel?: string;
  /** Spacing suffix for outer margin (e.g. "0" → m-0). */
  margin?: BreadCrumbMargin;
  /** Additional class name for the root nav element */
  className?: string;
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({
  items,
  separator = "chevron",
  ariaLabel = "Breadcrumb",
  margin,
  className = "",
}) => {
  const marginClass = margin ? getSpacingClass(margin, utilStyles, "m") : undefined;
  const rootClassName = getClassNames(
    styles["cp-breadcrumb"],
    separator === "slash" && styles["cp-breadcrumb_separator-slash"],
    marginClass,
    className
  );

  return (
    <nav className={rootClassName} aria-label={ariaLabel}>
      <ol className={styles["cp-breadcrumb__list"]} itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrentPage = isLast && item.href == null;

          return (
            <li
              key={index}
              className={styles["cp-breadcrumb__item"]}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <span
                  className={styles["cp-breadcrumb__separator"]}
                  aria-hidden="true"
                >
                  {separator === "chevron" ? (
                    <Icon name="chevron_right" size="small" className={styles["cp-breadcrumb__separator-icon"]} />
                  ) : (
                    "/"
                  )}
                </span>
              )}
              {isCurrentPage ? (
                <span
                  className={styles["cp-breadcrumb__current"]}
                  aria-current="page"
                  itemProp="name"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className={styles["cp-breadcrumb__link"]}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span className={styles["cp-breadcrumb__label"]} itemProp="name">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

BreadCrumb.displayName = "BreadCrumb";

export default BreadCrumb;
