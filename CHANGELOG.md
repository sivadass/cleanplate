# Changelog

## [1.0.0-beta.0] - 2026-08-16

**Beta release** — public CSS, HTML → React bridge, and agent docs. API and class names may still change before `1.0.0` stable. Pin this semver exactly if you adopt it (`cleanplate@1.0.0-beta.0`).

### Breaking

- **Public CSS (1.0):** CSS Modules no longer append hash suffixes. All component classes are stable `cp-*` names in `dist/index.css`. See [`docs/MIGRATION-v1.md`](docs/MIGRATION-v1.md).
- **Spacing props:** `margin`, `padding`, and `gap` use **suffix-only** values (`"0"`, `"b-2"`, `"4"`). Prefixed values like `"m-0"` or `"p-4"` are invalid.
- **`Statistic`:** `valueTone` replaced by `tone` (`neutral` | `success` | `warning` | `danger` | `muted`).
- **`FormControls.Date`:** calendar date picker replaces three-dropdown field. `value` / `defaultValue` are `Date | null`; `onChange` is `(date: Date | null) => void`.

### Added

- **`dist/tokens.css`** — design tokens for Paper / HTML prototype sync (`--space-*`, colors, radii).
- **HTML → JSX CLI** — `npm run html-to-jsx -- recipe.html` (also `cleanplate-html-to-jsx` bin). Mechanical conversion from `data-cp` HTML recipes; hard-fails on unknown props/enums.
- **HTML prototype recipes** in `docs/*.md` — Tier 1–4 components with `## HTML prototype` sections and fixtures under `src/html-to-jsx/fixtures/`.
- **Agent skills** — `skills/cleanplate-html-prototype/` and `skills/cleanplate-html-to-react/`.
- **`docs/html/kit.html`** — v1 primitive sticker sheet for design agents.
- **Opt-in `data-cp` attributes** — `CleanPlatePrototypeAttributes` provider (default off; Storybook preview enables for docs).
- **`Drawer`**, **`FeedbackState`**, **`Statistic`**, **`FormControls.SegmentedControl`** (see prior unreleased notes below).

### Migration

- Read [`docs/MIGRATION-v1.md`](docs/MIGRATION-v1.md) for hashed-class removal, spacing suffixes, and prototype workflow.
- HTML prototypes: load `cleanplate/dist/index.css` + `dist/tokens.css`; convert with CLI — do not hand-write JSX from HTML.

---

## Unreleased

### Breaking

- **Button sizes:** `small` is 32px (was 24px). `medium` (default) is 44px (was 50px) and no longer has `min-width: 96px`. `variant="icon"` is a square at the size height, not a circle. New `large` is 52px. See `docs/Button.md`.
- **Form control sizes:** Boxed fields (`Input`, `TextArea`, `Select`, `Date`, `ColorPicker`, `Stepper`, `SegmentedControl`, `File` button) share `size` (`small` 32 / `medium` 44 default / `large` 52). Default field height remaps 50px → 44px so it aligns with `Button` medium. `SegmentedControl` `small` remaps 40px → 32px; `medium` 50px → 44px; new `large` is 52px. Checkbox, Radio, Toggle, and File card are unchanged. See `docs/FormControls.md`.
- **Shared size tokens:** Button and boxed fields use `--cp-form-control-height-small|medium|large` and `--cp-form-control-radius-small|medium|large`. `--cp-button-height-*`, `--cp-form-control-radius` (single token), and font / pad-x / icon / textarea-min tokens are removed from `:root`.
- **Typography type scale:** Headings remap 60/50/40/30/24/18 → **48/32/24/20/16/14**. `small` is **12px** (was 14px). Heading line-height is no longer `1`. Public tokens `--cp-font-family`, `--cp-font-size-*`, `--cp-font-leading-*`, `--cp-font-tracking-*`, `--cp-font-weight-*`. `--font-family` is renamed to `--cp-font-family`. Class names unchanged. See `docs/Typography.md`.

### Added

- **FilterBar:** Controlled search, select, multi-select, and date-range fields for filtering a table. Bar fields update immediately. Drawer fields apply on Apply. See `docs/FilterBar.md`.
- **Button `prefixIcon` / `suffixIcon`:** Material Symbol names; Button owns glyph size (16 / 20 / 24) and asymmetric padding.
- **FormControls `size`:** `small` | `medium` | `large` on boxed fields. Public tokens `--cp-form-control-height-small|medium|large` and `--cp-form-control-radius-small|medium|large` (shared with Button). Wrapper class `cp-form-field--small|medium|large`.
- **Pagination small chrome:** Page buttons and the rows-per-page Select use Button / Select `small` (32px). The select trigger is no longer 36px.
