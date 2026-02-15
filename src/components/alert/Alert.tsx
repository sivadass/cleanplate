import React, { useState } from "react";
import Icon from "../icon";
import type { MaterialIconName } from "../icon/material-icon-names";
import Typography from "../typography";
import Button from "../button";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass, getVariantIcon } from "../../utils/common";
import styles from "./Alert.module.scss";
import utilsStyles from "../../styles/utils.module.scss";

export type AlertSize = "small" | "medium" | "large";

export type AlertVariant = "success" | "error" | "warning" | "info" | "default";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type AlertMargin = string | SpacingOption[];

export interface AlertProps {
  /** Main message text shown in the alert */
  message?: string;
  /** Size of the alert and its icon/close button */
  size?: AlertSize;
  /** Visual variant (success, error, warning, info, default) */
  variant?: AlertVariant;
  /** Whether to show a dismiss button */
  canDismiss?: boolean;
  /** Called when the user dismisses the alert */
  onDismiss?: () => void;
  /** Spacing suffix(s) for outer margin. Component adds the m- prefix (e.g. "0" → m-0). */
  margin?: AlertMargin;
}

const Alert: React.FC<AlertProps> = ({
  message,
  size = "medium",
  variant = "info",
  canDismiss = false,
  onDismiss,
  margin = ["0"],
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const iconName = getVariantIcon(variant);
  const marginClasses = getSpacingClass(margin, utilsStyles, "m");

  const handleClose = () => {
    setIsVisible(false);
    if (typeof onDismiss === "function") {
      onDismiss();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${styles["cp-alert"]} ${styles[variant]} ${styles[size]} ${marginClasses}`}
    >
      <div className={styles["contents"]}>
        <Icon className={styles["alert-icon"]} name={iconName as MaterialIconName} size={size} />
        <Typography className={styles["alert-message"]}>{message}</Typography>
      </div>
      {canDismiss && (
        <Button className={styles["close"]} onClick={handleClose}>
          <Icon name="close" size={size} />
        </Button>
      )}
    </div>
  );
};

export default Alert;
