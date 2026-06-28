import { Statistic, Container, Icon, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const SIZE_OPTIONS = ["small", "medium", "large"];
const TONE_OPTIONS = ["neutral", "success", "warning", "danger", "muted"];
const VARIANT_OPTIONS = ["plain", "card"];
const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const PREFIX_ICON_OPTIONS = [
  "",
  "thumb_up",
  "arrow_upward",
  "arrow_downward",
  "trending_up",
  "trending_down",
];
const HEADER_ICON_OPTIONS = [
  "",
  "group",
  "check_circle",
  "schedule",
  "warning",
  "pending",
  "block",
];

/** Map Storybook-only args to Statistic props. */
const toStatisticProps = ({
  prefixIcon,
  headerIcon,
  suffixText,
  descriptionText,
  footerLabel,
  footerBadge,
  progressValue,
  progressSize,
  valueAsString,
  value,
  precision,
  prefix,
  suffix,
  icon,
  description,
  progress,
  footer,
  ...rest
}) => {
  const resolvedValue =
    valueAsString != null && valueAsString !== "" ? valueAsString : value;

  const resolvedPrecision =
    typeof precision === "number" && !Number.isNaN(precision)
      ? precision
      : undefined;

  const resolvedProgress =
    progress ??
    (typeof progressValue === "number" && !Number.isNaN(progressValue)
      ? {
          value: progressValue,
          size: progressSize || "small",
        }
      : undefined);

  const resolvedFooter =
    footer ??
    (footerLabel || footerBadge
      ? {
          label: footerLabel || undefined,
          badge: footerBadge || undefined,
        }
      : undefined);

  return {
    ...rest,
    dataTestId: rest.dataTestId || undefined,
    value: resolvedValue,
    precision: resolvedPrecision,
    icon:
      icon ??
      (headerIcon ? <Icon name={headerIcon} size="small" /> : undefined),
    description: description ?? (descriptionText || undefined),
    progress: resolvedProgress,
    footer: resolvedFooter,
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
        component: `
Labeled numeric KPI for dashboards. Supports plain metrics and card-style tiles with icon, progress, description, and footer badge.

**Playground helpers** (not real props): \`value as string\`, \`header icon\`, \`prefix icon\`, \`suffix text\`, \`description text\`, \`progress value\`, \`footer label\`, \`footer badge\`.

See **atoms/Statistic/Documentation** for anatomy, tone guide, and dashboard composition patterns.
        `.trim(),
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      table: { category: "Content" },
      description: "Label above the value (or in the header row with `icon`)",
    },
    value: {
      control: { type: "number" },
      table: { category: "Content" },
      description: "Numeric metric — grouped; honors `precision`",
    },
    valueAsString: {
      name: "value as string",
      control: "text",
      table: { category: "Content" },
      description:
        "When non-empty, overrides **value** and renders verbatim (e.g. ¥1.2M)",
    },
    precision: {
      control: { type: "number", min: 0, step: 1 },
      table: { category: "Content" },
      description: "Fixed decimal places for numeric **value**",
    },
    prefix: { control: false, table: { disable: true } },
    suffix: { control: false, table: { disable: true } },
    icon: { control: false, table: { disable: true } },
    description: { control: false, table: { disable: true } },
    progress: { control: false, table: { disable: true } },
    footer: { control: false, table: { disable: true } },
    prefixIcon: {
      name: "prefix icon",
      options: PREFIX_ICON_OPTIONS,
      control: { type: "select" },
      table: { category: "Playground helpers" },
      description: "Material icon in the value **prefix** slot",
    },
    suffixText: {
      name: "suffix text",
      control: "text",
      table: { category: "Playground helpers" },
      description: "Text in the value **suffix** slot (e.g. `/ 100`, `%`)",
    },
    headerIcon: {
      name: "header icon",
      options: HEADER_ICON_OPTIONS,
      control: { type: "select" },
      table: { category: "Playground helpers" },
      description: "Material icon in the **header** row beside `title`",
    },
    descriptionText: {
      name: "description text",
      control: "text",
      table: { category: "Playground helpers" },
      description: "Subtext below value/progress",
    },
    progressValue: {
      name: "progress value",
      control: { type: "number", min: 0, max: 100, step: 1 },
      table: { category: "Playground helpers" },
      description: "Progress bar fill 0–100; bar color follows `tone`",
    },
    progressSize: {
      name: "progress size",
      options: ["small", "medium", "large"],
      control: { type: "select" },
      table: { category: "Playground helpers" },
      description: "Progress bar height",
    },
    footerLabel: {
      name: "footer label",
      control: "text",
      table: { category: "Playground helpers" },
      description: "Left text in the footer row (e.g. `of 8 total`)",
    },
    footerBadge: {
      name: "footer badge",
      control: "text",
      table: { category: "Playground helpers" },
      description: "Right badge text; variant follows `tone`",
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: "select" },
      table: { category: "Appearance" },
      description: "`card` adds border, padding, and tinted surface per `tone`",
    },
    tone: {
      options: TONE_OPTIONS,
      control: { type: "select" },
      table: { category: "Appearance" },
      description:
        "Semantic tone — icon, value, card surface, default progress/badge",
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: "select" },
      table: { category: "Appearance" },
      description: "Title and value typographic scale",
    },
    groupSeparator: {
      control: "text",
      table: { category: "Formatting" },
      description: "Thousands separator for numeric **value**",
    },
    decimalSeparator: {
      control: "text",
      table: { category: "Formatting" },
      description: "Decimal separator for numeric **value**",
    },
    loading: {
      control: "boolean",
      table: { category: "State" },
      description:
        "Spinner in value row; hides prefix/suffix/progress/description/footer",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      table: { category: "Layout" },
      description: "Margin spacing suffix (e.g. `0` → m-0)",
    },
    className: {
      control: "text",
      table: { category: "Layout" },
      description: "Additional class on the root element",
    },
    dataTestId: {
      control: "text",
      table: { category: "Layout" },
      description: "`data-testid` on the root element",
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
    headerIcon: "",
    descriptionText: "",
    progressValue: undefined,
    progressSize: "small",
    footerLabel: "",
    footerBadge: "",
    variant: "plain",
    size: "medium",
    tone: "neutral",
    loading: false,
    margin: "0",
    className: "",
    dataTestId: "",
  },
};

