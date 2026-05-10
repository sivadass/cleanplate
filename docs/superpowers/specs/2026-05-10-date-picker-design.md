# Date picker (`Date` form control) — design spec

**Status:** Approved (chat sign-off 2026-05-10)  
**Scope:** Replace existing three-`Select` `Date` field with calendar date picker per product requirements.  
**Stack:** React 18+, `date-fns` (granular imports), `@floating-ui/react` (already in package).

---

## 1. Summary

The public **`Date`** export from form controls becomes a **calendar-based date picker**: read-only trigger field, floating **popover** on desktop and **bottom sheet** on mobile (same breakpoint and shell pattern as `Select.tsx`), **Cancel / OK** staged commit, full constraint props, and accessibility per the requirements document. This is a **breaking API** change from the previous day/month/year string model.

---

## 2. Goals and non-goals

**In scope** (aligned with `datepicker-requirements.md` and wireframe):

- Single date selection; **staging** in the panel; **OK** commits (fires `onChange`, updates display); **Cancel** / Escape / outside dismiss / overlay tap **revert** to last committed value only.
- Month grid (7 columns, configurable `weekStartsOn`); **today** distinct from **selected**; **outside-month** cells visible, dimmed; click outside-month **navigates** to that month and **stages** that date.
- Month and year **chevrons** plus **dropdown** subviews; navigation **clamped** by `minDate` / `maxDate`.
- Constraints: `minDate`, `maxDate`, `disabledDates`, `disabledDaysOfWeek`.
- Locale via `date-fns` `Locale` and `weekStartsOn`.
- Keyboard and ARIA (`grid` / `gridcell`, `aria-selected`, `aria-disabled`, trigger `aria-expanded` / `aria-controls`, focus restoration on close).
- Responsive: desktop popover (**280px** width, flip/shift, 8px viewport padding); mobile sheet (rounded top corners, dim overlay, no swipe-dismiss), body scroll lock while open.

**Explicitly out of scope** for this component (unchanged from requirements):

- Range / dual calendar, time picker, typed free-form parsing, timezone UI, gestures, inline-only calendar embedding.

---

## 3. Breaking changes

Previous behaviour:

- Three `Select` fields; `onChange` emitted **`dd-mm-yyyy`** string; `defaultValue` used `"--"` split pattern.

New behaviour:

- `value` / `defaultValue`: **`Date | null`** (calendar date in **local** timezone; comparisons use **local calendar midnight** consistently — document in implementation and JSDoc).
- `onChange`: **`(date: Date | null) => void`**.
- Clearing via trigger **commits `null` immediately** (closes panel if open).

**Migration:** Consumers must replace string state with `Date` (or derive strings at form submit). Optionally use hidden `name` field (see below) for native forms.

---

## 4. Architecture (Approach 2)

**Facade + module folder** — keeps a single public **`Date`** / **`DateProps`** while splitting implementation for testability and maintainability.

| Area | Responsibility |
|------|----------------|
| `form-controls/Date.tsx` | Public API, field chrome (label, error, `isFluid`, `dataTestId`, ids), wires shell + panel. |
| `form-controls/date/calendar-matrix.ts` | Builds visible calendar cells / weeks using `date-fns` granular imports only. |
| `form-controls/date/date-constraints.ts` | `isDisabled`, nav bounds, weekday / blackout rules vs `min`/`max`. |
| `form-controls/date/use-date-picker-state.ts` | `open`, committed vs staged value, view mode (`calendar` \| `month` \| `year`), actions. |
| `form-controls/date/DatePickerPanel.tsx` | Header, grid, footer **Cancel** / **OK**. |
| `form-controls/date/MonthDropdownView.tsx` | Scrollable month list; clamp to allowed months. |
| `form-controls/date/YearDropdownView.tsx` | Scrollable year list; clamp to allowed years. |

Optional later extractions if files grow: shared **`ScrollPickerList`**; shared **responsive shell** hook extracted from duplication with `Select` (only if duplication hurts — not required in first PR).

