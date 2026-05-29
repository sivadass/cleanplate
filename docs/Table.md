# Table Component

Purpose: Displays structured data in a table with configurable columns, optional built-in pagination, and a responsive mobile view. Each row is an object; column `id` values match row keys for default cell rendering. Use `customRender` per column for badges, buttons, or custom content. When viewport is under 768px and `mobileColumns` is set, rows are shown as MediaObject cards instead of a table. Optional `onRowClick(rowData)` for clickable rows.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| columns | TableColumn[] | yes | — | Column definitions (id, title, textAlign?, widthPercentage?, customRender?). |
| data | TableRow[] | yes | — | Array of row objects; keys should match column `id`s. |
| variant | "default" \| "compact" | no | "default" | Visual variant. |
| margin | string \| SpacingOption[] | no | "0" | Margin spacing. Suffix or array of spacing suffixes; component adds `m-` prefix. |
| padding | string \| SpacingOption[] | no | "4" | Root padding. Suffix or array of spacing suffixes; component adds `p-` prefix. |
| className | string | no | "" | Additional class names for the root element. |
| onRowClick | (rowData: TableRow) => void | no | — | Called when a row is clicked; receives the row object. |
| totalItems | number | no | 0 | Total item count for built-in Pagination; 0 or omitted hides pagination. |
| totalLabel | string | no | "Items" | Label for the pagination total (e.g. "Items"). |
| currentPage | number | no | 1 | Current 1-based page (controlled). |
| rowsPerPage | number | no | 10 | Rows per page. |
| rowsPerPageOptions | PaginationRowsPerPageOption[] | no | — | Options for rows-per-page select (same shape as Pagination). |
| onPageChange | (page, rowsPerPage) => void | no | — | Called when page changes; receives (page, rowsPerPage). |
| onRowsPerPageChange | (rowsPerPage: number) => void | no | — | Called when rows per page changes. |
| hidePagination | boolean | no | false | If true, hides the built-in pagination bar even when totalItems > 0. |
| mobileColumns | TableMobileColumns \| null | no | null | When set and viewport < 768px, rows render as MediaObjects; keys map row keys to title, description, media. |

## Types

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### TableVariant
```typescript
type TableVariant = "default" | "compact";
```

### TableMargin
```typescript
type TableMargin = string | SpacingOption[];
```

### TablePadding
```typescript
type TablePadding = string | SpacingOption[];
```

### TableColumnTextAlign
```typescript
type TableColumnTextAlign = "left" | "center" | "right";
```

### TableRow
```typescript
type TableRow = Record<string, unknown>;
```

### TableColumn
```typescript
interface TableColumn {
  id: string;
  title: string;
  textAlign?: TableColumnTextAlign;
  customRender?: (rowData: TableRow, column: TableColumn) => React.ReactNode;
  widthPercentage?: string;
}
```

### TableMobileColumns
Extends static [MediaObject](./MediaObject.md) options (`margin`, `padding`, `descriptionLineClamp`, `className`, and other div attributes except `onClick`). Row-driven slots accept a **row key** or a **per-row resolver**.

```typescript
type TableMobileColumnKey = string;

type TableMobileColumnField<T = React.ReactNode> =
  | TableMobileColumnKey
  | ((row: TableRow) => T | undefined);

interface TableMobileColumns
  extends Omit<
    MediaObjectProps,
    | "title" | "subtitle" | "description" | "meta" | "action"
    | "mediaAvatar" | "mediaAvatarCodeText" | "mediaIcon" | "mediaImage" | "onClick"
  > {
  title: TableMobileColumnKey;              // required row key
  subtitle?: TableMobileColumnField;
  description?: TableMobileColumnField;
  meta?: TableMobileColumnField;
  mediaAvatar?: TableMobileColumnKey;
  mediaAvatarCodeText?: TableMobileColumnField<string>; // static code, row key, or resolver
  mediaIcon?: TableMobileColumnField<string>;  // static icon, row key, or resolver
  mediaImage?: TableMobileColumnField<string>; // static URL, row key, or resolver
  action?: (row: TableRow) => React.ReactNode;
}
```

