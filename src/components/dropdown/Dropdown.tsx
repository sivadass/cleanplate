import React, {
  useState,
  useRef,
  cloneElement,
  useEffect,
  type RefObject,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import styles from "./Dropdown.module.css";
import Button from "../button";
import Icon from "../icon";

export type DropdownPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface DropdownTriggerProps {
  ref: RefObject<HTMLElement | null>;
  onClick: (e: ReactMouseEvent<HTMLElement>) => void;
  className: string;
  role: string;
  "aria-expanded": boolean;
  "aria-haspopup": string;
}

export interface DropdownRenderTriggerParams {
  isOpen: boolean;
  isAnimating: boolean;
  placement: DropdownPlacement;
  toggle: () => void;
  close: () => void;
  triggerProps: DropdownTriggerProps;
}

export interface DropdownProps {
  /** Trigger element to clone and attach ref/onClick (use when not using renderTrigger or triggerLabel) */
  trigger?: React.ReactElement;
  /** Content element to show in the floating panel; receives onClose and className when cloned */
  content: React.ReactElement;
  /** Preferred placement of the floating content */
  placement?: DropdownPlacement;
  /** Offset in pixels between trigger and content */
  offset?: number;
  /** Whether to shift content to stay in viewport */
  shift?: boolean;
  /** Whether to flip placement when content would overflow viewport */
  flip?: boolean;
  /** Close when clicking outside trigger and content */
  closeOnClickOutside?: boolean;
  /** Close when pressing Escape */
  closeOnEscape?: boolean;
  /** Class name for the wrapper div */
  className?: string;
  /** Class name applied to the cloned content element */
  contentClassName?: string;
  /** Render prop for custom trigger; receives state and triggerProps */
  renderTrigger?: (params: DropdownRenderTriggerParams) => React.ReactNode;
  /** Label for default button trigger (used when neither trigger nor renderTrigger is provided) */
  triggerLabel?: string;
}

const PLACEMENT_MAP: Record<DropdownPlacement, string> = {
  top: styles["dropdown-top"],
  "top-start": styles["dropdown-top-start"],
  "top-end": styles["dropdown-top-end"],
  bottom: styles["dropdown-bottom"],
  "bottom-start": styles["dropdown-bottom-start"],
  "bottom-end": styles["dropdown-bottom-end"],
  left: styles["dropdown-left"],
  "left-start": styles["dropdown-left-start"],
  "left-end": styles["dropdown-left-end"],
  right: styles["dropdown-right"],
  "right-start": styles["dropdown-right-start"],
  "right-end": styles["dropdown-right-end"],
};

const FLIP_PLACEMENTS: Record<DropdownPlacement, DropdownPlacement> = {
  top: "bottom",
  "top-start": "bottom-start",
  "top-end": "bottom-end",
  bottom: "top",
  "bottom-start": "top-start",
  "bottom-end": "top-end",
  left: "right",
  "left-start": "right-start",
  "left-end": "right-end",
  right: "left",
  "right-start": "left-start",
  "right-end": "left-end",
};

const Dropdown: React.FC<DropdownProps> = ({
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
  const [adjustedPlacement, setAdjustedPlacement] = useState<DropdownPlacement>(placement);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    setTimeout(() => {
      setIsOpen(false);
      setAdjustedPlacement(placement);
    }, 150);
  };

  const calculatePlacement = (): DropdownPlacement => {
    if (!triggerRef.current || !dropdownRef.current) return placement;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newPlacement: DropdownPlacement = placement;
    const margin = 8;

    if (dropdownRef.current) {
      dropdownRef.current.style.setProperty("--offset", `${offsetValue}px`);
    }

    if (flipValue) {
      const isOutsideViewport =
        dropdownRect.left < margin ||
        dropdownRect.right > viewport.width - margin ||
        dropdownRect.top < margin ||
        dropdownRect.bottom > viewport.height - margin;

      if (isOutsideViewport) {
        newPlacement = FLIP_PLACEMENTS[placement] ?? placement;
      }
    }

    if (shiftValue) {
      let shiftX = 0;
      let shiftY = 0;

      if (dropdownRect.left < margin) {
        shiftX = margin - dropdownRect.left;
      } else if (dropdownRect.right > viewport.width - margin) {
        shiftX = viewport.width - margin - dropdownRect.right;
      }

      if (dropdownRect.top < margin) {
        shiftY = margin - dropdownRect.top;
      } else if (dropdownRect.bottom > viewport.height - margin) {
        shiftY = viewport.height - margin - dropdownRect.bottom;
      }

      if (dropdownRef.current) {
        dropdownRef.current.style.setProperty("--shift-x", `${shiftX}px`);
        dropdownRef.current.style.setProperty("--shift-y", `${shiftY}px`);
      }
    }

    return newPlacement;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: ReactKeyboardEvent | KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape as EventListener);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape as EventListener);
    };
  }, [isOpen, closeOnClickOutside, closeOnEscape]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      requestAnimationFrame(() => {
        const newPlacement = calculatePlacement();
        setAdjustedPlacement(newPlacement);
      });
    }
  }, [isOpen, placement, flipValue, shiftValue]);

  const createTriggerElement = (): React.ReactNode => {
    const triggerProps: DropdownTriggerProps = {
      ref: triggerRef as RefObject<HTMLElement | null>,
      onClick: handleToggle as (e: ReactMouseEvent<HTMLElement>) => void,
      className: `${styles["dropdown-trigger"]} ${isOpen ? styles["active"] : ""}`.trim(),
      role: "button",
      "aria-expanded": isOpen,
      "aria-haspopup": "true",
    };

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

    if (triggerLabel) {
      return (
        <span ref={triggerRef as RefObject<HTMLSpanElement | null>} style={{ display: "inline-flex" }}>
          <Button
            variant="outline"
            onClick={handleToggle}
            style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}
            className={triggerProps.className}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {triggerLabel}
            <Icon
              name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              style={{ fontSize: "16px" }}
            />
          </Button>
        </span>
      );
    }

    if (trigger) {
      return cloneElement(trigger, {
        ...triggerProps,
        className: `${(trigger.props as { className?: string }).className ?? ""} ${triggerProps.className}`.trim(),
      } as Partial<{ className: string }>);
    }

    return null;
  };

  if (!trigger && !renderTrigger && !triggerLabel) {
    throw new Error(
      "Dropdown requires either a 'trigger' element, 'renderTrigger' function, or 'triggerLabel' string"
    );
  }

  const triggerElement = createTriggerElement();

  const contentElement = cloneElement(content, {
    onClose: handleClose,
    className: `${(content.props as { className?: string }).className ?? ""} ${styles["dropdown-content"]} ${contentClassName}`.trim(),
  } as { onClose?: () => void; className?: string });

  const getPlacementClass = () =>
    PLACEMENT_MAP[adjustedPlacement] ?? styles["dropdown-bottom-end"];

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

export default Dropdown;
