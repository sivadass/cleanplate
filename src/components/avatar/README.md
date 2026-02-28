# Avatar Component

Purpose: Display a user avatar as an image, icon, or initials.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| name | string | no | "" | Used for initials, title text, and background color seed. |
| image | string | no | "" | Image URL to render when `icon` is not set. |
| icon | string | no | "" | Icon name to render when `image` is not set. |
| size | "small" \| "medium" | no | "medium" | Size variant. |
| margin | string \| string[] | no | "m-0" | Spacing utility token(s), such as `m-0` or `m-b-2`. |
| className | string | no | "" | Additional class names for the root element. |
| onClick | function | no | — | Called with the click event. |

## Types

None.

## Usage Examples

### Initials (default)

```jsx
import { Avatar } from "cleanplate";

export const Example = () => (
  <Avatar name="Jane Doe" />
);
```

### Image avatar

```jsx
import { Avatar } from "cleanplate";

export const Example = () => (
  <Avatar
    name="Jane Doe"
    image="https://example.com/jane.jpg"
    size="small"
  />
);
```

### Icon avatar

```jsx
import { Avatar } from "cleanplate";

export const Example = () => (
  <Avatar icon="person" />
);
```

## Behavior Notes

- Initials are derived from the first letter of each word and limited to 2 characters.
- Background color is generated from `name`, so the same name yields the same color.
- Provide only one of `image` or `icon`. If both are set, the component renders no content.
- The root element sets `title` to the value of `name`.

## Related Components / Links

- MediaObject
- Icon
