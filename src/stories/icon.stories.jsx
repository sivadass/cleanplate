import { Icon } from "../index";

const meta = {
  component: Icon,
};

export const Default = {
  name: "Default",
  description: "Name of the icon",
  render: () => <Icon name="settings" />,
};

export const Size = {
  name: "Size",
  description: "Size of the icon",
  render: () => <Icon name="search" />,
};

export default meta;
