import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import type { VirtualElement } from "@floating-ui/react-dom";
import Header from "../header";
import Footer from "../footer";
import MenuList from "../menu-list";
import type { MenuListItem } from "../menu-list";
import type { MenuListSize, MenuListVariant } from "../menu-list";
import type { HeaderProps } from "../header";
import type { FooterProps } from "../footer";
import Button from "../button";
import Icon from "../icon";
import getClassNames from "../../utils/get-class-names";
import styles from "./AppShell.module.scss";
import { APP_SHELL_SIDEBAR_MOBILE_MQ, useMediaQuery } from "./use-media-query";

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
  /**
   * When `sidebar` is set, controls the Floating UI drawer on viewports where the
   * sidebar column is hidden (≤1024px).
   * - `true`: show a menu trigger and drawer with the same navigation.
   * - `false`: no drawer (e.g. you use Header’s mobile menu with the same items).
   * - `undefined`: `false` when `header` is `HeaderProps` (mobile menu there);
   *   otherwise `true` when `sidebar` is set.
   */
  mobileSidebarDrawer?: boolean;
  /** Accessible name for the mobile navigation dialog. */
  mobileSidebarDrawerLabel?: string;
  /** Additional class name for the root element */
  className?: string;
  /** Additional class name for the main content wrapper */
  contentClassName?: string;
}

const isHeaderProps = (header: AppShellProps["header"]): header is HeaderProps =>
  typeof header === "object" && header !== null && "menuItems" in header;

const isFooterProps = (footer: AppShellProps["footer"]): footer is FooterProps =>
  typeof footer === "object" && footer !== null && !React.isValidElement(footer);

const leftEdgePositionReference: VirtualElement = {
  getBoundingClientRect() {
    const h = typeof window !== "undefined" ? window.innerHeight : 0;
    return {
      width: 0,
      height: h,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: h,
    };
  },
};

/** Shared vertical `MenuList` for desktop sidebar and mobile drawer. */
function SidebarVerticalMenu({
  config,
  onMenuClick,
}: {
  config: AppShellSidebarConfig;
  onMenuClick?: (item: MenuListItem) => void;
}) {
  return (
    <MenuList
      items={config.items}
      activeItem={config.activeItem}
      onMenuClick={onMenuClick ?? config.onMenuClick}
      direction="vertical"
      size={config.size}
      variant={config.variant}
      margin="0"
    />
  );
}

