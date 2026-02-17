# Alert Component

Purpose: Displays a short message with an optional variant icon and dismiss button. Use it for inline feedback (success, error, warning, info) or neutral notices. When dismissed, the alert unmounts (returns null). **Margin** uses the **framework-wide spacing suffix rule** (same for all components); see `llms.txt`.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| message | string | no | — | Main message text shown in the alert. |
| size | "small" \| "medium" \| "large" | no | "medium" | Size of the alert and its icon/close button. |
| variant | "success" \| "error" \| "warning" \| "info" \| "default" | no | "info" | Visual variant; each has a matching icon (e.g. success → check_circle, error → error). |
| canDismiss | boolean | no | false | When true, shows a close button that calls onDismiss and unmounts the alert. |
| onDismiss | function | no | — | Called when the user dismisses the alert (clicks the close button). |
| margin | string \| string[] | no | ["0"] | Spacing **suffix** for outer margin. The component adds the `m-` prefix (e.g. `"0"` → m-0, `"b-2"` → m-b-2). Use a single string or array: `"0"`, `["b-2"]`. |

## Types

### AlertSize
```typescript
type AlertSize = "small" | "medium" | "large";
```

### AlertVariant
```typescript
type AlertVariant = "success" | "error" | "warning" | "info" | "default";
```

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### AlertMargin
```typescript
type AlertMargin = string | SpacingOption[];
```

### AlertProps
```typescript
interface AlertProps {
  message?: string;
  size?: AlertSize;
  variant?: AlertVariant;
  canDismiss?: boolean;
  onDismiss?: () => void;
  margin?: AlertMargin;
}
```

## Usage Examples

### Basic

```jsx
import { Alert } from "cleanplate";

export const Example = () => (
  <Alert message="Your changes were saved." variant="success" />
);
```

### Variants

```jsx
import { Alert } from "cleanplate";

export const Example = () => (
  <>
    <Alert message="Default message" variant="default" margin="b-2" />
    <Alert message="Info message" variant="info" margin="b-2" />
    <Alert message="Warning message" variant="warning" margin="b-2" />
    <Alert message="Error message" variant="error" margin="b-2" />
    <Alert message="Success message" variant="success" />
  </>
);
```

### Sizes

```jsx
import { Alert } from "cleanplate";

export const Example = () => (
  <>
    <Alert message="Small alert" variant="info" size="small" margin="b-2" />
    <Alert message="Medium alert" variant="info" size="medium" margin="b-2" />
    <Alert message="Large alert" variant="info" size="large" />
  </>
);
```

### Dismissible

```jsx
import { Alert } from "cleanplate";

export const Example = () => (
  <Alert
    message="This can be dismissed."
    variant="info"
    canDismiss
    onDismiss={() => console.log("Dismissed")}
  />
);
```

### With Container

```jsx
import { Alert, Container } from "cleanplate";

export const Example = () => (
  <Container padding="4">
    <Alert message="Alert inside a container" variant="warning" margin="b-2" />
  </Container>
);
```

## Behavior Notes

- **Icon:** Each variant maps to an icon via `getVariantIcon` (e.g. error → "error", success → "check_circle", info → "info", warning → "warning", default → "info").
- **Dismiss:** When `canDismiss` is true, a close button is shown. Clicking it sets internal visibility to false, calls `onDismiss`, and the component returns `null` (removed from the tree).
- **Spacing:** `margin` accepts the **spacing suffix**; the component adds the `m-` prefix via `getSpacingClass`. Use suffix form (e.g. `"0"`, `"b-2"`) when passing values.
- **Root element:** A `div`; Alert does not extend HTML attributes, so only the documented props are supported.

## Related Components / Links

- Typography (used internally for the message text)
- Container (layout and spacing around alerts)
- Button (used internally for the dismiss button when canDismiss is true)
- Icon (used for the variant icon and the close icon)
