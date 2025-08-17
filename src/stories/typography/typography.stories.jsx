import { Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "atoms/Typography/Playground",
  component: Typography,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  argTypes: {
    variant: {
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "small"],
      control: { type: "select" },
      description: "Element type to be rendered",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    isBold: {
      control: { type: "boolean" },
    },
    align: {
      options: ["left", "center", "right"],
      control: { type: "radio" },
      description: "Text alignment",
    },
    wordBreak: {
      options: ["normal", "all", "wrap"],
      control: { type: "radio" },
      description: "Text wrapping",
    },
  },

  render: (args) => {
    return (
      <div>
        <Typography {...args}>
          The quick brown fox jumps over the lazy dog
        </Typography>
      </div>
    );
  },
};

export default meta;
