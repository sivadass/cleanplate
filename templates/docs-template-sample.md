# LLM/component doc structure (docs/<ComponentName>.md)

Use this order: **Purpose** → **Props / Inputs** → **Types** → **Usage Examples** → **Behavior Notes** → **Related Components / Links**. For any component with `margin`, `padding`, or `gap`: state in Purpose and in the prop description that spacing uses the **framework-wide suffix rule** (suffix only; component adds m-/p-/g- prefix); see `llms.txt`. Optional: add a **For AI / LLM** line after Purpose for components where LLMs often use inline style (e.g. Typography).

---

# Avatar Component

Purpose: Display a user avatar as an image, icon, or initials. **Margin** uses the **framework-wide spacing suffix rule** (same for all components); see `llms.txt`.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| name | string | no | "" | Used for initials, title text, and background color seed. |
| image | string | no | "" | Image URL to render when `icon` is not set. |
| icon | string | no | "" | Icon name to render when `image` is not set. |
| size | "small" \| "medium" | no | "medium" | Size variant. |
| margin | string \| string[] | no | "0" | Spacing **suffix** only (same rule as all components). Component adds `m-` prefix. E.g. `"0"`, `"b-2"`. Do not pass `"m-0"`. |
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
- **Margin** uses the framework-wide spacing rule: pass suffix only (e.g. `"b-2"`); component adds the `m-` prefix.

## Related Components / Links

- MediaObject
- Icon
