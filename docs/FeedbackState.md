# FeedbackState Component

Purpose: Unified empty and error **region** for cards, panels, tables, and main content areas — when a section has no data or failed to load. Use `Alert` for short inline banners and `Toast` for transient messages. **Margin** uses the **framework-wide spacing suffix rule** (same for all components); see `llms.txt`.

**Illustrations:** CleanPlate does not host artwork. Pass your own image URL (`png`, `jpg`, `svg`) or a custom `ReactNode`, or use the `icon` prop with a Material icon name when no image is needed.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| variant | `"empty" \| "error"` | yes | — | Drives default ARIA role and error tone |
| title | string | yes | — | Primary headline |
| titleTag | `"h1"` … `"h6" \| "p"` | no | `"h2"` | Semantic element for the title |
| description | string \| ReactNode | no | — | Supporting copy |
| illustration | string \| ReactNode | no | — | Image URL or custom media node |
| illustrationAlt | string | no | `""` | `alt` for URL images; empty = decorative |
| icon | MaterialIconName | no | — | Material icon when `illustration` is omitted |
| size | `"small" \| "medium" \| "large"` | no | `"medium"` | Overall scale (spacing, media box, icon size) |
| primaryAction | ActionConfig | no | — | Solid primary button |
| secondaryAction | ActionConfig | no | — | Ghost secondary button |
| onRetry | `() => void` | no | — | Shorthand primary “Try again” when `primaryAction` is absent |
| retryLabel | string | no | `"Try again"` | Label when `onRetry` is used |
| errorCode | string \| number | no | — | Visual error code (not the sole indicator) |
| errorDetails | string | no | — | Technical detail in a `<details>` disclosure |
| role | `"alert" \| "status" \| "none"` | no | `status` (empty) / `alert` (error) | Root ARIA role |
| margin | string \| SpacingOption[] | no | `"0"` | Spacing **suffix**; component adds `m-` prefix |
| className | string | no | `""` | Extra class on root for consumer CSS overrides |
| dataTestId | string | no | — | `data-testid` on root |

### ActionConfig

```typescript
type ActionConfig = {
  label: string;
  onClick: () => void;
};
```

Actions use `Button` only — there is no `href`. Use `onClick` for navigation (e.g. router).

## Types

### FeedbackStateVariant
```typescript
type FeedbackStateVariant = "empty" | "error";
```

### FeedbackStateSize
```typescript
type FeedbackStateSize = "small" | "medium" | "large";
```

### FeedbackStateTitleTag
```typescript
type FeedbackStateTitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
```

### FeedbackStateRole
```typescript
type FeedbackStateRole = "alert" | "status" | "none";
```

### FeedbackStateProps
```typescript
interface FeedbackStateProps {
  variant: FeedbackStateVariant;
  title: string;
  titleTag?: FeedbackStateTitleTag;
  description?: string | React.ReactNode;
  illustration?: string | React.ReactNode;
  illustrationAlt?: string;
  icon?: MaterialIconName;
  size?: FeedbackStateSize;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  onRetry?: () => void;
  retryLabel?: string;
  errorCode?: string | number;
  errorDetails?: string;
  role?: FeedbackStateRole;
  margin?: string | SpacingOption[];
  className?: string;
  dataTestId?: string;
}
```

## Usage Examples

### Empty state with icon

```jsx
import { FeedbackState } from "cleanplate";

export const ProjectsEmpty = ({ onCreate }) => (
  <FeedbackState
    variant="empty"
    title="No projects yet"
    description="Create your first project to get started."
    icon="folder_open"
    primaryAction={{ label: "New project", onClick: onCreate }}
  />
);
```

### Empty state with module illustration

```jsx
<FeedbackState
  variant="empty"
  title="No search results"
  description="Try adjusting your filters."
  illustration="/assets/modules/search-empty.png"
  illustrationAlt=""
  primaryAction={{ label: "Clear filters", onClick: clearFilters }}
/>
```

### Error with retry

```jsx
<FeedbackState
  variant="error"
  title="Could not load projects"
  description="Check your connection and try again."
  icon="cloud_off"
  errorCode={503}
  onRetry={refetch}
/>
```

### Error with technical details

```jsx
<FeedbackState
  variant="error"
  title="Request failed"
  errorDetails={error.message}
  dataTestId="projects-error"
/>
```

### Custom styles via className

```jsx
<FeedbackState
  variant="empty"
  title="No items"
  className="my-module-empty"
  icon="inbox"
/>
```

```css
.my-module-empty.cp-feedback-state {
  min-height: 280px;
}
```

## Behavior Notes

- **Media precedence:** `illustration` → `icon` → no media. If both `illustration` and `icon` are set, illustration wins.
- **Action precedence:** `primaryAction` overrides `onRetry`.
- **Layout:** Stacked only (media above text, centered actions).
- **Accessibility:** Root `aria-labelledby` points at the title; decorative media uses `aria-hidden` when `illustrationAlt` is empty and a title is present.
- **Motion:** Subtle mount fade; disabled when `prefers-reduced-motion: reduce`.

### Stable slot classes (for CSS overrides)

- `cp-feedback-state` — root
- `cp-feedback-state-media`, `cp-feedback-state-media-img`
- `cp-feedback-state-content`, `cp-feedback-state-title`, `cp-feedback-state-description`
- `cp-feedback-state-error-code`, `cp-feedback-state-actions`, `cp-feedback-state-details`

## Related Components / Links

- Alert (inline feedback)
- Toast (transient messages)
- Button, Icon, Typography (composed internally)
- Container (wrap for layout in stories and apps)
