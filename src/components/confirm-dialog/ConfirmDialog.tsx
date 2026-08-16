import React, { useEffect, useRef } from "react";
import Typography from "../typography";
import Button from "../button";
import Icon from "../icon";
import styles from "./ConfirmDialog.module.scss";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";

export type ConfirmDialogSize = "small" | "medium" | "large";

export type ConfirmDialogVariant = "default" | "destructive" | "warning";

export interface ConfirmDialogProps {
  /** Whether the dialog is visible */
  isOpen?: boolean;
  /** Called when the dialog should close (close button, overlay, escape, or after primary/secondary action) */
  onClose?: () => void;
  /** Dialog title */
  title?: string;
  /** Optional description text below the title */
  description?: string;
  /** Label for the primary (confirm) button */
  primaryButtonLabel?: string;
  /** Called when the primary button is clicked; onClose is also called */
  onPrimaryButtonClick?: () => void;
  /** Label for the secondary (cancel) button; empty string hides it */
  secondaryButtonLabel?: string;
  /** Called when the secondary button is clicked; onClose is also called */
  onSecondaryButtonClick?: () => void;
  /** Size of the dialog */
  size?: ConfirmDialogSize;
  /** Visual variant (default, destructive, warning) */
  variant?: ConfirmDialogVariant;
  /** Whether to show the X close button */
  showCloseButton?: boolean;
  /** Whether clicking the overlay closes the dialog */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the dialog */
  closeOnEscape?: boolean;
  /** Additional class names for the dialog panel */
  className?: string;
  /** Additional class names for the overlay */
  overlayClassName?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen = false,
  onClose,
  title = "Confirm Action",
  description = "",
  primaryButtonLabel = "Confirm",
  onPrimaryButtonClick,
  secondaryButtonLabel = "Cancel",
  onSecondaryButtonClick,
  size = "small",
  variant = "default",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  overlayClassName = "",
}) => {
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(
    prototypeEnabled,
    "ConfirmDialog",
    {
      isOpen,
      title,
      description,
      primaryButtonLabel,
      secondaryButtonLabel,
      size,
      variant,
      showCloseButton,
      closeOnOverlayClick,
      closeOnEscape,
      overlayClassName,
    },
    {
      isOpen: false,
      title: "Confirm Action",
      description: "",
      primaryButtonLabel: "Confirm",
      secondaryButtonLabel: "Cancel",
      size: "small",
      variant: "default",
      showCloseButton: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
      overlayClassName: "",
    },
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const modalClasses = getClassNames(
    styles["cp-confirm-dialog"],
    styles[`cp-confirm-dialog--${size}`],
    variant !== "default" && styles[`cp-confirm-dialog--${variant}`],
    {
      [styles["cp-confirm-dialog--open"]]: isOpen,
    },
    className
  );

  const overlayClasses = getClassNames(
    styles["cp-confirm-dialog-overlay"],
    {
      [styles["cp-confirm-dialog-overlay-open"]]: isOpen,
    },
    overlayClassName
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handlePrimaryClick = () => {
    if (typeof onPrimaryButtonClick === "function") {
      onPrimaryButtonClick();
    }
    onClose?.();
  };

  const handleSecondaryClick = () => {
    if (typeof onSecondaryButtonClick === "function") {
      onSecondaryButtonClick();
    }
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
      aria-labelledby="confirm-dialog-title"
    >
      <div
        {...dataCp}
        ref={modalRef}
        className={modalClasses}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            className={styles["cp-confirm-dialog__close-button"]}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <Icon name="close" size="small" />
          </button>
        )}

        <div className={styles["cp-confirm-dialog__content"]}>
          <Typography
            variant="h2"
            id="confirm-dialog-title"
            className={styles["cp-confirm-dialog__title"]}
          >
            {title}
          </Typography>

          {description && (
            <Typography variant="p" className={styles["cp-confirm-dialog__description"]}>
              {description}
            </Typography>
          )}

          <div className={styles["cp-confirm-dialog__buttons"]}>
            {secondaryButtonLabel && (
              <Button
                variant="outline"
                size="medium"
                onClick={handleSecondaryClick}
                className={styles["cp-confirm-dialog__button"]}
              >
                {secondaryButtonLabel}
              </Button>
            )}
            {primaryButtonLabel && (
              <Button
                variant="solid"
                size="medium"
                onClick={handlePrimaryClick}
                className={styles["cp-confirm-dialog__button"]}
              >
                {primaryButtonLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
