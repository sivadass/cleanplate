# Changelog

## Unreleased

### Added

- **`Drawer`**: slide-in overlay panel (`placement`, mobile bottom sheet at ≤768px, optional header/footer, `dataTestId`). See `docs/Drawer.md`.
- **`FeedbackState`**: unified empty/error region component (`variant`, consumer `illustration` URL or `icon`, `primaryAction` / `secondaryAction`, `onRetry`, `errorDetails`). See `docs/FeedbackState.md`.

### Breaking

- **`FormControls.Date`**: replaces the legacy three-dropdown (day/month/year) field with a **calendar date picker**.
  - `value` / `defaultValue` are now **`Date | null`** (not `string` / `"dd-mm-yyyy"` format).
  - `onChange` is now **`(date: Date | null) => void`**.
  - When `name` is set, a hidden input submits **`yyyy-MM-dd`**.
