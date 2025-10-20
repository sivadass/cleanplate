import React, { useState, useRef, cloneElement, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Dropdown.module.css";
import Button from "../button";
import Icon from "../icon";

const Dropdown = ({ 
  trigger, 
  content, 
  placement = "bottom-end",
  offset: offsetValue = 4,
  shift: shiftValue = true,
  flip: flipValue = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  className = "",
  contentClassName = "",
  renderTrigger,
  triggerLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [adjustedPlacement, setAdjustedPlacement] = useState(placement);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
      setIsAnimating(true);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before hiding the element
    setTimeout(() => {
      setIsOpen(false);
      setAdjustedPlacement(placement); // Reset placement
    }, 150); // Match the animation duration
  };

  // Calculate viewport collision and adjust placement
  const calculatePlacement = () => {
    if (!triggerRef.current || !dropdownRef.current) return placement;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newPlacement = placement;
    const margin = 8; // Minimum distance from viewport edge

    // Apply offset via CSS custom properties
    if (dropdownRef.current) {
      dropdownRef.current.style.setProperty('--offset', `${offsetValue}px`);
    }

    // Flip logic
    if (flipValue) {
      const placements = {
        'top': 'bottom',
        'top-start': 'bottom-start',
        'top-end': 'bottom-end',
        'bottom': 'top',
        'bottom-start': 'top-start',
        'bottom-end': 'top-end',
        'left': 'right',
        'left-start': 'right-start',
        'left-end': 'right-end',
        'right': 'left',
        'right-start': 'left-start',
        'right-end': 'left-end',
      };

      // Check if dropdown goes outside viewport
      const isOutsideViewport = 
        dropdownRect.left < margin ||
        dropdownRect.right > viewport.width - margin ||
        dropdownRect.top < margin ||
        dropdownRect.bottom > viewport.height - margin;

      if (isOutsideViewport) {
        newPlacement = placements[placement] || placement;
      }
    }

    // Shift logic
    if (shiftValue) {
      let shiftX = 0;
      let shiftY = 0;

      // Horizontal shift
      if (dropdownRect.left < margin) {
        shiftX = margin - dropdownRect.left;
      } else if (dropdownRect.right > viewport.width - margin) {
        shiftX = (viewport.width - margin) - dropdownRect.right;
      }

      // Vertical shift
      if (dropdownRect.top < margin) {
        shiftY = margin - dropdownRect.top;
      } else if (dropdownRect.bottom > viewport.height - margin) {
        shiftY = (viewport.height - margin) - dropdownRect.bottom;
      }

      // Apply shift via CSS custom properties
      if (dropdownRef.current) {
        dropdownRef.current.style.setProperty('--shift-x', `${shiftX}px`);
        dropdownRef.current.style.setProperty('--shift-y', `${shiftY}px`);
      }
    }

    return newPlacement;
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        closeOnClickOutside &&
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (closeOnEscape && event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeOnClickOutside, closeOnEscape]);

  // Calculate placement when dropdown opens
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        const newPlacement = calculatePlacement();
        setAdjustedPlacement(newPlacement);
      });
    }
  }, [isOpen, placement, flipValue, shiftValue]);

  // Create trigger element with render prop support
  const createTriggerElement = () => {
    const triggerProps = {
      ref: triggerRef,
      onClick: handleToggle,
      className: `${styles["dropdown-trigger"]} ${
        isOpen ? styles["active"] : ""
      }`.trim(),
      role: "button",
      "aria-expanded": isOpen,
      "aria-haspopup": "true",
    };

    // If renderTrigger function is provided, use it
    if (renderTrigger) {
      return renderTrigger({
        isOpen,
        isAnimating,
        placement: adjustedPlacement,
        toggle: handleToggle,
        close: handleClose,
        triggerProps,
      });
    }

    // If triggerLabel is provided, create a default trigger with Button and Icon
    if (triggerLabel) {
      return (
        <Button
          {...triggerProps}
          variant="outline"
          style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}
        >
          {triggerLabel}
          <Icon 
            name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} 
            style={{ fontSize: "16px" }}
          />
        </Button>
      );
    }

    // Otherwise, use the existing trigger element
    return cloneElement(trigger, {
      ...triggerProps,
      className: `${trigger.props.className || ""} ${triggerProps.className}`.trim(),
    });
  };

  // Validate that either trigger, renderTrigger, or triggerLabel is provided
  if (!trigger && !renderTrigger && !triggerLabel) {
    throw new Error("Dropdown requires either a 'trigger' element, 'renderTrigger' function, or 'triggerLabel' string");
  }

  const triggerElement = createTriggerElement();

  const contentElement = cloneElement(content, {
    onClose: handleClose,
    className: `${content.props.className || ""} ${styles["dropdown-content"]} ${contentClassName}`.trim(),
  });

  // Generate placement class based on adjusted placement
  const getPlacementClass = () => {
    const placementMap = {
      'top': styles['dropdown-top'],
      'top-start': styles['dropdown-top-start'],
      'top-end': styles['dropdown-top-end'],
      'bottom': styles['dropdown-bottom'],
      'bottom-start': styles['dropdown-bottom-start'],
      'bottom-end': styles['dropdown-bottom-end'],
      'left': styles['dropdown-left'],
      'left-start': styles['dropdown-left-start'],
      'left-end': styles['dropdown-left-end'],
      'right': styles['dropdown-right'],
      'right-start': styles['dropdown-right-start'],
      'right-end': styles['dropdown-right-end'],
    };
    return placementMap[adjustedPlacement] || styles['dropdown-bottom-end'];
  };

  return (
    <div className={`${styles["dropdown-wrapper"]} ${className}`}>
      {triggerElement}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`${styles["dropdown-floating"]} ${getPlacementClass()} ${
            isAnimating ? styles["dropdown-opening"] : styles["dropdown-closing"]
          }`}
          role="menu"
          aria-orientation="vertical"
        >
          {contentElement}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.element,
  content: PropTypes.element.isRequired,
  placement: PropTypes.oneOf([
    "top", "top-start", "top-end",
    "bottom", "bottom-start", "bottom-end",
    "left", "left-start", "left-end",
    "right", "right-start", "right-end"
  ]),
  offset: PropTypes.number,
  shift: PropTypes.bool,
  flip: PropTypes.bool,
  closeOnClickOutside: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  renderTrigger: PropTypes.func,
  triggerLabel: PropTypes.string,
};

export default Dropdown;