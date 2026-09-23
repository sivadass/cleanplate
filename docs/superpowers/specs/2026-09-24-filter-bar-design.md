# FilterBar — design spec

**Status:** Pending spec review  
**Scope:** A controlled filter toolbar that collects search, select, multi-select, and date-range values for the app to apply to table rows.  
**Source:** Brainstorming 2026-09-24.

---

## 1. Summary

`FilterBar` sits above a `Table` (or any other list). It renders a row of fields and, when needed, opens the existing `Drawer` for the rest. The app owns the committed values, filters the rows, and passes the result to `Table`. `FilterBar` does not receive row data and does not filter it.

Bar fields report changes immediately. Drawer fields stay in a draft until Apply.

---

## 2. Goals and non-goals

### In scope

- Controlled `fields`, `values`, and `onChange`.
- Field types: `search`, `select`, `multiSelect`, `dateRange`.
- Per-field `placement`: `"bar"` or `"drawer"`.
- Drawer draft, Apply, Clear, and discard on close.
- Date-range validation when both ends are set.
- Docs, HTML prototype, Storybook, unit tests, and the existing Storybook visual suite.

### Out of scope

| Item | Notes |
|------|--------|
| Filtering rows | The app filters. No helper that takes `data` and returns rows |
| Rendering `Table` | `FilterBar` is a sibling, not a `Table` prop |
| Custom field type | Only the four types above |
| Debounce | `onChange` fires on each bar change. The app may debounce |
| URL sync | The app may store `values` in the query string |
| Configurable control size | Every field is `size="small"` |
| Configurable button or drawer copy | English strings below are fixed |
| `Drawer` placement or size changes | Right edge, default size. Mobile stays the existing bottom sheet |

---

## 3. Public API

```ts
type FilterBarPlacement = "bar" | "drawer";

interface FilterBarFieldBase {
  id: string;
  label: string;
  placement: FilterBarPlacement;
}

interface FilterBarSearchField extends FilterBarFieldBase {
  type: "search";
  /** Input placeholder. Omitted means no placeholder; the label is still shown. */
  placeholder?: string;
}

interface FilterBarSelectField extends FilterBarFieldBase {
  type: "select";
  options: Option[];
}

interface FilterBarMultiSelectField extends FilterBarFieldBase {
  type: "multiSelect";
  options: Option[];
}

interface FilterBarDateRangeField extends FilterBarFieldBase {
  type: "dateRange";
}

type FilterBarField =
  | FilterBarSearchField
  | FilterBarSelectField
  | FilterBarMultiSelectField
  | FilterBarDateRangeField;

interface FilterBarDateRangeValue {
  from: Date | null;
  to: Date | null;
}

/**
 * Stored value depends on the field type:
 * - search: string
 * - select: Option | null
 * - multiSelect: Option[]
 * - dateRange: FilterBarDateRangeValue
 */
type FilterBarFieldValue =
  | string
  | Option
  | null
  | Option[]
  | FilterBarDateRangeValue;

interface FilterBarProps {
  fields: FilterBarField[];
  values: Record<string, FilterBarFieldValue>;
  onChange: (values: Record<string, FilterBarFieldValue>) => void;
  className?: string;
  /** Suffix spacing API, same as other components. Default "0". */
  margin?: string | SpacingOption[];
  dataTestId?: string;
}
```

`Option` is the existing Select option type. `onChange` receives a new object: the previous `values`, with the changed keys replaced. Keys the app included are preserved. Duplicate fields that were not rendered do not add a second key.

### Empty value for each type

| Type | Empty |
|------|--------|
| `search` | `""` |
| `select` | `null` |
| `multiSelect` | `[]` |
| `dateRange` | `{ from: null, to: null }` |

A missing key in `values` is read as that empty value. The field still renders.

### Usage

```jsx
<FilterBar
  fields={[
    { id: "q", type: "search", label: "Search", placement: "bar" },
    { id: "status", type: "select", label: "Status", placement: "bar", options: statusOptions },
    { id: "owner", type: "multiSelect", label: "Owner", placement: "drawer", options: ownerOptions },
    { id: "due", type: "dateRange", label: "Due", placement: "drawer" },
  ]}
  values={filters}
  onChange={setFilters}
/>
```

The app then filters its rows from `filters` and passes the result to `Table`. A date range means: `from` alone is on or after that calendar day, `to` alone is on or before that calendar day, and both is the closed range. `FilterBar` stores the two dates and does not apply that meaning itself.

---

## 4. Layout

Fields render at `size="small"`, in `fields` array order within their placement.

**Bar.** A wrapping horizontal row, gap spacing `2`. Search uses `Input`. Single and multi selects use `Select` (`multiple` for `multiSelect`). A date range is two `Date` fields labeled `{label} from` and `{label} to` (for label `Due`: "Due from" and "Due to"). Select and Date keep their current clear behavior (`clearable` default true).

**Filters button.** Rendered after the bar fields only when at least one field has `placement: "drawer"`. It is a `Button` with `variant="outline"` and `size="small"`. Label is `Filters` when no drawer field is active, and `Filters {n}` when `n` drawer fields are active. The count uses committed `values`, including while the drawer is open:

- `search` is active when the string is not `""`.
- `select` is active when the value is not `null`.
- `multiSelect` is active when the array length is greater than 0.
- `dateRange` is active when `from` or `to` is not `null`. It counts as one field.

