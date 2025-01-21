import { Icon, Container } from "../../index";

const meta = {
  title: "atoms/Icon/Playground",
  component: Icon,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  args: {
    size: "medium",
    name: "cloud_upload",
  },
  render: (args) => (
    <Container>
      <Icon {...args} />
    </Container>
  ),
};

export default meta;
