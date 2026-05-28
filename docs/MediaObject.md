# MediaObject Component

Purpose: Combines fixed media (`Avatar`: icon, image, or initials) with a dense text stack (primary title, optional subtitle, optional clipped preview). Supports an optional **trailing rail** for metadata aligned to the title row (e.g. date) and an action anchored to the last text row (e.g. star), matching mobile inbox/list cards. Built-in text colors use semantic tokens (`--text-default`, `--text-subtle`, `--text-muted`).

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| title | string | yes | — | Primary line (e.g. name, sender). Rendered emphasized. |
| mediaIcon | `MaterialIconName` \| string | no | "" | Material Symbol name passed to `Avatar`. |
| mediaImage | string | no | "" | Image URL for `Avatar`. |
| mediaAvatar | string | no | "" | Display name used for initials when image/icon are not shown. |
| mediaAvatarCodeText | string | no | "" | Optional avatar code override. Passed to `Avatar.codeText` (alphanumeric only, last 4 chars). |
| subtitle | `React.ReactNode` | no | — | Optional middle line (e.g. subject). Omit for two-line layouts. |
| description | `React.ReactNode` | no | — | Optional preview/snippet line(s); muted, multi-line ellipsis via `--cp-media-object-desc-lines`. |
| descriptionLineClamp | number | no | 2 | Max lines for `description` before truncation. |
| meta | `React.ReactNode` | no | — | Trailing rail, **first text row**. Strings/numbers get subdued meta typography; pass JSX for custom styling. |
| action | `React.ReactNode` | no | — | Trailing rail, **last content row** (e.g. `Icon`/button); right-aligned with the snippet row when present. |
| margin | string \| `SpacingOption[]` | no | "0" | Outer margin spacing tokens (`m-*` utilities). |
| padding | string \| `SpacingOption[]` | no | "0" | Inner padding spacing tokens (`p-*` utilities). |
| className | string | no | "media-object" | Extra classes on the root `<div>`. |
| onClick | function | no | — | Click handler on the root; forwarded to `Avatar` when provided. |
| ...rest | `React.HTMLAttributes<HTMLDivElement>` | no | — | Standard div props (`id`, `data-*`, `aria-*`, etc.). |

## Types

### MediaObjectMargin / MediaObjectPadding
```typescript
type MediaObjectMargin = string | SpacingOption[];
type MediaObjectPadding = string | SpacingOption[];
```

### SpacingOption
```typescript
type SpacingOption = typeof SPACING_OPTIONS[number];
```

### MediaObjectProps
```typescript
interface MediaObjectProps extends React.HTMLAttributes<HTMLDivElement> {
  mediaIcon?: MaterialIconName | string;
  mediaImage?: string;
  mediaAvatar?: string;
  mediaAvatarCodeText?: string;
  title: string;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  descriptionLineClamp?: number;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  margin?: MediaObjectMargin;
  padding?: MediaObjectPadding;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
```

## Usage Examples

### Title + description (classic two-line row)

```jsx
import { MediaObject } from "cleanplate";

<MediaObject
  mediaIcon="person"
  title="User Profile"
  description="Manage your account settings and preferences"
/>
```

### Inbox-style row (three lines + date + star)

Prefer `subtitle` + `description` plus `meta` / `action` for mail-style listings. Strings in `meta` use muted sizing; arbitrary JSX is allowed for custom summaries.

```jsx
import { Button, Icon, MediaObject } from "cleanplate";

<MediaObject
  mediaAvatar="Ada Lovelace"
  title="Ada Lovelace"
  subtitle="» Weekly digest — infra"
  description="Deployments, deprecation notices, and the FAQ refresh you requested."
  meta="Thu"
  descriptionLineClamp={2}
  action={
    <Button type="button" variant="icon" aria-label="Star thread" margin="m-0">
      <Icon name="star_border" />
    </Button>
  }
/>
```

### Subtitle without snippet

