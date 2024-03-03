import { Avatar, Container } from "../index";

const meta = {
  title: "components/avatar",
  component: Avatar,
};

export const Default = {
  name: "Variants",
  render: () => (
    <Container>
      <Container>
        <Avatar name="John Doe" />
      </Container>

      <Container>
        <Avatar name="Daniel" />
      </Container>

      <Container>
        <Avatar name="" />
      </Container>

      <Container>
        <Avatar name="Jane Doe" size="small" />
      </Container>
      <Container>
        <Avatar name="Kevin" size="small" />
      </Container>
      <Container>
        <Avatar name="" size="small" />
      </Container>
    </Container>
  ),
};

export default meta;
