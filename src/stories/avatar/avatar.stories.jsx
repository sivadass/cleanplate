import { Avatar, Container } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "atoms/Avatar/Playground",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
};

export const Name = {
  name: "Name",
  argTypes: {
    size: {
      options: ["small", "medium"],
      control: "inline-radio",
      description: "Size of the avatar",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: "inline-radio",
      description: "Margin of the avatar",
    },
  },
  args: {
    name: "John Doe",
    size: "medium",
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
    size: {
      options: ["small", "medium"],
      control: "inline-radio",
      description: "Size of the avatar",
    },
    icon: {
      control: "text",
      description: "Icon of the avatar",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: "inline-radio",
      description: "Margin of the avatar",
    },
  },
  args: {
    icon: "person",
    size: "medium",
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
    size: {
      options: ["small", "medium"],
      control: "inline-radio",
      description: "Size of the avatar",
    },
    image: {
      control: "text",
      description: "Image of the avatar",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: "inline-radio",
      description: "Margin of the avatar",
    },
  },
  args: {
    image: "https://avatar-list.netlify.app/assets/avatar-6.jpg",
    size: "medium",
  },
  render: (args) => (
    <Container>
      <Avatar {...args} />
    </Container>
  ),
};

export default meta;
