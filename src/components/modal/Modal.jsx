import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import Typography from "../typography";
import Button from "../button";
import styles from "./Modal.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";

const Modal = ({
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
  // Footer button props
  primaryButtonLabel = "",
  onPrimaryButtonClick,
  secondaryButtonLabel = "",
  onSecondaryButtonClick,
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

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
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Store the previously focused element
      previousActiveElement.current = document.activeElement;
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

  const handleOverlayClick = (e) => {
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

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large", "fullscreen"]),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  // Footer button props
  primaryButtonLabel: PropTypes.string,
  onPrimaryButtonClick: PropTypes.func,
  secondaryButtonLabel: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
};

export default Modal;
