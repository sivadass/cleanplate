import React from "react";
import { MenuList } from "../index";
import { SPACING_OPTIONS } from "../constants/common";

const meta = {
  title: "molecules/Menu List",
  component: MenuList,
  parameters: {
    layout: "centered",
  },
  args: {
    activeItem: "/",
  },
};

export const Default = {
  name: "Default",
  argTypes: {
    variant: {
      options: ["light", "dark"],
      control: { type: "select" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    activeItem: {
      control: { type: "text" },
    },
    direction: {
      options: ["horizontal", "vertical"],
      control: { type: "select" },
    },
  },

  render: (args) => {
    const [activeItem, setActiveItem] = React.useState("/");
    const onMenuClick = (menuItem) => {
      setActiveItem(menuItem.value);
    };
    return (
      <MenuList
        items={[
          {
            label: "Dashboard",
            value: "/",
            icon: "speed",
          },
          {
            label: "Posts",
            value: "/posts",
            icon: "description",
          },
          {
            label: "Projects",
            value: "/projects",
            icon: "receipt_long",
          },
          {
            label: "Clients",
            value: "/clients",
            icon: "group",
          },
          {
            label: "Invoices",
            value: "/invoices",
            icon: "payments",
          },
          {
            label: "Support",
            value: "/support",
            icon: "call",
          },
        ]}
        {...args}
        onMenuClick={onMenuClick}
        activeItem={activeItem}
      />
    );
  },
};

export default meta;
