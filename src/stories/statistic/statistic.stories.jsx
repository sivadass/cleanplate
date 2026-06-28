import { Statistic, Container, Icon } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const SIZE_OPTIONS = ["small", "medium", "large"];
const VALUE_TONE_OPTIONS = ["default", "positive", "negative"];
const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const PREFIX_ICON_OPTIONS = [
  "",
  "thumb_up",
  "arrow_upward",
  "arrow_downward",
  "trending_up",
  "trending_down",
];

/** Map Storybook-only args to Statistic props (prefix icon, suffix text, string value override). */
const toStatisticProps = ({
  prefixIcon,
  suffixText,
  valueAsString,
  value,
  precision,
  prefix,
  suffix,
  ...rest
}) => {
  const resolvedValue =
    valueAsString != null && valueAsString !== "" ? valueAsString : value;

  const resolvedPrecision =
    typeof precision === "number" && !Number.isNaN(precision)
      ? precision
      : undefined;

  return {
    ...rest,
    dataTestId: rest.dataTestId || undefined,
    value: resolvedValue,
    precision: resolvedPrecision,
    prefix:
      prefix ??
      (prefixIcon ? <Icon name={prefixIcon} size="small" /> : undefined),
    suffix: suffix ?? (suffixText ? suffixText : undefined),
  };
};

const meta = {
  title: "atoms/Statistic/Playground",
  component: Statistic,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Labeled numeric KPI. Use **value** for numbers (grouping + precision) or **value as string** to render verbatim. **Prefix icon** and **suffix text** are playground helpers that map to `prefix` / `suffix` slots.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Label above the value row",
    },
    value: {
      control: { type: "number" },
      description: "Numeric metric (grouped; honors precision)",
    },
    valueAsString: {
      control: "text",
      description:
        "When non-empty, overrides **value** and renders verbatim (e.g. ¥1.2M)",
    },
    precision: {
      control: { type: "number", min: 0, step: 1 },
      description: "Fixed decimal places for numeric **value**",
    },
    groupSeparator: {
      control: "text",
      description: "Thousands separator for numeric **value**",
    },
    decimalSeparator: {
      control: "text",
      description: "Decimal separator for numeric **value**",
    },
    prefixIcon: {
      name: "prefix icon",
      options: PREFIX_ICON_OPTIONS,
      control: { type: "select" },
      description: "Material icon in the prefix slot (playground helper)",
    },
    suffixText: {
      name: "suffix text",
      control: "text",
      description: "Text in the suffix slot (playground helper)",
    },
    prefix: { control: false, table: { disable: true } },
    suffix: { control: false, table: { disable: true } },
    valueTone: {
      options: VALUE_TONE_OPTIONS,
      control: { type: "select" },
      description: "Semantic color on the value text",
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: "select" },
      description: "Title and value typographic scale",
    },
    loading: {
      control: "boolean",
      description: "Show Spinner in value row; title stays visible",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing suffix (e.g. '0' → m-0)",
    },
    className: {
      control: "text",
      description: "Additional class on the root element",
    },
    dataTestId: {
      control: "text",
      description: "data-testid on the root element",
    },
  },
  args: {
    title: "Active Users",
    value: 112893,
    valueAsString: "",
    precision: undefined,
    groupSeparator: ",",
    decimalSeparator: ".",
    prefixIcon: "",
    suffixText: "",
    size: "medium",
    valueTone: "default",
    loading: false,
    margin: "0",
    className: "",
    dataTestId: "",
  },
};

export default meta;

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4">
      <Statistic {...toStatisticProps(args)} />
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

export const StringValue = {
  name: "String value",
  render: () => (
    <Container padding="4">
      <Statistic title="Revenue" value="¥1.2M" />
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