---

## 5. Tree-shaking notes

- **Runtime:** Always import **`date-fns`** as **named submodule imports** (e.g. `import { format } from 'date-fns/format'` or equivalent tree-shake-friendly entry — follow project ESLint / bundler conventions).
- **Package layout:** The published library currently uses a **single Rollup entry** (`src/index.js`) that imports `FormControls`; consumers importing the main entry may still include form controls as a group. **True** “only pay for Date” at app level may require a **future** `package.json` **`exports`** subpath (out of scope for this design unless explicitly added in the same effort). This spec still requires **no unnecessary eager imports** inside the date module.

---

## 6. Responsive shell (mirror `Select`)

- **Breakpoint:** `(max-width: 768px)` matches `Select.tsx` (`SELECT_MOBILE_SHEET_MEDIA`).
- **Desktop:** `FloatingPortal` + `useFloating` with `offset`, `flip`, `shift`; popover **width 280px** (not input width); `placement` overridable via prop (default `bottom-start`); `autoUpdate` while open.
- **Mobile:** Fixed bottom sheet, dim backdrop, `translateY` enter/exit, `transitionend` + timeout fallback, **`document.body.style.overflow = 'hidden'`** while open (same rationale as Select).
- **Dismiss:** Outside press / overlay tap behave as **Cancel** (discard staged).

SCSS timings and z-index should **reuse or align with** `--cp-select-*` tokens / class patterns in `FormControls.module.scss` to avoid visual regressions and drift.

---

## 7. Behaviour details

- **Opening:** Copies **committed → staged**. If no committed value, stage **today** clamped into allowed range, or first allowed day of **`displayedMonth`** if today invalid (implementation picks one deterministic rule — prefer **clamp today**, else **first enabled day of month** visible).
- **OK:** Applies staged → committed; `onChange(committed)`; close; restore focus per a11y section.
- **Cancel / Escape / outside dismiss:** Discard staged; close; no `onChange` unless clearing was instantaneous (clear is separate).
- **Clear:** **Instant** commit `null`, `onChange(null)`, close if open.
- **Disabled:** No open when `isDisabled`; nav controls and dropdown options respect disabled state for out-of-range or invalid targets.
- **Hidden input:** If `name` is provided, render `<input type="hidden" name={name}>` with value **`YYYY-MM-DD`** when committed value exists, otherwise empty string.

---

## 8. Accessibility

- Trigger: **`aria-expanded`**, **`aria-controls`** referencing panel id; labelled via `label` + `id` pattern consistent with form controls.
- Mobile sheet container: **`role="dialog"`**, **`aria-modal="true"`**; desktop popover remains focusable-managed surface (exact `role` may be `dialog` or documented pattern consistent with axe rules — implementation verifies with axe in Storybook or CI when available).
- Grid: **`role="grid"`**, cells **`role="gridcell"`**; **`aria-selected`** on selection; **`tabIndex={-1}`** vs roving tabindex strategy as implemented; **disabled** cells **`aria-disabled="true"`** and not in tab order.
- **Today** vs **selected**: not color-only (e.g. subtle ring or textual “today” available to SR via `aria-label` on cell).
- **Focus:** On open, move focus into panel; on close return focus to trigger. **Tab** cycles within the picker while open (**lightweight in-house Tab loop** first; introduce `focus-trap-react` only if manual handling fails review or tests).

Keyboard behaviour matches requirements doc:

| Key | Behaviour |
|-----|-----------|
| Tab / Shift+Tab | Cycle within open picker (within surface only while open). |
| Enter / Space on trigger | Open picker. |
| Arrows | Move between enabled days / within grid semantics. |
| Enter / Space on day | Stage date. |
| Page Up / Down | Previous / next month. |
| Home / End | First / last day of **currently displayed** month (enabled handling if some days disabled). |
| Escape | Cancel and close |

---

## 9. Props (public API)

Compatible with refined requirements (`datepicker-requirements.md`) with naming aligned to existing form controls where useful:

