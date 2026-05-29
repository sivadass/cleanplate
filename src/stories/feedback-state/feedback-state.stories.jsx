import { FeedbackState, Container } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);

const meta = {
  title: "atoms/FeedbackState/Playground",
  component: FeedbackState,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      options: ["empty", "error"],
      control: { type: "select" },
    },
    size: {
      options: ["small", "medium", "large"],
      control: { type: "select" },
    },
    title: { control: "text" },
    description: { control: "text" },
    icon: { control: "text" },
    illustration: { control: "text" },
    illustrationAlt: { control: "text" },
    errorCode: { control: "text" },
    errorDetails: { control: "text" },
    retryLabel: { control: "text" },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
    },
    onRetry: { action: "onRetry" },
  },
  args: {
    variant: "empty",
    size: "medium",
    title: "No projects yet",
    description: "Create your first project to get started.",
    icon: "folder_open",
    margin: "0",
  },
};

export default meta;

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4" width="medium">
      <FeedbackState {...args} />
    </Container>
  ),
};

export const WithIllustrationUrl = {
  name: "With illustration URL",
  render: () => (
    <Container padding="4" width="medium">
      <FeedbackState
        variant="empty"
        title="No search results"
        description="Try adjusting your filters."
        illustration="https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg"
        illustrationAlt=""
        primaryAction={{
          label: "Clear filters",
          onClick: () => {},
        }}
      />
    </Container>
  ),
};

export const ErrorWithRetry = {
  name: "Error with retry",
  render: () => (
    <Container padding="4" width="medium">
      <FeedbackState
        variant="error"
        title="Could not load data"
        description="Check your connection and try again."
        icon="cloud_off"
        errorCode={503}
        onRetry={() => {}}
      />
    </Container>
  ),
};

export const ErrorWithDetails = {
  name: "Error with details",
  render: () => (
    <Container padding="4" width="medium">
      <FeedbackState
        variant="error"
        title="Request failed"
        icon="error"
        errorDetails="TypeError: Failed to fetch at loadProjects (app.js:42)"
      />
    </Container>
  ),
};

export const SmallInTable = {
  name: "Small (narrow)",
  render: () => (
    <Container padding="2" width="small">
      <FeedbackState
        variant="empty"
        size="small"
        title="No rows"
        icon="table_rows"
      />
    </Container>
  ),
};

export const WithActions = {
  name: "Primary and secondary actions",
  render: () => (
    <Container padding="4" width="medium">
      <FeedbackState
        variant="empty"
        title="No documents"
        description="Upload a file or create one from a template."
        icon="description"
        primaryAction={{
          label: "Upload",
          onClick: () => {},
        }}
        secondaryAction={{
          label: "Use template",
          onClick: () => {},
        }}
      />
    </Container>
  ),
};

export const AllSizes = {
  name: "All sizes",
  render: () => (
    <Container padding="4" display="flex" gap="4" width="full">
      <FeedbackState
        variant="empty"
        size="small"
        title="Small"
        icon="inbox"
        margin="0"
      />
      <FeedbackState
        variant="empty"
        size="medium"
        title="Medium"
        icon="inbox"
        margin="0"
      />
      <FeedbackState
        variant="empty"
        size="large"
        title="Large"
        icon="inbox"
        margin="0"
      />
    </Container>
  ),
};
