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

### Recommended: account / user menu content (Header & AppShell)

When **`headerRight`** is a user menu, use **`Dropdown`** with an **`Avatar`** trigger (`placement="bottom-end"` and `offset={8}` are typical) and **`content`** built in **two parts**:

1. **User meta** — Optional caption (“Signed in as”), **display name**, **email**. Use **`Typography`** with clear hierarchy: `variant="small"` + `var(--text-muted)` for the caption; `variant="p"` + `isBold` + `var(--text-default)` for the name; `variant="small"` + `wordBreak="wrap"` + `var(--text-subtle)` for the email. Space lines with the **`margin`** suffix API (e.g. `"0"`, `"t-2"`).
2. **Actions** — A vertical **`MenuList`** (`direction="vertical"`, `size="small"`). In `onMenuClick`, run your handler then call **`onClose?.()`** so the panel closes (Dropdown injects **`onClose`** into `content` when cloning).

**Whitespace:** Vertical **`MenuList`** items use **`padding: 8px 16px`** on each link (`--space-2` × `--space-4`). Wrap the meta block in a container using the same horizontal inset and similar vertical rhythm so copy lines up with menu rows:

```jsx
const accountMetaStyle = {
  padding: "var(--space-2) var(--space-4) var(--space-3) var(--space-4)",
  marginBottom: "var(--space-2)",
  borderBottom: "1px solid var(--gray-100)",
};
```

Use the same structure whether **`Header`** is used standalone or passed as **`header`** on **`AppShell`** (`HeaderProps`); only data and handlers change.

```jsx
import { Dropdown, Avatar, MenuList, Typography } from "cleanplate";

const ACCOUNT_MENU_ITEMS = [
  { label: "Profile", value: "/profile", icon: "account_circle" },
  { label: "Settings", value: "/settings", icon: "settings" },
  { label: "Sign out", value: "/logout", icon: "logout" },
];

function AccountMenuContent({ onClose, onItemSelect }) {
  const handleMenuClick = (item) => {
    onItemSelect?.(item);
    onClose?.();
  };
  return (
    <>
      <div
        style={{
          padding: "var(--space-2) var(--space-4) var(--space-3) var(--space-4)",
          marginBottom: "var(--space-2)",
          borderBottom: "1px solid var(--gray-100)",
        }}
      >
        <Typography variant="small" margin="0" style={{ color: "var(--text-muted)" }}>
          Signed in as
        </Typography>
        <Typography variant="p" margin="t-2" isBold style={{ color: "var(--text-default)" }}>
          Jordan Lee
        </Typography>
        <Typography variant="small" margin="t-2" wordBreak="wrap" style={{ color: "var(--text-subtle)" }}>
          jordan@example.com
        </Typography>
      </div>
      <MenuList
        items={ACCOUNT_MENU_ITEMS}
        direction="vertical"
        variant="light"
        size="small"
        margin="0"
        onMenuClick={handleMenuClick}
      />
    </>
  );
}

<Dropdown
  placement="bottom-end"
  offset={8}
  trigger={
    <Avatar name="Jordan Lee" image="/avatar.jpg" size="medium" margin="0" tabIndex={0} />
  }
  content={<AccountMenuContent />}
/>
```

Live reference: **molecules/Header/Playground** in Storybook uses this pattern for **`headerRight`**.

## Behavior Notes

- **Trigger modes:** Exactly one of `trigger`, `renderTrigger`, or `triggerLabel` must be used; the component throws if none are provided.
- **Content:** The `content` element is cloned; the component injects `onClose` and merges `className` so the panel can close and be styled.
- **Positioning:** Placement is applied via CSS classes; when `flip` or `shift` are true, the component adjusts placement/position so the panel stays in view.
- **Accessibility:** The trigger receives `aria-expanded` and `aria-haspopup`; the panel has `role="menu"`. Escape and (optionally) click-outside close the dropdown.
- **Animation:** Opening/closing uses CSS classes (`dropdown-opening` / `dropdown-closing`); a short delay (e.g. 150ms) is used before unmounting so the close animation can run.

## Related Components / Links

- Button (commonly used as trigger or inside renderTrigger)
- Avatar (common trigger for account menus; see **Recommended: account / user menu content** above)
- MenuList (often used inside dropdown content for menu items)
- Header, AppShell (pass the same `headerRight` / account menu structure for standalone header or shell layout)
- Icon (used in the default trigger when `triggerLabel` is set for arrow icons)
