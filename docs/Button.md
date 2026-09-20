# Button Component

Purpose: A customizable action trigger for user interactions. Supports visual variants, size options, loading/disabled states, fluid layout, spacing utilities, and standard button behaviors.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | no | — | Content to display inside the button. |
| isLoading | boolean | no | false | Shows a loading spinner and disables the button. |
| isDisabled | boolean | no | false | Disables the button and prevents click events. |
| isFluid | boolean | no | false | Makes the button take full width of its container. |
| size | "small" \| "medium" \| "large" | no | "medium" | Size variant of the button. |
| prefixIcon | MaterialIconName | no | — | Leading Material Symbol name; Button owns glyph size and asymmetric padding. |
| suffixIcon | MaterialIconName | no | — | Trailing Material Symbol name; decorative (`aria-hidden`). |
| variant | "solid" \| "outline" \| "ghost" \| "icon" | no | "solid" | Visual style variant of the button (`icon` is a style variant, not an icon prop). |
| margin | string \| string[] | no | "0" | Spacing **suffix** token(s), such as `"0"` or `["0", "b-2"]`. |
| onClick | function | no | — | Called with the click event when button is clicked. Prevents execution if `isDisabled` or `isLoading` is true. |
| className | string | no | "" | Additional class names for the root element. |
| type | "button" \| "submit" \| "reset" | no | "button" | HTML button type attribute. |
| ...rest | React.ButtonHTMLAttributes | no | — | All other standard HTML button attributes are supported. |

## Types

### ButtonSize
```typescript
type ButtonSize = "small" | "medium" | "large";
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
  prefixIcon?: MaterialIconName;
  suffixIcon?: MaterialIconName;
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

### Icon variant (icon-only action)

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <Button variant="icon" prefixIcon="close" aria-label="Close dialog" />
);
```

Prefer `prefixIcon` for icon-only buttons. If `prefixIcon` is omitted, passing an `Icon` as `children` still works.

### Prefix and suffix icons

```jsx
import { Button } from "cleanplate";

export const Example = () => (
  <>
    <Button prefixIcon="add">Next</Button>
    <Button suffixIcon="expand_more">Export</Button>
    <Button prefixIcon="add" suffixIcon="expand_more">Create</Button>
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
    <Button size="large">Large</Button>
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
    <Button margin="2">With margin</Button>
    <Button margin={["1", "b-3"]}>With multiple margins</Button>
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

- When `isLoading` is true, a loading icon (`progress_activity`) replaces the prefix slot and the button is automatically disabled. Label and `suffixIcon` remain visible.
- When `isDisabled` is true, click events are prevented and the button appears visually disabled.
- If both `isDisabled` and `isLoading` are true, the button is disabled and the loading icon is shown.
- The `onClick` handler is not called if the button is disabled or loading, even if the event is triggered.
- The button extends standard HTML button attributes, so you can use props like `aria-label`, `data-*`, etc.
- The `type` prop defaults to `"button"` to prevent accidental form submissions. Use `type="submit"` for form submission buttons.
- Margin spacing accepts either a single suffix string (e.g., `"2"`) or an array of suffixes (e.g., `["1", "b-3"]`).
- `variant="icon"` is a visual style variant. Icon-only buttons are **square** at the size height (32 / 44 / 52), not circular. Provide an accessible name via `aria-label`.
- `prefixIcon` / `suffixIcon` inherit the button text color. Glyph sizes are 16 / 20 / 24 px (small / medium / large) — Button CSS only, not `Icon`'s `size` prop.
- Form controls remain 50px tall. Use `size="large"` (52px) on buttons placed beside inputs or selects.

## HTML prototype

Design agents (Paper, Claude Design) author canonical-frame HTML with `data-cp` attributes and public `cp-*` CSS. Convert to React with the CLI — do not invent JSX by hand.

```bash
npm run html-to-jsx -- recipe.html
```

### Recipe (outline)

```html
<button
  data-cp="Button"
  data-cp-variant="outline"
  data-cp-margin="b-2"
  class="cp-button cp-button--outline cp-m-b-2"
>
  Save
</button>
```

### Recipe (prefix icon)

```html
<button
  data-cp="Button"
  data-cp-prefix-icon="add"
  class="cp-button cp-button--medium cp-button--has-prefix"
>
  <span class="cp-icon cp-button__prefix-icon" aria-hidden="true">add</span>
  Next
</button>
```

### React equivalent

```jsx
<Button variant="outline" margin="b-2">Save</Button>
<Button prefixIcon="add">Next</Button>
```

## Related Components / Links

- Icon (used internally for loading spinner)
- FormControls (often used alongside buttons in forms)
