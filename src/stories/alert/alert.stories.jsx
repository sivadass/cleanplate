import { Alert, Container, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const SIZE_OPTIONS = ["small", "medium", "large"];
const VARIANT_OPTIONS = ["info", "warning", "success", "error", "default"];

const meta = {
  title: "atoms/Alert/Playground",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    message: {
      control: "text",
      description: "Main message text shown in the alert",
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: "select" },
      description: "Visual variant (success, error, warning, info, default)",
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: "select" },
      description: "Size of the alert and its icon/close button",
    },
    canDismiss: {
      control: "boolean",
      description: "Show or hide the dismiss button",
    },
    onDismiss: { action: "onDismiss" },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0). Use array in code for multiple.",
    },
  },
  args: {
    message: "The quick brown fox jumps over the lazy dog",
    variant: "info",
    size: "medium",
    canDismiss: false,
    margin: "0",
  },
};

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4">
      <Alert {...args} />
    </Container>
  ),
};

export const Variants = {
  name: "Variants",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Variants
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Alert message="Default alert message" variant="default" margin="b-2" />
        <Alert message="Info alert message" variant="info" margin="b-2" />
        <Alert message="Warning alert message" variant="warning" margin="b-2" />
        <Alert message="Error alert message" variant="error" margin="b-2" />
        <Alert message="Success alert message" variant="success" />
      </div>
    </Container>
  ),
};

export const Sizes = {
  name: "Sizes",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Sizes
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Alert message="Small alert" variant="info" size="small" margin="b-2" />
        <Alert message="Medium alert" variant="info" size="medium" margin="b-2" />
        <Alert message="Large alert" variant="info" size="large" />
      </div>
    </Container>
  ),
};

export const Dismissible = {
  name: "Dismissible",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        With dismiss button
      </Typography>
      <Alert
        message="This alert can be dismissed. Click the close button."
        variant="info"
        canDismiss
        onDismiss={() => console.log("Alert dismissed")}
      />
    </Container>
  ),
};

export default meta;
