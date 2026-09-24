# FilterBar button — design spec

**Status:** Pending spec review  
**Scope:** Prefix icon, custom label, and Default / Open / Applied treatments on the FilterBar drawer trigger.  
**Amends:** `docs/superpowers/specs/2026-09-24-filter-bar-design.md` section 4 (Filters button) and the out-of-scope row "Configurable button or drawer copy". Drawer title stays `Filters`.

---

## 1. Summary

The drawer trigger stays a `size="small"` `Button` after the bar fields, rendered only when at least one field has `placement: "drawer"`. It always shows a leading `filter_list` icon. The label is configurable. Applied (committed drawer count) and Open (drawer visibility) are separate signals and can be true together.

---

## 2. API

Add optional `buttonLabel?: string` to `FilterBarProps`. Default `"Filters"`.

The visible label is `buttonLabel` when the committed drawer count is 0, and `` `${buttonLabel} ${n}` `` when `n > 0`. `"More filters"` with two committed drawer fields reads `More filters 2`. The count rules are unchanged: search non-empty, select non-null, multi-select length > 0, date range with `from` or `to` set (one field). The count uses committed `values`, including while the drawer is open.

The icon is not a prop. The drawer title stays `Filters`.

---

## 3. States

| State | When | Button |
| --- | --- | --- |
| Default | Drawer closed, count 0 | `variant="outline"`, `prefixIcon="filter_list"`, label only, `aria-expanded={false}` |
| Open | Drawer open, count 0 | Outline, plus class `cp-filter-bar__button--open` (`background: var(--primary-brand-light)`), `aria-expanded={true}` |
| Applied | Drawer closed, count > 0 | `variant="solid"` (brand fill, white text), label includes the count, `aria-expanded={false}` |
| Applied + open | Drawer open, count > 0 | Solid and the count stay. `aria-expanded={true}`. The open class is not applied, so the solid fill is not replaced by the light background. |

Hover stays the existing Button hover for outline and solid.

---

## 4. Tests

- Default button name is `Filters`, outline, and exposes the prefix icon.
- `buttonLabel="More filters"` with a committed drawer field is named `More filters 1` and uses the solid variant.
- Opening the drawer with no committed drawer values sets `aria-expanded="true"` and `cp-filter-bar__button--open`.
- Opening the drawer when a drawer field is already committed keeps the count in the name, uses solid, sets `aria-expanded="true"`, and does not add `cp-filter-bar__button--open`.
- The button is still absent when every field is in the bar.

Update `docs/FilterBar.md` and the HTML prototype recipe for the new prop and the four states.
