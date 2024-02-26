import { FormControls, Container } from "../index";

const meta = {
  component: FormControls,
};

export const Default = {
  name: "Input",
  render: () => {
    return (
      <Container>
        <Container>
          <FormControls.Input placeholder="Email Address" />
        </Container>
        <Container>
          <FormControls.Input
            label="Email Address"
            placeholder="user@acme.com"
          />
        </Container>
        <Container>
          <FormControls.Input
            label="Email Address"
            placeholder="user@acme.com"
            isRequired
            error="Email address is required"
          />
        </Container>
      </Container>
    );
  },
};

export const TextArea = {
  name: "TextArea",
  render: () => {
    return (
      <Container>
        <Container>
          <FormControls.TextArea placeholder="Email Address" />
        </Container>
        <Container>
          <FormControls.TextArea
            label="Email Address"
            placeholder="user@acme.com"
          />
        </Container>
        <Container>
          <FormControls.TextArea
            label="Email Address"
            placeholder="user@acme.com"
            isRequired
            error="Email address is required"
          />
        </Container>
      </Container>
    );
  },
};

export default meta;
