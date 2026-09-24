# FilterBar Component

Purpose: Collects search, select, multi-select, and date-range values above a table or list. The app owns `values`, filters its rows, and passes the result to `Table`. `FilterBar` does not receive row data and does not filter rows.

Bar fields call `onChange` immediately. Drawer fields edit a draft until **Apply**.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| fields | FilterBarField[] | yes | — | Field definitions (id, type, label, placement, options). |
| values | FilterBarValues | yes | — | Committed values keyed by field id. |
| onChange | (values: FilterBarValues) => void | yes | — | Called when bar fields change or when drawer **Apply** commits. |
| className | string | no | "" | Additional class on the root. |
| margin | string \| SpacingOption[] | no | "0" | Margin spacing (suffix API). |
| padding | string \| SpacingOption[] | no | "x-4" | Padding spacing (suffix API). Default horizontal inset matches Table's 16px padding so bar fields line up with the table. |
| dataTestId | string | no | — | Root test id; suffixed on fields and drawer. |
| buttonLabel | string | no | "Filters" | Drawer trigger label. When drawer fields are committed, the label becomes `{buttonLabel} {n}`. |
| fieldMaxWidth | string | no | — | CSS max-width for each bar field (for example `"320px"`). Omitted fields keep the form control default of 240px. Drawer fields stay full width. |

## Types

### FilterBarPlacement
```typescript
type FilterBarPlacement = "bar" | "drawer";
```

### FilterBarField
```typescript
type FilterBarField =
  | FilterBarSearchField
  | FilterBarSelectField
  | FilterBarMultiSelectField
  | FilterBarDateRangeField;
```

### FilterBarDateRangeValue
```typescript
interface FilterBarDateRangeValue {
  from: Date | null;
  to: Date | null;
}
```

### FilterBarFieldValue
```typescript
type FilterBarFieldValue =
  | string
  | Option
  | null
  | Option[]
  | FilterBarDateRangeValue;
```

### FilterBarValues
```typescript
type FilterBarValues = Record<string, FilterBarFieldValue>;
```

### FilterBarProps
```typescript
interface FilterBarProps {
  fields: FilterBarField[];
  values: FilterBarValues;
  onChange: (values: FilterBarValues) => void;
  className?: string;
  margin?: string | SpacingOption[];
  padding?: string | SpacingOption[];
  dataTestId?: string;
  buttonLabel?: string;
  fieldMaxWidth?: string;
}
```

## Usage

```jsx
import { FilterBar, Table } from "cleanplate";

const fields = [
  { id: "q", type: "search", label: "Search", placement: "bar" },
  { id: "status", type: "select", label: "Status", placement: "bar", options: statusOptions },
  { id: "owner", type: "multiSelect", label: "Owner", placement: "drawer", options: ownerOptions },
  { id: "due", type: "dateRange", label: "Due", placement: "drawer" },
];

<FilterBar fields={fields} values={filters} onChange={setFilters} />
<Table columns={columns} data={filteredRows} />
```

Date ranges in the app: `from` alone means on or after that local calendar day; `to` alone means on or before; both ends form a closed range. `FilterBar` stores the dates only and does not apply that meaning.

The drawer trigger is a small button with a `filter_list` prefix icon. It is hidden when every field is in the bar. `buttonLabel` defaults to `Filters`.

| State | Appearance |
| --- | --- |
| Default | Outline, label only, drawer closed, nothing committed |
| Open | Outline with a light brand background, drawer open, nothing committed |
| Applied | Solid, label plus the committed drawer count, drawer closed |
| Applied while open | Solid, count stays, drawer open |

The drawer title stays `Filters`.

## HTML prototype

```html
<div data-cp="FilterBar" data-cp-button-label="More filters" class="cp-filter-bar">
  <div data-cp-type="search" data-cp-id="q" data-cp-label="Search" data-cp-placement="bar"></div>
  <div data-cp-type="select" data-cp-id="status" data-cp-label="Status" data-cp-placement="bar">
    <div data-cp-value="active" data-cp-label="Active"></div>
  </div>
  <div data-cp-type="multiSelect" data-cp-id="owner" data-cp-label="Owner" data-cp-placement="drawer">
    <div data-cp-value="asha" data-cp-label="Asha"></div>
  </div>
  <div data-cp-type="dateRange" data-cp-id="due" data-cp-label="Due" data-cp-placement="drawer"></div>
</div>
```

Converted JSX (add `values` and `onChange` in the app after conversion):

```jsx
<FilterBar buttonLabel="More filters" fields={[
  { id: "q", type: "search", label: "Search", placement: "bar" },
  { id: "status", type: "select", label: "Status", placement: "bar", options: [{ value: "active", label: "Active" }] },
  { id: "owner", type: "multiSelect", label: "Owner", placement: "drawer", options: [{ value: "asha", label: "Asha" }] },
  { id: "due", type: "dateRange", label: "Due", placement: "drawer" },
]} />
```
