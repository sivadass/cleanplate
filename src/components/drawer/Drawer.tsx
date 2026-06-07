import React, { useEffect, useId, useMemo } from "react";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react";
import Icon from "../icon";
import Typography from "../typography";
import Button from "../button";
import styles from "./Drawer.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { useMediaQuery } from "../../utils/use-media-query";

/** Frozen breakpoint: matches Select, Date, Table mobile behavior. */
export const DRAWER_MOBILE_SHEET_MEDIA = "(max-width: 768px)";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export type DrawerSize = "small" | "medium" | "large" | "full";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type DrawerMargin = string | SpacingOption[];

const BACKDROP_TRANSITION_CONFIG = {
  duration: {
    open: 220,
    close: 180,
  },
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
  close: {
    opacity: 0,
  },
  common: {
    transitionTimingFunction: "cubic-bezier(0.2, 0, 0.2, 1)",
  },
};

const PANEL_TRANSITION_COMMON = {
  duration: {
    open: 260,
    close: 220,
  },
  common: {
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
};

const PANEL_TRANSITION_BY_PLACEMENT: Record<
  DrawerPlacement,
  {
    initial: { opacity: number; transform: string };
    open: { opacity: number; transform: string };
    close: { opacity: number; transform: string };
  }
> = {
  left: {
    initial: { opacity: 0, transform: "translateX(-100%)" },
    open: { opacity: 1, transform: "translateX(0)" },
    close: { opacity: 0.98, transform: "translateX(-100%)" },
  },
  right: {
    initial: { opacity: 0, transform: "translateX(100%)" },
    open: { opacity: 1, transform: "translateX(0)" },
    close: { opacity: 0.98, transform: "translateX(100%)" },
  },
  top: {
    initial: { opacity: 0, transform: "translateY(-100%)" },
    open: { opacity: 1, transform: "translateY(0)" },
    close: { opacity: 0.98, transform: "translateY(-100%)" },
  },
  bottom: {
    initial: { opacity: 0, transform: "translateY(100%)" },
    open: { opacity: 1, transform: "translateY(0)" },
    close: { opacity: 0.98, transform: "translateY(100%)" },
  },
};

function getPanelTransitionConfig(placement: DrawerPlacement) {
  return {
    ...PANEL_TRANSITION_COMMON,
    ...PANEL_TRANSITION_BY_PLACEMENT[placement],
  };
}

export interface DrawerProps {
  /** Drawer body content */
  children: React.ReactNode;
  /** Whether the drawer is visible */
  isOpen?: boolean;
  /** Called when the drawer should close */
  onClose?: () => void;
  /** Edge the drawer slides from on desktop (≥768px); mobile always uses bottom sheet */
  placement?: DrawerPlacement;
  /** Panel size preset */
  size?: DrawerSize;
  /** Title displayed in the drawer header */
  title?: string;
  /** Whether to show the close (X) button */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the drawer */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the drawer */
  closeOnEscape?: boolean;
  /** Margin spacing (suffix or array of spacing suffixes; component adds m- prefix) */
  margin?: DrawerMargin;
  /** Additional class names for the drawer panel */
  className?: string;
  /** Additional class names for the overlay */
  overlayClassName?: string;
  /** Additional class names for the content wrapper */
  contentClassName?: string;
  /** Additional class names for the header row */
  headerClassName?: string;
  /** Additional class names for the body region */
  bodyClassName?: string;
  /** Additional class names for the footer row */
  footerClassName?: string;
  /** Accessible name when no title is provided */
  ariaLabel?: string;
  /** Label for the primary footer button */
  primaryButtonLabel?: string;
  /** Called when the primary footer button is clicked */
  onPrimaryButtonClick?: () => void;
  /** Label for the secondary footer button */
  secondaryButtonLabel?: string;
  /** Called when the secondary footer button is clicked */
  onSecondaryButtonClick?: () => void;
  /**
   * Root `data-testid` on the dialog panel. When set, related elements also get
   * suffixed ids: `-overlay`, `-header`, `-title`, `-close`, `-body`, `-footer`,
   * `-primary`, `-secondary`.
   */
  dataTestId?: string;
}

function drawerFieldTestId(
  base: string | undefined,
  suffix: string,
): string | undefined {
  return base ? `${base}-${suffix}` : undefined;
}

const Drawer: React.FC<DrawerProps> = ({
  children,
  isOpen = false,
  onClose,
  placement = "right",
  size = "medium",
  title = "",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  margin = "0",
  className = "",
  overlayClassName = "",
  contentClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  ariaLabel,
  primaryButtonLabel = "",
  onPrimaryButtonClick,
  secondaryButtonLabel = "",
  onSecondaryButtonClick,
  dataTestId,
}) => {
  const titleId = useId();
  const isMobileSheet = useMediaQuery(DRAWER_MOBILE_SHEET_MEDIA);
  const effectivePlacement: DrawerPlacement = isMobileSheet
    ? "bottom"
    : placement;

  const panelTransitionConfig = useMemo(
    () => getPanelTransitionConfig(effectivePlacement),
    [effectivePlacement],
  );

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (nextOpen) => {
      if (!nextOpen && isOpen) {
        onClose?.();
      }
    },
  });

  const { isMounted, styles: backdropTransitionStyles } = useTransitionStyles(
    context,
    BACKDROP_TRANSITION_CONFIG,
  );

  const { styles: panelTransitionStyles } = useTransitionStyles(
    context,
    panelTransitionConfig,
  );

  const dismiss = useDismiss(context, {
    outsidePress: closeOnOverlayClick,
    outsidePressEvent: "pointerdown",
    escapeKey: closeOnEscape,
  });
  const role = useRole(context, { role: "dialog" });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const drawerClasses = getClassNames(
    styles["cp-drawer"],
    styles[`placement-${effectivePlacement}`],
    styles[`size-${size}`],
    isMobileSheet && styles["cp-drawer-mobile-sheet"],
    marginClass,
    className,
  );

  const overlayClasses = getClassNames(
    styles["cp-drawer-overlay"],
    overlayClassName,
  );

  const contentClasses = getClassNames(
    styles["content"],
    contentClassName,
  );

  const headerClasses = getClassNames(
    styles["header"],
    headerClassName,
  );

  const bodyClasses = getClassNames(styles["body"], bodyClassName);

  const footerClasses = getClassNames(styles["footer"], footerClassName);

  const handleClose = () => {
    onClose?.();
  };

  const dialogAriaLabel =
    !title && ariaLabel ? ariaLabel : undefined;

  useEffect(() => {
    if (!isOpen || title || ariaLabel) {
      return;
    }
    // eslint-disable-next-line no-console
    console.warn(
      "CleanPlate Drawer: provide `title` or `ariaLabel` so the dialog has an accessible name.",
    );
  }, [isOpen, title, ariaLabel]);

  if (!isMounted) {
    return null;
  }

  return (
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        className={overlayClasses}
        style={backdropTransitionStyles}
        data-testid={drawerFieldTestId(dataTestId, "overlay")}
      />
      <FloatingFocusManager context={context} modal returnFocus>
        <div
          ref={refs.setFloating}
          className={drawerClasses}
          style={panelTransitionStyles}
          data-testid={dataTestId}
          {...getFloatingProps({
            "aria-modal": "true",
            "aria-labelledby": title ? titleId : undefined,
            "aria-label": dialogAriaLabel,
          })}
        >
          <div className={contentClasses}>
            {(title || showCloseButton) && (
              <div
                className={headerClasses}
                data-testid={drawerFieldTestId(dataTestId, "header")}
              >
                {title && (
                  <Typography
                    variant="h2"
                    id={titleId}
                    className={styles["title"]}
                    data-testid={drawerFieldTestId(dataTestId, "title")}
                  >
                    {title}
                  </Typography>
                )}
                {showCloseButton && (
                  <Button
                    variant="icon"
                    size="small"
                    onClick={handleClose}
                    className={styles["close-button"]}
                    aria-label="Close drawer"
                    data-testid={drawerFieldTestId(dataTestId, "close")}
                  >
                    <Icon name="close" size="small" />
                  </Button>
                )}
              </div>
            )}
            <div
              className={bodyClasses}
              data-testid={drawerFieldTestId(dataTestId, "body")}
            >
              {children}
            </div>
            {(primaryButtonLabel || secondaryButtonLabel) && (
              <div
                className={footerClasses}
                data-testid={drawerFieldTestId(dataTestId, "footer")}
              >
                {secondaryButtonLabel && (
                  <Button
                    variant="outline"
                    size="medium"
                    onClick={onSecondaryButtonClick}
                    className={styles["footer-button"]}
                    data-testid={drawerFieldTestId(dataTestId, "secondary")}
                  >
                    {secondaryButtonLabel}
                  </Button>
                )}
                {primaryButtonLabel && (
                  <Button
                    variant="solid"
                    size="medium"
                    onClick={onPrimaryButtonClick}
                    className={styles["footer-button"]}
                    data-testid={drawerFieldTestId(dataTestId, "primary")}
                  >
                    {primaryButtonLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};

Drawer.displayName = "Drawer";

export default Drawer;
