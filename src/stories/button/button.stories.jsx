import { Button } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "atoms/Button/Playground",
  component: Button,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  argTypes: {
    size: {
      options: ["large", "medium", "small"],
      control: "inline-radio",
      description: "Size of the button",
    },
    variant: {
      options: ["solid", "outline", "ghost", "icon"],
      control: { type: "inline-radio" },
      description: "Type of the button",
    },
    isFluid: {
      control: { type: "boolean" },
    },
    isLoading: {
      control: { type: "boolean" },
    },
    isDisabled: {
      control: { type: "boolean" },
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    onClick: { action: "onClick" },
  },
  args: {
    variant: "solid",
    children: "Hello world!",
    isLoading: false,
    isDisabled: false,
    isFluid: false,
  },
  render: (args) => {
    const { children, ...otherArgs } = args;
    return <Button {...otherArgs}>{children}</Button>;
  },
};

export default meta;
