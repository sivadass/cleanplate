# Icon Component

Purpose: A versatile and reusable element for displaying scalable vector icons, supporting various sizes, colors, and custom classes. It seamlessly integrates into user interfaces to enhance visual appeal and provide intuitive, meaningful representations using Google Material Symbols.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| name | MaterialIconName | no | "" | The name of the Material Symbol icon to display. Use a value from `MATERIAL_ICON_NAMES` or `ICON_CATEGORIES` (see **Icon names and categories** below). |
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
  name?: MaterialIconName;
  size?: IconSize;
  className?: string;
  color?: IconColor;
}
```

### MaterialIconName
Icon names are typed as `MaterialIconName` (a union of all valid names). The package also exports `MATERIAL_ICON_NAMES` (array of all names) and `ICON_CATEGORIES` (icons grouped by purpose) from the Icon component’s generated data.

## Icon names and categories

Icon names are sourced from the generated `material-icon-names` module. Icons are grouped into **categories** to make it easier to pick a name for the `name` prop. Use these when suggesting or choosing icons.

| Category | Description | Example icon names |
| --- | --- | --- |
| **navigation** | Back, forward, menu, home, close | `arrow_back`, `arrow_forward`, `home`, `menu`, `close` |
| **action** | Add, edit, delete, search, settings, refresh | `add`, `edit`, `delete`, `search`, `settings`, `refresh` |
| **communication** | Chat, email, message | `chat`, `chat_bubble`, `email`, `message` |
| **content** | Copy, cut, paste | `content_copy`, `content_cut`, `content_paste` |
| **device** | Phone, devices, thermostat | `phone`, `devices`, `device_thermostat`, `phonelink` |
| **editor** | Format, align, list, bold, italic | `format_bold`, `format_align_center`, `format_list_bulleted` |
| **file** | Folder, insert, drive | `folder`, `folder_open`, `insert_drive_file`, `insert_photo` |
| **hardware** | Keyboard, computer | `keyboard`, `computer`, `keyboard_arrow_down` |
| **image** | Photo, camera, image | `image`, `photo`, `photo_camera`, `photo_library` |
| **maps** | Map, place | `map`, `place`, `maps_ugc` |
| **notification** | Notifications, alerts | `notifications`, `notifications_active`, `notification_add` |
| **social** | Person, group, share | `person`, `person_add`, `group`, `share` |
| **toggle** | Check, checkbox, toggle | `check`, `check_circle`, `check_box`, `toggle_on` |
| **av** | Play, pause, volume | `play_arrow`, `pause`, `volume_up`, `volume_off` |
| **alert** | Error, warning | `error`, `error_outline`, `warning`, `warning_amber` |
| **other** | All remaining Material Icons not in the above categories | Many additional names (e.g. `star`, `favorite`, `bookmark`) |

- For **full autocomplete** in TypeScript, use the `MaterialIconName` type or import `MATERIAL_ICON_NAMES` / `ICON_CATEGORIES` from `cleanplate` (or from the package’s icon module).
- Names use **underscores** (e.g. `cloud_upload`), not spaces.
- See [Google Material Icons](https://fonts.google.com/icons) for the full visual reference.

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
- Icon names should match the exact names from the [Google Material Icons library](https://fonts.google.com/icons). Use underscores instead of spaces (e.g., `cloud_upload` not `cloud upload`). Use the **Icon names and categories** table above to find names by purpose.
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
