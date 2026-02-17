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
      description: "Width of the sidebar (e.g. 240px, 16rem)",
    },
    className: {
      control: "text",
      description: "Additional class name for the root element",
    },
    contentClassName: {
      control: "text",
      description: "Additional class name for the main content wrapper",
    },
  },
  args: {
    sidebar: defaultSidebar,
    header: defaultHeader,
    footer: defaultFooter,
    sidebarWidth: "240px",
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
            Main content area. Resize the viewport to see the sidebar hide at
            1024px; use the header hamburger menu for navigation on small
            screens.
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
          activeMenuItem: activeItem,
          onMenuItemClick: handleMenuClick,
          headerRight: <Avatar size="medium" name="Jane" />,
        }}
        footer={{
          brandName: "Acme Inc",
          poweredByLabel: "Powered by CleanPlate",
          poweredByLink: "https://github.com/sivadass/cleanplate",
        }}
        sidebarWidth="260px"
      >
        <Container padding="4">
          <Typography variant="h4" margin="m-0 m-b-2">
            {DEFAULT_MENU_ITEMS.find((i) => i.value === activeItem)?.label ?? "Page"}
          </Typography>
          <Typography variant="p">
            Page content goes here. The sidebar and header share the same menu
            items and active state.
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
        sidebarWidth="240px"
      >
        <Container padding="4">
          <Typography variant="h5" margin="m-0 m-b-2">
            No header or footer
          </Typography>
          <Typography variant="p">
            Only the sidebar and main content. Useful for minimal app chrome.
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
