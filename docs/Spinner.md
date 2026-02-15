# Spinner Component

Purpose: A loading indicator that shows a rotating Material icon. Use it for progress or activity states. Supports six icon options (all animate when rotated), sizes, light/dark variant, and margin spacing.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| size | "small" \| "medium" \| "large" | no | "medium" | Size of the spinner. |
| variant | "light" \| "dark" | no | "light" | Visual variant; use dark on dark backgrounds. |
| icon | SpinnerIcon | no | "progress_activity" | Icon to display as the spinner. One of: progress_activity, autorenew, sync, refresh, cached, loop. |
| margin | string \| string[] | no | "0" | Spacing **suffix** for outer margin. The component adds the `m-` prefix (e.g. `"0"` → m-0, `"b-2"` → m-b-2). Use a single string or array. |
| className | string | no | "" | Additional class names for the wrapper. |

## Types

### SpinnerSize
```typescript
type SpinnerSize = "small" | "medium" | "large";
```

### SpinnerVariant
```typescript
type SpinnerVariant = "light" | "dark";
```

### SpinnerIcon
```typescript
type SpinnerIcon =
  | "progress_activity"
  | "autorenew"
  | "sync"
  | "refresh"
  | "cached"
  | "loop";
```

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### SpinnerMargin
```typescript
type SpinnerMargin = string | SpacingOption[];
```

### SpinnerProps
```typescript
interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  icon?: SpinnerIcon;
  margin?: SpinnerMargin;
  className?: string;
}
```

## Usage Examples

### Basic

```jsx
import { Spinner } from "cleanplate";

export const Example = () => <Spinner size="medium" variant="light" />;
```

### Icon options

All of these icons rotate via the same CSS animation.

```jsx
import { Spinner } from "cleanplate";

<Spinner />                     // progress_activity (default)
<Spinner icon="autorenew" />    // Circular arrows
<Spinner icon="sync" />         // Sync arrows
<Spinner icon="refresh" />      // Refresh arrows
<Spinner icon="cached" />       // Cache/refresh arrows
<Spinner icon="loop" />         // Circular loop
```

### Sizes and variants

```jsx
<Spinner size="small" />
<Spinner size="medium" />
<Spinner size="large" />
<Spinner variant="light" />
<Spinner variant="dark" />
```

### With Container

```jsx
import { Spinner, Container } from "cleanplate";

export const Example = () => (
  <Container padding="4">
    <Spinner icon="sync" size="medium" margin="b-2" />
  </Container>
);
```

## Behavior Notes

- **Animation:** The icon is rotated continuously via CSS (class `cp-spinner-icon`). All six icon options work with this rotation.
- **Layout:** Spinner renders a Container wrapping an Icon; size and variant classes apply to the wrapper.
- **Spacing:** `margin` accepts the **spacing suffix**; the component adds the `m-` prefix via `getSpacingClass`. Use suffix form (e.g. `"0"`, `"b-2"`) when passing values.

## Related Components / Links

- Container (used internally as the wrapper; use for layout around the spinner)
- Icon (used internally to render the Material icon that rotates)