export default meta;

export const Default = {
  name: "Default",
  parameters: {
    docs: {
      description: {
        story: "Minimal plain statistic — title and formatted value.",
      },
    },
  },
  render: (args) => (
    <Container padding="4">
      <Statistic {...toStatisticProps(args)} />
    </Container>
  ),
};

export const WithPrecision = {
  name: "With precision",
  parameters: {
    docs: {
      description: {
        story: "Numeric `value` with fixed decimal places.",
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: "Optional nodes before and after the formatted value.",
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          "Pass `value` as a string to render pre-formatted text verbatim.",
      },
    },
  },
  render: () => (
    <Container padding="4">
      <Statistic title="Revenue" value="¥1.2M" />
    </Container>
  ),
};

export const Loading = {
  name: "Loading",
  parameters: {
    docs: {
      description: {
        story:
          "Title and icon stay visible; value row shows `Spinner`. Other slots are hidden.",
      },
    },
  },
  render: () => (
    <Container padding="4">
      <Statistic title="Active Users" value={112893} loading />
    </Container>
  ),
};

export const Tones = {
  name: "Tones",
  parameters: {
    docs: {
      description: {
        story:
          "Semantic tones on card variant — surface tint, icon accent, and value emphasis.",
      },
    },
  },
  render: () => (
    <Container padding="4" display="flex" gap="4" style={{ flexWrap: "wrap" }}>
      <Statistic
        variant="card"
        tone="neutral"
        title="Total billed"
        value={9000}
        prefix="₹"
      />
      <Statistic
        variant="card"
        tone="success"
        title="Collected"
        value={3375}
        prefix="₹"
        progress={{ value: 38 }}
      />
      <Statistic
        variant="card"
        tone="warning"
        title="Outstanding"
        value={5625}
        prefix="₹"
      />
      <Statistic
        variant="card"
        tone="danger"
        title="Overdue"
        value={0}
        prefix="₹"
      />
      <Statistic variant="card" tone="muted" title="Waived" value={0} />
    </Container>
  ),
};

