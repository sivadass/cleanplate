# ConfirmDialog Component

Purpose: A modal dialog for confirmation actions (e.g. delete, discard, proceed). Shows a title, optional description, primary and secondary buttons, and optional close button. Use it for user confirmations, destructive actions, and warnings. Supports overlay click and Escape to close, body scroll lock when open, and focus management.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| isOpen | boolean | no | false | Whether the dialog is visible. |
| onClose | () => void | no | — | Called when the dialog should close (close button, overlay, Escape, or after primary/secondary click). |
| title | string | no | "Confirm Action" | Dialog title. |
| description | string | no | "" | Optional description below the title. |
| primaryButtonLabel | string | no | "Confirm" | Label for the primary (confirm) button. |
| onPrimaryButtonClick | () => void | no | — | Called when the primary button is clicked; onClose is also called. |
| secondaryButtonLabel | string | no | "Cancel" | Label for the secondary (cancel) button; empty string hides it. |
| onSecondaryButtonClick | () => void | no | — | Called when the secondary button is clicked; onClose is also called. |
| size | "small" \| "medium" \| "large" | no | "small" | Size of the dialog. |
| variant | "default" \| "destructive" \| "warning" | no | "default" | Visual variant. |
| showCloseButton | boolean | no | true | Whether to show the X close button. |
| closeOnOverlayClick | boolean | no | true | Whether clicking the overlay closes the dialog. |
| closeOnEscape | boolean | no | true | Whether pressing Escape closes the dialog. |
| className | string | no | "" | Additional class names for the dialog panel. |
| overlayClassName | string | no | "" | Additional class names for the overlay. |

## Types

### ConfirmDialogSize
```typescript
type ConfirmDialogSize = "small" | "medium" | "large";
```

### ConfirmDialogVariant
```typescript
type ConfirmDialogVariant = "default" | "destructive" | "warning";
```

### ConfirmDialogProps
```typescript
interface ConfirmDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  primaryButtonLabel?: string;
  onPrimaryButtonClick?: () => void;
  secondaryButtonLabel?: string;
  onSecondaryButtonClick?: () => void;
  size?: ConfirmDialogSize;
  variant?: ConfirmDialogVariant;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
}
```

## Usage Examples

### Basic

```jsx
import { ConfirmDialog, Button } from "cleanplate";
import { useState } from "react";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleConfirm = () => { /* ... */ setIsOpen(false); };
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Delete</Button>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Item"
        description="Are you sure? This cannot be undone."
        primaryButtonLabel="Delete"
        onPrimaryButtonClick={handleConfirm}
        secondaryButtonLabel="Cancel"
      />
    </>
  );
};
```

### Variants

```jsx
<ConfirmDialog variant="default" title="Save?" ... />
<ConfirmDialog variant="destructive" title="Delete Account?" ... />
<ConfirmDialog variant="warning" title="Proceed Anyway?" ... />
```

### Sizes

```jsx
<ConfirmDialog size="small" title="Quick confirm" ... />
<ConfirmDialog size="medium" title="Standard confirm" ... />
<ConfirmDialog size="large" title="Important decision" ... />
```

### No description, custom buttons

```jsx
<ConfirmDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Are you sure?"
  primaryButtonLabel="Yes"
  onPrimaryButtonClick={handleConfirm}
  secondaryButtonLabel="No"
/>
```

### Close behavior

```jsx
<ConfirmDialog
  showCloseButton={true}
  closeOnOverlayClick={true}
  closeOnEscape={true}
  onClose={handleClose}
  ...
/>
```

## Behavior Notes

- **Rendering:** When `isOpen` is false, the component returns `null` (nothing in the DOM).
- **Close:** onClose is called when the user clicks the X button, the overlay (if closeOnOverlayClick), Escape (if closeOnEscape), or either action button (after their handler runs).
- **Body scroll:** When open, `document.body.style.overflow` is set to `"hidden"`; restored on close.
- **Focus:** On open, focus moves to the dialog panel (ref + tabIndex={-1}); on close, focus returns to the previously focused element.
- **ARIA:** The overlay has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the title.

## Related Components / Links

- Button (used to open the dialog and for primary/secondary actions inside)
- Typography (used for title and description)
- Icon (used for the close button)
