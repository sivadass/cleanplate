# MenuList Component

Purpose: Renders a list of navigational items with optional icons, active state highlighting, and customizable layout. Use for nav menus, sidebars, or link lists. Supports horizontal and vertical directions, sizes (small, medium, large), variants (light, dark), and margin spacing. Items use Animated with fade-in-left on mount.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| items | MenuListItem[] | yes | — | List of menu items; each has label, value, optional icon. |
| activeItem | string | no | — | Value of the currently active item (matches item.value). |
| size | "small" \| "medium" \| "large" | no | — | Size of menu items. |
| variant | "light" \| "dark" | no | — | Visual variant. |
| direction | "horizontal" \| "vertical" | no | "horizontal" | Layout direction of the list. |
| margin | string \| SpacingOption[] | no | — | Spacing suffix(s) for outer margin; component adds m- prefix. |
| className | string | no | "" | Additional class names for the root element. |
| onMenuClick | (item: MenuListItem) => void | no | — | Called when a menu item is clicked; receives the clicked item. |

## Types

### MenuListItem
```typescript
interface MenuListItem {
  label: string;
  value: string;
  icon?: MaterialIconName;  // optional Material icon name
}
```

### MenuListSize
```typescript
type MenuListSize = "small" | "medium" | "large";
```

### MenuListVariant
```typescript
type MenuListVariant = "light" | "dark";
```

### MenuListDirection
```typescript
type MenuListDirection = "horizontal" | "vertical";
```

### MenuListProps
```typescript
interface MenuListProps {
  items: MenuListItem[];
  activeItem?: string;
  size?: MenuListSize;
  variant?: MenuListVariant;
  direction?: MenuListDirection;
  margin?: MenuListMargin;
  className?: string;
  onMenuClick?: (item: MenuListItem) => void;
}
```

## Usage Examples

### Basic

```jsx
import { useState } from "react";
import { MenuList } from "cleanplate";

const ITEMS = [
  { label: "Dashboard", value: "/", icon: "speed" },
  { label: "Projects", value: "/projects", icon: "receipt_long" },
];

const Nav = () => {
  const [activeItem, setActiveItem] = useState("/");
  return (
    <MenuList
      items={ITEMS}
      activeItem={activeItem}
      onMenuClick={(item) => setActiveItem(item.value)}
    />
  );
};
```

### Directions and variants

```jsx
<MenuList items={items} direction="horizontal" activeItem={activeItem} onMenuClick={handleClick} />
<MenuList items={items} direction="vertical" activeItem={activeItem} onMenuClick={handleClick} />
<MenuList items={items} variant="light" activeItem={activeItem} onMenuClick={handleClick} />
<MenuList items={items} variant="dark" activeItem={activeItem} onMenuClick={handleClick} />
```

### Sizes

```jsx
<MenuList items={items} size="small" activeItem={activeItem} onMenuClick={handleClick} />
<MenuList items={items} size="medium" activeItem={activeItem} onMenuClick={handleClick} />
<MenuList items={items} size="large" activeItem={activeItem} onMenuClick={handleClick} />
```

## Behavior Notes

- **Items:** Each item must have `label` and `value`. `icon` is optional (Material icon name).
- **onMenuClick:** Called with the clicked item. Use it to update `activeItem` or navigate.
- **DOM:** A `div` wrapping a `ul` of `li` elements; each `li` contains an anchor.
- **Animated:** Each item is wrapped in Animated with `fade-in-left` and staggered delay.
- **Margin:** Uses the suffix API (e.g. `"0"` → m-0, `"b-2"` → m-b-2).

## Related Components / Links

- Dropdown (often uses MenuList inside for menu items)
- Header (commonly uses MenuList for navigation)
- Container (layout around the menu)
- Typography, Icon, Animated (used internally)
