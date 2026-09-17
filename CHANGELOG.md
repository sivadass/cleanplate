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

_No unreleased changes._