An empty `fields` array renders nothing.

**Drawer.** The existing `Drawer`, title `Filters`, `placement="right"`. Under 768px it is already a bottom sheet. Drawer fields stack at full width in array order. Footer order matches `Drawer` today: secondary **Clear**, primary **Apply**.

Public root class: `cp-filter-bar`. The bar row is `cp-filter-bar__fields`. The button is `cp-filter-bar__button`.

---

## 5. Data flow

The app owns committed `values`. `FilterBar` keeps a drawer draft only while the drawer is open.

**Bar change.** Call `onChange` with `{ ...values, [id]: next }` on that change. No debounce. A cleared search is `""`, a cleared single select is `null`, and a cleared multi-select is `[]`.

**Open.** Copy the committed value of each drawer field into the draft.

**Drawer edit.** Update the draft only. Do not call `onChange`.

**Apply.** If the draft is equal to the committed drawer values, close the drawer and do not call `onChange`. Otherwise call `onChange` with the latest `values` (so a bar edit made while the drawer was open is kept) overlaid with the drawer draft, then close.

Draft equality:

- `search`: string equality.
- `select`: both `null`, or both `Option.value` strictly equal.
- `multiSelect`: same length and the same `Option.value` sequence, compared with strict equality.
- `dateRange`: `from` and `to` each match as a local calendar day (`getFullYear`, `getMonth`, `getDate`), or both sides null. Time of day is ignored.

**Clear.** Reset every drawer draft field to its empty value. Do not call `onChange`. The cleared draft is committed only if the user then presses Apply.

**Dismiss.** The close button, overlay click, and Escape drop the draft and leave `values` unchanged. There is no separate Cancel button.

If the set of drawer field ids changes while the drawer is open, drop the draft and close the drawer.

---

## 6. Invalid values

**Date range.** Only From, only To, or neither is valid. When both dates are set and From's local calendar day is after To's, the To field's `error` is `From must be on or before To`. Same calendar day is valid.

That invalid range is not committed.

- In the drawer, Apply is disabled until every drawer date range is valid or cleared. Clear stays available.
- On the bar, the invalid pair is held in local state and shown in the fields. `onChange` is not called until the range is valid again. The previous committed range stays in `values` meanwhile.

`Drawer` has no way to disable its primary footer button. This work adds `isPrimaryButtonDisabled?: boolean` (default `false`) to `Drawer`. When true, the primary footer `Button` receives `isDisabled`.

**Duplicate `id`.** The first field is rendered. Later fields with that `id` are ignored. In development (`process.env.NODE_ENV !== "production"`), log one `console.warn` naming the duplicated id.

**Select value not in `options`.** Pass the committed `Option` through to `Select`.

An inverted range can appear in `values` only if the app sets it. `FilterBar` shows the error and will not emit another `onChange` for that field until the user makes the range valid.

---

## 7. Files

- `src/components/filter-bar/FilterBar.tsx`
- `src/components/filter-bar/FilterBar.module.scss`
- `src/components/filter-bar/FilterBar.test.tsx`
- `src/components/filter-bar/index.ts`
- Export the component from `src/index.js` and its types from `src/public-types.ts`
- `docs/FilterBar.md`, plus a `llms.txt` index entry
- HTML prototype section in that doc, authored with `data-cp="FilterBar"` and converted with the html-to-jsx workflow. Each field is a child with `data-cp-type`, `data-cp-id`, `data-cp-label`, and `data-cp-placement` (`bar` or `drawer`). Select fields list options as nested elements with `data-cp-value` and `data-cp-label`. A `dateRange` field has no option children. The converter emits the `fields` array and leaves `values` / `onChange` for the app to add.
- `src/stories/filter-bar/filter-bar.stories.tsx` and `filter-bar.docs.mdx`

`Drawer.tsx` and `docs/Drawer.md` gain `isPrimaryButtonDisabled`.

The Storybook story places Search and Status in the bar, Owner (multi-select) and Due (date range) in the drawer, and renders a `Table` below. The story filters the sample rows. The library does not export that filtering.

---

## 8. Tests

Unit tests in `FilterBar.test.tsx`:

- A bar search change calls `onChange` with the full values object.
- A bar select change calls `onChange` immediately.
- Drawer edits do not call `onChange`.
- Apply commits the draft, preserves a bar value edited while the drawer was open, and closes the drawer.
- Apply does not call `onChange` when the draft matches the committed drawer values, and still closes.
- Close, overlay, and Escape drop the draft.
- Clear resets the draft and does not call `onChange`. A following Apply commits the empty drawer values.
- The Filters button is absent when every field is in the bar.
- The button reads `Filters` when no drawer field is active, and `Filters 2` when two are.
- An inverted date range shows `From must be on or before To` and is not committed. Drawer Apply is disabled in that state. A bar date range does not call `onChange` until it is valid.
- A duplicate `id` renders the first field only.
- A missing `values` key renders the empty value for that type.
- `fields={[]}` renders nothing.
- `isPrimaryButtonDisabled` disables the Drawer primary button.

The existing Storybook visual suite snapshots the new story. No new visual spec file.

---

## 9. Drawer prop

```ts
interface DrawerProps {
  /** When true, the primary footer button is disabled. Default false. */
  isPrimaryButtonDisabled?: boolean;
}
```