export const Sizes = {
  name: "Sizes",
  parameters: {
    docs: {
      description: {
        story: "Three typographic scales for title and value.",
      },
    },
  },
  render: () => (
    <Container padding="4" display="flex" gap="4" align="end">
      <Statistic title="Small" value={112893} size="small" />
      <Statistic title="Medium" value={112893} size="medium" />
      <Statistic title="Large" value={112893} size="large" />
    </Container>
  ),
};

const cardFlexStyle = {
  flex: "1 1 200px",
  minWidth: "180px",
};

export const DashboardCards = {
  name: "Dashboard cards",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Financial summary row — card variant with icon, tone, and description. Layout uses `Container` flex wrap.",
      },
    },
  },
  render: () => (
    <Container padding="4" display="block" gap="4">
      <Container display="flex" gap="4" style={{ flexWrap: "wrap" }}>
        <Container display="block" style={cardFlexStyle}>
          <Statistic
            variant="card"
            tone="neutral"
            icon={<Icon name="group" size="small" />}
            title="Total billed"
            value={9000}
            prefix="₹"
            description="8 active members"
          />
        </Container>
        <Container display="block" style={cardFlexStyle}>
          <Statistic
            variant="card"
            tone="success"
            icon={<Icon name="check_circle" size="small" />}
            title="Collected"
            value={3375}
            prefix="₹"
            progress={{ value: 38, size: "small" }}
            description="38% collection rate"
          />
        </Container>
        <Container display="block" style={cardFlexStyle}>
          <Statistic
            variant="card"
            tone="warning"
            icon={<Icon name="schedule" size="small" />}
            title="Outstanding"
            value={5625}
            prefix="₹"
            description="5 dues pending"
          />
        </Container>
        <Container display="block" style={cardFlexStyle}>
          <Statistic
            variant="card"
            tone="danger"
            icon={<Icon name="warning" size="small" />}
            title="Overdue (>30d)"
            value={0}
            prefix="₹"
            description="0 members"
          />
        </Container>
      </Container>
    </Container>
  ),
};

export const DashboardBreakdown = {
  name: "Dashboard breakdown",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Breakdown row with progress bar and footer badge. Tone sets bar and badge colors automatically.",
      },
    },
  },
  render: () => (
    <Container padding="4" display="block" gap="4">
      <Typography variant="h5" margin="b-2">
        Due status breakdown
      </Typography>
      <Container display="flex" gap="4" style={{ flexWrap: "wrap" }}>
        <Container display="block" style={cardFlexStyle}>
          <Statistic
            variant="card"
            tone="success"
            icon={<Icon name="check_circle" size="small" />}
            title="Paid dues"
            value={3}
            progress={{ value: 38 }}
            footer={{ label: "of 8 total", badge: "38%" }}
          />
        </Container>
        <Container display="block" style={cardFlexStyle}>
          <Statistic
            variant="card"
            tone="warning"
            icon={<Icon name="pending" size="small" />}
            title="Partial / pending"
            value={5}
            progress={{ value: 63 }}
            footer={{ label: "of 8 total", badge: "63%" }}
          />
        </Container>
        <Container display="block" style={cardFlexStyle}>
          <Statistic
            variant="card"
            tone="muted"
            icon={<Icon name="block" size="small" />}
            title="Waived"
            value={0}
            progress={{ value: 0 }}
            footer={{ label: "hardship / error", badge: "0%" }}
          />
        </Container>
      </Container>
    </Container>
  ),
};
