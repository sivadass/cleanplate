import React from "react";
import {
  AppShell,
  Container,
  Typography,
  Avatar,
} from "../../index";

const DEFAULT_MENU_ITEMS = [
  { label: "Dashboard", value: "/", icon: "speed" },
  { label: "Posts", value: "/posts", icon: "description" },
  { label: "Projects", value: "/projects", icon: "receipt_long" },
  { label: "Clients", value: "/clients", icon: "group" },
  { label: "Invoices", value: "/invoices", icon: "payments" },
  { label: "Support", value: "/support", icon: "call" },
];

const defaultSidebar = {
  items: DEFAULT_MENU_ITEMS,
  activeItem: "/",
  variant: "light",
};

const defaultHeader = {
  logoUrl: "https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg",
  menuItems: DEFAULT_MENU_ITEMS,
  showCenterMenu: false,
  activeMenuItem: "/",
  headerRight: <Avatar size="medium" name="John" />,
};

const defaultFooter = {
  brandName: "Acme Inc",
  poweredByLabel: "Powered by CleanPlate",
  poweredByLink: "https://github.com/sivadass/cleanplate",
};

const meta = {
  title: "molecules/AppShell/Playground",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    sidebar: {
      control: false,
      description:
        "Sidebar config: items, activeItem, onMenuClick, size?, variant?. Omit to hide sidebar.",
    },
    header: {
      control: false,
      description:
        "Header: pass Header props object or custom ReactNode. Omit to hide header.",
    },
    footer: {
      control: false,
      description:
        "Footer: pass Footer props object or custom ReactNode. Omit to hide footer.",
    },
    sidebarWidth: {
      control: "text",
      description: "Width of the sidebar (e.g. 252px, 16rem)",
    },
    className: {
      control: "text",
      description: "Additional class name for the root element",
    },
    mobileSidebarDrawer: {
      control: "boolean",
      description:
        "Floating UI mobile drawer when sidebar is hidden (≤1024px). Default false with HeaderProps header.",
    },
    mobileSidebarDrawerLabel: {
      control: "text",
      description: "aria-label for the mobile navigation dialog.",
    },
  },
  args: {
    sidebar: defaultSidebar,
    header: defaultHeader,
    footer: defaultFooter,
    sidebarWidth: "252px",
    className: "",
    contentClassName: "",
  },
};

export const Default = {
  name: "Default",
  render: (args) => {
    const [activeItem, setActiveItem] = React.useState("/");
    const handleMenuClick = (item) => setActiveItem(item.value);
    const sidebar = {
      ...defaultSidebar,
      activeItem,
      onMenuClick: handleMenuClick,
    };
    const header = {
      ...defaultHeader,
      activeMenuItem: activeItem,
      onMenuItemClick: handleMenuClick,
    };
    return (
      <AppShell
        {...args}
        sidebar={sidebar}
        header={header}
        footer={args.footer}
      >
        <Container padding="4">
          <Typography variant="h4" margin="m-0 m-b-2">
            Dashboard
          </Typography>
          <Typography variant="p">
            Primary navigation is in the sidebar on desktop; the header keeps
            the same <code>menuItems</code> for the mobile menu only (
            <code>showCenterMenu: false</code>).
          </Typography>
        </Container>
      </AppShell>
    );
  },
};

export const FullDashboard = {
  name: "Full dashboard",
  render: () => {
    const [activeItem, setActiveItem] = React.useState("/posts");
    const handleMenuClick = (item) => setActiveItem(item.value);
    return (
      <AppShell
        sidebar={{
          items: DEFAULT_MENU_ITEMS,
          activeItem,
          onMenuClick: handleMenuClick,
          variant: "light",
        }}
        header={{
          logoUrl: "https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg",
          menuItems: DEFAULT_MENU_ITEMS,
          showCenterMenu: false,
          activeMenuItem: activeItem,
          onMenuItemClick: handleMenuClick,
          headerRight: <Avatar size="medium" name="Jane" />,
        }}
        footer={{
          brandName: "Acme Inc",
          poweredByLabel: "Powered by CleanPlate",
          poweredByLink: "https://github.com/sivadass/cleanplate",
        }}
        sidebarWidth="252px"
      >
        <Container padding="4">
          <Typography variant="h4" margin="m-0 m-b-2">
            {DEFAULT_MENU_ITEMS.find((i) => i.value === activeItem)?.label ?? "Page"}
          </Typography>
          <Typography variant="p">
            Page content goes here. The sidebar shows nav on desktop; the header
            uses <code>showCenterMenu: false</code> so the same items only appear
            in the mobile menu.
          </Typography>
        </Container>
      </AppShell>
    );
  },
};

export const SidebarOnly = {
  name: "Sidebar only",
  render: () => {
    const [activeItem, setActiveItem] = React.useState("/");
    const handleMenuClick = (item) => setActiveItem(item.value);
    return (
      <AppShell
        sidebar={{
          items: DEFAULT_MENU_ITEMS,
          activeItem,
          onMenuClick: handleMenuClick,
          variant: "light",
        }}
        sidebarWidth="252px"
      >
        <Container padding="4">
          <Typography variant="h5" margin="m-0 m-b-2">
            No header or footer
          </Typography>
          <Typography variant="p">
            Only the sidebar and main content. On viewports ≤1024px the sidebar
            column hides; a Floating UI drawer (menu button, bottom-left) opens
            the same navigation with focus trap and scroll lock.
          </Typography>
        </Container>
      </AppShell>
    );
  },
};

export const HeaderAndFooterOnly = {
  name: "Header and footer only",
  render: () => (
    <AppShell
      header={{
        logoUrl: "https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg",
        menuItems: DEFAULT_MENU_ITEMS.slice(0, 4),
        activeMenuItem: "/",
        headerRight: <Avatar size="medium" name="User" />,
      }}
      footer={{
        brandName: "My App",
      }}
    >
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          No sidebar
        </Typography>
        <Typography variant="p">
          Header and footer with full-width main content. Center navigation is in
          the header.
        </Typography>
      </Container>
    </AppShell>
  ),
};

export const ContentOnly = {
  name: "Content only",
  render: () => (
    <AppShell>
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          Minimal shell
        </Typography>
        <Typography variant="p">
          No header, sidebar, or footer. Just the main content area (e.g. for
          login or landing pages).
        </Typography>
      </Container>
    </AppShell>
  ),
};

export default meta;
