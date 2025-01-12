import React from "react";
import { MenuList, Avatar, Typography } from "../index";
import { SPACING_OPTIONS } from "../constants/common";

const meta = {
  title: "molecules/Menu List",
  component: MenuList,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    activeItem: "/",
  },
};

export const Default = {
  name: "Horizontal",
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
      console.log(menuItem);
      setActiveItem(menuItem.value);
    };
    return (
      <MenuList
        items={[
          {
            label: "Dashboard",
            value: "/",
          },
          {
            label: "Posts",
            value: "/posts",
          },
          {
            label: "Projects",
            value: "/projects",
          },
          {
            label: "Clients",
            value: "/clients",
          },
          {
            label: "Invoices",
            value: "/invoices",
          },
          {
            label: "support",
            value: "/support",
          },
        ]}
        onMenuClick={onMenuClick}
        {...args}
        activeItem={activeItem}
      />
    );
  },
};

export default meta;
