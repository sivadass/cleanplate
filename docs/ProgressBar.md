# ProgressBar Component

Purpose: A horizontal progress indicator showing completion percentage. Supports size and color variants, spacing utilities, and custom class names for the track and fill.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| value | number | yes | — | Progress percentage from 0 to 100. |
| size | "small" \| "medium" \| "large" | no | "medium" | Height preset of the bar. |
| variant | "default" \| "primary" \| "secondary" \| "success" \| "info" \| "error" \| "warning" | no | "default" | Fill color variant. |
| margin | string \| string[] | no | "0" | Spacing **suffix** for outer margin (e.g. `"0"`, `"b-2"`, or `["0", "b-2"]`). |
| className | string | no | "progress-bar" | Additional class names for the root wrapper. |
| trackClassName | string | no | "progress-bar-track" | Class name applied to both track and fill elements. |

## Types

ProgressBar is implemented in JavaScript with PropTypes. Typical usage:

```typescript
interface ProgressBarProps {
  value: number;
  size?: "small" | "medium" | "large";
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "error"
    | "warning";
  margin?: string | string[];
  className?: string;
  trackClassName?: string;
}
```

## Usage Examples

### Basic progress bar

```jsx
import { ProgressBar } from "cleanplate";

export const Example = () => <ProgressBar value={65} />;
```

### Variants

```jsx
import { ProgressBar } from "cleanplate";

export const Example = () => (
  <>
    <ProgressBar value={40} variant="primary" />
    <ProgressBar value={80} variant="success" margin="b-2" />
    <ProgressBar value={20} variant="error" size="small" />
  </>
);
```

## Behavior Notes

- **value:** Must be a number between 0 and 100 (validated in development via PropTypes).
- **DOM:** Outer container with track and fill layers; fill width is set inline from `value`.
- **Spacing:** Uses the shared suffix-only margin API (e.g. `margin="b-2"`, not prefixed values like `"m-b-2"`).


## HTML prototype

```bash
npm run html-to-jsx -- recipe.html
```

### Recipe

```html
<div data-cp="ProgressBar" data-cp-value="50" class="cp-progress-bar"></div>
```

### React equivalent

```jsx
<ProgressBar value={50} />
```