const AppShell: React.FC<AppShellProps> = ({
  children,
  header,
  footer,
  sidebar,
  sidebarWidth = "272px",
  mobileSidebarDrawer: mobileSidebarDrawerProp,
  mobileSidebarDrawerLabel = "Main navigation",
  className = "",
  contentClassName = "",
}) => {
  const rootClassName = getClassNames(styles["cp-app-shell"], className);

  const headerProvidesMobileNav = header !== undefined && isHeaderProps(header);
  const showMobileSidebarDrawer =
    mobileSidebarDrawerProp ??
    Boolean(sidebar && !headerProvidesMobileNav);

  const isMobileSidebarBreakpoint = useMediaQuery(APP_SHELL_SIDEBAR_MOBILE_MQ);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  /** Post-mount open visuals (backdrop fade + drawer slide). */
  const [mobileDrawerEntered, setMobileDrawerEntered] = useState(false);
  /** Keeps the portaled drawer mounted until the close transition finishes. */
  const [mobileDrawerExitAnimating, setMobileDrawerExitAnimating] =
    useState(false);
  const mobileDrawerExitAnimatingRef = useRef(false);
  mobileDrawerExitAnimatingRef.current = mobileDrawerExitAnimating;

  useEffect(() => {
    if (!isMobileSidebarBreakpoint) {
      setMobileDrawerOpen(false);
      setMobileDrawerExitAnimating(false);
      setMobileDrawerEntered(false);
    }
  }, [isMobileSidebarBreakpoint]);

  const drawerEnabled =
    Boolean(sidebar) &&
    showMobileSidebarDrawer &&
    isMobileSidebarBreakpoint;

  const beginCloseMobileDrawer = useCallback(() => {
    if (mobileDrawerOpen) {
      setMobileDrawerExitAnimating(true);
      setMobileDrawerEntered(false);
      setMobileDrawerOpen(false);
      return;
    }
    setMobileDrawerExitAnimating(false);
    setMobileDrawerOpen(false);
  }, [mobileDrawerOpen]);

  const handleDrawerOpenChange = useCallback(
    (next: boolean) => {
      if (!drawerEnabled) return;
      if (next) {
        setMobileDrawerExitAnimating(false);
        setMobileDrawerOpen(true);
        return;
      }
      beginCloseMobileDrawer();
    },
    [drawerEnabled, beginCloseMobileDrawer],
  );

  useLayoutEffect(() => {
    if (!mobileDrawerOpen) {
      if (!mobileDrawerExitAnimating) {
        setMobileDrawerEntered(false);
      }
      return undefined;
    }
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setMobileDrawerEntered(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [mobileDrawerOpen, mobileDrawerExitAnimating]);

  const handleMobileDrawerTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      if (!mobileDrawerExitAnimatingRef.current) return;
      if (event.propertyName !== "transform") return;
      setMobileDrawerExitAnimating(false);
    },
    [],
  );

  const { refs, context, floatingStyles } = useFloating({
    open: drawerEnabled && mobileDrawerOpen,
    onOpenChange: handleDrawerOpenChange,
    placement: "right-start",
    strategy: "fixed",
    transform: false,
  });

  useLayoutEffect(() => {
    if (!drawerEnabled) return;
    refs.setPositionReference(leftEdgePositionReference);
  }, [drawerEnabled, refs]);

  const click = useClick(context, { enabled: drawerEnabled });
  const dismiss = useDismiss(context, {
    enabled: drawerEnabled,
    outsidePressEvent: "pointerdown",
  });
  const role = useRole(context, { role: "dialog" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const handleMobileMenuClick = useCallback(
    (item: MenuListItem) => {
      sidebar?.onMenuClick?.(item);
      beginCloseMobileDrawer();
    },
    [sidebar, beginCloseMobileDrawer],
  );

  const closeMobileDrawer = useCallback(() => {
    beginCloseMobileDrawer();
  }, [beginCloseMobileDrawer]);

  const mobileDrawerMounted =
    drawerEnabled && (mobileDrawerOpen || mobileDrawerExitAnimating);

  return (
    <div className={rootClassName}>
      {header !== undefined && (
        <div className={styles["header-slot"]}>
          {isHeaderProps(header) ? <Header {...header} /> : header}
        </div>
      )}

      <div className={styles["body"]}>
        {sidebar !== undefined && (
          <aside
            className={styles["sidebar"]}
            style={{ width: sidebarWidth }}
            aria-label="Main navigation"
          >
            <SidebarVerticalMenu config={sidebar} />
          </aside>
        )}

        <main
          className={getClassNames(
            styles["main"],
            contentClassName,
          )}
        >
          {children}
        </main>
      </div>

      {footer !== undefined && (
        <div className={styles["footer-slot"]}>
          {isFooterProps(footer) ? <Footer {...footer} /> : footer}
        </div>
      )}

      {drawerEnabled && (
        <>
          <Button
            ref={refs.setReference}
            type="button"
            variant="icon"
            className={styles["mobile-nav-trigger"]}
            aria-label="Open navigation menu"
            {...getReferenceProps()}
          >
            <Icon name="menu" />
          </Button>

          {mobileDrawerMounted && (
            <FloatingPortal id="cp-app-shell-mobile-nav-root">
              <FloatingOverlay
                lockScroll
                className={styles["cp-mobile-nav-overlay"]}
                data-visible={mobileDrawerEntered ? "true" : undefined}
                onClick={closeMobileDrawer}
              />
              <FloatingFocusManager context={context} modal returnFocus>
                <div
                  ref={refs.setFloating}
                  className={getClassNames(
                    styles["cp-mobile-nav-drawer"],
                    mobileDrawerEntered &&
                      styles["cp-mobile-nav-drawer-entered"],
                  )}
                  style={{ ...floatingStyles, width: sidebarWidth }}
                  {...getFloatingProps({
                    onTransitionEnd: handleMobileDrawerTransitionEnd,
                  })}
                  aria-label={mobileSidebarDrawerLabel}
                >
                  <div className={styles["mobile-drawer-nav"]}>
                    <Button
                      type="button"
                      variant="icon"
                      className={styles["mobile-drawer-close"]}
                      aria-label="Close navigation menu"
                      onClick={closeMobileDrawer}
                    >
                      <Icon name="close" />
                    </Button>
                    <SidebarVerticalMenu
                      config={sidebar}
                      onMenuClick={handleMobileMenuClick}
                    />
                  </div>
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </>
      )}
    </div>
  );
};

AppShell.displayName = "AppShell";

export default AppShell;
