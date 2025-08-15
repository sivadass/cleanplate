import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import Button from "../button";
import styles from "./BottomSheet.module.scss";
import Animated from "../animated";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";

const SNAP_POINTS = [0.3, 0.6, 0.9];
const MINIMUM_DISTANCE = 50;
const CLOSE_THRESHOLD = 0.2;

const BottomSheet = ({ margin, className, children, isOpen, onClose }) => {
  const [currentSnap, setCurrentSnap] = useState(SNAP_POINTS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const startHeight = useRef(0);

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

  const handleTouchStart = (e) => {
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

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const delta = clientY - startY.current;
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
    if (!isDragging) return;
    setIsDragging(false);

    const distance = currentY.current - startY.current;
    if (Math.abs(distance) < MINIMUM_DISTANCE) {
      setCurrentSnap(currentSnap);
      return;
    }

    const windowHeight = window.innerHeight;
    const currentPosition = 1 - (currentY.current / windowHeight);

    if (distance > 0 && currentPosition < CLOSE_THRESHOLD) {
      onClose();
      return;
    }

    let closestSnap = SNAP_POINTS[0];
    let minDistance = Math.abs(currentPosition - SNAP_POINTS[0]);

    SNAP_POINTS.forEach((snap) => {
      const distance = Math.abs(currentPosition - snap);
      if (distance < minDistance) {
        minDistance = distance;
        closestSnap = snap;
      }
    });

    setCurrentSnap(closestSnap);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (e) => handleTouchMove(e);
    const handleMouseUp = () => handleTouchEnd();

    // Add event listeners when component is mounted
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    // Cleanup event listeners when component is unmounted
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOpen]); // Only re-run if isOpen changes

  if (!isOpen) return null;

  return (
    <div className={styles["bottom-sheet-overlay"]}>
      <Animated
        ref={sheetRef}
        style={{
          transform: `translateY(${(1 - currentSnap) * 100}%)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        className={[bottomSheetClassNames]}
      >
        <div
          className={styles["bottom-sheet-handle"]}
          onMouseDown={handleTouchStart}
          onTouchStart={handleTouchStart}
        >
          <div className={styles["bottom-sheet-handle-bar"]} />
          <Icon
            className={styles["bottom-sheet-handle-icon"]}
            size="m"
            name="drag_indicator"
          />
        </div>
        <div className={styles["bottom-sheet-content"]}>{children}</div>
      </Animated>
    </div>
  );
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func,
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
  children: PropTypes.node,
};

export default BottomSheet;
