import React from "react";
import Spinner from "../spinner";
import type { SpinnerSize } from "../spinner/Spinner";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";
import styles from "./Statistic.module.scss";
import { formatStatisticValue } from "./format-value";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type StatisticSize = "small" | "medium" | "large";
export type StatisticValueTone = "default" | "positive" | "negative";
export type StatisticMargin = string | SpacingOption[];

export interface StatisticProps {
  title?: React.ReactNode;
  value?: string | number;
  precision?: number;
  groupSeparator?: string;
  decimalSeparator?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  valueTone?: StatisticValueTone;
  size?: StatisticSize;
  loading?: boolean;
  margin?: StatisticMargin;
  className?: string;
  dataTestId?: string;
}

const mapStatisticSizeToSpinnerSize = (size: StatisticSize): SpinnerSize => {
  if (size === "small") return "small";
  if (size === "large") return "large";
  return "medium";
};

const Statistic: React.FC<StatisticProps> = ({
  title,
  value,
  precision,
  groupSeparator = ",",
  decimalSeparator = ".",
  prefix,
  suffix,
  valueTone = "default",
  size = "medium",
  loading = false,
  margin = "0",
  className = "",
  dataTestId,
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const rootClassName = getClassNames(
    styles["cp-statistic"],
    styles[`cp-statistic--${size}`],
    loading ? styles["cp-statistic--loading"] : undefined,
    marginClass,
    className,
  );

  const formattedValue =
    value !== undefined
      ? formatStatisticValue(value, {
          precision,
          groupSeparator,
          decimalSeparator,
        })
      : null;

  const showPrefix = !loading && prefix != null;
  const showSuffix = !loading && suffix != null;
  const showValue = !loading && formattedValue != null && formattedValue !== "";

  const valueClassName = getClassNames(
    styles["cp-statistic__value"],
    valueTone === "positive" ? styles["cp-statistic__value--positive"] : undefined,
    valueTone === "negative" ? styles["cp-statistic__value--negative"] : undefined,
  );

  return (
    <div className={rootClassName} data-testid={dataTestId}>
      {title != null && title !== "" ? (
        <div className={styles["cp-statistic__title"]}>{title}</div>
      ) : null}
      <div
        className={styles["cp-statistic__content"]}
        aria-busy={loading || undefined}
      >
        {loading ? (
          <Spinner size={mapStatisticSizeToSpinnerSize(size)} margin="0" />
        ) : (
          <>
            {showPrefix ? (
              <span className={styles["cp-statistic__prefix"]}>{prefix}</span>
            ) : null}
            {showValue ? (
              <span className={valueClassName}>{formattedValue}</span>
            ) : null}
            {showSuffix ? (
              <span className={styles["cp-statistic__suffix"]}>{suffix}</span>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Statistic;
