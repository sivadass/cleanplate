# SegmentedControl — design spec

**Status:** Approved (2026-08-06)  
**Scope:** Ship `FormControls.SegmentedControl` — single-select segmented form control for CleanPlate v1.  
**Source requirements:** [Apple HIG — Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls), [Material 3 — Segmented buttons](https://m3.material.io/components/segmented-buttons/overview), adapted to CleanPlate FormControls conventions and brainstorming decisions (2026-08-06).

---

## 1. Summary

`FormControls.SegmentedControl` is a compact, horizontal, single-select control for a small set of closely related, mutually exclusive options. It is a **form primitive** (label, validation, `name`, controlled/uncontrolled value) — not app navigation.

**v1 is single-select only.** Multi-select (M3 / macOS select-any), momentary/action segments, and vertical orientation are deferred.

**Implementation approach:** Mirror `FormControls.Radio` — `<fieldset>` + `<legend>`, visually hidden native `<input type="radio">` per segment, options array API. Contiguous equal-width segment chrome lives in `FormControls.module.scss` (Stepper-like shared shell, not MenuList pills).

---

## 2. Goals and non-goals

### In scope (v1)

- Namespace export: `FormControls.SegmentedControl`.
- Flat props + non-empty `options` array (FormControls convention).
- Single-select: `value` / `defaultValue` / `onChange(value, e)`.
- Segment content: visible `label` and/or `icon`; icon-only requires `ariaLabel`.
- `size`: `"small" | "medium"` (default `"medium"`).
- Always equal-width segments; `isFluid` stretches the whole control.
- No click-to-deselect (selecting another segment is the only way to change value after first selection).
- Common FormControls field props: `name`, `label`, `isDisabled`, `isRequired`, `error`, `margin`, `className`, `dataTestId`.
- Per-option `isDisabled`, `dataTestId`, `id`.
- Unit tests, Storybook playground stories, updates to `docs/FormControls.md` and `llms.txt`.

### Out of scope (v1)

| Item | Notes |
|------|--------|
| Multi-select | Use `FormControls.Checkbox`; M3 multi deferred |
| Momentary / action segments | Not form selection state |
| Vertical orientation | Horizontal only |
| Compound `.Item` API | Flat `options[]` only |
| Content-sized / unequal widths | Always `flex: 1` |
| Click-to-deselect / empty via UI | Controlled unset only if consumer clears `value` |
| Option `description` | Too cramped; use Radio |
| Card / outline visual variants | One contiguous shell style |
| Navigation / tabs | Use `MenuList` |

### Relationship to existing components

| Component | Use when |
|-----------|----------|
| `FormControls.SegmentedControl` | Compact single choice among 2–5 closely related options (mode, density, Day/Week/Month) |
| `FormControls.Radio` | Options need descriptions, card tiles, or vertical list layout |
| `FormControls.Checkbox` | Multi-select |
| `MenuList` | Tab-like app / section navigation (not a form field) |
| `Button` | Discrete actions, not exclusive selection state |

---

## 3. API

### Component signature

```tsx
import { FormControls, Icon } from "cleanplate";

const [view, setView] = useState("week");

<FormControls.SegmentedControl
  label="Calendar view"
  name="view"
  value={view}
  onChange={(v) => setView(String(v))}
  isRequired
  isFluid
  size="medium"
  dataTestId="calendar-view"
  options={[
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ]}
/>

{/* Icon + label */}
<FormControls.SegmentedControl
  label="Density"
  name="density"
  defaultValue="comfortable"
  size="small"
  options={[
    { label: "Compact", value: "compact", icon: <Icon name="view_headline" /> },
    { label: "Comfortable", value: "comfortable", icon: <Icon name="view_agenda" /> },
  ]}
/>

{/* Icon-only — ariaLabel required */}
<FormControls.SegmentedControl
  label="Alignment"
  name="align"
  defaultValue="left"
  options={[
    { value: "left", icon: <Icon name="format_align_left" />, ariaLabel: "Align left" },
    { value: "center", icon: <Icon name="format_align_center" />, ariaLabel: "Align center" },
    { value: "right", icon: <Icon name="format_align_right" />, ariaLabel: "Align right" },
  ]}
/>
```

### Props table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | non-empty `SegmentedControlOption[]` | Yes | — | Segments; recommend 2–5 in docs |
| `name` | `string` | Yes | — | Shared radio `name` (form submit + grouping) |
| `label` | `string` | Yes | — | Group label in `<legend>` |
| `id` | `string` | No | derived | Stable id base for legend / options / error |
| `value` | `SegmentedControlValue` | No | — | Controlled selected value |
| `defaultValue` | `SegmentedControlValue` | No | — | Uncontrolled initial value |
| `onChange` | `(value, e) => void` | No | — | Fires with next value and change event |
| `size` | `"small" \| "medium"` | No | `"medium"` | Track height / padding density |
| `isDisabled` | `boolean` | No | `false` | Disable entire group (`fieldset disabled`) |
| `isRequired` | `boolean` | No | `false` | `*` on legend; `required` on first enabled option |
| `isFluid` | `boolean` | No | `false` | Full-width field; segments stay equal-width |
| `error` | `string` | No | `""` | Validation message under control |
| `margin` | `FormFieldMargin` | No | `"b-4"` | Spacing suffix API |
| `className` | `string` | No | `""` | Merged on fieldset root |
| `dataTestId` | `string` | No | — | Root `data-testid` + Radio-style suffixes |

Not exposed in v1: `style`, `orientation`, `variant`, `selectionMode`, compound children, `equalWidth` (always equal).

### Types

```ts
type SegmentedControlValue = string | number;
type SegmentedControlSize = "small" | "medium";

interface SegmentedControlOption {
  /** Visible text. Omit for icon-only (then `ariaLabel` is required). */
  label?: string;
  /** Submitted / selected value. */
  value: SegmentedControlValue;
  /** Optional leading visual (`Icon`, SVG, etc.). */
  icon?: React.ReactNode;
  /**
   * Accessible name. Required when there is no visible `label` (icon-only).
   * When both `label` and `ariaLabel` are set, prefer exposing `label` visually
   * and use `ariaLabel` only if it must override the accessible name.
   */
  ariaLabel?: string;
  /** Disable just this segment (group `isDisabled` overrides). */
  isDisabled?: boolean;
  /** Overrides group-derived `-input-{value}` test id on the native input. */
  dataTestId?: string;
  /** Explicit id for this option's input. */
  id?: string;
}

interface SegmentedControlProps {
  options: [SegmentedControlOption, ...SegmentedControlOption[]];
  name: string;
  label: string;
  id?: string;
  value?: SegmentedControlValue;
  defaultValue?: SegmentedControlValue;
  onChange?: (
    value: SegmentedControlValue,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  size?: SegmentedControlSize;
  isDisabled?: boolean;
  isRequired?: boolean;
  isFluid?: boolean;
  error?: string;
  margin?: FormFieldMargin;
  className?: string;
  dataTestId?: string;
}
```

---

## 4. Behavior

### Controlled / uncontrolled

- Controlled when `value !== undefined`; otherwise internal state seeded by `defaultValue` (same as Radio).
- `onChange` always receives the newly selected option’s `value` and the native change event.

### Selection rules

- Exactly one segment may be selected at a time (native radio group).
- Re-clicking / re-activating the already selected segment does **not** clear selection.
- Empty selection is only possible if the consumer never sets a value / clears controlled `value`; the UI does not offer deselect.

### Required

- Render `*` on the legend when `isRequired`.
- Set `required` and `aria-required` on the **first enabled** option (HTML5 radio group validation pattern used by Radio).
- Set `aria-required` on the radiogroup container when `isRequired`.

### Disabled

- Group: `fieldset disabled={isDisabled}` plus per-input `disabled`.
- Option: `isDisabled` on that option only.

### Icon-only accessibility

- When an option has no visible `label`, the native input **must** get an accessible name via `ariaLabel` (document as required for icon-only).
- Icons in the visual segment are `aria-hidden` when a text name is provided separately.

---

## 5. Visual design

### Chrome

- Single horizontal track with shared border and `border-radius: var(--cp-form-control-radius)`.
- Segments flush; internal hairline dividers between segments (Stepper-like contiguous shell).
- **Not** MenuList-style separate pills.

### Layout

- Each segment `flex: 1` (always equal width).
- Default field max-width follows other FormControls unless `isFluid` (then full width).
- Content inside a segment: optional icon then optional label, centered, truncating gracefully if needed.

### States

| State | Treatment |
|-------|-----------|
| Selected | `--primary-brand` fill; high-contrast label/icon (selected ≠ color alone) |
| Hover (unselected, enabled) | Subtle `--primary-brand-lightest` or gray fill |
| Focus-visible | `outline: 2px solid var(--primary-brand); outline-offset: 2px` on the focused segment |
| Disabled | ~0.45 opacity, `cursor: not-allowed` |
| Error | `data-invalid="true"` on fieldset; red border/outline; error text under control |

### Sizes

| Size | Intent |
|------|--------|
| `medium` | Align with form control height (~50px track) |
| `small` | Tighter padding/font for toolbars / dense UI |

### Tokens

Use existing design tokens only — no new public `--cp-segmented-*` layer in v1:

- `--cp-form-control-radius`
- `--primary-brand`, `--primary-brand-lightest`
- `--gray-*` borders
- `--text-default` / inverse-on-brand for selected text
- `--red` for invalid

---

## 6. Accessibility

- Root: `<fieldset>` with `<legend>` for the group label.
- Options container: `role="radiogroup"`, `aria-labelledby` → legend id.
- One visually hidden native radio per segment; visible chrome is the associated `<label>`.
- Keyboard: native radio group behavior (arrow keys, Space/Enter via platform).
- `aria-invalid` / `aria-describedby` for errors (fieldset + inputs as in Radio).
- Error message: `role="alert"`, stable `{fieldId}-error` id.
- Focus indicator must be visible on keyboard focus (see Visual design).

---

## 7. E2E / test selectors

Same suffix scheme as Checkbox / Radio. Pass `dataTestId="calendar-view"`:

| Suffix | Element |
|--------|---------|
| *(root)* | `<fieldset>` |
| `-options` | Options / track container (`role="radiogroup"`) |
| `-option-{value}` | Segment row wrapper |
| `-input-{value}` | Native `<input type="radio">` |
| `-label-{value}` | Clickable label (preferred for Playwright clicks) |
| `-error` | Error message when `error` is set |

`{value}` key: non-alphanumeric characters become `-` (same `toKey` helper as Radio).

Per-option `dataTestId` overrides only that option’s `-input-{value}` id.

---

## 8. Documentation guidance (HIG / M3 aligned)

Public docs (`docs/FormControls.md`, `llms.txt`, Storybook) must state:

- Prefer **2–5** segments; more options → Radio, Select, or another pattern.
- Keep content type consistent within one control (prefer all text, all icons, or all icon+label — avoid mixing icon-only with long text labels in the same control).
- Prefer nouns / noun phrases for labels.
- Do **not** use SegmentedControl for top-level app navigation — use **MenuList**.
- Distinguish clearly from Radio (descriptions / cards) and Checkbox (multi-select).

---

## 9. Files & packaging

| Path | Role |
|------|------|
| `src/components/form-controls/SegmentedControl.tsx` | Component + exported types |
| `src/components/form-controls/SegmentedControl.test.tsx` | Vitest + Testing Library |
| `src/components/form-controls/FormControls.module.scss` | `.cp-segmented-control-field` styles |
| `src/components/form-controls/index.ts` | Namespace + named + type exports |
| `src/stories/form-controls/form-controls.stories.tsx` | Playground stories |
| `src/stories/form-controls/form-controls.docs.mdx` | Storybook docs (if present) |
| `docs/FormControls.md` | Public consumer / LLM doc |
| `llms.txt` | Index entry + MenuList distinction |
| `CHANGELOG.md` | Unreleased note |

FormControls are consumed via the existing `FormControls` namespace from `src/index.js` — no new top-level package export beyond adding the member to the namespace object.

---

## 10. Guideline → capability map

| Guideline theme | v1 capability |
|-----------------|---------------|
| HIG / M3 mutually exclusive choice | Single-select native radios |
| Equal / balanced segments | Always `flex: 1` |
| Text and/or icons | `label` / `icon` / `ariaLabel` |
| Limit segment count | Docs guidance (2–5), not hardcoded |
| Not for top-level nav | Docs → MenuList |
| Selected ≠ color alone | Brand fill + contrast text/icon |
| Clear focus / targets | Focus ring; medium/small heights |
| M3 multi-select | Explicitly out of v1 |

---

## 11. Open follow-ups (post-v1)

- `selectionMode="multiple"` if product demand emerges (or keep multi on Checkbox).
- Momentary / toolbar action segments.
- Vertical segmented track.
- Soft runtime warning in development when icon-only option lacks `ariaLabel`.
