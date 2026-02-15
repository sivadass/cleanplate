# Badge Component

Purpose: Displays a short label with a colored background. Use it for status (e.g. success, error, warning), tags, or counts. Renders as an inline-block element with five variants (default, info, success, warning, error). Optional `className` for custom styling.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| label | string | no | — | Text shown inside the badge. |
| variant | "default" \| "info" \| "warning" \| "error" \| "success" | no | "default" | Visual variant (gray, blue, orange, red, green). |
| className | string | no | "" | Additional class names for the root element. |

## Types

### BadgeVariant
```typescript
type BadgeVariant = "default" | "info" | "warning" | "error" | "success";
```

### BadgeProps
```typescript
interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  className?: string;
}
```

## Usage Examples

### Basic

```jsx
import { Badge } from "cleanplate";

<Badge label="New" />
<Badge label="Active" variant="success" />
```

### Variants

```jsx
<Badge label="Default" variant="default" />
<Badge label="Info" variant="info" />
<Badge label="Success" variant="success" />
<Badge label="Warning" variant="warning" />
<Badge label="Error" variant="error" />
```

### With Table (customRender)

```jsx
import { Table, Badge } from "cleanplate";

const columns = [
  { id: "name", title: "Name" },
  {
    id: "status",
    title: "Status",
    customRender: (rowData, column) => (
      <Badge label={String(rowData.status)} variant="success" />
    ),
  },
];
<Table columns={columns} data={data} />;
```

### Custom className

```jsx
<Badge label="Custom" variant="info" className="my-badge" />
```

## Behavior Notes

- **Element:** Renders as a `<p>` with `display: inline-block` in styles.
- **Label:** Optional; can be omitted or empty.
- **Variants:** Each variant maps to a CSS class that sets background color via design tokens (e.g. `var(--blue)` for info, `var(--green)` for success).

## Related Components / Links

- Table (often use Badge in column `customRender` for status or tag columns)
- Container (for layout when showing multiple badges)
