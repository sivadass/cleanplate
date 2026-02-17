# BottomSheet Component

Purpose: Slides up from the bottom of the screen. Use for additional content, forms, or actions without leaving the current context. Controlled by `isOpen` and `onClose`. Supports drag-to-close, snap points (30%, 60%, 90% of viewport), touch and mouse gestures, body scroll lock when open, and margin spacing.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| isOpen | boolean | yes | — | Whether the bottom sheet is open. |
| onClose | () => void | no | — | Called when the user drags to close (past threshold). |
| margin | string \| SpacingOption[] | no | — | Spacing suffix(s) for outer margin; component adds m- prefix. |
| className | string | no | "" | Additional class names for the sheet panel. |
| children | ReactNode | no | — | Content rendered inside the sheet. |

## Types

### BottomSheetMargin
```typescript
type BottomSheetMargin = string | SpacingOption[];
```

### BottomSheetProps
```typescript
interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  margin?: BottomSheetMargin;
  className?: string;
  children?: React.ReactNode;
}
```

## Usage Examples

### Basic

```jsx
import { useState } from "react";
import { BottomSheet, Button } from "cleanplate";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>Content here</p>
      </BottomSheet>
    </>
  );
};
```

### With Container and Typography

```jsx
<BottomSheet isOpen={isOpen} onClose={handleClose}>
  <Container padding="4">
    <Typography variant="h5" margin="m-0 m-b-2">Title</Typography>
    <Typography variant="p">Body text</Typography>
  </Container>
</BottomSheet>
```

## Behavior Notes

- **isOpen / onClose:** Controlled visibility. `onClose` is called when the user drags past the close threshold.
- **Snap points:** Sheet snaps to 30%, 60%, or 90% of viewport height.
- **DOM:** Overlay div wrapping the sheet panel; handle area for drag; content area for children.
- **Body overflow:** Set to `hidden` when open, restored on close or unmount.
- **Margin:** Uses the suffix API (e.g. `"0"` → m-0).

## Related Components / Links

- Modal (full overlay dialog)
- ConfirmDialog (simple confirmation overlay)
- Button (commonly used to trigger opening)
- Container, Typography (layout and content inside the sheet)
