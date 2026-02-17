import React from "react";
import { Header, Container, Typography, Avatar } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const SIZE_OPTIONS = ["small", "medium", "large"];
const VARIANT_OPTIONS = ["light", "dark"];

const DEFAULT_MENU_ITEMS = [
  { label: "Dashboard", value: "/", icon: "speed" },
  { label: "Posts", value: "/posts", icon: "description" },
  { label: "Projects", value: "/projects", icon: "receipt_long" },
  { label: "Clients", value: "/clients", icon: "group" },
  { label: "Invoices", value: "/invoices", icon: "payments" },
  { label: "Support", value: "/support", icon: "call" },
];

const meta = {
  title: "molecules/Header/Playground",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    activeMenuItem: {
      control: "text",
      description: "Value of the currently active menu item",
    },
    logoUrl: {
      control: "text",
      description: "URL for the logo image (shown when headerLeft is not provided)",
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: "select" },
      description: "Size of the header",
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: "select" },
      description: "Visual variant (light, dark)",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
    onMenuItemClick: { action: "onMenuItemClick" },
  },
  args: {
    logoUrl: "https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg",
    activeMenuItem: "/",
    menuItems: DEFAULT_MENU_ITEMS,
    headerRight: <Avatar size="medium" name="John" />,
    margin: "0",
  },
};

export const Default = {
  name: "Default",
  render: (args) => {
    const [activeMenuItem, setActiveMenuItem] = React.useState(args.activeMenuItem ?? "/");
    const handleMenuItemClick = (menuItem) => {
      setActiveMenuItem(menuItem.value);
      args.onMenuItemClick?.(menuItem);
    };
    return (
      <Header
        {...args}
        activeMenuItem={activeMenuItem}
        onMenuItemClick={handleMenuItemClick}
      />
    );
  },
};

export const Variants = {
  name: "Variants",
  render: () => {
    const [activeMenuItem, setActiveMenuItem] = React.useState("/");
    const handleMenuItemClick = (menuItem) => setActiveMenuItem(menuItem.value);
    const items = DEFAULT_MENU_ITEMS.slice(0, 4);
    return (
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          Variants
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <Typography variant="p" margin="m-0 m-b-1">Light</Typography>
            <Header
              logoUrl="https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg"
              menuItems={items}
              activeMenuItem={activeMenuItem}
              onMenuItemClick={handleMenuItemClick}
              variant="light"
              margin="b-2"
            />
          </div>
          <div>
            <Typography variant="p" margin="m-0 m-b-1">Dark</Typography>
            <Header
              logoUrl="https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg"
              menuItems={items}
              activeMenuItem={activeMenuItem}
              onMenuItemClick={handleMenuItemClick}
              variant="dark"
            />
          </div>
        </div>
      </Container>
    );
  },
};

export const Mobile = {
  name: "Mobile",
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: (args) => {
    const [activeMenuItem, setActiveMenuItem] = React.useState(args.activeMenuItem ?? "/");
    const handleMenuItemClick = (menuItem) => {
      setActiveMenuItem(menuItem.value);
      args.onMenuItemClick?.(menuItem);
    };
    return (
      <Header
        {...args}
        activeMenuItem={activeMenuItem}
        onMenuItemClick={handleMenuItemClick}
      />
    );
  },
};

export default meta;
