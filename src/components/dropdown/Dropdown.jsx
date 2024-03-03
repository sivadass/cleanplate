import { useEffect, useState, useRef, cloneElement } from "react";
import PropTypes from "prop-types";
import styles from "./Dropdown.module.css";

const Dropdown = ({ trigger, content, align = "right" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const alignClass = align ? `align-${align}` : "";
  const alignStyle = alignClass ? `${styles[alignClass]}` : "";
  const toggleDropdown = (event) => {
    if (
      isOpen &&
      triggerRef.current &&
      triggerRef.current.contains(event.target)
    ) {
      setIsOpen(false);
      return;
    }
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  return (
    <div className={styles["dropdown-wrapper"]}>
      <div
        className={`${styles["dropdown-trigger"]} ${
          isOpen ? styles["active"] : ""
        }`}
        ref={triggerRef}
        onClick={(e) => toggleDropdown(e)}
        isActive={isOpen}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={dropdownContentRef}
          className={`${styles["dropdown-contents"]} ${alignStyle}`}
        >
          {cloneElement(content, { onClose: () => setIsOpen(false) })}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  align: PropTypes.oneOf(["left", "right"]),
};

export default Dropdown;
