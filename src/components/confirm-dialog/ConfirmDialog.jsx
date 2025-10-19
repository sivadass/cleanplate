import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Typography from "../typography";
import Button from "../button";
import Icon from "../icon";
import styles from "./ConfirmDialog.module.scss";
import getClassNames from "../../utils/get-class-names";

const ConfirmDialog = ({
  isOpen = false,
  onClose,
  title = "Confirm Action",
  description = "",
  primaryButtonLabel = "Confirm",
  onPrimaryButtonClick,
  secondaryButtonLabel = "Cancel",
  onSecondaryButtonClick,
  size = "small",
  variant = "default", // "default", "destructive", "warning"
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  overlayClassName = "",
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const modalClasses = getClassNames(
    styles["confirm-dialog"],
    styles[size],
    styles[variant],
    {
      [styles["open"]]: isOpen,
    },
    className
  );

  const overlayClasses = getClassNames(
    styles["overlay"],
    {
      [styles["overlay-open"]]: isOpen,
    },
    overlayClassName
  );

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
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

  const handleOverlayClick = (e) => {
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
        ref={modalRef}
        className={modalClasses}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            className={styles["close-button"]}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <Icon name="close" size="small" />
          </button>
        )}
        
        <div className={styles["content"]}>
          <Typography 
            variant="h2" 
            id="confirm-dialog-title" 
            className={styles["title"]}
          >
            {title}
          </Typography>
          
          {description && (
            <Typography 
              variant="p" 
              className={styles["description"]}
            >
              {description}
            </Typography>
          )}
          
          <div className={styles["buttons"]}>
            {secondaryButtonLabel && (
              <Button
                variant="outline"
                size="medium"
                onClick={handleSecondaryClick}
                className={styles["button"]}
              >
                {secondaryButtonLabel}
              </Button>
            )}
            {primaryButtonLabel && (
              <Button
                variant="solid"
                size="medium"
                onClick={handlePrimaryClick}
                className={styles["button"]}
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

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  primaryButtonLabel: PropTypes.string,
  onPrimaryButtonClick: PropTypes.func,
  secondaryButtonLabel: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["default", "destructive", "warning"]),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
};

export default ConfirmDialog;
