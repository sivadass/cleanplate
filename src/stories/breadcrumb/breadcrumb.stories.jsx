import { BreadCrumb, Container, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const SEPARATOR_OPTIONS = ["chevron", "slash"];

const defaultItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Category", href: "/products/category" },
  { label: "Current Product" },
];

const meta = {
  title: "atoms/BreadCrumb/Playground",
  component: BreadCrumb,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    items: {
      description:
        "List of breadcrumb items. Each has label; href is optional (omit for current page).",
      control: false,
    },
    separator: {
      options: SEPARATOR_OPTIONS,
      control: { type: "select" },
      description: "Visual separator between items (chevron or slash)",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the navigation landmark",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
    className: {
      control: "text",
      description: "Additional class name for the root nav element",
    },
  },
  args: {
    items: defaultItems,
    separator: "chevron",
    ariaLabel: "Breadcrumb",
    margin: "0",
    className: "",
  },
};

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4">
      <BreadCrumb {...args} />
    </Container>
  ),
};

export const Separators = {
  name: "Separators",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Chevron (default)
      </Typography>
      <BreadCrumb items={defaultItems} separator="chevron" margin="b-4" />
      <Typography variant="h5" margin="m-0 m-b-2">
        Slash
      </Typography>
      <BreadCrumb items={defaultItems} separator="slash" />
    </Container>
  ),
};

export const ShortTrail = {
  name: "Short trail",
  render: () => (
    <Container padding="4">
      <BreadCrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Current page" },
        ]}
      />
    </Container>
  ),
};

export const WithContainer = {
  name: "With Container",
  render: () => (
    <Container padding="4">
      <BreadCrumb items={defaultItems} margin="b-2" />
      <Typography variant="p">
        Page content below the breadcrumb.
      </Typography>
    </Container>
  ),
};

export default meta;
