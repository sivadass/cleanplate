import { ProgressBar, Container } from "../../index";

const meta = {
  title: "atoms/Progress Bar/Playground",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      options: [
        "default",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "error",
      ],
      control: "select",
      description: "Color of the progress bar",
    },
    size: {
      options: ["large", "medium", "small"],
      control: "inline-radio",
      description: "Size of the progress bar",
    },
    value: {
      control: "number",
      description: "Current progress value of the progress bar",
    },
  },
};

export const Default = {
  name: "Default",
  args: {
    size: "medium",
    variant: "default",
    value: 45,
    className: "custom-wrapper",
    trackClassName: "custom-track",
  },
  render: (args) => (
    <Container>
      <ProgressBar {...args} />
    </Container>
  ),
};

export default meta;
