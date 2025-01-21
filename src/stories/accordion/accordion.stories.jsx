import { Accordion, Container } from "../../index";

const meta = {
  title: "atoms/Accordion/Playground",
  component: Accordion,
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
      <Accordion {...args} />
    </Container>
  ),
};

export default meta;
