# Button Component

Purpose: A highly customizable and interactive UI element designed to handle user actions with various styles, sizes, and variants. Supports loading states, disabled states, and click events.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | no | — | Content to display inside the button. |
| isLoading | boolean | no | false | Shows a loading spinner and disables the button. |
| isDisabled | boolean | no | false | Disables the button and prevents click events. |
| isFluid | boolean | no | false | Makes the button take full width of its container. |
| size | "small" \| "medium" | no | "medium" | Size variant of the button. |
| variant | "solid" \| "outline" \| "ghost" \| "icon" | no | "solid" | Visual style variant of the button. |
| margin | string \| string[] | no | "m-0" | Spacing utility token(s), such as `m-0` or `["m-1", "m-b-2"]`. |
| onClick | function | no | — | Called with the click event when button is clicked. Prevents execution if `isDisabled` or `isLoading` is true. |
| className | string | no | "" | Additional class names for the root element. |
| type | "button" \| "submit" \| "reset" | no | "button" | HTML button type attribute. |
| ...rest | React.ButtonHTMLAttributes | no | — | All other standard HTML button attributes are supported. |

## Types

### ButtonSize
```typescript
type ButtonSize = "small" | "medium";
```

### ButtonVariant
```typescript
type ButtonVariant = "solid" | "outline" | "ghost" | "icon";
```

### ButtonMargin
```typescript
type ButtonMargin = string | SpacingOption[];
```

### SpacingOption
```typescript
type SpacingOption = typeof SPACING_OPTIONS[number];
```

### ButtonProps
```typescript
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> {
  children?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  isFluid?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  margin?: ButtonMargin;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}
```

## Usage Examples

### Basic button

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <Button onClick={() => console.log("Clicked")}>
    Click me
  </Button>
);
```

### Variants

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <>
    <Button variant="solid">Solid</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="icon">Icon</Button>
  </>
);
```

### Sizes

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <>
    <Button size="small">Small</Button>
    <Button size="medium">Medium</Button>
  </>
);
```

### Loading state

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <Button isLoading>
    Loading...
  </Button>
);
```

### Disabled state

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <Button isDisabled>
    Disabled
  </Button>
);
```

### Fluid button

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <Button isFluid>
    Full Width Button
  </Button>
);
```

### With margin spacing

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <>
    <Button margin="m-2">With margin</Button>
    <Button margin={["m-1", "m-b-3"]}>With multiple margins</Button>
  </>
);
```

### Submit button

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <form onSubmit={(e) => { e.preventDefault(); console.log("Submitted"); }}>
    <Button type="submit">Submit</Button>
  </form>
);
```

## Behavior Notes

- When `isLoading` is true, a progress spinner icon is displayed and the button is automatically disabled.
- When `isDisabled` is true, click events are prevented and the button appears visually disabled.
- If both `isDisabled` and `isLoading` are true, the button is disabled and the loading spinner is shown.
- The `onClick` handler is not called if the button is disabled or loading, even if the event is triggered.
- The button extends standard HTML button attributes, so you can use props like `aria-label`, `data-*`, etc.
- The `type` prop defaults to `"button"` to prevent accidental form submissions. Use `type="submit"` for form submission buttons.
- Margin spacing accepts either a single string token (e.g., `"m-2"`) or an array of tokens (e.g., `["m-1", "m-b-3"]`).

## Related Components / Links

- Icon (used internally for loading spinner)
- FormControls (often used alongside buttons in forms)
