import { describe, expect, it } from "vitest";
import {
  resolveStatisticBadgeVariant,
  resolveStatisticProgressVariant,
  STATISTIC_TONE_BADGE,
  STATISTIC_TONE_PROGRESS,
} from "./tone-defaults";

describe("statistic tone defaults", () => {
  it("maps tones to progress variants", () => {
    expect(STATISTIC_TONE_PROGRESS.success).toBe("success");
    expect(STATISTIC_TONE_PROGRESS.warning).toBe("warning");
    expect(STATISTIC_TONE_PROGRESS.danger).toBe("error");
    expect(STATISTIC_TONE_PROGRESS.muted).toBe("info");
  });

  it("maps tones to badge variants", () => {
    expect(STATISTIC_TONE_BADGE.success).toBe("success");
    expect(STATISTIC_TONE_BADGE.danger).toBe("error");
    expect(STATISTIC_TONE_BADGE.muted).toBe("info");
  });

  it("honors explicit progress variant overrides", () => {
    expect(resolveStatisticProgressVariant("success", "warning")).toBe("warning");
  });

  it("honors explicit badge variant overrides", () => {
    expect(resolveStatisticBadgeVariant("danger", "default")).toBe("default");
  });
});
