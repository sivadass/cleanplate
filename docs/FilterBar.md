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
| dataTestId | string | no | — | Root test id; suffixed on fields and drawer. |

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
  dataTestId?: string;
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

## HTML prototype

```html
<div data-cp="FilterBar" class="cp-filter-bar">
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
<FilterBar fields={[
  { id: "q", type: "search", label: "Search", placement: "bar" },
  { id: "status", type: "select", label: "Status", placement: "bar", options: [{ value: "active", label: "Active" }] },
  { id: "owner", type: "multiSelect", label: "Owner", placement: "drawer", options: [{ value: "asha", label: "Asha" }] },
  { id: "due", type: "dateRange", label: "Due", placement: "drawer" },
]} />
```
