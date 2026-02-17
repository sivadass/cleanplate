import React from "react";
import Typography from "../typography";
import Button from "../button";
import Icon from "../icon";
import Dropdown from "../dropdown";
import type { DropdownRenderTriggerParams } from "../dropdown";
import getClassNames from "../../utils/get-class-names";
import styles from "./PageHeader.module.scss";

export interface PageHeaderMoreMenuItem {
  /** Menu item label */
  label: string;
  /** Called when the item is clicked; the more menu closes after. */
  onClick?: () => void;
}

export interface PageHeaderProps {
  /** Page title (left column) */
  title: React.ReactNode;
  /** Optional subtitle below the title (left column) */
  subtitle?: React.ReactNode;
  /** Primary call-to-action, e.g. a Button (right column, aligned right) */
  primaryCta?: React.ReactNode;
  /** More menu items; renders a trigger with three-dots (more_vert) icon and a dropdown (right column). */
  moreMenuItems?: PageHeaderMoreMenuItem[];
  /** Custom content for the more menu dropdown instead of moreMenuItems (right column). */
  moreMenuContent?: React.ReactNode;
  /** Additional class name for the root element */
  className?: string;
}

/** Internal: list used as dropdown content when moreMenuItems is provided; receives onClose from Dropdown clone. */
const MoreMenuList: React.FC<{
  items: PageHeaderMoreMenuItem[];
  onClose?: () => void;
  className?: string;
}> = ({ items, onClose, className }) => (
  <ul className={className} role="menu">
    {items.map((item, index) => (
      <li key={index} role="none">
        <button
          type="button"
          role="menuitem"
          className={styles["cp-page-header__more-item"]}
          onClick={() => {
            item.onClick?.();
            onClose?.();
          }}
        >
          {item.label}
        </button>
      </li>
    ))}
  </ul>
);

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  primaryCta,
  moreMenuItems,
  moreMenuContent,
  className = "",
}) => {
  const hasMoreMenu = (moreMenuItems?.length ?? 0) > 0 || moreMenuContent != null;

  const rootClassName = getClassNames(styles["cp-page-header"], className);

  const renderMoreTrigger = ({ triggerProps }: DropdownRenderTriggerParams) => (
    <span
      ref={triggerProps.ref as React.RefObject<HTMLSpanElement>}
      style={{ display: "inline-flex" }}
    >
      <Button
        variant="icon"
        size="small"
        className={getClassNames(
          styles["cp-page-header__more-trigger"],
          triggerProps.className
        )}
        onClick={triggerProps.onClick as React.MouseEventHandler<HTMLButtonElement>}
        // aria-expanded={triggerProps["aria-expanded"]}
        // aria-haspopup={triggerProps["aria-haspopup"]}
      >
        <Icon name="more_vert" size="small" />
      </Button>
    </span>
  );

  return (
    <header className={rootClassName}>
      <div className={styles["cp-page-header__row"]}>
        <div className={styles["cp-page-header__left"]}>
          {typeof title === "string" ? (
            <Typography variant="h4" className={styles["cp-page-header__title"]}>
              {title}
            </Typography>
          ) : (
            <div className={styles["cp-page-header__title"]}>{title}</div>
          )}
          {subtitle != null && (
            <>
              {typeof subtitle === "string" ? (
                <Typography
                  variant="p"
                  className={styles["cp-page-header__subtitle"]}
                >
                  {subtitle}
                </Typography>
              ) : (
                <div className={styles["cp-page-header__subtitle"]}>
                  {subtitle}
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles["cp-page-header__right"]}>
          {primaryCta != null && (
            <div className={styles["cp-page-header__cta"]}>{primaryCta}</div>
          )}
          {hasMoreMenu && (
            <div className={styles["cp-page-header__more"]}>
              {moreMenuItems != null && moreMenuItems.length > 0 ? (
                <Dropdown
                  placement="bottom-end"
                  content={
                    <MoreMenuList
                      items={moreMenuItems}
                      className={styles["cp-page-header__more-list"]}
                    />
                  }
                  renderTrigger={renderMoreTrigger}
                />
              ) : moreMenuContent != null ? (
                <Dropdown
                  placement="bottom-end"
                  content={
                    <div className={styles["cp-page-header__more-list"]}>
                      {moreMenuContent}
                    </div>
                  }
                  renderTrigger={renderMoreTrigger}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

PageHeader.displayName = "PageHeader";

export default PageHeader;
