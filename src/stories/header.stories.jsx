import { Header, Avatar, Typography } from "../index";
import { SPACING_OPTIONS } from "../constants/common";

const meta = {
  title: "molecules/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    logoUrl: "https://web.spendsights.in/logo.svg",
    headerCenter: <Typography variant="body">Menu Items here</Typography>,
    headerRight: <Avatar size="medium" name="John" />,
  },
};

export const Default = {
  name: "Copyright",
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
