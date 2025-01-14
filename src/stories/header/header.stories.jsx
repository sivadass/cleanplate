import { Header, Avatar } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "molecules/Header/Playground",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    logoUrl:
      "https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg",
    // headerCenter: <Typography variant="body">Menu Items here</Typography>,
    headerRight: <Avatar size="medium" name="John" />,
    menuItems: [
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
    ],
  },
};

export const Default = {
  name: "Desktop View",
  argTypes: {
    variant: {
      options: ["light", "dark"],
      control: { type: "select" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
  },

  render: (args) => {
    return <Header {...args} />;
  },
};

export const Mobile = {
  name: "Mobile View",
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  argTypes: {
    variant: {
      options: ["light", "dark"],
      control: { type: "select" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
  },

  render: (args) => {
    return <Header {...args} />;
  },
};

export default meta;
