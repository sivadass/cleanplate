# Button size variants — design spec

**Status:** Approved (2026-09-20)  
**Scope:** Remap `Button` size scale to 32 / 44 / 52, add `large`, and add `prefixIcon` / `suffixIcon`. Primitive only.  
**Source:** Existing Button analysis, size spec (text / icon-only / icon+label), brainstorming 2026-09-20.

---

## 1. Summary

`Button` today has two sizes: `small` (24px) and `medium` (50px default). That gap is too large; several composites already override height with `!important`. This change remaps the primitive to a three-step spec-faithful scale, adds leading/trailing Material Symbol props, and makes `variant="icon"` a **square** at the size height (not a circle).

Form controls stay 50px. In-library composites (Modal, Drawer, Pagination, Pills, FeedbackState, PageHeader) are **not** restyled in this work.

**Implementation approach:** Spec-faithful remap with `--cp-button-*` tokens on `:root` (same override pattern as `--cp-form-control-radius`).

---

## 2. Goals and non-goals

### In scope

- `ButtonSize`: `"small" | "medium" | "large"` (default `"medium"`).
- Visual remap: `small` 24→32, `medium` 50→44, new `large` 52.
- `prefixIcon` / `suffixIcon`: Material Symbol **names**; Button renders `Icon` and owns glyph size.
- Icon-only: square hit area, same radius as the text button of that size.
- `--cp-button-*` tokens for height, type, padding, glyph, gap.
- Loading spinner replaces the prefix slot at the glyph size.
- HTML prototype + html-to-jsx + public classes + docs / Storybook / unit + visual tests.

### Out of scope

| Item | Notes |
|------|--------|
| Form control `size` | Input / Select / Date / Stepper stay a single 50px height |
| Retuning field height to 44 or 52 | Accepted mismatch; use `Button size="large"` beside fields |
| `Icon` public sizes | Stay `small \| medium \| large` (16 / 24 / 36). 20px is Button CSS only |
| Circular icon buttons | `variant="icon"` is square; no `isRound` |
| Composite restyle | Modal / Drawer close hacks, Pills 44px override, FeedbackState `large`→`medium` mapping stay as-is |
| `icon` / `endIcon` names | Rejected; use `prefixIcon` / `suffixIcon` |

---

## 3. Public API

```ts
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  size?: ButtonSize; // default "medium"
  variant?: "solid" | "outline" | "ghost" | "icon";
  prefixIcon?: MaterialIconName;
  suffixIcon?: MaterialIconName;
  // existing: children, isLoading, isDisabled, isFluid, margin, onClick, className, type, ...rest
}
```

### Usage

```jsx
<Button>Save</Button>
<Button size="small">Filters</Button>
<Button size="large">Submit</Button>

<Button prefixIcon="add">Next</Button>
<Button suffixIcon="expand_more">Export</Button>
<Button prefixIcon="add" suffixIcon="expand_more">Create</Button>

<Button variant="icon" prefixIcon="close" aria-label="Close dialog" />
```

`prefixIcon` / `suffixIcon` are decorative (`aria-hidden` on the rendered `Icon`). They inherit the button text color (do not pass `Icon` `color`). Glyph size comes from `--cp-button-icon-*` on the slot, not from `Icon`’s `size` prop. Icon-only buttons must supply an accessible name (`aria-label`).

---

## 4. Metrics

Drop `min-width: 96px` on medium. Width comes from padding + content. Corner radius for **all** sizes (text and icon-only): `var(--cp-form-control-radius)` (drop the 6px small special case).

| | small | medium (default) | large |
|---|---|---|---|
| Height | 32 | 44 | 52 |
| Label | 14px | 16px | 16px |
| Side padding (text only) | 16 | 24 | 32 |
| Glyph | 16 | 20 (Button CSS only) | 24 |
| Gap (icon + label) | 4 | 8 | 8 |
| Padding with prefix | 12 … 16 | 20 … 24 | 24 … 32 |
| Padding with suffix | 16 … 12 | 24 … 20 | 32 … 24 |
| Padding with both | 12 … 12 | 20 … 20 | 24 … 24 |
| Icon-only | 32×32 | 44×44 | 52×52 |

