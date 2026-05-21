import React, { useId } from "react";
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
import styles from "./Modal.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

export type ModalSize = "small" | "medium" | "large" | "fullscreen";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type ModalMargin = string | SpacingOption[];

const MODAL_TRANSITION_CONFIG = {
  duration: {
    open: 320,
    close: 320,
  },
  initial: {
    opacity: 0,
    transform: "translateY(28px) scale(0.94)",
  },
  open: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
  close: {
    opacity: 0,
    transform: "translateY(44px) scale(0.9)",
  },
  common: {
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
};

const OVERLAY_TRANSITION_CONFIG = {
  duration: {
    open: 280,
    close: 260,
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
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

export interface ModalProps {
  /** Modal content */
  children: React.ReactNode;
  /** Whether the modal is visible */
  isOpen?: boolean;
  /** Called when the modal should close */
  onClose?: () => void;
  /** Title displayed in the modal header */
  title?: string;
  /** Size of the modal */
  size?: ModalSize;
  /** Whether to show the close (X) button */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Margin spacing around the modal (e.g. "m-0" or array of spacing suffixes) */
  margin?: ModalMargin;
  /** Additional class names for the modal panel */
  className?: string;
  /** Additional class names for the overlay */
  overlayClassName?: string;
  /** Additional class names for the content wrapper */
  contentClassName?: string;
  /** Label for the primary footer button */
  primaryButtonLabel?: string;
  /** Called when the primary footer button is clicked */
  onPrimaryButtonClick?: () => void;
  /** Label for the secondary footer button */
  secondaryButtonLabel?: string;
  /** Called when the secondary footer button is clicked */
  onSecondaryButtonClick?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  isOpen = false,
  onClose,
  title = "",
  size = "medium",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  margin = "m-0",
  className = "",
  overlayClassName = "",
  contentClassName = "",
  primaryButtonLabel = "",
  onPrimaryButtonClick,
  secondaryButtonLabel = "",
  onSecondaryButtonClick,
}) => {
  const titleId = useId();
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (nextOpen) => {
      if (!nextOpen && isOpen) {
        onClose?.();
      }
    },
  });

  const { isMounted, styles: modalTransitionStyles } = useTransitionStyles(
    context,
    MODAL_TRANSITION_CONFIG
  );

  const { styles: overlayTransitionStyles } = useTransitionStyles(
    context,
    OVERLAY_TRANSITION_CONFIG
  );

  const dismiss = useDismiss(context, {
    outsidePress: closeOnOverlayClick,
    outsidePressEvent: "pointerdown",
    escapeKey: closeOnEscape,
  });
  const role = useRole(context, { role: "dialog" });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const modalClasses = getClassNames(
    styles["modal"],
    styles[size],
    marginClass,
    className
  );

  const overlayClasses = getClassNames(styles["overlay"], overlayClassName);

  const contentClasses = getClassNames(
    styles["content"],
    contentClassName
  );

  const handleClose = () => {
    onClose?.();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        className={overlayClasses}
        style={{
          ...overlayTransitionStyles,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <FloatingFocusManager context={context} modal returnFocus>
          <div
            ref={refs.setFloating}
            className={modalClasses}
            style={modalTransitionStyles}
            {...getFloatingProps({
              "aria-modal": "true",
              "aria-labelledby": title ? titleId : undefined,
            })}
          >
            <div className={contentClasses}>
              {(title || showCloseButton) && (
                <div className={styles["header"]}>
                  {title && (
                    <Typography
                      variant="h2"
                      id={titleId}
                      className={styles["title"]}
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
                      aria-label="Close modal"
                    >
                      <Icon name="close" size="small" />
                    </Button>
                  )}
                </div>
              )}
              <div className={styles["body"]}>
                {children}
              </div>
              {(primaryButtonLabel || secondaryButtonLabel) && (
                <div className={styles["footer"]}>
                  {secondaryButtonLabel && (
                    <Button
                      variant="outline"
                      size="medium"
                      onClick={onSecondaryButtonClick}
                      className={styles["footer-button"]}
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
                    >
                      {primaryButtonLabel}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};

export default Modal;
