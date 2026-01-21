# MediaObject Component

Purpose: A flexible layout pattern that combines media (icon, image, or avatar) with content (title and description). Perfect for displaying user profiles, product cards, notifications, and any content that needs a media element alongside text.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| title | string | yes | — | The main title text displayed in the content area. |
| mediaIcon | string | no | "" | Icon name from Material Symbols to display as the media element. |
| mediaImage | string | no | "" | Image URL to display as the media element. |
| mediaAvatar | string | no | "" | Name used to generate an avatar with initials and background color. |
| description | string | no | — | Secondary text displayed below the title. |
| margin | string \| string[] | no | "0" | Spacing utility token(s) for outer margin, such as `m-0` or `["m-1", "m-b-2"]`. |
| padding | string \| string[] | no | "0" | Spacing utility token(s) for inner padding, such as `p-0` or `["p-1", "p-b-2"]`. |
| className | string | no | "media-object" | Additional class names for the root element. |
| onClick | function | no | — | Called with the click event when the media object is clicked. |
| ...rest | React.HTMLAttributes<HTMLDivElement> | no | — | All other standard HTML div attributes are supported and passed through to the rendered element. |

## Types

### MediaObjectMargin
```typescript
type MediaObjectMargin = string | SpacingOption[];
```

### MediaObjectPadding
```typescript
type MediaObjectPadding = string | SpacingOption[];
```

### SpacingOption
```typescript
type SpacingOption = typeof SPACING_OPTIONS[number];
```

### MediaObjectProps
```typescript
interface MediaObjectProps extends React.HTMLAttributes<HTMLDivElement> {
  mediaIcon?: string;
  mediaImage?: string;
  mediaAvatar?: string;
  title: string;
  description?: string;
  margin?: MediaObjectMargin;
  padding?: MediaObjectPadding;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
```

## Usage Examples

### With icon

```jsx
import { MediaObject } from "cleanplate";

export const Example = () => (
  <MediaObject
    mediaIcon="person"
    title="User Profile"
    description="Manage your account settings and preferences"
  />
);
```

### With image

```jsx
import { MediaObject } from "cleanplate";

export const Example = () => (
  <MediaObject
    mediaImage="https://example.com/avatar.jpg"
    title="John Doe"
    description="Senior Developer at Tech Corp"
  />
);
```

### With avatar (initials)

```jsx
import { MediaObject } from "cleanplate";

export const Example = () => (
  <MediaObject
    mediaAvatar="John Doe"
    title="John Doe"
    description="Senior Developer with 5+ years of experience"
  />
);
```

### Title only

```jsx
import { MediaObject } from "cleanplate";

export const Example = () => (
  <MediaObject
    mediaIcon="settings"
    title="Settings"
  />
);
```

### With margin and padding

```jsx
import { MediaObject } from "cleanplate";

export const Example = () => (
  <>
    <MediaObject
      mediaIcon="star"
      title="Featured Item"
      description="This item has custom spacing"
      margin="m-3"
      padding="p-2"
    />
    <MediaObject
      mediaIcon="heart"
      title="Another Item"
      description="With multiple margin tokens"
      margin={["m-1", "m-b-3"]}
      padding={["p-1", "p-x-2"]}
    />
  </>
);
```

### Clickable media object

```jsx
import { MediaObject } from "cleanplate";

export const Example = () => (
  <MediaObject
    mediaImage="https://example.com/product.jpg"
    title="Wireless Headphones"
    description="High-quality wireless headphones"
    onClick={() => console.log("Media object clicked")}
  />
);
```

### User profile card

```jsx
import { MediaObject } from "cleanplate";
import { Button } from "cleanplate";

export const Example = () => (
  <div style={{ 
    border: "1px solid #e0e0e0", 
    borderRadius: "8px",
    padding: "16px"
  }}>
    <MediaObject
      mediaImage="https://example.com/avatar.jpg"
      title="John Doe"
      description="Senior Developer • john.doe@example.com"
    />
    <Button variant="outline" size="small" margin="m-t-3">
      Edit Profile
    </Button>
  </div>
);
```

