import React from "react";
import Header from "../header";
import Footer from "../footer";
import MenuList from "../menu-list";
import type { MenuListItem } from "../menu-list";
import type { MenuListSize, MenuListVariant } from "../menu-list";
import type { HeaderProps } from "../header";
import type { FooterProps } from "../footer";
import getClassNames from "../../utils/get-class-names";
import styles from "./AppShell.module.scss";

/** Sidebar configuration: MenuList as vertical nav. Direction is always "vertical". */
export interface AppShellSidebarConfig {
  /** Menu items for the sidebar navigation */
  items: MenuListItem[];
  /** Value of the currently active item */
  activeItem?: string;
  /** Called when a menu item is clicked */
  onMenuClick?: (item: MenuListItem) => void;
  /** Size of menu items */
  size?: MenuListSize;
  /** Visual variant for the sidebar */
  variant?: MenuListVariant;
}

export interface AppShellProps {
  /** Main content (page area) */
  children: React.ReactNode;
  /** Top bar: pass Header props or custom ReactNode. Omit to hide header. */
  header?: React.ReactNode | HeaderProps;
  /** Bottom bar: pass Footer props or custom ReactNode. Omit to hide footer. */
  footer?: React.ReactNode | FooterProps;
  /** Sidebar config (MenuList as vertical nav on the left). Omit to hide sidebar. */
  sidebar?: AppShellSidebarConfig;
  /** Width of the sidebar (e.g. "240px", "16rem") */
  sidebarWidth?: string;
  /** Additional class name for the root element */
  className?: string;
  /** Additional class name for the main content wrapper */
  contentClassName?: string;
}

const isHeaderProps = (header: AppShellProps["header"]): header is HeaderProps =>
  typeof header === "object" && header !== null && "menuItems" in header;

const isFooterProps = (footer: AppShellProps["footer"]): footer is FooterProps =>
  typeof footer === "object" && footer !== null && !React.isValidElement(footer);

const AppShell: React.FC<AppShellProps> = ({
  children,
  header,
  footer,
  sidebar,
  sidebarWidth = "240px",
  className = "",
  contentClassName = "",
}) => {
  const rootClassName = getClassNames(styles["cp-app-shell"], className);

  return (
    <div className={rootClassName}>
      {header !== undefined && (
        <div className={styles["cp-app-shell__header-slot"]}>
          {isHeaderProps(header) ? <Header {...header} /> : header}
        </div>
      )}

      <div className={styles["cp-app-shell__body"]}>
        {sidebar !== undefined && (
          <aside
            className={styles["cp-app-shell__sidebar"]}
            style={{ width: sidebarWidth }}
            aria-label="Main navigation"
          >
            <MenuList
              items={sidebar.items}
              activeItem={sidebar.activeItem}
              onMenuClick={sidebar.onMenuClick}
              direction="vertical"
              size={sidebar.size}
              variant={sidebar.variant}
              margin="0"
            />
          </aside>
        )}

        <main
          className={getClassNames(
            styles["cp-app-shell__main"],
            contentClassName
          )}
        >
          {children}
        </main>
      </div>

      {footer !== undefined && (
        <div className={styles["cp-app-shell__footer-slot"]}>
          {isFooterProps(footer) ? <Footer {...footer} /> : footer}
        </div>
      )}
    </div>
  );
};

AppShell.displayName = "AppShell";

export default AppShell;
