import { Typography } from "../index";

const meta = {
  title: "components/typography",
  component: Typography,
};

export const Variants = {
  name: "Variants",
  argTypes: {
    variant: {
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
      control: { type: "select" },
      defaultValue: "p",
      description: "Element type to be rendered",
    },
    marginTop: {
      options: ["none", "small", "medium", "large", "extra-large"],
      control: { type: "select" },
      defaultValue: "small",
    },
    marginRight: {
      options: ["none", "small", "medium", "large", "extra-large"],
      control: { type: "select" },
      defaultValue: "small",
    },
    marginBottom: {
      options: ["none", "small", "medium", "large", "extra-large"],
      control: { type: "select" },
      defaultValue: "small",
    },
    marginLeft: {
      options: ["none", "small", "medium", "large", "extra-large"],
      control: { type: "select" },
      defaultValue: "small",
    },
  },

  render: (args) => {
    return (
      <div>
        <Typography variant="h1" marginBottom="extra-large" {...args}>
          The quick brown fox jumps over the lazy dog
        </Typography>
      </div>
    );
  },
};

export default meta;
