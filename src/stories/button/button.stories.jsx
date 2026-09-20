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
      options: ["small", "medium", "large"],
      control: "inline-radio",
      description: "Size of the button",
    },
    variant: {
      options: ["solid", "outline", "ghost", "icon"],
      control: { type: "inline-radio" },
      description: "Type of the button",
    },
    prefixIcon: {
      control: "text",
      description: "Leading Material Symbol name",
    },
    suffixIcon: {
      control: "text",
      description: "Trailing Material Symbol name",
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

export const IconVariant = {
  name: "Icon Variant",
  args: {
    variant: "icon",
    size: "medium",
    prefixIcon: "close",
    isLoading: false,
    isDisabled: false,
    isFluid: false,
    "aria-label": "Close dialog",
  },
  render: (args) => {
    const { children, ...otherArgs } = args;
    return <Button {...otherArgs} />;
  },
};

export const Sizes = {
  name: "Sizes",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["small", "medium", "large"]).map((size) => (
        <div key={size} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button size={size}>Next</Button>
          <Button size={size} prefixIcon="add">Next</Button>
          <Button size={size} suffixIcon="expand_more">Next</Button>
          <Button size={size} variant="icon" prefixIcon="refresh" aria-label="Refresh" />
        </div>
      ))}
    </div>
  ),
};

export default meta;
