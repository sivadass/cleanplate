# Changelog

## Unreleased

### Breaking

- **`FormControls.Date`**: replaces the legacy three-dropdown (day/month/year) field with a **calendar date picker**.
  - `value` / `defaultValue` are now **`Date | null`** (not `string` / `"dd-mm-yyyy"` format).
  - `onChange` is now **`(date: Date | null) => void`**.
  - When `name` is set, a hidden input submits **`yyyy-MM-dd`**.
