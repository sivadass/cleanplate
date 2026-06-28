# Changelog

## Unreleased

### Added

- **`Drawer`**: slide-in overlay panel (`placement`, mobile bottom sheet at ≤768px, optional header/footer, `dataTestId`). See `docs/Drawer.md`.
- **`FeedbackState`**: unified empty/error region component (`variant`, consumer `illustration` URL or `icon`, `primaryAction` / `secondaryAction`, `onRetry`, `errorDetails`). See `docs/FeedbackState.md`.
- **`Statistic`**: labeled numeric KPI display (`title`, `value`, `precision`, `prefix`/`suffix`, `tone`, `size`, `loading`, `variant` plain|card, `icon`, `description`, `progress`, `footer`). See `docs/Statistic.md`. `Statistic.Timer` is planned for a future release.

### Breaking

- **`Statistic`**: `valueTone` (`default` | `positive` | `negative`) replaced by `tone` (`neutral` | `success` | `warning` | `danger` | `muted`). Tone drives icon, value, card surface, and default progress/badge styling.

### Breaking

- **`FormControls.Date`**: replaces the legacy three-dropdown (day/month/year) field with a **calendar date picker**.
  - `value` / `defaultValue` are now **`Date | null`** (not `string` / `"dd-mm-yyyy"` format).
  - `onChange` is now **`(date: Date | null) => void`**.
  - When `name` is set, a hidden input submits **`yyyy-MM-dd`**.