| Prop | Type | Notes |
|------|------|--------|
| `value` | `Date \| null` | Controlled. |
| `defaultValue` | `Date \| null` | Uncontrolled initial. |
| `onChange` | `(date: Date \| null) => void` | Fires on **OK** or **instant clear**. |
| `placeholder` | `string` | Default `Select date`. |
| `dateFormat` | `string` | Default `MMM dd, yyyy`; use `date-fns` `format`. |
| `id`, `name` | `string` | `name` enables hidden ISO field. |
| `minDate`, `maxDate` | `Date` | Inclusive bounds on calendar dates. |
| `disabledDates` | `Date[]` | Normalized to date-only compare. |
| `disabledDaysOfWeek` | `number[]` | `0` Sun … `6` Sat. |
| `locale` | `Locale` | `date-fns` locale. |
| `weekStartsOn` | `0 \| … \| 6` | Default `0`. |
| `clearable` | `boolean` | Default `true`. |
| `disabled` | `boolean` | Align prop name with other controls (`isDisabled` deprecated alias optional — **YAGNI**: use `disabled` only if we standardize; else keep `isDisabled` for consistency with `Select` — **decision: keep `isDisabled`** to match existing `Date.tsx` and `Select.tsx` until a global rename). |
| `readOnly` | `boolean` | Per requirements. |
| `label`, `error` | `string` | Match existing field patterns. |
| `isFluid`, `dataTestId`, `isRequired` | | Preserve from current `Date`. |
| `popoverPlacement` | `Placement` | `@floating-ui/react`. |
| `onOpen`, `onClose` | `() => void` | |

**Note:** Requirements used `disabled`; existing components use **`isDisabled`**. This spec **standardizes on `isDisabled`** for continuity with `Select` / prior `Date` until a library-wide rename.

---

## 10. Testing (TDD)

**Tooling:** Add **Vitest**, **@testing-library/react**, **jsdom** (+ any minimal config for TSX path aliases).

**Order:**

1. **Unit:** `calendar-matrix.ts`, `date-constraints.ts` — edge cases (leap years, DST boundaries treated as local date-only, boundary min/max months, weekdays).
2. **Hook / state:** `use-date-picker-state` — open/close, commit/cancel, month/year navigation clamps, staged vs committed.
3. **RTL:** OK vs Cancel vs outside-click vs Escape; disabled day interaction; clear button commits `null`; optional snapshot of header rendering.

Stories (Storybook): desktop vs mobile layouts, constrained DOB scenario, weekday blackout — scheduled after core tests pass.

---

## 11. Dependencies

| Package | Role |
|---------|------|
| `date-fns` | **New** dependency — formatting, arithmetic, locale. |
| `@floating-ui/react` | Existing — positioning. |

No headless UI library.

---

## 12. Files to touch (implementation preview)

- Replace `src/components/form-controls/Date.tsx`.
- Add `src/components/form-controls/date/*` as above.
- Extend `FormControls.module.scss` for date picker (tokens aligned with select sheet/dropdown).
- `package.json` — add `date-fns`, test deps, `test` script.
- Storybook stories under existing form-controls stories pattern.
- **Changelog / migration note** for breaking `Date` API (where the project publishes changes).

---

## 13. Self-review checklist (pre-implementation)

- [x] No unresolved “TBD” in behaviour: focus strategy starts in-house Tab loop; clamp rule for empty-open documented in §7.
- [x] `isDisabled` vs `disabled` contradiction resolved (**use `isDisabled`**).
- [x] Timezone stance: **local calendar date only** for v1.
- [x] Scope fits one implementation plan with optional follow-up for `package.json` exports.

---

## 14. References

- Product requirements (authoritative checklist): companion doc `datepicker-requirements.md` (user-provided).
- Visual: wireframe `assets/Screenshot_2026-05-10_at_3.54.33_PM-29e15a23-18c8-40cb-a7e3-2941980c2d4a.png`.
- Behavioural reference: `src/components/form-controls/Select.tsx` (responsive shell).
