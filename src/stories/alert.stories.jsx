import { Alert, Container, Typography } from "../index";
import { SPACING_OPTIONS, SIZING_OPTIONS } from "../constants/common";

const meta = {
  title: "components/alert",
  component: Alert,
  argTypes: {
    message: {
      control: {
        type: "string",
      },
    },
    variant: {
      options: ["info", "warning", "success", "error", "default"],
      control: { type: "select", defaultValue: "error" },
    },
    canDismiss: {
      description: "Show or hide dismission icon button",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    size: {
      options: SIZING_OPTIONS,
      control: { type: "select" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "select" },
    },
  },
};

export const Docs = {
  name: "Docs",
  render: () => (
    <Container>
      <Container>
        <Typography variant="h5">Varaints</Typography>
        <Alert
          message="The quick brown fox jumps over the lazy dog"
          variant="default"
          margin={["b-4", "t-9"]}
        />
        <Alert
          message="The quick brown fox jumps over the lazy dog"
          variant="info"
          margin={["b-4"]}
        />
        <Alert
          message="The quick brown fox jumps over the lazy dog"
          variant="warning"
          margin={["b-4"]}
        />
        <Alert
          message="The quick brown fox jumps over the lazy dog"
          variant="error"
          margin={["b-4"]}
        />
        <Alert
          message="The quick brown fox jumps over the lazy dog"
          variant="success"
        />
      </Container>

      <Container>
        <Typography variant="h5">Sizes</Typography>
        <Alert
          message="The quick brown fox jumps over the lazy dog"
          variant="default"
          margin={["b-4"]}
          size="small"
        />
        <Alert
          message="The quick brown fox jumps over the lazy dog"
          variant="default"
          margin={["b-4"]}
          size="medium"
        />
        <Alert
          message="The quick brown fox jumps over the lazy dog"
          variant="default"
          margin={["b-4"]}
          size="large"
        />
      </Container>
    </Container>
  ),
};

export const Playground = {
  name: "Playground",
  render: (args) => (
    <Container>
      <Alert message="The quick brown fox jumps over the lazy dog" {...args} />
    </Container>
  ),
};

export default meta;
