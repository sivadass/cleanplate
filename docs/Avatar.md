# Avatar Component

Purpose: Displays user initials, an image, or a Material icon in a consistent circle. Use it for user identity in headers, lists, MediaObject, or anywhere you need a compact avatar. Supports sizes, spacing (margin), and optional click handling.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| name | string | no | "" | Display name; used for initials and `title` when no image/icon. Also used for image `alt` and for generating background color when showing initials. |
| image | string | no | "" | Image URL; when set, shows image instead of initials or icon. |
| icon | MaterialIconName | no | — | Material icon name; when set (and no image), shows icon instead of initials. |
| size | "small" \| "medium" | no | "medium" | Size of the avatar. |
| margin | string \| string[] | no | "m-0" | Spacing **suffix** for outer margin. The component adds the `m-` prefix (e.g. `"0"` → m-0, `"b-2"` → m-b-2). Use a single string or array: `"0"`, `["2", "b-3"]`. |
| onClick | function | no | — | Click handler for the root div. |
| className | string | no | "" | Additional class names for the root element. |
| ...rest | React.HTMLAttributes<HTMLDivElement> | no | — | Any other div attributes (e.g. `id`, `data-*`, `aria-*`, `style`) are forwarded. |

## Types

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### AvatarSize
```typescript
type AvatarSize = "small" | "medium";
```

### AvatarMargin
```typescript
type AvatarMargin = string | SpacingOption[];
```

### AvatarProps
```typescript
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  image?: string;
  icon?: MaterialIconName;  // from "../icon/material-icon-names"
  size?: AvatarSize;
  margin?: AvatarMargin;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}
```

## Usage Examples

### Name (initials)

```jsx
import { Avatar } from "cleanplate";

export const Example = () => (
  <>
    <Avatar name="John Doe" size="medium" />
    <Avatar name="Jane Smith" size="small" margin="2" />
  </>
);
```

### Icon

```jsx
import { Avatar } from "cleanplate";

export const Example = () => (
  <>
    <Avatar icon="person" size="medium" />
    <Avatar icon="account_circle" size="small" />
  </>
);
```

### Image

```jsx
import { Avatar } from "cleanplate";

export const Example = () => (
  <Avatar
    name="John Doe"
    image="https://example.com/photo.jpg"
    size="medium"
  />
);
```

### Clickable avatar

```jsx
import { Avatar } from "cleanplate";

export const Example = () => (
  <Avatar
    name="John Doe"
    size="medium"
    onClick={() => console.log("Avatar clicked")}
  />
);
```

### With Container

```jsx
import { Avatar, Container } from "cleanplate";

export const Example = () => (
  <Container display="flex" gap="2" align="center">
    <Avatar name="Alice" size="small" margin="0" />
    <Avatar icon="person" size="medium" margin="0" />
    <Avatar image="https://example.com/bob.jpg" name="Bob" size="medium" margin="0" />
  </Container>
);
```

## Behavior Notes

- **Display priority:** If `image` is set, the image is shown. Else if `icon` is set, the Material icon is shown. Otherwise initials from `name` are shown.
- **Initials:** Derived from the first letter of each word in `name` (up to 2 characters), e.g. "John Doe" → "JD".
- **Background color:** When showing initials, background color is generated deterministically from `name` (hash-based).
- **Spacing:** `margin` accepts the **spacing suffix**; the component adds the `m-` prefix via `getSpacingClass`. Use suffix form (e.g. `"0"`, `"2"`, `"b-3"`) when passing values explicitly.
- **Root element:** A `div`; all standard HTML div attributes and ref are supported via `...rest`.

## Related Components / Links

- MediaObject (often uses Avatar via `mediaAvatar` for the media slot)
- Container (layout and spacing around avatars)
- Icon (Avatar can show an icon via the `icon` prop; uses Material icon names)
