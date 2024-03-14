import { Alert, Container } from "../index";

const meta = {
  title: "components/alert",
  component: Alert,
};

export const Default = {
  name: "Variants",
  render: () => (
    <Container>
      <Container>
        <Alert
          canClose
          variant="info"
          message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
        />
      </Container>
      <Container>
        <Alert
          variant="success"
          message="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
      </Container>
      <Container>
        <Alert variant="error" message="John Doe" />
      </Container>
      <Container>
        <Alert
          variant="warning"
          message="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"
        />
      </Container>

      <Container>
        <Alert
          size="small"
          variant="warning"
          message="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"
        />
      </Container>

      <Container>
        <Alert
          size="small"
          variant="warning"
          message="It is a long established fact that a reader will be."
        />
      </Container>

      <Container>
        <Alert
          variant="warning"
          message="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"
        />
      </Container>

      <Container>
        <Alert
          variant="warning"
          message="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"
        />
      </Container>
    </Container>
  ),
};

export default meta;
