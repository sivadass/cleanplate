import React, { useState, useRef, useEffect } from "react";
import Icon from "../icon";
import styles from "./BottomSheet.module.scss";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type BottomSheetMargin = string | SpacingOption[];

export interface BottomSheetProps {
  /** Whether the bottom sheet is open */
  isOpen: boolean;
  /** Called when the sheet should close (e.g. after drag-to-close) */
  onClose?: () => void;
  /** Spacing suffix(s) for outer margin; component adds m- prefix */
  margin?: BottomSheetMargin;
  /** Additional class names for the sheet panel */
  className?: string;
  /** Content rendered inside the sheet */
  children?: React.ReactNode;
}

const SNAP_POINTS = [0.3, 0.6, 0.9];
const MINIMUM_DISTANCE = 50;
const CLOSE_THRESHOLD = 0.2;

const BottomSheet: React.FC<BottomSheetProps> = ({
  margin,
  className = "",
  children,
  isOpen,
  onClose,
}) => {
  const [currentSnap, setCurrentSnap] = useState(SNAP_POINTS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const startHeight = useRef(0);
  const isDraggingRef = useRef(false);
  isDraggingRef.current = isDragging;

  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const bottomSheetClassNames = getClassNames(
    styles["cp-bottom-sheet"],
    marginClass,
    className
  );

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

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ("touches" in e) {
      startY.current = e.touches[0].clientY;
      currentY.current = e.touches[0].clientY;
    } else {
      startY.current = e.clientY;
      currentY.current = e.clientY;
    }
    if (sheetRef.current) {
      startHeight.current = sheetRef.current.getBoundingClientRect().height;
    }
  };

  const handleTouchMove = (e: TouchEvent | MouseEvent) => {
    if (!isDraggingRef.current) return;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    currentY.current = clientY;

    if (sheetRef.current) {
      const windowHeight = window.innerHeight;
      const currentPosition = 1 - (clientY / windowHeight);
      const transform = Math.max(
        (1 - currentPosition) * 100,
        (1 - SNAP_POINTS[SNAP_POINTS.length - 1]) * 100
      );

      const resistance = currentPosition < 0 ? 0.5 : 1;
      sheetRef.current.style.transform = `translateY(${transform * resistance}%)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);

    const distance = currentY.current - startY.current;
    if (Math.abs(distance) < MINIMUM_DISTANCE) {
      setCurrentSnap((prev) => prev);
      return;
    }

    const windowHeight = window.innerHeight;
    const currentPosition = 1 - (currentY.current / windowHeight);

    if (distance > 0 && currentPosition < CLOSE_THRESHOLD) {
      onClose?.();
      return;
    }

    let closestSnap = SNAP_POINTS[0];
    let minDistance = Math.abs(currentPosition - SNAP_POINTS[0]);

    SNAP_POINTS.forEach((snap) => {
      const dist = Math.abs(currentPosition - snap);
      if (dist < minDistance) {
        minDistance = dist;
        closestSnap = snap;
      }
    });

    setCurrentSnap(closestSnap);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (e: MouseEvent) => handleTouchMove(e);
    const handleMouseUp = () => handleTouchEnd();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove as EventListener);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove as EventListener);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles["bottom-sheet-overlay"]}>
      <div
        ref={sheetRef}
        style={{
          transform: `translateY(${(1 - currentSnap) * 100}%)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        className={bottomSheetClassNames}
      >
        <div
          className={styles["bottom-sheet-handle"]}
          onMouseDown={handleTouchStart}
          onTouchStart={handleTouchStart}
        >
          <div className={styles["bottom-sheet-handle-bar"]} />
          <Icon
            className={styles["bottom-sheet-handle-icon"]}
            size="medium"
            name="drag_indicator"
          />
        </div>
        <div className={styles["bottom-sheet-content"]}>{children}</div>
      </div>
    </div>
  );
};

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
