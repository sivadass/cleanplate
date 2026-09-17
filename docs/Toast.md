# Toast Component

Purpose: Displays transient messages in a portal (fixed top-right). Use a ref to call `addMessage({ mode, message })` imperatively. The parent does not manage toast state; the component handles rendering, stacking, and optional auto-close. Use for success/error feedback, notifications, or short-lived messages.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| autoClose | boolean | no | false | Whether toasts auto-close after autoCloseTime. |
| autoCloseTime | number | no | 5000 | Duration in ms before auto-closing when autoClose is true. |

## Imperative API

| Method | Signature | Description |
| --- | --- | --- |
| addMessage | (toast: ToastMessage) => void | Add a toast. toast has `mode` (info \| error \| warning \| success) and `message` (string). |

## Types

### ToastVariant
```typescript
type ToastVariant = "info" | "error" | "warning" | "success";
```

### ToastMessage
```typescript
interface ToastMessage {
  mode: ToastVariant;
  message: string;
}
```

### ToastRefHandle
```typescript
interface ToastRefHandle {
  addMessage: (toast: ToastMessage) => void;
}
```

### ToastProps
```typescript
interface ToastProps {
  autoClose?: boolean;
  autoCloseTime?: number;
}
```

## Usage Examples

### Basic

```jsx
import { useRef } from "react";
import { Toast, Button } from "cleanplate";

const App = () => {
  const toastRef = useRef(null);
  const showToast = () => {
    toastRef.current?.addMessage({ mode: "success", message: "Saved!" });
  };
  return (
    <>
      <Button onClick={showToast}>Save</Button>
      <Toast ref={toastRef} />
    </>
  );
};
```

### Variants

```jsx
toastRef.current?.addMessage({ mode: "info", message: "Info message" });
toastRef.current?.addMessage({ mode: "error", message: "Error message" });
toastRef.current?.addMessage({ mode: "warning", message: "Warning message" });
toastRef.current?.addMessage({ mode: "success", message: "Success message" });
```

### With auto close

```jsx
<Toast ref={toastRef} autoClose autoCloseTime={5000} />
```

## Behavior Notes

- **Imperative handle:** `forwardRef` + `useImperativeHandle` expose `addMessage` on the ref. The parent never manages a toast list.
- **Portal:** Toasts render in a div prepended to `document.body`, fixed at top-right (16px).
- **Icon:** Each mode maps to an icon via `getVariantIcon` (error → "error", success → "check_circle", info → "info").
- **Click to dismiss:** Clicking a toast removes it.



## HTML prototype

HTML recipe is a **single toast card** snapshot (not the imperative queue). Place the host at the **artboard root** (`position: fixed; top: 16px; right: 16px`). After conversion, wire `ref.addMessage({ mode, message })` by hand.

```bash
npm run html-to-jsx -- toast.single.html
```

### Recipe (open)

```html
<div data-cp="Toast" data-cp-mode="success" data-cp-message="Changes saved" class="cp-toast-container" style="position: fixed; top: 16px; right: 16px; z-index: var(--cp-z-toast)">
  <div class="cp-toast cp-toast--success" role="button" tabindex="0">
    <span class="material-symbols-outlined cp-toast__icon">check_circle</span>
    <div class="cp-toast__message">Changes saved</div>
  </div>
</div>
```

### React equivalent

```jsx
<Toast mode="success" message="Changes saved"><div className="cp-toast cp-toast--success" role="button" tabIndex="0">
    <span className="material-symbols-outlined cp-toast__icon">check_circle</span>
    <div className="cp-toast__message">Changes saved</div>
  </div></Toast>
```

## Related Components / Links

- Alert (inline feedback; use when the message should stay in the layout)
- Button (commonly used to trigger toasts)
- Container (layout around trigger buttons)
