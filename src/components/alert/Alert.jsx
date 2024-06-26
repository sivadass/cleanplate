import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import Typography from "../typography";
import Button from "../button";
import { SPACING_OPTIONS, SIZING_OPTIONS } from "../../constants/common";
import { getSpacingClass, getVariantIcon } from "../../utils/common";

import styles from "./Alert.module.scss";
import utilsStyles from "../../styles/utils.module.scss";

const Alert = ({
  message,
  size = "medium",
  variant = "info",
  canDismiss = false,
  onDismiss,
  margin = ["0"],
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const iconName = getVariantIcon(variant);

  const marginClasses = getSpacingClass(margin, utilsStyles, "m");

  const handleClose = () => {
    setIsVisible(false);
    if (typeof onDismiss === "function") {
      onDismiss();
    }
  };
  if (isVisible) {
    return (
      <div
        className={`${styles["cp-alert"]} ${styles[variant]} ${styles[size]} ${marginClasses}`}
        onClick={(e) => handleClick(e)}
      >
        <div className={`${styles["contents"]}`}>
          <Icon className={styles["alert-icon"]} name={iconName} size={size} />
          <Typography className={styles["alert-message"]}>{message}</Typography>
        </div>
        {canDismiss && (
          <Button className={styles["close"]} onClick={() => handleClose()}>
            <Icon name="close" size={size} />
          </Button>
        )}
      </div>
    );
  }
  return null;
};

Alert.propTypes = {
  message: PropTypes.string,
  canDismiss: PropTypes.bool,
  onDismiss: PropTypes.func,
  size: PropTypes.oneOf(SIZING_OPTIONS),
  variant: PropTypes.oneOf(["success", "error", "warning", "info", "default"]),
  margin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(SPACING_OPTIONS),
  ]),
};

export default Alert;
