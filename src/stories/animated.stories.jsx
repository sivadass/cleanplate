import { Animated, Avatar, Container } from "../index";

const meta = {
  title: "components/animated",
  component: Animated,
};

export const Default = {
  delay: 0,
  render: () => (
    <Container>
      <Container>
        <Animated>
          <Avatar name="John Doe" />
        </Animated>
        <Animated delay={200}>
          <Avatar name="John Doe" delay={0} />
        </Animated>
        <Animated delay={400}>
          <Avatar name="John Doe" />
        </Animated>
        <Animated delay={600}>
          <Avatar name="John Doe" />
        </Animated>
        <Animated delay={800}>
          <Avatar name="John Doe" />
        </Animated>
      </Container>

      <Container>
        <Animated delay={1000}>
          <Avatar name="Daniel" />
        </Animated>
      </Container>
    </Container>
  ),
};

export default meta;