### TableProps
```typescript
interface TableProps {
  variant?: TableVariant;
  margin?: TableMargin;
  padding?: TablePadding;
  className?: string;
  columns: TableColumn[];
  data: TableRow[];
  onRowClick?: (rowData: TableRow) => void;
  totalItems?: number;
  totalLabel?: string;
  currentPage?: number;
  rowsPerPage?: number;
  rowsPerPageOptions?: PaginationRowsPerPageOption[];
  onPageChange?: (page: number, rowsPerPage: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  hidePagination?: boolean;
  mobileColumns?: TableMobileColumns | null;
}
```

## Usage Examples

### Basic

```jsx
import { Table } from "cleanplate";

const columns = [
  { id: "name", title: "Name" },
  { id: "email", title: "Email" },
];

const data = [
  { name: "John Doe", email: "john@doe.com" },
  { name: "Jane Doe", email: "jane@doe.com" },
];

<Table columns={columns} data={data} />
```

### With pagination

```jsx
import { Table } from "cleanplate";
import { useState } from "react";

const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);

<Table
  columns={columns}
  data={data}
  totalItems={100}
  currentPage={currentPage}
  rowsPerPage={rowsPerPage}
  onPageChange={(page) => setCurrentPage(page)}
  onRowsPerPageChange={(rpp) => {
    setRowsPerPage(rpp);
    setCurrentPage(1);
  }}
/>
```

### Custom cell (customRender)

```jsx
const columns = [
  { id: "name", title: "Name", widthPercentage: "50%" },
  {
    id: "status",
    title: "Status",
    textAlign: "right",
    customRender: (rowData, column) => (
      <Badge label={String(rowData.status)} variant="success" />
    ),
  },
];
<Table columns={columns} data={data} />;
```

### Mobile view (mobileColumns)

```jsx
<Table
  columns={columns}
  data={data}
  mobileColumns={{
    title: "name",
    subtitle: "role",
    description: "email",
    meta: "status",
    mediaAvatar: "name",
    mediaAvatarCodeText: "employeeCode",
    descriptionLineClamp: 2,
    action: (row) => <Badge label={String(row.status)} variant="success" />,
  }}
/>
```

### Row click

```jsx
<Table
  columns={columns}
  data={data}
  onRowClick={(rowData) => console.log(rowData)}
/>
```

## Behavior Notes

- **Required:** `columns` and `data` are required. Each column must have `id` and `title`; row keys should match `id` for default cell display.
- **Pagination:** Built-in Pagination is shown when `totalItems` > 0 and `hidePagination` is false. Pass `onPageChange` and optionally `onRowsPerPageChange`; keep `currentPage` and `rowsPerPage` in parent state.
- **Mobile:** When viewport width < 768px and `mobileColumns` is set, each row renders as a `MediaObject`. Map row keys to `title`, `subtitle`, `description`, `meta`, and media fields (`mediaAvatar`, `mediaAvatarCodeText`, `mediaIcon`, `mediaImage`), or use resolvers / `action` for custom per-row UI. Static MediaObject props (`descriptionLineClamp`, `margin`, `padding`, etc.) pass through unchanged.
- **customRender:** Receives `(rowData, column)` and returns a React node; use for badges, buttons, or any custom cell content.
- **Spacing:** `margin` and `padding` use the suffix API; the component adds the `m-` and `p-` prefixes via `getSpacingClass`.

## Related Components / Links

- Pagination (used inside Table when totalItems > 0 and hidePagination is false; same props as standalone Pagination)
- MediaObject (used for mobile view when mobileColumns is set)
- Typography, Container (used for headers and cells; Container often used in customRender with Badge)
