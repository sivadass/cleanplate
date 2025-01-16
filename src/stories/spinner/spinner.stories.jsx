import { Spinner, Container } from "../../index";

const meta = {
  title: "atoms/Spinner/Playground",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  args: {
    size: "medium",
    variant: "light",
  },
  render: (args) => (
    <Container>
      <Spinner {...args} />
    </Container>
  ),
};

export default meta;
