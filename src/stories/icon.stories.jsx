import { Icon } from "../index";

const meta = {
  title: "components/icon/docs",
  component: Icon,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  description: "Name of the icon",
  args: {
    name: "Home",
    color: "#666",
  },
  render: (args) => {
    return <Icon {...args} />;
  },
};

export default meta;
