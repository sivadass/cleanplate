import { Avatar, Container } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const SPACING_SUFFIX_OPTIONS = SPACING_OPTIONS.slice(0, 10);

const meta = {
  title: "atoms/Avatar/Playground",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
};

const sharedArgTypes = {
  size: {
    options: ["small", "medium"],
    control: { type: "inline-radio" },
    description: "Size of the avatar",
  },
  margin: {
    options: SPACING_SUFFIX_OPTIONS,
    control: { type: "select" },
    description: "Margin spacing (suffix: e.g. '0' applies m-0)",
  },
};

export const Default = {
  name: "Default Avatar",
  argTypes: {
    ...sharedArgTypes,
    name: {
      control: "text",
      description: "Display name; used for initials and title when no image/icon",
    },
    codeText: {
      control: "text",
      description:
        "Optional code-like text override; keeps alphanumeric chars and shows last 4",
    },
    image: {
      control: "text",
      description: "Image URL; when set, shows image instead of initials",
    },
    icon: {
      control: "text",
      description: "Material icon name; when set (and no image), shows icon instead of initials",
    },
    onClick: { action: "onClick" },
    className: {
      control: "text",
      description: "Additional class names for the root element",
    },
  },
  args: {
    name: "John Doe",
    size: "medium",
    margin: "0",
  },
  render: (args) => (
    <Container>
      <Avatar {...args} />
    </Container>
  ),
};

export const Name = {
  name: "Name (initials)",
  argTypes: sharedArgTypes,
  args: {
    name: "John Doe",
    size: "medium",
    margin: "0",
  },
  render: (args) => (
    <Container>
      <Avatar {...args} />
    </Container>
  ),
};

export const Icon = {
  name: "Icon",
  argTypes: {
    ...sharedArgTypes,
    icon: {
      control: "text",
      description: "Material icon name",
    },
  },
  args: {
    icon: "person",
    size: "medium",
    margin: "0",
  },
  render: (args) => (
    <Container>
      <Avatar {...args} />
    </Container>
  ),
};

export const CodeText = {
  name: "Code Text",
  argTypes: {
    ...sharedArgTypes,
    codeText: {
      control: "text",
      description:
        "Optional code-like text override; keeps alphanumeric chars and shows last 4",
    },
    name: {
      control: "text",
      description: "Fallback name when codeText resolves empty",
    },
  },
  args: {
    codeText: "B101",
    name: "John Doe",
    size: "medium",
    margin: "0",
  },
  render: (args) => (
    <Container>
      <Avatar {...args} />
    </Container>
  ),
};

export const Image = {
  name: "Image",
  argTypes: {
    ...sharedArgTypes,
    image: {
      control: "text",
      description: "Image URL",
    },
  },
  args: {
    image: "https://avatar-list.netlify.app/assets/avatar-6.jpg",
    size: "medium",
    margin: "0",
  },
  render: (args) => (
    <Container>
      <Avatar {...args} />
    </Container>
  ),
};

export default meta;
