# Typography type scale — design spec

**Status:** Locked (2026-09-23)  
**Scope:** Two-scale type system for CleanPlate. Public font tokens + `Typography` styles only.  
**Source:** Major Third (1.250) analysis, option B (UI 4px grid + display Major Third above 24px), brainstorming 2026-09-23.  
**Plan:** `docs/superpowers/plans/2026-09-23-typography-type-scale.md`

---

## 1. Summary

`Typography` today is a single 60 / 50 / 40 / 30 / 24 / 18 / 16 / 14 ladder with `line-height: 1` on headings. Adjacent heading steps are not distinct roles, and 50–60px is unused by real UI (Modal / Drawer / PageHeader already override titles down).

This change splits type into two scales that meet at **24px**:

- **UI text (≤24px):** 4px steps, plus **14px** as the one compact exception already used by small Button, form labels, and `small`.
- **Display (>24px):** Major Third from 24, snapped to the 4px/8px grid: 32 / 40 / 48. No 60px default.

`variant` names and HTML tags do not change. `h4`–`h6` stay for semantics; they reuse UI sizes instead of inventing more steps.

---

## 2. Goals and non-goals

### In scope

- Public `--cp-font-size-*`, `--cp-font-leading-*`, `--cp-font-tracking-*`, `--cp-font-weight-*` tokens on `:root` in `tokens.css` and `reset.scss`.
- Remap `Typography` variants to those tokens (size, line-height, weight, letter-spacing).
- Keep existing `TypographyVariant` and public classes (`cp-typography--h1` … `--small`).
- Docs: `docs/Typography.md`, Storybook typography docs, `llms.txt` (two-scale rule), `CHANGELOG.md`, `docs/MIGRATION-v1.md`.
- Tests: token presence; Typography computed size / weight / leading per variant.

### Out of scope

| Item | Notes |
|------|--------|
| New `variant` values (`display`, `title`, `caption`) | Rejected; keep `h1`–`h6` / `p` / `span` / `small` |
| Cap default `h1` at 40px | Rejected; `h1` is 48px. 40px ships as `--cp-font-size-3xl` for overrides |
| Changing `--font-size` (16px) or body `line-height: 1` in `reset.scss` | Document root stays; Typography owns its own leading |
| Retokenizing other components | Badge 13px, Avatar 13px, Modal 18px, Button 14/16, form helpers stay until later PRs |
| Fluid / viewport-scaled type | Not in this pass |
| New font family | Inter and `--font-family` unchanged |

---

## 3. Token palette

Define on `:root` in `reset.scss` and `tokens.css`. `--font-size: 16px` remains the document/body token. `--cp-font-size-md` equals `16px` (same value; do not make it `var(--font-size)` if that would hide the scale in the tokens file — both are `16px`).

### Size

| Token | Value | Band |
|---|---|---|
| `--cp-font-size-xs` | 12px | UI |
| `--cp-font-size-sm` | 14px | UI (2px exception) |
| `--cp-font-size-md` | 16px | UI |
| `--cp-font-size-lg` | 20px | UI |
| `--cp-font-size-xl` | 24px | UI / join |
| `--cp-font-size-2xl` | 32px | Display (24 × 1.25 → 30 → 32) |
| `--cp-font-size-3xl` | 40px | Display (32 × 1.25). No default variant |
| `--cp-font-size-4xl` | 48px | Display (40 × 1.25 → 50 → 48) |

No `--cp-font-size` step at 60px, 50px, 30px, or 18px.

### Line-height

| Token | Value | Pairs with |
|---|---|---|
| `--cp-font-leading-xs` | 16px | 12 |
| `--cp-font-leading-sm` | 20px | 14 |
| `--cp-font-leading-md` | 24px | 16 |
| `--cp-font-leading-lg` | 28px | 20 |
| `--cp-font-leading-xl` | 32px | 24 |
| `--cp-font-leading-2xl` | 40px | 32 |
| `--cp-font-leading-3xl` | 48px | 40 |
| `--cp-font-leading-4xl` | 56px | 48 |

### Tracking

| Token | Value | Use |
|---|---|---|
| `--cp-font-tracking-display` | -0.03em | 48px (`h1`) |
| `--cp-font-tracking-title` | -0.02em | 32–40px (`h2`, and 3xl overrides) |
| `--cp-font-tracking-heading` | -0.015em | 24px (`h3`) |
| `--cp-font-tracking-ui` | 0 | 16–20px (`h4`, `h5`, `p`, `span`) |
| `--cp-font-tracking-caption` | 0.01em | 12–14px (`h6`, `small`) |

