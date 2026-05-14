# AppShell Component

Purpose: Full-page layout that combines an optional Header (top), optional Footer (bottom), and an optional MenuList as a left sidebar, with main content in the center. Use for dashboard-style apps where the sidebar holds primary navigation and the header holds logo and utilities (e.g. user account **Dropdown** with **Avatar** trigger). Sidebar is hidden below 1024px; pass the same menu items to the header for the header’s mobile menu. To avoid duplicating nav in the header center on desktop, set **`showCenterMenu: false`** on Header props (see `docs/Header.md`). For **`headerRight`** user menus, follow the same **user meta + vertical MenuList** content structure as **`docs/Dropdown.md`** (*Recommended: account / user menu content*)—whether you render **`<Header />`** yourself or pass **`header={{ ... }}`** here.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | ReactNode | yes | — | Main content (page area). |
| header | ReactNode \| HeaderProps | no | — | Top bar: pass Header props object or custom ReactNode. Omit to hide header. |
| footer | ReactNode \| FooterProps | no | — | Bottom bar: pass Footer props object or custom ReactNode. Omit to hide footer. |
| sidebar | AppShellSidebarConfig | no | — | Sidebar config (MenuList as vertical nav on the left). Omit to hide sidebar. |
| sidebarWidth | string | no | "240px" | Width of the sidebar (e.g. "240px", "16rem"). |
| mobileSidebarDrawer | boolean | no | *see below* | When `sidebar` is set: show a Floating UI drawer + trigger on narrow viewports (≤1024px). Default `false` if `header` is `HeaderProps` (header mobile menu); otherwise default `true`. |
| mobileSidebarDrawerLabel | string | no | "Main navigation" | Accessible name (`aria-label`) for the mobile navigation dialog. |
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
  mobileSidebarDrawer?: boolean;
  mobileSidebarDrawerLabel?: string;
  className?: string;
  contentClassName?: string;
}
```

## Usage Examples

### Full dashboard (sidebar + header + footer)

```jsx
import { useState } from "react";
import { AppShell, Container, Typography, Avatar, Dropdown, MenuList } from "cleanplate";

const MENU_ITEMS = [
  { label: "Dashboard", value: "/", icon: "speed" },
  { label: "Settings", value: "/settings", icon: "settings" },
];

const ACCOUNT_MENU_ITEMS = [
  { label: "Profile", value: "/profile", icon: "account_circle" },
  { label: "Sign out", value: "/logout", icon: "logout" },
];

/** Same structure as `docs/Dropdown.md` — Recommended: account / user menu content */
function AccountMenuContent({ onClose }) {
  const handleMenuClick = () => {
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
        logoUrl: "/logo.svg",
        menuItems: MENU_ITEMS,
        showCenterMenu: false,
        activeMenuItem: active,
        onMenuItemClick: onMenuClick,
        headerRight: (
          <Dropdown
            placement="bottom-end"
            offset={8}
            trigger={
              <Avatar name="Jordan Lee" size="medium" margin="0" tabIndex={0} />
            }
            content={<AccountMenuContent />}
          />
        ),
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

Use the same **`headerRight`** account menu pattern as in the full dashboard example (`Dropdown` + **`Avatar`** + **`AccountMenuContent`** from **`docs/Dropdown.md`**).

```jsx
<AppShell
  header={{
    logoUrl: "/logo.svg",
    menuItems,
    activeMenuItem: active,
    onMenuItemClick: (item) => setActive(item.value),
    headerRight: (
      <Dropdown
        placement="bottom-end"
        offset={8}
        trigger={<Avatar name="Jordan Lee" size="medium" margin="0" tabIndex={0} />}
        content={<AccountMenuContent />}
      />
    ),
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
- **Header / footer:** When `header` or `footer` is a plain object with Header/Footer props (e.g. `menuItems` for header), the component renders `<Header {...header} />` or `<Footer {...footer} />`. Otherwise it renders the ReactNode as-is. **`header.headerRight`** should follow the same patterns as a standalone **`Header`** (see **`docs/Header.md`** and **`docs/Dropdown.md`** for the recommended account **`Dropdown`** content layout).
- **Sidebar:** Rendered in an `<aside aria-label="Main navigation">` with MenuList `direction="vertical"`. Width from `sidebarWidth` (inline style).
- **Responsive:** At viewport width ≤ 1024px the sidebar column is hidden via CSS. When `header` is `HeaderProps`, the default is to rely on the header’s mobile menu for the same items. When there is no header (or `mobileSidebarDrawer` is `true`), AppShell renders a **Floating UI** mobile drawer: fixed menu trigger, `FloatingPortal` + `FloatingOverlay` (scroll lock) + `FloatingFocusManager` (modal focus), dismiss on overlay press and Escape, and the same `MenuList` as the sidebar. On desktop, use Header’s **`showCenterMenu: false`** when the sidebar already shows the same items so the header center stays empty (or use **`headerCenter`** for a title or other content).
- **No root spacing props:** AppShell does not expose margin/padding; use `className` or `contentClassName` for layout.

## Related Components / Links

- Header (Header props or custom node; with sidebar + `HeaderProps`, pass **`showCenterMenu: false`** to hide duplicate center nav on desktop while keeping `menuItems` for the mobile menu)
- Dropdown (see **`docs/Dropdown.md`** — recommended account menu **`content`** for **`headerRight`** with **`HeaderProps`**)
- Footer (rendered in footer slot when footer is Footer props)
- MenuList (used in sidebar with direction="vertical")
- Container (wrap page content inside children)
- Typography, Avatar (common in header and main)
