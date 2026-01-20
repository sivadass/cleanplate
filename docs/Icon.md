# Icon Component

Purpose: A versatile and reusable element for displaying scalable vector icons, supporting various sizes, colors, and custom classes. It seamlessly integrates into user interfaces to enhance visual appeal and provide intuitive, meaningful representations using Google Material Symbols.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| name | string | no | "" | The name of the Material Symbol icon to display. See [Google Material Icons](https://fonts.google.com/icons) for available icon names. |
| size | "small" \| "medium" \| "large" | no | "medium" | Size variant of the icon. |
| color | "black" \| "white" \| "gray" \| "blue" \| "green" \| "red" \| "yellow" \| "orange" | no | "black" | Color variant of the icon. |
| className | string | no | "" | Additional class names for the root element. |
| ...rest | React.HTMLAttributes<HTMLSpanElement> | no | — | All other standard HTML span attributes are supported and passed through to the rendered element. |

## Types

### IconSize
```typescript
type IconSize = "small" | "medium" | "large";
```

### IconColor
```typescript
type IconColor = "black" | "white" | "gray" | "blue" | "green" | "red" | "yellow" | "orange";
```

### IconProps
```typescript
interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  size?: IconSize;
  className?: string;
  color?: IconColor;
}
```

## Installation

Before using the Icon component, you need to include the Material Symbols font in your project. Add the following link tag to the `<head>` of your `index.html`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
```

## Usage Examples

### Basic icon

```jsx
import { Icon } from "cleanplate";

export const Example = () => (
  <Icon name="settings" />
);
```

### Different sizes

```jsx
import { Icon } from "cleanplate";

export const Example = () => (
  <>
    <Icon name="home" size="small" />
    <Icon name="home" size="medium" />
    <Icon name="home" size="large" />
  </>
);
```

### Different colors

```jsx
import { Icon } from "cleanplate";

export const Example = () => (
  <>
    <Icon name="favorite" color="black" />
    <Icon name="favorite" color="red" />
    <Icon name="favorite" color="blue" />
    <Icon name="favorite" color="green" />
  </>
);
```

### Common icons

```jsx
import { Icon } from "cleanplate";

export const Example = () => (
  <>
    <Icon name="home" />
    <Icon name="settings" />
    <Icon name="search" />
    <Icon name="menu" />
    <Icon name="close" />
    <Icon name="add" />
    <Icon name="delete" />
    <Icon name="edit" />
    <Icon name="download" />
    <Icon name="cloud_upload" />
  </>
);
```

### With custom className

```jsx
import { Icon } from "cleanplate";

export const Example = () => (
  <Icon
    name="star"
    className="custom-icon-class"
    size="large"
    color="yellow"
  />
);
```

### With HTML attributes

```jsx
import { Icon } from "cleanplate";

export const Example = () => (
  <>
    <Icon
      name="info"
      aria-label="Information icon"
      data-testid="info-icon"
      onClick={() => console.log("Icon clicked")}
    />
    <Icon
      name="error"
      id="error-icon"
      title="Error occurred"
    />
  </>
);
```

### In buttons

```jsx
import { Icon } from "cleanplate";
import { Button } from "cleanplate";

export const Example = () => (
  <>
    <Button>
      <Icon name="save" size="small" />
      Save
    </Button>
    <Button>
      <Icon name="download" />
      Download
    </Button>
  </>
);
```

### With Typography

```jsx
import { Icon } from "cleanplate";
import { Typography } from "cleanplate";

export const Example = () => (
  <Typography variant="p">
    <Icon name="check_circle" color="green" size="small" />
    {" "}Task completed
  </Typography>
);
```

## Behavior Notes

- The component uses Google Material Symbols (Material Icons) font, which must be included in your project for icons to display correctly.
- Icon names should match the exact names from the [Google Material Icons library](https://fonts.google.com/icons). Use underscores instead of spaces (e.g., `cloud_upload` not `cloud upload`).
- The component renders as a `<span>` element, making it an inline element by default.
- If no `name` is provided, the icon will render as an empty span.
- The `color` prop applies predefined color classes. For custom colors, use the `className` prop with your own CSS.
- All standard HTML span attributes (like `onClick`, `aria-label`, `data-*`, etc.) are supported and passed through.
- Icons are scalable and will inherit the font size from their container if custom sizing is needed.
- The component is designed to work seamlessly with other CleanPlate components like Button, Typography, and Alert.

## Related Components / Links

- Button (commonly uses icons for visual enhancement)
- Typography (often combined with icons for inline content)
- Alert (uses icons to indicate different alert types)
- [Google Material Icons](https://fonts.google.com/icons) - Browse available icon names
