import React, { useEffect, useRef } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const modalClasses = getClassNames(
    styles["modal"],
    styles[size],
    {
      [styles["open"]]: isOpen,
    },
    marginClass,
    className
  );

  const overlayClasses = getClassNames(
    styles["overlay"],
    {
      [styles["overlay-open"]]: isOpen,
    },
    overlayClassName
  );

  const contentClasses = getClassNames(
    styles["content"],
    contentClassName
  );

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      // Focus the modal
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={overlayClasses}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={contentClasses}>
          {(title || showCloseButton) && (
            <div className={styles["header"]}>
              {title && (
                <Typography
                  variant="h2"
                  id="modal-title"
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
    </div>
  );
};

export default Modal;
