import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon";
import styles from "./Alert.module.scss";
import Typography from "../typography";
import Button from "../button";

const getIcon = (variant) => {
  let iconName = "";
  switch (variant) {
    case "error":
      iconName = "error";
      break;
    case "warning":
      iconName = "warning";
      break;
    case "success":
      iconName = "check_circle";
      break;
    default:
      iconName = "info";
  }
  return iconName;
};

const Alert = ({
  message,
  isLoading = false,
  isDisabled = false,
  size = "medium",
  variant = "info",
  onClick,
  canClose = false,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const iconName = getIcon(variant);
  const handleClick = (e) => {
    if (isDisabled || isLoading) {
      e.preventDefault();
      return;
    }
    if (typeof onClick === "function") {
      onClick(e);
    }
  };
  const handleClose = () => {
    setIsVisible(false);
  };
  if (isVisible) {
    return (
      <div
        className={`${styles["cp-alert"]} ${styles[variant]} ${styles[size]}`}
        onClick={(e) => handleClick(e)}
      >
        <div className={`${styles["contents"]}`}>
          <Icon className={styles["alert-icon"]} name={iconName} size={size} />
          <Typography className={styles["alert-message"]}>{message}</Typography>
        </div>
        {canClose && (
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
  size: PropTypes.oneOf(["small", "medium"]),
  variant: PropTypes.oneOf(["success", "error", "warning", "info", "default"]),
};

export default Alert;