```jsx
<MediaObject
  mediaIcon="payments"
  title="Invoice #4021"
  subtitle="Reminder: payable on receipt."
  meta="Unpaid"
/>
```

### Action only on the trailing rail

```jsx
<MediaObject
  mediaIcon="shopping_bag"
  title="Reorder suggestions"
  description="Based on your last three carts."
  action={<Icon name="more_vert" />}
/>
```

### Meta as custom JSX

```jsx
import { MediaObject, Typography } from "cleanplate";

<MediaObject
  mediaAvatar="Jane"
  title="Jane Doe"
  description="Ping when you merge."
  meta={
    <Typography variant="small" margin="m-0" isBold align="right">
      3 new
    </Typography>
  }
/>
```

### With image or avatar initials

```jsx
<MediaObject
  mediaImage="https://example.com/avatar.jpg"
  title="John Doe"
  description="Senior Developer at Tech Corp"
/>

<MediaObject
  mediaAvatar="John Doe"
  title="John Doe"
  description="Shows initials until an image overrides."
/>
```

### Title only

```jsx
<MediaObject mediaIcon="settings" title="Settings" />
```

### Margin / padding tokens

```jsx
<MediaObject
  mediaIcon="star"
  title="Featured"
  description="With spacing utilities"
  margin="m-b-3"
  padding="p-2"
/>
<MediaObject
  margin={["m-1", "m-b-3"]}
  padding={["p-1", "p-x-2"]}
  title="Row"
/>
```

### Clickable row

```jsx
<MediaObject
  mediaImage="/product.jpg"
  title="Wireless Headphones"
  description="Noise cancelling"
  onClick={() => {}}
/>
```

## Behavior Notes

- **Layout**: Root uses flex (media column + responsive grid body). Without `meta` or `action`, the body is one column of stacked text with **zero row-gap** between lines for inbox-like density.
- **Trailing rail**: If `meta` and/or `action` is passed, the body adds a second grid column: `meta` always occupies **column 2, row 1** aligned with `title`; `action` occupies **column 2, last text row**, aligned toward the snippet row. When **only one** logical text row remains and **both** `meta` and `action` exist, both stack in one compact trailing cell (`gap` 2px).
- **`descriptionLineClamp`** sets the CSS custom property `--cp-media-object-desc-lines` on the snippet wrapper so consumers can clamp 1–N lines preview text.
- **Media slot**: Implemented with `Avatar` (`name={mediaAvatar}`, `image`, `icon`). Combination rules when multiple props are set match `Avatar` (see `docs/Avatar.md`); typical usage passes one dominant source (photo URL vs icon vs name for initials).
- **Code avatars**: Use `mediaAvatarCodeText` for code-like values (e.g. `B101`, `F2`). Avatar sanitizes to alphanumeric and renders the last 4 chars.
- **`meta` primitives**: Strings and numbers render with component meta typography (muted `--text-muted`); pass React nodes when you control color/weight entirely.
- **`title`** is always a string rendered as emphasized primary text (`--text-default`).
- **`subtitle`** and **`description`** accept `React.ReactNode`; empty string / falsy hides the slot.
- **Styling**: Text stacks use semantic tokens (`--text-default`, `--text-subtle`, `--text-muted`); rules live in CSS modules—not the `Typography` component—so inbox-style line-heights stay consistent.
- **Spacing**: Margin and padding use the same spacing token shape as elsewhere (`string` or `SpacingOption[]` arrays).
- **Interaction**: Whole row is clickable when `onClick` is supplied; avatar receives the same handler for consistency.

## Related Components / Links

- **Avatar** — media slot (`mediaAvatar`, `mediaImage`, `mediaIcon`).
- **Icon**, **Button** — common `action` content.
- **Table** — `mobileColumns` maps rows into `MediaObject` on narrow viewports (`title`, `description`, optional `mediaAvatar`; still compatible without `subtitle` / rail).
- **Container** — often wraps stacked `MediaObject` rows.
