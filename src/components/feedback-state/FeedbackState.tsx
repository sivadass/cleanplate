import React, { useId } from "react";
import Typography from "../typography";
import Button from "../button";
import Icon from "../icon";
import type { IconSize } from "../icon/Icon";
import type { MaterialIconName } from "../icon/material-icon-names";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";
import styles from "./FeedbackState.module.scss";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];

export type FeedbackStateVariant = "empty" | "error";

export type FeedbackStateSize = "small" | "medium" | "large";

export type FeedbackStateTitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export type FeedbackStateRole = "alert" | "status" | "none";

export type FeedbackStateMargin = string | SpacingOption[];

export type ActionConfig = {
  label: string;
  onClick: () => void;
};

export interface FeedbackStateProps {
  variant: FeedbackStateVariant;
  title: string;
  titleTag?: FeedbackStateTitleTag;
  description?: string | React.ReactNode;
  illustration?: string | React.ReactNode;
  illustrationAlt?: string;
  icon?: MaterialIconName;
  size?: FeedbackStateSize;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  onRetry?: () => void;
  retryLabel?: string;
  errorCode?: string | number;
  errorDetails?: string;
  role?: FeedbackStateRole;
  margin?: FeedbackStateMargin;
  className?: string;
  dataTestId?: string;
}

const defaultRoleForVariant = (variant: FeedbackStateVariant): FeedbackStateRole =>
  variant === "error" ? "alert" : "status";

const mapSizeToIconSize = (size: FeedbackStateSize): IconSize => {
  if (size === "small") return "small";
  if (size === "large") return "large";
  return "medium";
};

const mapSizeToButtonSize = (size: FeedbackStateSize): "small" | "medium" =>
  size === "small" ? "small" : "medium";

const resolvePrimaryAction = (
  primaryAction: ActionConfig | undefined,
  onRetry: (() => void) | undefined,
  retryLabel: string
): ActionConfig | null => {
  if (primaryAction) return primaryAction;
  if (onRetry) {
    return { label: retryLabel, onClick: onRetry };
  }
  return null;
};

const FeedbackState: React.FC<FeedbackStateProps> = ({
  variant,
  title,
  titleTag = "h2",
  description,
  illustration,
  illustrationAlt = "",
  icon,
  size = "medium",
  primaryAction,
  secondaryAction,
  onRetry,
  retryLabel = "Try again",
  errorCode,
  errorDetails,
  role,
  margin = "0",
  className = "",
  dataTestId,
}) => {
  const titleId = useId();
  const resolvedRole = role ?? defaultRoleForVariant(variant);
  const resolvedPrimary = resolvePrimaryAction(primaryAction, onRetry, retryLabel);
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const buttonSize = mapSizeToButtonSize(size);
  const isDecorativeMedia = !illustrationAlt;

  const rootClassName = getClassNames(
    styles["cp-feedback-state"],
    styles[`cp-feedback-state--${size}`],
    styles[`cp-feedback-state--${variant}`],
    marginClass,
    className
  );

  const TitleTag = titleTag;

  const renderMedia = () => {
    if (illustration !== undefined && illustration !== null && illustration !== "") {
      const mediaClassName = styles["cp-feedback-state__media"];
      const mediaAriaHidden = isDecorativeMedia ? true : undefined;

      if (typeof illustration === "string") {
        return (
          <div className={mediaClassName} aria-hidden={mediaAriaHidden}>
            <img
              className={styles["cp-feedback-state__media-img"]}
              src={illustration}
              alt={illustrationAlt}
            />
          </div>
        );
      }

      return (
        <div className={mediaClassName} aria-hidden={mediaAriaHidden}>
          {illustration}
        </div>
      );
    }

    if (icon) {
      return (
        <div
          className={styles["cp-feedback-state__media"]}
          aria-hidden={isDecorativeMedia ? true : undefined}
        >
          <Icon
            name={icon}
            size={mapSizeToIconSize(size)}
            color={variant === "error" ? "red" : "gray"}
          />
        </div>
      );
    }

    return null;
  };

  const rootProps: React.HTMLAttributes<HTMLDivElement> & { "data-testid"?: string } = {
    className: rootClassName,
    "data-testid": dataTestId,
  };

  if (resolvedRole !== "none") {
    rootProps.role = resolvedRole;
    rootProps["aria-labelledby"] = titleId;
  }

  return (
    <div {...rootProps}>
      {renderMedia()}
      <div className={styles["cp-feedback-state__content"]}>
        <TitleTag id={titleId} className={styles["cp-feedback-state__title"]}>
          {title}
        </TitleTag>
        {description ? (
          <Typography
            variant="p"
            align="center"
            className={styles["cp-feedback-state__description"]}
          >
            {description}
          </Typography>
        ) : null}
        {errorCode !== undefined && errorCode !== null && errorCode !== "" ? (
          <span className={styles["cp-feedback-state__error-code"]}>{errorCode}</span>
        ) : null}
      </div>
      {resolvedPrimary || secondaryAction ? (
        <div className={styles["cp-feedback-state__actions"]}>
          {resolvedPrimary ? (
            <Button
              variant="solid"
              size={buttonSize}
              onClick={resolvedPrimary.onClick}
            >
              {resolvedPrimary.label}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button
              variant="ghost"
              size={buttonSize}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
      {errorDetails ? (
        <details className={styles["cp-feedback-state__details"]}>
          <summary>Show details</summary>
          {errorDetails}
        </details>
      ) : null}
    </div>
  );
};

export default FeedbackState;
