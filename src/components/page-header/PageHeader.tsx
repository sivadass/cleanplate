import React from "react";
import Typography from "../typography";
import Button from "../button";
import Icon from "../icon";
import Dropdown from "../dropdown";
import MenuList from "../menu-list";
import type { DropdownRenderTriggerParams } from "../dropdown";
import type { MenuListItem } from "../menu-list";
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

function toMenuListItems(items: PageHeaderMoreMenuItem[]): MenuListItem[] {
  return items.map((item, index) => ({
    label: item.label,
    value: String(index),
  }));
}

/** Dropdown panel: MenuList for items, or a slot for custom content. Receives onClose from Dropdown clone. */
const MoreMenuPanel: React.FC<{
  items?: PageHeaderMoreMenuItem[];
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}> = ({ items, children, onClose, className }) => {
  if (items != null && items.length > 0) {
    const menuItems = toMenuListItems(items);

    return (
      <MenuList
        className={className}
        items={menuItems}
        direction="vertical"
        variant="light"
        size="small"
        onMenuClick={(menuItem) => {
          const index = Number(menuItem.value);
          items[index]?.onClick?.();
          onClose?.();
        }}
      />
    );
  }

  if (children != null) {
    return <div className={className}>{children}</div>;
  }

  return null;
};

function renderHeadingBlock(
  content: React.ReactNode,
  variant: "h4" | "p",
  className: string,
): React.ReactNode {
  return (
    <Typography variant={variant} className={className}>
      {content}
    </Typography>
  );
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  primaryCta,
  moreMenuItems,
  moreMenuContent,
  className = "",
}) => {
  const hasMoreMenuItems = (moreMenuItems?.length ?? 0) > 0;
  const hasMoreMenu = hasMoreMenuItems || moreMenuContent != null;
  const hasActions = primaryCta != null || hasMoreMenu;

  const rootClassName = getClassNames(styles["cp-page-header"], className);

  const renderMoreTrigger = ({ triggerProps }: DropdownRenderTriggerParams) => (
    <Button
      ref={triggerProps.ref as React.Ref<HTMLButtonElement>}
      type="button"
      variant="icon"
      size="medium"
      aria-label="More options"
      className={getClassNames(
        styles["cp-page-header-more-trigger"],
        triggerProps.className,
      )}
      onClick={triggerProps.onClick as React.MouseEventHandler<HTMLButtonElement>}
      aria-expanded={triggerProps["aria-expanded"]}
      aria-haspopup="true"
    >
      <Icon name="more_vert" size="medium" />
    </Button>
  );

  const moreMenuPanel = (
    <MoreMenuPanel items={hasMoreMenuItems ? moreMenuItems : undefined}>
      {moreMenuContent}
    </MoreMenuPanel>
  );

  return (
    <header className={rootClassName}>
      <div className={styles["cp-page-header-row"]}>
        <div className={styles["cp-page-header-start"]}>
          {renderHeadingBlock(title, "h4", styles["cp-page-header-title"])}
          {subtitle != null &&
            renderHeadingBlock(subtitle, "p", styles["cp-page-header-subtitle"])}
        </div>

        {hasActions && (
          <div className={styles["cp-page-header-actions"]}>
            {primaryCta != null && (
              <div className={styles["cp-page-header-cta"]}>{primaryCta}</div>
            )}
            {hasMoreMenu && (
              <Dropdown
                placement="bottom-end"
                content={moreMenuPanel}
                renderTrigger={renderMoreTrigger}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

PageHeader.displayName = "PageHeader";

export default PageHeader;
