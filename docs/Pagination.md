# Pagination Component

Purpose: Lets users navigate large sets of content by splitting them into pages. Shows total count, previous/next and page-number buttons (with ellipsis for long ranges), and an optional “rows per page” select. Use it below tables, lists, or search results. Fully controlled via `currentPage` and `rowsPerPage` with `onPageChange` and `onRowsPerPageChange`.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| totalItems | number | yes | — | Total number of items across all pages. |
| totalLabel | string | no | "Items" | Label for the total count (e.g. "Items", "Results"). |
| currentPage | number | yes | — | Current 1-based page number (controlled). |
| rowsPerPage | number | no | 10 | Number of rows per page. |
| rowsPerPageOptions | PaginationRowsPerPageOption[] | no | [{ label: "10", value: 10 }, ...] | Options for the rows-per-page select; each has `label` and `value` (number). |
| onPageChange | (page, rowsPerPage) => void | yes | — | Called when the page changes; receives (page, rowsPerPage). |
| onRowsPerPageChange | (rowsPerPage: number) => void | no | — | Called when the user changes rows per page; receives the new value. |
| variant | "default" \| "minimal" | no | "default" | Visual variant. |
| margin | string \| SpacingOption[] | no | "0" | Margin spacing. Suffix or array of spacing suffixes; component adds `m-` prefix (e.g. "0" → m-0). |
| className | string | no | "" | Additional class names for the root element. |

## Types

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### PaginationVariant
```typescript
type PaginationVariant = "default" | "minimal";
```

### PaginationMargin
```typescript
type PaginationMargin = string | SpacingOption[];
```

### PaginationRowsPerPageOption
```typescript
interface PaginationRowsPerPageOption {
  label: string;
  value: number;
}
```

### PaginationProps
```typescript
interface PaginationProps {
  totalItems: number;
  totalLabel?: string;
  currentPage: number;
  rowsPerPage?: number;
  rowsPerPageOptions?: PaginationRowsPerPageOption[];
  onPageChange: (page: number, rowsPerPage: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  variant?: PaginationVariant;
  margin?: PaginationMargin;
  className?: string;
}
```

## Usage Examples

### Basic

```jsx
import { Pagination } from "cleanplate";
import { useState } from "react";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <Pagination
      totalItems={120}
      totalLabel="Items"
      currentPage={currentPage}
      rowsPerPage={rowsPerPage}
      onPageChange={(page) => setCurrentPage(page)}
      onRowsPerPageChange={(rpp) => {
        setRowsPerPage(rpp);
        setCurrentPage(1);
      }}
    />
  );
};
```

### Variants

```jsx
<Pagination variant="default" totalItems={120} currentPage={currentPage} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
<Pagination variant="minimal" totalItems={120} currentPage={currentPage} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} />
```

### Custom rows per page options

```jsx
const options = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

<Pagination
  totalItems={500}
  currentPage={currentPage}
  rowsPerPage={rowsPerPage}
  rowsPerPageOptions={options}
  onPageChange={handlePageChange}
  onRowsPerPageChange={handleRowsPerPageChange}
/>
```

### With Table

```jsx
import { Table, Pagination } from "cleanplate";

// Table can hide its built-in pagination (hidePagination) and you render Pagination below with your own state.
<Pagination
  totalItems={totalCount}
  currentPage={page}
  rowsPerPage={pageSize}
  onPageChange={(p, rpp) => { setPage(p); }}
  onRowsPerPageChange={(rpp) => { setPageSize(rpp); setPage(1); }}
/>
```

## Behavior Notes

- **Controlled:** You must hold `currentPage` (and typically `rowsPerPage`) in state and pass them in; update them in `onPageChange` and `onRowsPerPageChange`.
- **onPageChange:** Called when the user clicks a page number or prev/next; receives `(page, rowsPerPage)`. Update `currentPage` in state.
- **onRowsPerPageChange:** Called when the user selects a new rows-per-page value; receives the new number. Update `rowsPerPage` and usually set `currentPage` to 1.
- **Page buttons:** First page, last page, and a range around the current page are shown; gaps are represented as ellipsis (disabled "..." button).
- **Spacing:** `margin` uses the suffix API; the component adds the `m-` prefix via `getSpacingClass`.

## Related Components / Links

- Table (often used with Pagination for tabular data; Table can show Pagination via `hidePagination={false}` or you can render Pagination separately)
- Container, Button, FormControls.Select, Typography, Icon (used internally)
