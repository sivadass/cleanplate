import React, {
  useState,
  cloneElement,
  useEffect,
  useMemo,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
} from "react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";
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
  ref: Ref<HTMLElement>;
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

type RefCallback<T> = (instance: T | null) => void;

function composeRefs<T>(...refs: (Ref<T> | undefined | null)[]): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (ref == null) return;
      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

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

  const floatingMiddleware = useMemo(
    () => [
      offset(offsetValue),
      ...(flipValue ? [flip({ padding: 8 })] : []),
      ...(shiftValue ? [shift({ padding: 8 })] : []),
    ],
    [offsetValue, flipValue, shiftValue],
  );

  const { refs, floatingStyles, placement: resolvedPlacement } = useFloating({
    placement: placement as Placement,
    strategy: "absolute",
    middleware: floatingMiddleware,
    whileElementsMounted: autoUpdate,
  });

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
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        closeOnClickOutside &&
        isOpen &&
        refs.floating.current &&
        !refs.floating.current.contains(target) &&
        refs.domReference.current &&
        !refs.domReference.current.contains(target)
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
  }, [isOpen, closeOnClickOutside, closeOnEscape, refs]);

  const placementForTrigger = (isOpen ? resolvedPlacement : placement) as DropdownPlacement;

  const createTriggerElement = (): React.ReactNode => {
    const triggerProps: DropdownTriggerProps = {
      ref: refs.setReference,
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
        placement: placementForTrigger,
        toggle: handleToggle,
        close: handleClose,
        triggerProps,
      });
    }

    if (triggerLabel) {
      return (
        <span ref={refs.setReference} style={{ display: "inline-flex" }}>
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
      const userRef = (trigger as React.ReactElement & { ref?: Ref<HTMLElement> }).ref;
      return cloneElement(trigger, {
        ...triggerProps,
        ref: composeRefs(userRef, refs.setReference),
        className: `${(trigger.props as { className?: string }).className ?? ""} ${triggerProps.className}`.trim(),
      } as Partial<{ className: string; ref: Ref<HTMLElement> }>);
    }

    return null;
  };

  if (!trigger && !renderTrigger && !triggerLabel) {
    throw new Error(
      "Dropdown requires either a 'trigger' element, 'renderTrigger' function, or 'triggerLabel' string",
    );
  }

  const triggerElement = createTriggerElement();

  const contentElement = cloneElement(content, {
    onClose: handleClose,
    className: `${(content.props as { className?: string }).className ?? ""} ${styles["dropdown-content"]} ${contentClassName}`.trim(),
  } as { onClose?: () => void; className: string });

  return (
    <div className={`${styles["dropdown-wrapper"]} ${className}`}>
      {triggerElement}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={`${styles["dropdown-floating"]} ${
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
