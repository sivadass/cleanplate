import React, { useState, useRef, cloneElement, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import styles from "./Dropdown.module.css";

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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(offsetValue),
      flipValue && flip(),
      shiftValue && shift({ padding: 8 }),
    ].filter(Boolean),
    whileElementsMounted: autoUpdate,
    strategy: 'absolute',
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePress: closeOnClickOutside,
    escapeKey: closeOnEscape,
  });
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const handleClose = () => setIsOpen(false);

  const triggerElement = cloneElement(trigger, {
    ref: (node) => {
      refs.setReference(node);
      triggerRef.current = node;
    },
    ...getReferenceProps(),
    className: `${trigger.props.className || ""} ${styles["dropdown-trigger"]} ${
      isOpen ? styles["active"] : ""
    }`.trim(),
  });

  const contentElement = cloneElement(content, {
    onClose: handleClose,
    className: `${content.props.className || ""} ${styles["dropdown-content"]} ${contentClassName}`.trim(),
  });

  return (
    <div className={`${styles["dropdown-wrapper"]} ${className}`}>
      {triggerElement}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              zIndex: 1000,
              ...floatingStyles,
            }}
            {...getFloatingProps()}
          >
            {contentElement}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.element.isRequired,
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
};

export default Dropdown;
