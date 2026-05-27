# Modal Component

Purpose: A full-featured modal overlay for forms, long content, or custom dialogs. Use it when you need a larger, flexible dialog than ConfirmDialog—with optional title, close button, footer actions, and configurable close behavior (overlay click, Escape). Supports body scroll lock and focus management when open.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | yes | — | Modal body content. |
| isOpen | boolean | no | false | Whether the modal is visible. |
| onClose | () => void | no | — | Called when the modal should close (close button, overlay, or Escape). |
| title | string | no | "" | Title displayed in the modal header. |
| size | "small" \| "medium" \| "large" \| "fullscreen" | no | "medium" | Size of the modal panel. |
| showCloseButton | boolean | no | true | Whether to show the X close button in the header. |
| closeOnOverlayClick | boolean | no | true | Whether clicking the overlay closes the modal. |
| closeOnEscape | boolean | no | true | Whether pressing Escape closes the modal. |
| margin | string \| SpacingOption[] | no | "m-0" | Margin around the modal. Use full class string (e.g. "m-0") or array of spacing suffixes; component adds `m-` prefix. |
| className | string | no | "" | Additional class names for the modal panel. |
| overlayClassName | string | no | "" | Additional class names for the overlay. |
| contentClassName | string | no | "" | Additional class names for the content wrapper. |
| primaryButtonLabel | string | no | "" | Label for the primary footer button; empty hides it. |
| onPrimaryButtonClick | () => void | no | — | Called when the primary footer button is clicked. |
| secondaryButtonLabel | string | no | "" | Label for the secondary footer button; empty hides it. |
| onSecondaryButtonClick | () => void | no | — | Called when the secondary footer button is clicked. |
| dataTestId | string | no | — | Root `data-testid` on the dialog panel; suffixed ids on overlay, header, title, close, body, footer, and action buttons (see **E2E / test selectors**). |

## Types

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### ModalSize
```typescript
type ModalSize = "small" | "medium" | "large" | "fullscreen";
```

### ModalMargin
```typescript
type ModalMargin = string | SpacingOption[];
```

### ModalProps
```typescript
interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  margin?: ModalMargin;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  primaryButtonLabel?: string;
  onPrimaryButtonClick?: () => void;
  secondaryButtonLabel?: string;
  onSecondaryButtonClick?: () => void;
  dataTestId?: string;
}
```

## E2E / test selectors

Pass `dataTestId="save-modal"` to get stable Playwright / Testing Library hooks:

| Suffix | Element |
| --- | --- |
| *(root)* | Dialog panel (`role="dialog"`) |
| `-overlay` | Backdrop overlay |
| `-header` | Header row (title + close button) |
| `-title` | Title text |
| `-close` | Header close (X) button |
| `-body` | Main content area |
| `-footer` | Footer action row |
| `-primary` | Primary footer button |
| `-secondary` | Secondary footer button |

Header, title, close, footer, and button suffixes are omitted when those regions are not rendered (e.g. no `title` and `showCloseButton={false}` hides `-header`, `-title`, and `-close`).

### Playwright example

```ts
await page.getByRole("button", { name: "Open settings" }).click();
await expect(page.getByTestId("settings-modal")).toBeVisible();
await expect(page.getByTestId("settings-modal-title")).toHaveText("Settings");
await page.getByTestId("settings-modal-body").getByLabel("Display name").fill("Ada");
await page.getByTestId("settings-modal-primary").click();
await expect(page.getByTestId("settings-modal")).toBeHidden();
```

## Usage Examples

### Basic

```jsx
import { Modal, Button, Typography } from "cleanplate";
import { useState } from "react";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
      >
        <Typography variant="p">Modal body content goes here.</Typography>
      </Modal>
    </>
  );
};
```

### Sizes

```jsx
<Modal size="small" title="Small" isOpen={isOpen} onClose={onClose}>...</Modal>
<Modal size="medium" title="Medium" isOpen={isOpen} onClose={onClose}>...</Modal>
<Modal size="large" title="Large" isOpen={isOpen} onClose={onClose}>...</Modal>
<Modal size="fullscreen" title="Fullscreen" isOpen={isOpen} onClose={onClose}>...</Modal>
```

### With footer buttons

```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Save Changes"
  primaryButtonLabel="Save"
  onPrimaryButtonClick={handleSave}
  secondaryButtonLabel="Cancel"
  onSecondaryButtonClick={() => setIsOpen(false)}
>
  <Typography variant="p">Review and save your changes.</Typography>
</Modal>
```

### Close behavior

```jsx
<Modal
  showCloseButton={true}
  closeOnOverlayClick={true}
  closeOnEscape={true}
  onClose={handleClose}
  ...
/>
```

### Form inside modal

```jsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Contact Form" size="medium">
  <form onSubmit={handleSubmit}>
    {/* form fields */}
    <Button type="submit">Submit</Button>
  </form>
</Modal>
```

### With test selectors

```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Delete item"
  dataTestId="delete-item-modal"
  primaryButtonLabel="Delete"
  onPrimaryButtonClick={handleDelete}
  secondaryButtonLabel="Cancel"
  onSecondaryButtonClick={() => setIsOpen(false)}
>
  <Typography variant="p">This action cannot be undone.</Typography>
</Modal>
```

## Behavior Notes

- **Rendering:** The modal mounts when `isOpen` is true and unmounts shortly after close so the exit transition can finish.
- **Close:** onClose is called when the user clicks the X button (if showCloseButton), the overlay (if closeOnOverlayClick), or Escape (if closeOnEscape). Footer buttons do not auto-close; call onClose in their handlers if desired.
- **Body scroll:** Body scroll is locked while open and restored when dismissed.
- **Focus:** Focus is trapped while open and returned to the previously focused element on close.
- **ARIA:** The overlay has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the title when present.
- **Spacing:** `margin` accepts a full class string (e.g. "m-0") or an array of spacing suffixes; the component uses `getSpacingClass` with prefix `m-`.

## Related Components / Links

- ConfirmDialog (simpler confirmation-only modal with title, description, primary/secondary actions)
- Button (often used to open the modal and for footer actions)
- Typography (used for title and body content)
- Icon (used for the close button)
