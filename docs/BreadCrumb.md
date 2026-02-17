# BreadCrumb Component

Purpose: Renders a semantic navigation trail (e.g. Home → Products → Current page). Use it at the top of a page to show hierarchy and let users navigate back. The last item is treated as the current page when it has no `href`. Uses `<nav aria-label="Breadcrumb">` with an ordered list; includes Schema.org BreadcrumbList microdata for SEO.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| items | BreadCrumbItem[] | yes | — | List of breadcrumb items. Each has `label`; `href` is optional (omit for current page). |
| separator | "slash" \| "chevron" | no | "chevron" | Visual separator between items (chevron icon or "/"). |
| ariaLabel | string | no | "Breadcrumb" | Accessible label for the navigation landmark. |
| margin | string \| string[] | no | — | Spacing **suffix** for outer margin. The component adds the `m-` prefix (e.g. `"0"` → m-0, `"b-2"` → m-b-2). Use a single string or array. |
| className | string | no | "" | Additional class name for the root nav element. |

## Types

### BreadCrumbItem
```typescript
interface BreadCrumbItem {
  label: string;   // Display label for the crumb
  href?: string;   // URL for the crumb; omit for the current page (typically last item)
}
```

### BreadCrumbSeparator
```typescript
type BreadCrumbSeparator = "slash" | "chevron";
```

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### BreadCrumbMargin
```typescript
type BreadCrumbMargin = string | SpacingOption[];
```

### BreadCrumbProps
```typescript
interface BreadCrumbProps {
  items: BreadCrumbItem[];
  separator?: BreadCrumbSeparator;
  ariaLabel?: string;
  margin?: BreadCrumbMargin;
  className?: string;
}
```

## Usage Examples

### Basic

```jsx
import { BreadCrumb } from "cleanplate";

const items = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Current Product" },
];

export const Example = () => <BreadCrumb items={items} />;
```

### Slash separator

```jsx
import { BreadCrumb } from "cleanplate";

<BreadCrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Getting started" },
  ]}
  separator="slash"
/>
```

### Short trail

```jsx
<BreadCrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Current page" },
  ]}
/>
```

### With Container

```jsx
import { BreadCrumb, Container, Typography } from "cleanplate";

<Container padding="4">
  <BreadCrumb
    items={[
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Current" },
    ]}
    margin="b-2"
  />
  <Typography variant="p">Page content below the breadcrumb.</Typography>
</Container>
```

### Custom aria label

```jsx
<BreadCrumb
  items={[{ label: "Home", href: "/" }, { label: "Here" }]}
  ariaLabel="Page location"
/>
```

## Behavior Notes

- **Current page:** The last item in `items` with no `href` is rendered as the current page (non-link) with `aria-current="page"`. Items without `href` elsewhere in the list are rendered as plain text.
- **Links:** Items with `href` are rendered as `<a href="...">` for navigation and accessibility.
- **Semantic markup:** Root is `<nav aria-label={ariaLabel}>` with `<ol>` and `<li>`. Schema.org `BreadcrumbList` and `ListItem` (itemScope, itemType, itemProp) are applied for SEO.
- **Separator:** Rendered with `aria-hidden="true"`. Chevron uses the Icon component (`chevron_right`); slash is the "/" character.
- **Spacing:** `margin` accepts the **spacing suffix**; the component adds the `m-` prefix via `getSpacingClass`.

## Related Components / Links

- Container (layout and spacing around the breadcrumb)
- Typography (page title or content below the breadcrumb)
- Icon (used internally for the chevron separator)
- Header (breadcrumbs are often placed inside or next to the header)
