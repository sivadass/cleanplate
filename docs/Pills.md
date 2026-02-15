# Pills Component

Purpose: A single tag or chip that can show a label only (read-only), an inline input with submit (edit), or a label with a close button (remove). Use it for tags, filters, or editable chips where the user can add or remove items. Submit in edit mode via Enter or check button; remove via close button. Optional `isLoading` and `isDisabled`; margin uses the suffix API.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| margin | string \| SpacingOption[] | no | "0" | Margin spacing. Suffix or array of spacing suffixes; component adds `m-` prefix. |
| className | string | no | "" | Additional class names for the root element. |
| label | string | no | "" | Label in read-only/remove mode; initial value in edit mode. |
| placeholder | string | no | "Add tag" | Placeholder for the input in edit mode. |
| onSubmit | (value: string) => void | no | — | Called when user submits in edit mode (Enter or check); receives current input value. |
| onRemove | () => void | no | — | Called when user clicks close in remove mode. |
| isDisabled | boolean | no | false | Disables the input and action button. |
| isLoading | boolean | no | false | Shows spinner instead of icon in edit/remove mode. |
| mode | "read-only" \| "edit" \| "remove" | no | "read-only" | read-only (label only), edit (input + check), remove (label + close). |

## Types

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### PillsMargin
```typescript
type PillsMargin = string | SpacingOption[];
```

### PillsMode
```typescript
type PillsMode = "read-only" | "edit" | "remove";
```

### PillsProps
```typescript
interface PillsProps {
  margin?: PillsMargin;
  className?: string;
  label?: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onRemove?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  mode?: PillsMode;
}
```

## Usage Examples

### Basic

```jsx
import { Pills } from "cleanplate";

<Pills label="Taxi" mode="read-only" />
<Pills mode="edit" placeholder="Add tag" onSubmit={(v) => console.log(v)} />
<Pills label="Tag" mode="remove" onRemove={() => {}} />
```

### Controlled (edit)

```jsx
import { Pills } from "cleanplate";
import { useState } from "react";

const [tag, setTag] = useState("Taxi");
<Pills
  label={tag}
  mode="edit"
  placeholder="Add tag"
  onSubmit={(v) => setTag(v)}
  onRemove={() => setTag("")}
/>
```

### Modes

```jsx
<Pills label="Tag" mode="read-only" />
<Pills label="" mode="edit" placeholder="Add tag" onSubmit={onSubmit} />
<Pills label="Tag" mode="remove" onRemove={onRemove} />
```

### Loading and disabled

```jsx
<Pills mode="edit" isLoading />
<Pills label="Tag" mode="remove" isDisabled onRemove={() => {}} />
```

## Behavior Notes

- **Edit mode:** Internal state holds the input value. On submit (Enter or check), `onSubmit(value)` is called and internal value is cleared. Parent can pass new `label` to reflect saved value.
- **Remove mode:** Close button calls `onRemove()`; parent typically clears or unmounts the pill.
- **Spacing:** `margin` uses the suffix API; the component adds the `m-` prefix via `getSpacingClass`.

## Related Components / Links

- Container (layout for multiple pills)
- FormControls.Input, Button, Icon, Spinner (used internally)
- Typography (used for label in read-only/remove mode)
