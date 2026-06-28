import type { BadgeVariant } from "../badge/Badge";
import type { StatisticProgressVariant, StatisticTone } from "./Statistic";

export const STATISTIC_TONE_PROGRESS: Record<
  StatisticTone,
  StatisticProgressVariant
> = {
  neutral: "default",
  success: "success",
  warning: "warning",
  danger: "error",
  muted: "info",
};

export const STATISTIC_TONE_BADGE: Record<StatisticTone, BadgeVariant> = {
  neutral: "default",
  success: "success",
  warning: "warning",
  danger: "error",
  muted: "info",
};

export function resolveStatisticProgressVariant(
  tone: StatisticTone,
  override?: StatisticProgressVariant,
): StatisticProgressVariant {
  return override ?? STATISTIC_TONE_PROGRESS[tone];
}

export function resolveStatisticBadgeVariant(
  tone: StatisticTone,
  override?: BadgeVariant,
): BadgeVariant {
  return override ?? STATISTIC_TONE_BADGE[tone];
}
