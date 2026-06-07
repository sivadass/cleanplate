# Drawer Component

Purpose: A slide-in overlay panel for navigation, filters, settings, or detail views. On desktop (≥768px), slides from a configurable edge (`left`, `right`, `top`, or `bottom`). Below 768px, always renders as a bottom sheet (max height 90dvh). Includes fade/slide transitions, focus management, and Modal-like optional chrome (title, close button, footer actions).

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | yes | — | Drawer body content. |
| isOpen | boolean | no | false | Whether the drawer is visible. |
| onClose | () => void | no | — | Called when the drawer should close (close button, overlay, or Escape). |
| placement | "left" \| "right" \| "top" \| "bottom" | no | "right" | Edge the drawer slides from on desktop; ignored on mobile (always bottom sheet). |
| size | "small" \| "medium" \| "large" \| "full" | no | "medium" | Panel size preset (width for side drawers, height for top/bottom). |
| title | string | no | "" | Title displayed in the drawer header. |
| showCloseButton | boolean | no | true | Whether to show the X close button in the header. |
| closeOnOverlayClick | boolean | no | true | Whether clicking the overlay closes the drawer. |
| closeOnEscape | boolean | no | true | Whether pressing Escape closes the drawer. |
| margin | string \| SpacingOption[] | no | "0" | Margin spacing (suffix or array of suffixes; component adds `m-` prefix). |
| className | string | no | "" | Additional class names for the drawer panel. |
| overlayClassName | string | no | "" | Additional class names for the overlay. |
| contentClassName | string | no | "" | Additional class names for the content wrapper. |
| headerClassName | string | no | "" | Additional class names for the header row. |
| bodyClassName | string | no | "" | Additional class names for the body region. |
| footerClassName | string | no | "" | Additional class names for the footer row. |
| ariaLabel | string | no | — | Accessible name when no `title` is provided. Required for a11y when `title` is omitted. |
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

### DrawerPlacement
```typescript
type DrawerPlacement = "left" | "right" | "top" | "bottom";
```

### DrawerSize
```typescript
type DrawerSize = "small" | "medium" | "large" | "full";
```

### DrawerMargin
```typescript
type DrawerMargin = string | SpacingOption[];
```

### DrawerProps
```typescript
interface DrawerProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  title?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  margin?: DrawerMargin;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  ariaLabel?: string;
  primaryButtonLabel?: string;
  onPrimaryButtonClick?: () => void;
  secondaryButtonLabel?: string;
  onSecondaryButtonClick?: () => void;
  dataTestId?: string;
}
```

## E2E / test selectors

Pass `dataTestId="filters-drawer"` to get stable Playwright / Testing Library hooks:

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

Header, title, close, footer, and button suffixes are omitted when those regions are not rendered.

### Playwright example

```ts
await page.getByRole("button", { name: "Open filters" }).click();
await expect(page.getByTestId("filters-drawer")).toBeVisible();
await page.getByTestId("filters-drawer-body").getByLabel("Category").selectOption("books");
await page.getByTestId("filters-drawer-primary").click();
await expect(page.getByTestId("filters-drawer")).toBeHidden();
```

## Usage Examples

### Basic

```jsx
import { Drawer, Button, Typography } from "cleanplate";
import { useState } from "react";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filters"
        placement="right"
      >
        <Typography variant="p">Filter options go here.</Typography>
      </Drawer>
    </>
  );
};
```

### Placements (desktop)

```jsx
<Drawer placement="left" title="Navigation" isOpen={isOpen} onClose={onClose}>...</Drawer>
<Drawer placement="right" title="Details" isOpen={isOpen} onClose={onClose}>...</Drawer>
<Drawer placement="top" title="Announcements" isOpen={isOpen} onClose={onClose}>...</Drawer>
<Drawer placement="bottom" title="Actions" isOpen={isOpen} onClose={onClose}>...</Drawer>
```

### With footer buttons

```jsx
<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Apply Filters"
  primaryButtonLabel="Apply"
  onPrimaryButtonClick={handleApply}
  secondaryButtonLabel="Reset"
  onSecondaryButtonClick={handleReset}
>
  <Typography variant="p">Choose filter criteria.</Typography>
</Drawer>
```

### Custom class names

```jsx
<Drawer
  isOpen={isOpen}
  onClose={onClose}
  title="Settings"
  className="my-drawer-panel"
  overlayClassName="my-drawer-overlay"
  bodyClassName="my-drawer-body"
  dataTestId="settings-drawer"
>
  ...
</Drawer>
```

## Behavior Notes

- **Desktop (≥768px):** Panel slides from the configured `placement` edge with subtle opacity fade. Side drawers use full viewport height; top/bottom drawers use full viewport width.
- **Mobile (<768px):** Always renders as a bottom sheet regardless of `placement`. Max height is **90dvh** with rounded top corners and safe-area padding at the bottom.
- **Rendering:** Mounts when `isOpen` is true and stays mounted briefly after close so the exit transition can finish.
- **Close:** `onClose` is called when the user clicks the X button (if `showCloseButton`), the overlay (if `closeOnOverlayClick`), or Escape (if `closeOnEscape`). Footer buttons do not auto-close; call `onClose` in their handlers if desired.
- **Body scroll:** Locked while open and restored on close.
- **Focus:** Trapped while open; returned to the previously focused element on close.
- **ARIA:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` when `title` is present, or `aria-label` via `ariaLabel`. Provide **`title` or `ariaLabel`** — a dev warning is logged when the drawer opens without either.
- **Spacing:** `margin` uses the suffix API (e.g. `"0"`, `"b-2"`); component adds `m-` prefix.

## Related Components / Links

- Modal (centered overlay dialog)
- BottomSheet (drag gestures and snap points from bottom only)
- ConfirmDialog (simple confirmation overlay)
- Button (open trigger and footer actions)
- Typography (title and body content)
