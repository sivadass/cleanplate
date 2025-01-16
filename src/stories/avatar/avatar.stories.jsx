import { Avatar, Container } from "../../index";

const meta = {
  title: "atoms/Avatar/Playground",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  args: {
    name: "John Doe",
  },
  render: (args) => (
    <Container>
      <Avatar {...args} />
    </Container>
  ),
};

export default meta;
