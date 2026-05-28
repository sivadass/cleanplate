# Header Component

Purpose: Responsive navigation header with logo, menu items, and customizable left, center, and right slots. Use for app navigation. Supports sizes, variants, margin spacing, and a responsive mobile menu that slides in from the left. Uses MenuList for nav items; headerLeft, headerCenter, headerRight for custom content.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| logoUrl | string | no | — | URL for the logo image (shown when headerLeft is not provided). |
| activeMenuItem | string | no | — | Value of the currently active menu item (matches item.value). |
| onMenuItemClick | (item: MenuListItem) => void | no | — | Called when a menu item is clicked; receives the clicked item. |
| className | string | no | "" | Additional class names for the root element. |
| headerLeft | ReactNode | no | — | Custom content for the left area (replaces logo when provided). |
| headerRight | ReactNode | no | — | Custom content for the right area. |
| headerCenter | ReactNode | no | — | Custom content for the center area (replaces MenuList when provided). |
| showCenterMenu | boolean | no | true | When true, shows `menuItems` in the center on wide viewports. Set false when primary nav is only in a sidebar; `menuItems` is still used for the mobile menu. |
| menuItems | MenuListItem[] | yes | — | Menu items for center nav and mobile menu; each has label, value, optional icon. |
| size | "small" \| "medium" \| "large" | no | — | Size of the header. |
| variant | "light" \| "dark" | no | — | Visual variant. |
| margin | string \| SpacingOption[] | no | — | Spacing suffix(s) for outer margin; component adds m- prefix. |

## Types

### HeaderSize
```typescript
type HeaderSize = "small" | "medium" | "large";
```

### HeaderVariant
```typescript
type HeaderVariant = "light" | "dark";
```

### HeaderMargin
```typescript
type HeaderMargin = string | SpacingOption[];
```

### HeaderProps
```typescript
interface HeaderProps {
  logoUrl?: string;
  activeMenuItem?: string;
  onMenuItemClick?: (item: MenuListItem) => void;
  className?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerCenter?: React.ReactNode;
  showCenterMenu?: boolean;
  menuItems: MenuListItem[];
  size?: HeaderSize;
  variant?: HeaderVariant;
  margin?: HeaderMargin;
}
```

## Usage Examples

### Basic

```jsx
import { useState } from "react";
import { Header, Avatar } from "cleanplate";

const MENU_ITEMS = [
  { label: "Dashboard", value: "/", icon: "speed" },
  { label: "Projects", value: "/projects", icon: "receipt_long" },
];

const AppHeader = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("/");
  return (
    <Header
      logoUrl="/logo.svg"
      menuItems={MENU_ITEMS}
      activeMenuItem={activeMenuItem}
      onMenuItemClick={(item) => setActiveMenuItem(item.value)}
      headerRight={<Avatar name="John" />}
    />
  );
};
```

### With AppShell (desktop nav in sidebar only)

Use `showCenterMenu: false` so `menuItems` is only used for the header’s mobile menu while the sidebar shows the same links on desktop. For **`headerRight`**, use the same **Dropdown + Avatar + user meta + vertical MenuList** pattern as in **`docs/Dropdown.md`** (*Recommended: account / user menu content*)—whether **`Header`** is rendered by you or by **`AppShell`** via **`header={{ ... }}`**.

```jsx
import { Dropdown, Avatar } from "cleanplate";
// AccountMenuContent: full structure in docs/Dropdown.md

<Header
  logoUrl="/logo.svg"
  menuItems={MENU_ITEMS}
  showCenterMenu={false}
  activeMenuItem={active}
  onMenuItemClick={onMenuClick}
  headerRight={
    <Dropdown
      placement="bottom-end"
      offset={8}
      trigger={<Avatar name="Jordan Lee" size="medium" margin="0" tabIndex={0} />}
      content={<AccountMenuContent />}
    />
  }
/>
```

### User account menu (`headerRight`)

Prefer **`Dropdown`** with **`Avatar`** as **`trigger`** and **`content`** that separates **identity** (caption, name, email with **`Typography`** + meta padding aligned to vertical **`MenuList`** rows) from **actions** (vertical **`MenuList`** calling **`onClose`** after each action). See **`docs/Dropdown.md`** — *Recommended: account / user menu content* — and Storybook **molecules/Header/Playground**.

### With custom slots

```jsx
<Header
  menuItems={menuItems}
  activeMenuItem={activeItem}
  onMenuItemClick={handleClick}
  headerLeft={<img src="/logo.svg" alt="Logo" />}
  headerRight={<Avatar name="User" />}
/>
```

### Variants and sizes

```jsx
<Header menuItems={items} variant="light" activeMenuItem={active} onMenuItemClick={handle} />
<Header menuItems={items} variant="dark" activeMenuItem={active} onMenuItemClick={handle} />
<Header menuItems={items} size="small" activeMenuItem={active} onMenuItemClick={handle} />
```

## Behavior Notes

- **menuItems:** Required; each item has label, value, optional icon (Material icon name).
- **headerLeft / headerCenter / headerRight:** When provided, replace the default logo, MenuList, or right slot.
- **AppShell:** If you pass **`header`** as **`HeaderProps`** to **`AppShell`**, configure **`headerRight`** the same way as a standalone **`Header`** (recommended account dropdown structure does not change).
- **showCenterMenu:** When `false`, the center column is empty on desktop (unless `headerCenter` is set). `menuItems` is still used for the mobile overlay.
- **Mobile:** Below 1024px, center nav hides; hamburger shows. Click opens a Floating UI drawer with backdrop fade and left slide animation.
- **Backdrop + close:** Clicking the backdrop closes the drawer; close button and menu item clicks also close it.
- **Scroll lock:** While the mobile drawer is open, background page scroll is locked.
- **onMenuItemClick:** Called with the clicked item; mobile menu closes on click.
- **Margin:** Uses the suffix API (e.g. `"0"` → m-0).

## Related Components / Links

- MenuList (used in center and mobile menu)
- Dropdown, Avatar (account menu in **headerRight**; see `docs/Dropdown.md`)
- AppShell (passes **`header`** as Header props; same **headerRight** recommendations apply)
- Button, Icon (mobile menu trigger and close)
- Floating UI overlay/dialog primitives (mobile menu drawer)
