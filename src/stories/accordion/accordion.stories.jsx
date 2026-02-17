import { Accordion, Container, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const PADDING_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const VARIANT_OPTIONS = ["grouped", "spaced"];
const ICON_OPTIONS = ["expand", "plus"];
const TITLE_TAG_OPTIONS = ["span", "h2", "h3", "h4", "h5", "h6"];

const DEFAULT_ITEMS = [
  { title: "Section 1", content: "Content for section 1." },
  { title: "Section 2", content: "Content for section 2." },
  { title: "Section 3", content: "Content for section 3." },
];

const meta = {
  title: "atoms/Accordion/Playground",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    items: {
      control: false,
      description: "Array of { title, content } items",
    },
    allowMultiple: {
      control: "boolean",
      description: "Allow multiple panels open at once",
    },
    defaultExpandedIndex: {
      control: { type: "number", min: 0, max: 2, step: 1 },
      description: "Index of panel open initially (0, 1, or 2)",
    },
    iconVariant: {
      options: ICON_OPTIONS,
      control: { type: "select" },
      description: "Icon style: expand (arrows) or plus (+/-)",
    },
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: "select" },
      description: "Visual layout: grouped (one unit) or spaced (separate items, e.g. FAQ)",
    },
    titleTag: {
      options: TITLE_TAG_OPTIONS,
      control: { type: "select" },
      description: "Semantic HTML for title: span (default) or heading level for SEO FAQ pages",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
    padding: {
      options: PADDING_OPTIONS,
      control: { type: "select" },
      description: "Padding spacing (suffix: e.g. '4' applies p-4)",
    },
    className: {
      control: "text",
      description: "Additional class names for the root element",
    },
  },
  args: {
    items: DEFAULT_ITEMS,
    allowMultiple: false,
    defaultExpandedIndex: 0,
    iconVariant: "expand",
    variant: "grouped",
    titleTag: "span",
    margin: "0",
  },
};

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4" style={{ maxWidth: 400 }}>
      <Accordion key={args.defaultExpandedIndex} {...args} />
    </Container>
  ),
};

export const Variants = {
  name: "Variants",
  render: () => {
    const items = DEFAULT_ITEMS.slice(0, 2);
    return (
      <Container padding="4" style={{ maxWidth: 400 }}>
        <Typography variant="h5" margin={["0", "b-2"]}>
          Variants
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <Typography variant="p" margin={["0", "b-1"]}>Grouped</Typography>
            <Accordion items={items} variant="grouped" margin="b-2" />
          </div>
          <div>
            <Typography variant="p" margin={["0", "b-1"]}>Spaced (FAQ style)</Typography>
            <Accordion items={items} variant="spaced" />
          </div>
        </div>
      </Container>
    );
  },
};

export const IconVariants = {
  name: "Icon variants",
  render: () => {
    const items = DEFAULT_ITEMS.slice(0, 2);
    return (
      <Container padding="4" style={{ maxWidth: 400 }}>
        <Typography variant="h5" margin={["0", "b-2"]}>
          Icon variants
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <Typography variant="p" margin={["0", "b-1"]}>Expand (arrows)</Typography>
            <Accordion items={items} iconVariant="expand" margin="b-2" />
          </div>
          <div>
            <Typography variant="p" margin={["0", "b-1"]}>Plus (+/-)</Typography>
            <Accordion items={items} iconVariant="plus" />
          </div>
        </div>
      </Container>
    );
  },
};

export const FAQ = {
  name: "FAQ (SEO-friendly)",
  args: {
    items: DEFAULT_ITEMS,
    variant: "spaced",
    titleTag: "h3",
    iconVariant: "plus",
  },
  render: (args) => (
    <Container padding="4" style={{ maxWidth: 400 }}>
      <Accordion {...args} />
    </Container>
  ),
};

export const AllowMultiple = {
  name: "Allow multiple",
  args: {
    items: DEFAULT_ITEMS,
    allowMultiple: true,
  },
  render: (args) => (
    <Container padding="4" style={{ maxWidth: 400 }}>
      <Accordion {...args} />
    </Container>
  ),
};

export default meta;
