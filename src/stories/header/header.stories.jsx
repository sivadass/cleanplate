import React from "react";
import { Header, Container, Typography, Avatar, Dropdown, MenuList } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const SIZE_OPTIONS = ["small", "medium", "large"];
const VARIANT_OPTIONS = ["light", "dark"];

const HEADER_USER_AVATAR_IMAGE = "https://avatar-list.netlify.app/assets/avatar-6.jpg";

const HEADER_USER_DISPLAY_NAME = "John Doe";
const HEADER_USER_EMAIL = "john.doe@cleanplate.dev";

const HEADER_USER_MENU_ITEMS = [
  { label: "Profile", value: "profile", icon: "account_circle" },
  { label: "Settings", value: "settings", icon: "settings" },
  { label: "Help", value: "help", icon: "help" },
  { label: "Sign out", value: "sign-out", icon: "logout" },
];

const HeaderUserMenuContent = ({ onClose, onItemSelect }) => {
  const handleMenuClick = (item) => {
    onItemSelect?.(item);
    onClose?.();
  };
  return (
    <>
      <div
        style={{
          /* Match MenuList vertical links: padding 8px 16px on each <a> */
          padding: "var(--space-2) var(--space-4) var(--space-3) var(--space-4)",
          marginBottom: "var(--space-2)",
          borderBottom: "1px solid var(--gray-100)",
        }}
      >
        <Typography
          variant="small"
          margin="0"
          style={{ color: "var(--text-muted)" }}
        >
          Signed in as
        </Typography>
        <Typography variant="p" margin="t-2" isBold style={{ color: "var(--text-default)" }}>
          {HEADER_USER_DISPLAY_NAME}
        </Typography>
        <Typography
          variant="small"
          margin="t-2"
          wordBreak="wrap"
          style={{ color: "var(--text-subtle)" }}
        >
          {HEADER_USER_EMAIL}
        </Typography>
      </div>
      <MenuList
        items={HEADER_USER_MENU_ITEMS}
        direction="vertical"
        variant="light"
        size="small"
        margin="0"
        onMenuClick={handleMenuClick}
      />
    </>
  );
};

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
    showCenterMenu: {
      control: "boolean",
      description:
        "When false, hides desktop center MenuList (e.g. with AppShell sidebar); menuItems still used for mobile",
    },
    onMenuItemClick: { action: "onMenuItemClick" },
    onAccountMenuClick: { action: "onAccountMenuClick" },
  },
  args: {
    logoUrl: "https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg",
    activeMenuItem: "/",
    menuItems: DEFAULT_MENU_ITEMS,
    showCenterMenu: true,
    margin: "0",
  },
};

const renderHeaderPlayground = (args) => {
  const [activeMenuItem, setActiveMenuItem] = React.useState(args.activeMenuItem ?? "/");
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem.value);
    args.onMenuItemClick?.(menuItem);
  };
  const headerRight = (
    <Dropdown
      placement="bottom-end"
      offset={8}
      trigger={
        <Avatar
          name={HEADER_USER_DISPLAY_NAME}
          image={HEADER_USER_AVATAR_IMAGE}
          size="medium"
          margin="0"
          tabIndex={0}
        />
      }
      content={<HeaderUserMenuContent onItemSelect={args.onAccountMenuClick} />}
    />
  );
  return (
    <Header
      {...args}
      headerRight={headerRight}
      activeMenuItem={activeMenuItem}
      onMenuItemClick={handleMenuItemClick}
    />
  );
};

export const Default = {
  name: "Default",
  render: renderHeaderPlayground,
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
  render: renderHeaderPlayground,
};

export default meta;
