import { Container } from "../index";

const meta = {
  component: Container,
};

export const Default = {
  name: "Medium",
  render: () => {
    return (
      <Container display="flex" justify="space-between">
        <Container>
          <h1>Hello world!</h1>
        </Container>
        <Container>
          <h1>Hello world!</h1>
        </Container>
        <Container>
          <h1>Hello world!</h1>
        </Container>
        <Container>
          <h1>Hello world!</h1>
        </Container>
      </Container>
    );
  },
};

export default meta;
