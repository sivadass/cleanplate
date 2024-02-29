import { Icon } from "../index";

const meta = {
  title: "components/icon/docs",
  component: Icon,
};

export const Default = {
  name: "Default",
  description: "Name of the icon",
  render: (args) => {
    return (
      <div>
        <Icon {...args} name="settings" size="small" />
        <Icon {...args} name="settings" size="medium" />
        <Icon {...args} name="settings" size="large" />
        <Icon {...args} name="settings" color="white" />
        <Icon {...args} name="home" color="gray" />
      </div>
    );
  },
};

export default meta;
