import React from "react";
import Badge, { type BadgeVariant } from "../badge/Badge";
import ProgressBar from "../progress-bar";
import Spinner from "../spinner";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";
import styles from "./Statistic.module.scss";
import { formatStatisticValue } from "./format-value";
import {
  resolveStatisticBadgeVariant,
  resolveStatisticProgressVariant,
} from "./tone-defaults";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type StatisticSize = "small" | "medium" | "large";
export type StatisticTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "muted";
export type StatisticVariant = "plain" | "card";
export type StatisticMargin = string | SpacingOption[];

export type StatisticProgressVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "error"
  | "warning";

export interface StatisticProgress {
  value: number;
  variant?: StatisticProgressVariant;
  size?: "small" | "medium" | "large";
}

export interface StatisticFooter {
  label?: React.ReactNode;
  badge?: React.ReactNode;
  badgeVariant?: BadgeVariant;
}

export interface StatisticProps {
  title?: React.ReactNode;
  value?: string | number;
  precision?: number;
  groupSeparator?: string;
  decimalSeparator?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  progress?: StatisticProgress;
  footer?: StatisticFooter;
  variant?: StatisticVariant;
  /** Semantic color tone for icon, value, card surface, and default progress/badge styling. */
  tone?: StatisticTone;
  size?: StatisticSize;
  loading?: boolean;
  margin?: StatisticMargin;
  className?: string;
  dataTestId?: string;
}

const renderFooterBadge = (
  footer: StatisticFooter,
  tone: StatisticTone,
): React.ReactNode => {
  const { badge, badgeVariant } = footer;

  if (badge == null || badge === "") {
    return null;
  }

  if (typeof badge === "string") {
    return (
      <Badge
        label={badge}
        variant={resolveStatisticBadgeVariant(tone, badgeVariant)}
      />
    );
  }

  return badge;
};

const Statistic: React.FC<StatisticProps> = ({
  title,
  value,
  precision,
  groupSeparator,
  decimalSeparator,
  prefix,
  suffix,
  icon,
  description,
  progress,
  footer,
  variant = "plain",
  tone = "neutral",
  size = "medium",
  loading = false,
  margin = "0",
  className = "",
  dataTestId,
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");
  const showHeaderRow = variant === "card" || icon != null;
  const showTitle = title != null && title !== "";
  const showProgress = !loading && progress != null;
  const showDescription =
    !loading && description != null && description !== "";
  const showFooter =
    !loading &&
    footer != null &&
    ((footer.label != null && footer.label !== "") ||
      (footer.badge != null && footer.badge !== ""));

  const rootClassName = getClassNames(
    styles["cp-statistic"],
    styles[`cp-statistic-${size}`],
    styles[`cp-statistic-tone-${tone}`],
    variant === "card" ? styles["cp-statistic-card"] : undefined,
    marginClass,
    className,
  );

  const formattedValue =
    !loading && value !== undefined
      ? formatStatisticValue(value, {
          precision,
          groupSeparator,
          decimalSeparator,
        })
      : null;

  const titleNode = showTitle ? (
    <div className={styles["cp-statistic-title"]}>{title}</div>
  ) : null;

  return (
    <div className={rootClassName} data-testid={dataTestId}>
      {showHeaderRow ? (
        <div className={styles["cp-statistic-header"]}>
          {icon != null ? (
            <span className={styles["cp-statistic-icon"]}>{icon}</span>
          ) : null}
          {titleNode}
        </div>
      ) : (
        titleNode
      )}
      <div
        className={styles["cp-statistic-content"]}
        aria-busy={loading || undefined}
      >
        {loading ? (
          <Spinner size={size} margin="0" />
        ) : (
          <>
            {prefix != null ? (
              <span className={styles["cp-statistic-prefix"]}>{prefix}</span>
            ) : null}
            {formattedValue != null && formattedValue !== "" ? (
              <span className={styles["cp-statistic-value"]}>
                {formattedValue}
              </span>
            ) : null}
            {suffix != null ? (
              <span className={styles["cp-statistic-suffix"]}>{suffix}</span>
            ) : null}
          </>
        )}
      </div>
      {showProgress ? (
        <div className={styles["cp-statistic-progress"]}>
          <ProgressBar
            value={progress.value}
            variant={resolveStatisticProgressVariant(tone, progress.variant)}
            size={progress.size ?? "small"}
            margin="0"
          />
        </div>
      ) : null}
      {showDescription ? (
        <div className={styles["cp-statistic-description"]}>{description}</div>
      ) : null}
      {showFooter ? (
        <div className={styles["cp-statistic-footer"]}>
          {footer.label != null && footer.label !== "" ? (
            <span className={styles["cp-statistic-footer-label"]}>
              {footer.label}
            </span>
          ) : null}
          {footer.badge != null && footer.badge !== "" ? (
            <span className={styles["cp-statistic-footer-badge"]}>
              {renderFooterBadge(footer, tone)}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Statistic;
