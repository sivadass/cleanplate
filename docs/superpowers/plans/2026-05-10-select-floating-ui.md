# Select rebuild — Frozen requirements & implementation plan

> **Frozen as of:** 2026-05-10  
> **Process:** Implement one numbered phase per session (or PR slice); pause for Storybook review before starting the next. Work stays on the current feature branch.

**Goal:** Replace `Select` with a Floating UI–based control: desktop portalled dropdown with collision-aware positioning; mobile-first bottom sheet for the panel; parity with your written spec plus the decisions below.

**Tech stack:** React 18, existing SCSS (`FormControls.module.scss`), `@floating-ui/react` (must be a **runtime dependency** for the published package—not only devDependency).

**Architecture (short):** Reference element = composite trigger (`button`/`div` pattern matching a11y plan). Floating panel = `FloatingPortal` → `FloatingFocusManager` for desktop; overlay + sheet panel for narrow viewports sharing the same inner list/search shell where possible.

**Testing gate:** Existing Storybook form-controls **Select** story (expand with variants as phases land).

---

## Frozen requirements

### Locked from your original spec

- **Modes:** `mode: 'single' | 'multi'` (multi shows removable chips when selected; overflow `+N` after `triggerMaxItems`).
- **Data:** Static `Option[]`, or async when `options === null` and `onSearch` is provided.
- **Options:** Shape as in your doc (`value`, `label`, optional `group`, `icon`, `avatar`, `meta`, `disabled`).
- **Portal:** Dropdown content renders through a portal (`document.body` or `#root`-safe target if we add optional `portalRoot` prop—**frozen default:** `document.body`).
- **Clear:** Trigger shows × whenever there is a selection; clears all and closes panel.
- **Search:** Debounced `searchDebounce` (async); search row at top of panel (clear control on search input when non-empty)—matches your inspirations.
- **Panel (multi):** Select all row with checked / unchecked / **indeterminate** when some visible options are selected; respects disabled options and `maxSelect`.
- **`maxSelect`:** Enforced in multi only; capped state is visibly disabled before tap; single mode **no-op** (frozen).
- **Keyboard (desktop dropdown):** ↓ / ↑ move active option; Enter toggles selection; Escape closes and returns focus to trigger; Tab closes (match spec table).
- **States:** Idle, open (+ search focus behavior per phase notes), loading, error, empty, disabled.
- **Forms:** Preserve hidden/native submission story where applicable (`name` prop); extend as needed for multi value encoding.

### Former “open items” — now decided

| Item | Decision |
|------|----------|
| `maxSelect` in single mode | **No-op** (ignored). |
| Bottom sheet animation | **CSS-only:** translateY from 100% → 0, **240ms**, `cubic-bezier(0.22, 1, 0.36, 1)`; backdrop fades **160ms**. (Tunable in SCSS only.) |
| Flip / collision (desktop) | **Yes:** `flip` + `shift` + **`size`** so max height clamps to viewport; scroll inside list. |
| Error retry | **Manual “Retry”** only after failure (invokes same `onSearch` with last query). No automatic retry loops. |
| Uncontrolled mode | **Out of scope for v1.** API is controlled: `value` + `onChange`. (Optional `defaultValue` is a future enhancement, not part of this rebuild.) |

### Visual / UX defaults (aligned to your screenshots)

- Multi trigger: chips with per-chip dismiss; comma-joined label text is replaced by chips + overflow.
- Single trigger: plain text label of selected option (no chip), or placeholder.
- Checkbox-style row affordance for multi list; highlight row on hover/focus-visible.
- Icons: **`icon`** uses **Material Symbols names** like the rest of CleanPlate **`Icon`** (your doc said Tabler—**frozen correction:** match existing **`Icon`** / `cleanplate` pattern in this repo, unless you revert this in review).

---

## Dependencies

- Move **`@floating-ui/react`** from `devDependencies` to **`dependencies`** in `package.json` before shipping the component (can land in Phase 1 PR).

---

## Implementation phases (one todo each — review after)

### Phase 1 — Floating UI desktop shell

- Portal + `useFloating` with `flip`, `shift`, `offset`, `size`, `whileElementsMounted` / `autoUpdate`.
- Replace in-flow dropdown positioning; dismiss on outside press and Escape (`useDismiss`).
- **Scope limit:** Static options, existing simple single + multi behaviour, no chips yet beyond current approximation if multi still uses text summary briefly.
- Storybook: Select still runnable; note known gaps.

### Phase 2 — API & types freeze

- Export `Option` type; deprecate or alias `SelectOption` → `Option` for compat.
- Add `mode` prop; **`isMulti` maps to `mode`** for one release or deprecate `isMulti` with console warning once (pick minimal churn—frozen approach: **`mode` canonical**, keep `isMulti` as undocumented alias forwarding to `mode` OR remove if you prefer breaking change—default **canonical `mode`** + **`isMulti` deprecated** shim).
- Storybook controls updated.

### Phase 3 — Multi trigger chips + overflow

- Render first `triggerMaxItems` selections as removable chips; `+N` for remainder.
- Clear (×) and chevron behaviours per spec.

### Phase 4 — Search (sync + async wiring)

- Search field in panel; **sync:** filters `options` locally, no debounce on static path (debounce still applies only to `onSearch` path per your table).
- **Async:** when `options === null`, debounced `onSearch(q)`.

### Phase 5 — Async states

- Loading / error / empty UI in list slot; Retry on error only.

### Phase 6 — Groups + rich options

- `groups` sections; icons/avatars/meta; disabled options skipped in keyboard nav and not selectable.

### Phase 7 — Panel bulk actions & `maxSelect`

- Select all / clear all in panel (multi); indeterminate logic for “visible” selectable set respect `disabled` rows.
- Cap styling and blocked clicks.

### Phase 8 — Keyboard completion

- Arrow navigation through options; Enter to toggle/select; Tab/Escape per frozen table; roving tabindex or Floating UI list patterns.

### Phase 9 — Mobile bottom sheet

- Breakpoint: **`max-width: 768px`** (match common `md` boundary; overrides if you expose `breakpoints` prop later—**frozen: internal constant** first).
- Sheet uses focus trap compatible with Floating UI dismissal; reuse inner list markup.

### Phase 10 — A11y + Storybook showcases

- `aria-expanded`, `aria-controls`, listbox/combobox roles consistent across modes.
- Hidden input / form submission validated for multi.
- Stories: static single/multi, async, groups, chips overflow, maxSelect, error, empty, sheet (viewport toggle).

---

## Review checkpoint protocol

After each phase: run **Storybook** (`npm run storybook`), exercise **Select** story (and phase-specific knobs), confirm no regressions in **All controls showcase**, then approve next phase.

---

## Out of scope (explicit)

- List virtualization (`react-window`, etc.).
- Uncontrolled/defaultValue API.
- Auto-retry on fetch errors.