### Product card

```jsx
import { MediaObject } from "cleanplate";
import { Typography } from "cleanplate";
import { Button } from "cleanplate";

export const Example = () => (
  <div style={{ 
    border: "1px solid #e0e0e0", 
    borderRadius: "8px",
    padding: "16px"
  }}>
    <MediaObject
      mediaImage="https://example.com/product.jpg"
      title="Wireless Headphones"
      description="High-quality wireless headphones with noise cancellation"
    />
    <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h5">$199.99</Typography>
      <Button size="small" variant="outline">Add to Cart</Button>
    </div>
  </div>
);
```

### Notification list

```jsx
import { MediaObject } from "cleanplate";

export const Example = () => (
  <div>
    <MediaObject
      mediaIcon="notifications"
      title="New Message"
      description="You have received a new message from Jane Smith"
      margin="m-b-2"
    />
    <MediaObject
      mediaIcon="schedule"
      title="Meeting Reminder"
      description="Team standup in 30 minutes"
      margin="m-b-2"
    />
    <MediaObject
      mediaIcon="done"
      title="Task Completed"
      description="Your project 'Website Redesign' has been updated"
    />
  </div>
);
```

### Settings items

```jsx
import { MediaObject } from "cleanplate";

export const Example = () => (
  <div>
    <MediaObject
      mediaIcon="settings"
      title="Account Settings"
      description="Manage your account preferences and security settings"
      margin="m-b-2"
    />
    <MediaObject
      mediaIcon="lock"
      title="Privacy & Security"
      description="Control your privacy settings and security options"
      margin="m-b-2"
    />
    <MediaObject
      mediaIcon="notifications"
      title="Notifications"
      description="Configure how and when you receive notifications"
    />
  </div>
);
```

### List of users

```jsx
import { MediaObject } from "cleanplate";

export const Example = () => {
  const users = [
    { name: "John Doe", role: "Developer", avatar: "https://example.com/avatar1.jpg" },
    { name: "Jane Smith", role: "Designer", avatar: "https://example.com/avatar2.jpg" },
    { name: "Mike Johnson", role: "Manager", avatar: "https://example.com/avatar3.jpg" }
  ];

  return (
    <div>
      {users.map((user, index) => (
        <MediaObject
          key={index}
          mediaImage={user.avatar}
          title={user.name}
          description={user.role}
          margin={index < users.length - 1 ? "m-b-2" : "m-0"}
        />
      ))}
    </div>
  );
};
```

## Behavior Notes

- The `title` prop is required and will always be displayed in bold text.
- The `description` prop is optional. If not provided, only the title will be displayed.
- You can provide one of `mediaIcon`, `mediaImage`, or `mediaAvatar` to display the media element. If multiple are provided, the component will prioritize in this order: `mediaAvatar` > `mediaImage` > `mediaIcon`.
- The component uses the `Avatar` component internally to render the media element, which supports icons, images, and generated avatars with initials.
- The component uses the `Typography` component internally for the title and description text.
- The title is rendered with `isBold={true}` by default.
- The description is rendered with `variant="small"`.
- The component renders as a `<div>` element with a flex layout structure.
- Margin and padding spacing accept either a single string token (e.g., `"m-2"`) or an array of tokens (e.g., `["m-1", "m-b-3"]`).
- The `onClick` handler makes the entire media object clickable, useful for interactive lists or cards.
- All standard HTML div attributes can be passed through, allowing for custom `id`, `data-*`, `aria-*`, and other attributes.
- The component is designed to be responsive and adapts to different screen sizes.

## Related Components / Links

- Avatar (used internally for the media element)
- Typography (used internally for title and description)
- Button (often used alongside MediaObject in cards)
- Container (commonly used to wrap MediaObject components)