When `isLoading` is true, treat the control as having a prefix (spinner occupies that slot) so padding matches `cp-button--has-prefix`.

---

## 5. Tokens

Define on `:root` in `reset.scss` and `tokens.css`. Button SCSS uses only these variables in size modifiers (no raw pixels).

| Token | small | medium | large |
|---|---|---|---|
| `--cp-button-height-*` | 32px | 44px | 52px |
| `--cp-button-font-*` | 14px | 16px | 16px |
| `--cp-button-pad-x-*` | 16px | 24px | 32px |
| `--cp-button-pad-icon-*` | 12px | 20px | 24px |
| `--cp-button-icon-*` | 16px | 20px | 24px |
| `--cp-button-gap-*` | 4px | 8px | 8px |

Consumers may override these after importing `cleanplate/dist/index.css`.

---

## 6. Markup, loading, prototype

Root remains `<button>`. Size class is always present: `cp-button--small|medium|large`.

Slot classes:

- `cp-button__prefix-icon`, `cp-button__suffix-icon` — Button-owned `font-size` from `--cp-button-icon-*`
- `cp-button--has-prefix`, `cp-button--has-suffix` — padding (explicit classes, not `:has()`, so HTML matches React)
- `cp-button-loader` — existing; sized like the prefix glyph

**Icon-only:** `variant="icon"` + `prefixIcon` + `aria-label`. Padding 0, width = height, square. If `prefixIcon` is set, it is the glyph and `children` are not rendered. If `prefixIcon` is omitted, existing `<Button variant="icon"><Icon name="close" /></Button>` still works.

**Loading:** disable the button; show `progress_activity` in the **prefix slot** (hide `prefixIcon`); keep label and `suffixIcon`. Icon-only: spinner replaces the glyph.

**Prototype:** `emitDataCp` already kebab-cases. Non-defaults emit `data-cp-size`, `data-cp-prefix-icon`, `data-cp-suffix-icon`. Default `medium` is omitted (same as today).

HTML recipe paints icon spans for CSS. The converter maps `data-cp-prefix-icon` / `data-cp-suffix-icon` to props and **strips** `.cp-button__prefix-icon` / `.cp-button__suffix-icon` from children.

```html
<button
  data-cp="Button"
  data-cp-prefix-icon="add"
  class="cp-button cp-button--medium cp-button--has-prefix"
>
  <span class="cp-icon cp-button__prefix-icon" aria-hidden="true">add</span>
  Next
</button>
```

```jsx
<Button prefixIcon="add">Next</Button>
```

Manifest: `size` enum adds `"large"`; add string props `prefixIcon` and `suffixIcon`.

---

## 7. Docs and tests

**Docs:** `docs/Button.md`, Storybook MDX, `llms.txt`. Replace the stale “medium icon = 44px compact padding” note with the square 44×44 medium icon-only behavior. Document `large` and “use `size="large"` next to 50px fields.” HTML prototype recipe for prefix/suffix. Migration note in `docs/MIGRATION-v1.md`: remap 24→32 / 50→44, new `large` 52, new icon props.

**Unit tests:** size classes including `large`; prefix/suffix render + `--has-prefix` / `--has-suffix`; loading replaces prefix; icon-only square (replace the 24px SCSS assertion with 32px for small); prototype omits default size, emits `data-cp-prefix-icon`.

**Converter:** fixture prefix/suffix HTML → props, slot spans stripped; illegal size still fails; `large` allowed.

**Visual:** Button playground — three sizes × text / icon-only / prefix+label / suffix. Composite snapshots will shift because `small`/`medium` remap; regenerate as accepted fallout, not as a restyle pass. Kit row may stay default medium (optional one prefix example).

---

## 8. Breaking changes

| Before | After |
|--------|--------|
| `small` height 24px, radius 6px, type 13px | 32px, form-control radius, 14px |
| `medium` height 50px, min-width 96px | 44px, no min-width |
| `variant="icon"` circle 24 / 50 | square 32 / 44 / 52 |
| No `large` | `large` = 52 |
| Icon-only via `children` only | Prefer `prefixIcon`; children still work if `prefixIcon` omitted |

Apps that aligned buttons to 50px inputs should pass `size="large"` (52px, 2px taller than fields).
