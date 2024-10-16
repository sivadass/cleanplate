import { Button } from "../index";
import { SPACING_OPTIONS } from "../constants/common";
import { action } from "@storybook/addon-actions";

const meta = {
  title: "components/button",
  component: Button,
};

export const Default = {
  name: "default",
  argTypes: {
    size: {
      options: ["large", "small"],
      control: "inline-radio",
      description: "Size of the button",
    },
    variant: {
      options: ["solid", "outline", "ghost"],
      control: { type: "inline-radio" },
      description: "Type of the button",
    },
    isFluid: {
      control: { type: "boolean" },
      default: false,
    },
    isLoading: {
      control: { type: "boolean" },
    },
    isDisabled: {
      control: { type: "boolean" },
      default: false,
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    onClick: { action: "onClick" },
  },
  render: (args) => {
    return <Button {...args}>Save</Button>;
  },
};

export default meta;
