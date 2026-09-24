# Small field label size — design spec

**Status:** Approved (2026-09-24)
**Scope:** On `size="small"` form controls, field labels are 12px and trigger icons are 20px. Medium and large labels stay 16px. Medium icons stay 20px; large icons stay 24px. Multi-select chip remove icons are white on the green chip. The selected-option check is centered in its circle.
**Source:** Brainstorming 2026-09-24. Label size: `--cp-font-size-xs`. Icon size: `--cp-form-control-icon` at 20px on small. Both are size tokens on the field.

---

## 1. Summary

`.cp-form-label` inherits 16px from `.cp-form-field`. Small controls already set their value text to 14px, so the label reads heavier than the control. Small labels become 12px. The value inside a small control stays 14px.

Select chevron, date `calendar_month`, color-picker palette, search, stepper ±, and the file button icon are `Icon` with no `size`, so they render at `cp-icon--medium` (24px). Clear glyphs on those triggers use `size="small"` (16px). The small field token `--cp-form-control-icon` is 16px, and it does not reliably win over `.cp-icon.cp-icon--medium`. On small fields those trigger icons become 20px.

**Implementation approach:** `--cp-form-label-font` on the field size classes, consumed by `.cp-form-label`. Small `--cp-form-control-icon` becomes 20px, and trigger-icon rules win over `.cp-icon--medium` / `.cp-icon--small`.

---

## 2. Goals and non-goals

### In scope

- `--cp-form-label-font` on `.cp-form-field`, `.cp-form-field--small`, `.cp-form-field--medium`, and `.cp-form-field--large`.
- `.cp-form-label` sets `font-size: var(--cp-form-label-font, var(--font-size))`.
- Small: `var(--cp-font-size-xs)` (12px). Default, medium, and large: `var(--font-size)` (16px).
- Segmented control legends, which use `.cp-form-label`, follow the same token.
- Filter bar button spacer (`.cp-filter-bar__button-label`) uses the same font size and line height as a small field label, so the Filters button stays aligned with small fields.
- Small `--cp-form-control-icon` changes from 16px to 20px. Medium stays 20px. Large stays 24px.
- Trigger glyphs that follow that token render at 20px on small: select chevron, date `calendar_month`, color-picker palette, search icon, search clear, stepper ±, file **button** icon, and clear buttons on select, date, and color-picker triggers.
- Those rules beat `Icon`’s own size class (`.cp-icon.cp-icon--medium` is 24px; clear icons use `.cp-icon--small` at 16px).
- `docs/FormControls.md` sizes section: small labels are 12px; medium and large stay 16px. Glyph scale is 20 / 20 / 24.
- Multi-select chip remove icon is white on the green chip, and green on white when the remove button is hovered.
- Selected-option `done` icon is centered inside its 22px circle.

### Out of scope

| Item | Notes |
|------|--------|
| Medium and large label size | Stay 16px |
| Control value type | Small stays 14px (`--cp-form-control-font`) |
| Segment option text | `.cp-segmented-control-segment` keeps `font-size: var(--cp-form-control-font)` |
| Checkbox / radio option labels | `.cp-form-label-inline` keeps `font-size: inherit` |
| Color-picker channel labels | Already 12px on `.cp-color-picker-channel-field .cp-form-label` |
| Error message, hint, and description type | Unchanged |
| Label color, weight, and margin | Unchanged. Do not set a new line-height on `.cp-form-label` |
| Medium and large icon size | Stay 20px and 24px |
| Panel and option icons | Date picker header, panel back arrows, select option icons, file list icons, and the file **card** upload glyph stay as they are |
| `Icon` public sizes | `small` / `medium` / `large` stay 16 / 24 / 36. 20px is the form-control token only |

---

## 3. Behavior

| Field size | Label | Control value | Trigger icon |
| --- | --- | --- | --- |
| `small` | 12px (`--cp-font-size-xs`) | 14px | 20px |
| `medium` (default) | 16px (`--font-size`) | 16px | 20px |
| `large` | 16px (`--font-size`) | 16px | 24px |

The color-picker trigger swatch uses `--cp-form-control-icon` for width and height, so a small swatch becomes 20px with the palette icon.

`.cp-form-label-inline` is declared after `.cp-form-label` and sets its own `font-size`, so option labels do not pick up the token. Segment text is more specific than `.cp-form-label` and keeps the control font.

The filter bar spacer today is 14px with `line-height: 1.5`. Field labels inherit `line-height: 1` from `body`. After this change the spacer is `font-size: var(--cp-font-size-xs)` and `line-height: 1`, matching the small label’s text box. `margin-bottom` stays `var(--space-2)`.

### Chip remove icon

`.cp-select-chip` is `--primary-brand` with white text. The remove control passes `<Icon color="gray" />`. `.cp-icon.cp-icon--gray` (two classes) beats `.cp-select-chip-remove > span`, so the close glyph stays gray on green. Hover, which sets the span to `--primary-brand`, loses the same way.

Stop passing `color="gray"`. Color the glyph from `.cp-select-chip-remove .cp-icon` with a selector that beats `.cp-icon--*`: `var(--white)` at rest, `var(--primary-brand)` on hover. Chip fill, size, and hit target stay as they are.

### Selected-option check

The `done` icon uses the default Icon size (`cp-icon--medium`, 24px) and also `.cp-select-field-option-selected` (22×22 circle, `font-size: 16px`, `line-height: 20px`, `text-align: center`). The 24px size class ties or wins, so the glyph is larger than the circle and sits off-center.

Keep the 22px green circle and white border. Center the glyph with inline flex (`align-items` and `justify-content: center`), `line-height: 1`, and a `font-size: 16px` rule that beats `.cp-icon.cp-icon--medium`. The check stays white on `--primary-brand`.

---

## 4. Docs

Replace the sentence in `docs/FormControls.md` that says field labels do not scale. State that `.cp-form-label` uses `--cp-form-label-font`: 12px on small, 16px on medium and large. State that trigger glyphs scale 20 / 20 / 24.

---

## 5. Testing

- Existing size tests still expect `cp-form-field--small|medium|large` on the field wrapper.
- No new public prop or class.
- Confirm in Storybook (or the running docs app) that a `size="small"` Input label is 12px and a default Input label is 16px, and that a small Segmented control’s legend is 12px while its segment text stays 14px.
- Confirm a small Select chevron, Date `calendar_month` icon, and ColorPicker palette icon compute to 20px, and that a large control’s trigger icon stays 24px.
- Confirm a multi-select chip close glyph is white on the green chip and `--primary-brand` when the remove button is hovered.
- Confirm a selected option’s `done` glyph is 16px, white, and centered in the 22px circle.
