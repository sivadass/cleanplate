import { Badge, Container } from "../index";

const meta = {
  title: "badge/component",
  component: Badge,
};

export const Default = {
  name: "Variants",
  render: () => (
    <Container>
      <Container>
        <Badge label="Default" variant="default" />
      </Container>

      <Container>
        <Badge label="Info" variant="info" />
      </Container>

      <Container>
        <Badge label="Success" variant="success" />
      </Container>

      <Container>
        <Badge label="Warning" variant="warning" />
      </Container>

      <Container>
        <Badge label="Error" variant="error" />
      </Container>
    </Container>
  ),
};

export default meta;
