import { Spinner, Container, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const ICON_OPTIONS = [
  "progress_activity",
  "autorenew",
  "sync",
  "refresh",
  "cached",
  "loop",
];
const SIZE_OPTIONS = ["small", "medium", "large"];
const VARIANT_OPTIONS = ["light", "dark"];
const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);

const meta = {
  title: "atoms/Spinner/Playground",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      options: SIZE_OPTIONS,
      control: { type: "select" },
      description: "Size of the spinner",
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: "select" },
      description: "Visual variant (light or dark)",
    },
    icon: {
      options: ICON_OPTIONS,
      control: { type: "select" },
      description: "Icon to display as the spinner (all animate when rotated)",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
    className: {
      control: "text",
      description: "Additional class names for the wrapper",
    },
  },
  args: {
    size: "medium",
    variant: "light",
    icon: "progress_activity",
    margin: "0",
  },
};

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4">
      <Spinner {...args} />
    </Container>
  ),
};

export const IconVariants = {
  name: "Icon variants",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-3">
        Spinner icons (all rotate via CSS)
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spinner icon="progress_activity" margin="b-2" />
          <Typography variant="small" margin="m-0">
            progress_activity
          </Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <Spinner icon="autorenew" margin="b-2" />
          <Typography variant="small" margin="m-0">
            autorenew
          </Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <Spinner icon="sync" margin="b-2" />
          <Typography variant="small" margin="m-0">
            sync
          </Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <Spinner icon="refresh" margin="b-2" />
          <Typography variant="small" margin="m-0">
            refresh
          </Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <Spinner icon="cached" margin="b-2" />
          <Typography variant="small" margin="m-0">
            cached
          </Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <Spinner icon="loop" margin="b-2" />
          <Typography variant="small" margin="m-0">
            loop
          </Typography>
        </div>
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
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <div style={{ textAlign: "center" }}>
          <Spinner size="small" margin="b-2" />
          <Typography variant="small" margin="m-0">
            small
          </Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <Spinner size="medium" margin="b-2" />
          <Typography variant="small" margin="m-0">
            medium
          </Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <Spinner size="large" margin="b-2" />
          <Typography variant="small" margin="m-0">
            large
          </Typography>
        </div>
      </div>
    </Container>
  ),
};

export const Variants = {
  name: "Variants (light / dark)",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Light vs dark
      </Typography>
      <div
        style={{
          display: "flex",
          gap: "var(--space-4)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "var(--space-3)",
            background: "var(--gray-lightest)",
            borderRadius: "var(--radius-medium)",
            textAlign: "center",
          }}
        >
          <Spinner variant="light" margin="b-2" />
          <Typography variant="small" margin="m-0">
            light
          </Typography>
        </div>
        <div
          style={{
            padding: "var(--space-3)",
            background: "var(--gray-dark)",
            borderRadius: "var(--radius-medium)",
            textAlign: "center",
          }}
        >
          <Spinner variant="dark" margin="b-2" />
          <Typography variant="small" margin="m-0" style={{ color: "white" }}>
            dark
          </Typography>
        </div>
      </div>
    </Container>
  ),
};

export default meta;
