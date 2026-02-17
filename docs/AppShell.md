# AppShell Component

Purpose: Full-page layout that combines an optional Header (top), optional Footer (bottom), and an optional MenuList as a left sidebar, with main content in the center. Use for dashboard-style apps where the sidebar holds primary navigation and the header holds logo and utilities (e.g. user menu). Sidebar is hidden below 1024px; pass the same menu items to the header for the header’s mobile menu.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | ReactNode | yes | — | Main content (page area). |
| header | ReactNode \| HeaderProps | no | — | Top bar: pass Header props object or custom ReactNode. Omit to hide header. |
| footer | ReactNode \| FooterProps | no | — | Bottom bar: pass Footer props object or custom ReactNode. Omit to hide footer. |
| sidebar | AppShellSidebarConfig | no | — | Sidebar config (MenuList as vertical nav on the left). Omit to hide sidebar. |
| sidebarWidth | string | no | "240px" | Width of the sidebar (e.g. "240px", "16rem"). |
| className | string | no | "" | Additional class name for the root element. |
| contentClassName | string | no | "" | Additional class name for the main content wrapper. |

## Types

### AppShellSidebarConfig
```typescript
interface AppShellSidebarConfig {
  items: MenuListItem[];      // Menu items for the sidebar
  activeItem?: string;        // Value of the currently active item
  onMenuClick?: (item: MenuListItem) => void;
  size?: MenuListSize;        // small | medium | large
  variant?: MenuListVariant;  // light | dark
}
```

### AppShellProps
```typescript
interface AppShellProps {
  children: React.ReactNode;
  header?: React.ReactNode | HeaderProps;
  footer?: React.ReactNode | FooterProps;
  sidebar?: AppShellSidebarConfig;
  sidebarWidth?: string;
  className?: string;
  contentClassName?: string;
}
```

## Usage Examples

### Full dashboard (sidebar + header + footer)

```jsx
import { useState } from "react";
import { AppShell, Container, Typography, Avatar } from "cleanplate";

const MENU_ITEMS = [
  { label: "Dashboard", value: "/", icon: "speed" },
  { label: "Settings", value: "/settings", icon: "settings" },
];

const Dashboard = () => {
  const [active, setActive] = useState("/");
  const onMenuClick = (item) => setActive(item.value);
  return (
    <AppShell
      sidebar={{
        items: MENU_ITEMS,
        activeItem: active,
        onMenuClick,
        variant: "light",
      }}
      header={{
        logoUrl="/logo.svg",
        menuItems: MENU_ITEMS,
        activeMenuItem: active,
        onMenuItemClick: onMenuClick,
        headerRight: <Avatar name="User" />,
      }}
      footer={{ brandName: "Acme Inc" }}
      sidebarWidth="260px"
    >
      <Container padding="4">
        <Typography variant="h4">Dashboard</Typography>
      </Container>
    </AppShell>
  );
};
```

### Sidebar only

```jsx
<AppShell
  sidebar={{
    items: menuItems,
    activeItem: activeItem,
    onMenuClick: (item) => setActiveItem(item.value),
  }}
  sidebarWidth="240px"
>
  <Container padding="4">
    <Typography variant="p">Main content</Typography>
  </Container>
</AppShell>
```

### Header and footer only (no sidebar)

```jsx
<AppShell
  header={{
    logoUrl="/logo.svg",
    menuItems,
    activeMenuItem: active,
    onMenuItemClick: (item) => setActive(item.value),
    headerRight: <Avatar name="User" />,
  }}
  footer={{ brandName: "My App" }}
>
  <Container padding="4">
    <Typography variant="p">Content</Typography>
  </Container>
</AppShell>
```

### Content only (minimal shell)

```jsx
<AppShell>
  <Container padding="4">
    <Typography variant="h4">Welcome</Typography>
  </Container>
</AppShell>
```

## Behavior Notes

- **Layout:** Root is a flex column with `min-height: 100vh`. Header and footer slots are full width; body is a flex row (sidebar + main). Main area is scrollable.
- **Header / footer:** When `header` or `footer` is a plain object with Header/Footer props (e.g. `menuItems` for header), the component renders `<Header {...header} />` or `<Footer {...footer} />`. Otherwise it renders the ReactNode as-is.
- **Sidebar:** Rendered in an `<aside aria-label="Main navigation">` with MenuList `direction="vertical"`. Width from `sidebarWidth` (inline style).
- **Responsive:** At viewport width ≤ 1024px the sidebar is hidden via CSS. Pass the same `menuItems` and `activeMenuItem` / `onMenuItemClick` to `header` so the header’s mobile menu provides navigation.
- **No root spacing props:** AppShell does not expose margin/padding; use `className` or `contentClassName` for layout.

## Related Components / Links

- Header (rendered in header slot when header is Header props; use same menu items for mobile)
- Footer (rendered in footer slot when footer is Footer props)
- MenuList (used in sidebar with direction="vertical")
- Container (wrap page content inside children)
- Typography, Avatar (common in header and main)
