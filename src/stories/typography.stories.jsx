import { Typography } from "../index";
import { SPACING_OPTIONS } from "../constants/common";

const meta = {
  title: "components/typography",
  component: Typography,
};

export const Default = {
  name: "default",
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
  },

  render: (args) => {
    return (
      <div>
        <Typography variant="h1" isBold={false} {...args}>
          The quick brown fox jumps over the lazy dog
        </Typography>
      </div>
    );
  },
};

export default meta;
