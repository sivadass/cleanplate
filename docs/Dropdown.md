# Dropdown Component

Purpose: A floating panel that shows content relative to a trigger. Use it for menus, option lists, or any content that opens on click. Supports 12 placements, optional flip/shift to stay in viewport, and three trigger modes: a `trigger` element, a `renderTrigger` function, or a `triggerLabel` for a default button.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| trigger | React.ReactElement | no | — | Trigger element to clone; ref and onClick are attached. Omit when using `renderTrigger` or `triggerLabel`. |
| content | React.ReactElement | yes | — | Content shown in the floating panel. Receives `onClose` and `className` when cloned. |
| placement | DropdownPlacement | no | "bottom-end" | Preferred position relative to trigger (e.g. "bottom-end", "top-start"). |
| offset | number | no | 4 | Gap in pixels between trigger and panel. |
| shift | boolean | no | true | When true, shift panel to stay inside viewport. |
| flip | boolean | no | true | When true, flip to opposite side when there is no space. |
| closeOnClickOutside | boolean | no | true | Close when user clicks outside trigger and panel. |
| closeOnEscape | boolean | no | true | Close when user presses Escape. |
| className | string | no | "" | Class name for the wrapper div. |
| contentClassName | string | no | "" | Class name applied to the cloned content element. |
| renderTrigger | (params: DropdownRenderTriggerParams) => React.ReactNode | no | — | Render prop for a custom trigger; receives `isOpen`, `isAnimating`, `placement`, `toggle`, `close`, `triggerProps`. |
| triggerLabel | string | no | — | Label for the default button trigger. Use when neither `trigger` nor `renderTrigger` is provided. |

## Types

### DropdownPlacement
```typescript
type DropdownPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";
```

### DropdownTriggerProps
```typescript
interface DropdownTriggerProps {
  ref: RefObject<HTMLElement | null>;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  className: string;
  role: string;
  "aria-expanded": boolean;
  "aria-haspopup": string;
}
```

### DropdownRenderTriggerParams
```typescript
interface DropdownRenderTriggerParams {
  isOpen: boolean;
  isAnimating: boolean;
  placement: DropdownPlacement;
  toggle: () => void;
  close: () => void;
  triggerProps: DropdownTriggerProps;
}
```

### DropdownProps
```typescript
interface DropdownProps {
  trigger?: React.ReactElement;
  content: React.ReactElement;
  placement?: DropdownPlacement;
  offset?: number;
  shift?: boolean;
  flip?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  contentClassName?: string;
  renderTrigger?: (params: DropdownRenderTriggerParams) => React.ReactNode;
  triggerLabel?: string;
}
```

## Usage Examples

### With trigger element

```jsx
import { Dropdown, Button } from "cleanplate";

const MenuContent = ({ onClose }) => (
  <div style={{ padding: "var(--space-2)" }}>
    <button onClick={onClose}>Close</button>
    <p>Menu items here</p>
  </div>
);

export const Example = () => (
  <Dropdown
    trigger={<Button>Open Menu</Button>}
    content={<MenuContent />}
    placement="bottom-end"
  />
);
```

### With triggerLabel

```jsx
import { Dropdown } from "cleanplate";

export const Example = () => (
  <Dropdown
    triggerLabel="Select Option"
    content={<MenuContent />}
    placement="bottom-end"
  />
);
```

### With renderTrigger

```jsx
import { Dropdown, Button } from "cleanplate";

export const Example = () => (
  <Dropdown
    renderTrigger={({ isOpen, triggerProps }) => (
      <Button {...triggerProps}>
        {isOpen ? "Close" : "Open"}
      </Button>
    )}
    content={<MenuContent />}
  />
);
```

### Placement and offset

```jsx
<Dropdown
  trigger={<Button>Menu</Button>}
  content={<MenuContent />}
  placement="top-start"
  offset={8}
/>
```

### Disable flip / shift

```jsx
<Dropdown
  trigger={<Button>Menu</Button>}
  content={<MenuContent />}
  placement="top"
  flip={false}
  shift={false}
/>
```

### Close behavior

```jsx
<Dropdown
  trigger={<Button>Menu</Button>}
  content={<MenuContent />}
  closeOnClickOutside={false}
  closeOnEscape={true}
/>
```

## Behavior Notes

- **Trigger modes:** Exactly one of `trigger`, `renderTrigger`, or `triggerLabel` must be used; the component throws if none are provided.
- **Content:** The `content` element is cloned; the component injects `onClose` and merges `className` so the panel can close and be styled.
- **Positioning:** Placement is applied via CSS classes; when `flip` or `shift` are true, the component adjusts placement/position so the panel stays in view.
- **Accessibility:** The trigger receives `aria-expanded` and `aria-haspopup`; the panel has `role="menu"`. Escape and (optionally) click-outside close the dropdown.
- **Animation:** Opening/closing uses CSS classes (`dropdown-opening` / `dropdown-closing`); a short delay (e.g. 150ms) is used before unmounting so the close animation can run.

## Related Components / Links

- Button (commonly used as trigger or inside renderTrigger)
- MenuList (often used inside dropdown content for menu items)
- Icon (used in the default trigger when `triggerLabel` is set for arrow icons)
