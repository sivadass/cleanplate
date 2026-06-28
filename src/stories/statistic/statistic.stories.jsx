import { Statistic, Container, Icon } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const SIZE_OPTIONS = ["small", "medium", "large"];
const VALUE_TONE_OPTIONS = ["default", "positive", "negative"];
const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);

const meta = {
  title: "atoms/Statistic/Playground",
  component: Statistic,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    precision: { control: "number" },
    valueTone: {
      options: VALUE_TONE_OPTIONS,
      control: { type: "select" },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: "select" },
    },
    loading: { control: "boolean" },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
    },
    className: { control: "text" },
  },
  args: {
    title: "Active Users",
    value: 112893,
    size: "medium",
    valueTone: "default",
    loading: false,
    margin: "0",
  },
};

export default meta;

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4">
      <Statistic {...args} />
    </Container>
  ),
};

export const WithPrecision = {
  name: "With precision",
  render: () => (
    <Container padding="4">
      <Statistic
        title="Account Balance (CNY)"
        value={112893}
        precision={2}
      />
    </Container>
  ),
};

export const PrefixAndSuffix = {
  name: "Prefix and suffix",
  render: () => (
    <Container padding="4" display="flex" gap="4">
      <Statistic
        title="Feedback"
        value={1128}
        prefix={<Icon name="thumb_up" size="small" />}
      />
      <Statistic title="Unmerged" value={93} suffix="/ 100" />
    </Container>
  ),
};

export const Loading = {
  name: "Loading",
  render: () => (
    <Container padding="4">
      <Statistic title="Active Users" value={112893} loading />
    </Container>
  ),
};

export const ValueTones = {
  name: "Value tones",
  render: () => (
    <Container padding="4" display="flex" gap="4">
      <Container
        padding="4"
        display="block"
        style={{
          background: "var(--gray-100)",
          borderRadius: "var(--radius-medium)",
        }}
      >
        <Statistic
          title="Active"
          value={11.28}
          precision={2}
          valueTone="positive"
          prefix={<Icon name="arrow_upward" size="small" />}
          suffix="%"
        />
      </Container>
      <Container
        padding="4"
        display="block"
        style={{
          background: "var(--gray-100)",
          borderRadius: "var(--radius-medium)",
        }}
      >
        <Statistic
          title="Idle"
          value={9.3}
          precision={2}
          valueTone="negative"
          prefix={<Icon name="arrow_downward" size="small" />}
          suffix="%"
        />
      </Container>
    </Container>
  ),
};

export const Sizes = {
  name: "Sizes",
  render: () => (
    <Container padding="4" display="flex" gap="4" align="end">
      <Statistic title="Small" value={112893} size="small" />
      <Statistic title="Medium" value={112893} size="medium" />
      <Statistic title="Large" value={112893} size="large" />
    </Container>
  ),
};
