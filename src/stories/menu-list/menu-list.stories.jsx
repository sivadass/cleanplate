import React from "react";
import { MenuList, Container, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const SIZE_OPTIONS = ["small", "medium", "large"];
const VARIANT_OPTIONS = ["light", "dark"];
const DIRECTION_OPTIONS = ["horizontal", "vertical"];

const DEFAULT_ITEMS = [
  { label: "Dashboard", value: "/", icon: "speed" },
  { label: "Posts", value: "/posts", icon: "description" },
  { label: "Projects", value: "/projects", icon: "receipt_long" },
  { label: "Clients", value: "/clients", icon: "group" },
  { label: "Invoices", value: "/invoices", icon: "payments" },
  { label: "Support", value: "/support", icon: "call" },
];

const TAB_ITEMS = [
  { label: "Overview", value: "overview", icon: "dashboard" },
  { label: "Activity", value: "activity", icon: "history" },
  { label: "Settings", value: "settings", icon: "settings" },
];

const TAB_PANELS = {
  overview: "Overview content — summary metrics and recent updates.",
  activity: "Activity content — timeline of events and changes.",
  settings: "Settings content — preferences and account options.",
};

const meta = {
  title: "molecules/MenuList/Playground",
  component: MenuList,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    activeItem: {
      control: "text",
      description: "Value of the currently active item",
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: "select" },
      description: "Size of menu items",
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: "select" },
      description: "Visual variant (light, dark)",
    },
    direction: {
      options: DIRECTION_OPTIONS,
      control: { type: "select" },
      description: "Layout direction of the list",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
    onMenuClick: { action: "onMenuClick" },
  },
  args: {
    activeItem: "/",
    direction: "horizontal",
    margin: "0",
  },
};

export const Default = {
  name: "Default",
  render: (args) => {
    const [activeItem, setActiveItem] = React.useState(args.activeItem ?? "/");
    const onMenuClick = (menuItem) => {
      setActiveItem(menuItem.value);
      args.onMenuClick?.(menuItem);
    };
    return (
      <Container padding="4">
        <MenuList
          items={DEFAULT_ITEMS}
          activeItem={activeItem}
          onMenuClick={onMenuClick}
          {...args}
        />
      </Container>
    );
  },
};

export const Variants = {
  name: "Variants",
  render: () => {
    const [activeItem, setActiveItem] = React.useState("/");
    const onMenuClick = (menuItem) => setActiveItem(menuItem.value);
    const items = DEFAULT_ITEMS.slice(0, 4);
    return (
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          Variants
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <Typography variant="p" margin="m-0 m-b-1">Light</Typography>
            <MenuList items={items} activeItem={activeItem} onMenuClick={onMenuClick} variant="light" margin="b-2" />
          </div>
          <div>
            <Typography variant="p" margin="m-0 m-b-1">Dark</Typography>
            <MenuList items={items} activeItem={activeItem} onMenuClick={onMenuClick} variant="dark" />
          </div>
        </div>
      </Container>
    );
  },
};

export const Directions = {
  name: "Directions",
  render: () => {
    const [activeItem, setActiveItem] = React.useState("/");
    const onMenuClick = (menuItem) => setActiveItem(menuItem.value);
    const items = DEFAULT_ITEMS.slice(0, 4);
    return (
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          Directions
        </Typography>
        <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <div>
            <Typography variant="p" margin="m-0 m-b-1">Horizontal</Typography>
            <MenuList items={items} activeItem={activeItem} onMenuClick={onMenuClick} direction="horizontal" margin="b-2" />
          </div>
          <div>
            <Typography variant="p" margin="m-0 m-b-1">Vertical</Typography>
            <MenuList items={items} activeItem={activeItem} onMenuClick={onMenuClick} direction="vertical" />
          </div>
        </div>
      </Container>
    );
  },
};

export const Tabs = {
  name: "Tabs",
  parameters: {
    docs: {
      description: {
        story:
          "Recommended tab bar pattern: horizontal MenuList + panel content keyed off activeItem. There is no separate Tabs component — see molecules/Tabs in the docs.",
      },
    },
  },
  render: () => {
    const [activeItem, setActiveItem] = React.useState("overview");
    const onMenuClick = (menuItem) => setActiveItem(menuItem.value);
    return (
      <Container padding="4" width="full">
        <Typography variant="h5" margin="m-0 m-b-2">
          Tabs (use MenuList)
        </Typography>
        <Typography variant="p" margin="m-0 m-b-2">
          Horizontal MenuList acts as the tab control; panel copy below follows{" "}
          <code>activeItem</code>.
        </Typography>
        <MenuList
          items={TAB_ITEMS}
          direction="horizontal"
          variant="light"
          activeItem={activeItem}
          onMenuClick={onMenuClick}
          margin="b-2"
        />
        <Container padding="4" display="block">
          <Typography variant="p" margin="0">
            {TAB_PANELS[activeItem]}
          </Typography>
        </Container>
      </Container>
    );
  },
};

export const Sizes = {
  name: "Sizes",
  render: () => {
    const [activeItem, setActiveItem] = React.useState("/");
    const onMenuClick = (menuItem) => setActiveItem(menuItem.value);
    const items = DEFAULT_ITEMS.slice(0, 3);
    return (
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          Sizes
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <MenuList items={items} activeItem={activeItem} onMenuClick={onMenuClick} size="small" margin="b-2" />
          <MenuList items={items} activeItem={activeItem} onMenuClick={onMenuClick} size="medium" margin="b-2" />
          <MenuList items={items} activeItem={activeItem} onMenuClick={onMenuClick} size="large" />
        </div>
      </Container>
    );
  },
};

export default meta;