### Weight

| Token | Value | Use |
|---|---|---|
| `--cp-font-weight-regular` | 400 | `p`, `span`, `small` |
| `--cp-font-weight-medium` | 600 | `h4`, `h5`, `h6` |
| `--cp-font-weight-bold` | 700 | `h1`, `h2`, `h3`; `isBold` |

Consumers may override these after importing `cleanplate/dist/index.css`. Typography SCSS uses only these variables (no raw `px` / unitless `line-height: 1` on variants).

---

## 4. Variant mapping

No TypeScript API change.

| `variant` | Element | Size | Leading | Weight | Tracking |
|---|---|---|---|---|---|
| `h1` | `h1` | 4xl (48) | 4xl (56) | bold | display |
| `h2` | `h2` | 2xl (32) | 2xl (40) | bold | title |
| `h3` | `h3` | xl (24) | xl (32) | bold | heading |
| `h4` | `h4` | lg (20) | lg (28) | medium | ui |
| `h5` | `h5` | md (16) | md (24) | medium | ui |
| `h6` | `h6` | sm (14) | sm (20) | medium | caption |
| `p` (default) | `p` | md (16) | md (24) | regular | ui |
| `span` | `span` | md (16) | md (24) | regular | ui |
| `small` | `small` | xs (12) | xs (16) | regular | caption |

`isBold` sets `font-weight: var(--cp-font-weight-bold)` on any variant and does not change size or tracking.

`--cp-font-size-3xl` / `--cp-font-leading-3xl` have no default variant. Products that want a 40px title override `h1` or `h2` with those tokens (or a local class). Do not add a `variant` for it in this pass.

Default (no `variant`) remains `<p>` at `md`.

---

## 5. Markup and prototype

Root tags, public classes, `margin` / `align` / `wordBreak` / `isBold`, and `data-cp` emission stay as they are. HTML recipes that only set `variant` keep converting; computed sizes change.

Kit (`docs/html/kit.html`) and Storybook playground pick up the new sizes from CSS. No recipe markup change required unless a fixture asserts pixel sizes.

---

## 6. Docs and tests

**Docs**

- `docs/Typography.md`: add a type-scale table (variant → size / leading / weight / tracking) and a short “two scales” note (UI 12–24, display 32–48).
- Storybook typography docs: same table; show all variants on one sample string.
- `llms.txt` Typography guideline: prefer `variant` for hierarchy; sizes come from the two-scale tokens; do not invent inline `fontSize`.
- `CHANGELOG.md` Unreleased → Breaking: heading remap (60/50/40/30/24/18 → 48/32/24/20/16/14), `small` 14→12, heading line-heights no longer 1.
- `docs/MIGRATION-v1.md`: table of old vs new pixel sizes; note that `h1`–`h6` class names are unchanged.

**Unit / token tests**

- `src/test/tokens-css.test.ts`: assert each `--cp-font-size-*`, `--cp-font-leading-*`, `--cp-font-tracking-*`, and `--cp-font-weight-*` value listed above.
- `Typography` tests: keep public-class checks; add computed-style assertions for the nine variants (font-size, line-height, font-weight, letter-spacing). `isBold` on `p` → weight 700.

**Visual**

- Typography playground / kit row will reflow. Regenerate visual snapshots as accepted fallout of the remap, not as a composite restyle.

---

## 7. Breaking changes

Visual only. No prop or class rename.

| Variant | Before | After |
|---|---|---|
| `h1` | 60px / 60px / normal | 48px / 56px / 700 / -0.03em |
| `h2` | 50px / 50px / normal | 32px / 40px / 700 / -0.02em |
| `h3` | 40px / 40px / normal | 24px / 32px / 700 / -0.015em |
| `h4` | 30px / 30px / normal | 20px / 28px / 600 |
| `h5` | 24px / 24px / normal | 16px / 24px / 600 |
| `h6` | 18px / 18px / normal | 14px / 20px / 600 |
| `p` / `span` | 16px / 24px / normal | 16px / 24px / 400 |
| `small` | 14px / 20px / normal | 12px / 16px / 400 |

Apps that used `h1`/`h2` as page chrome will get smaller, better-leaded titles. Apps that used `h5` as a “section heading” now get body-sized semibold (use `h3` or `h4` for 24/20). Apps that used `small` at 14px should switch to `h6` or a local 14px style if they need the old size.
