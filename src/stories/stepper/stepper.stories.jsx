import React from "react";
import { Stepper, Container, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);
const VARIANT_OPTIONS = ["horizontal", "vertical"];

const defaultConfig = [
  { label: "Personal Details", key: "/", isActive: true },
  { label: "Address", key: "/address" },
  { label: "Payment", key: "/payment", isCompleted: true },
  { label: "Confirmation", key: "/confirmation" },
];

const meta = {
  title: "atoms/Stepper/Playground",
  component: Stepper,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      options: VARIANT_OPTIONS,
      control: { type: "select" },
      description: "Layout direction (horizontal or vertical)",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
    className: {
      control: "text",
      description: "Additional class names for the root element",
    },
    onClick: { action: "onClick" },
  },
  args: {
    variant: "horizontal",
    margin: "0",
    config: defaultConfig,
  },
};

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4">
      <Stepper {...args} />
    </Container>
  ),
};

export const Variants = {
  name: "Variants",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Horizontal
      </Typography>
      <Stepper config={defaultConfig} variant="horizontal" margin="b-4" />
      <Typography variant="h5" margin="m-0 m-b-2">
        Vertical
      </Typography>
      <Stepper config={defaultConfig} variant="vertical" />
    </Container>
  ),
};

export const Interactive = {
  name: "Interactive (click to set active step)",
  render: () => {
    const [activeStep, setActiveStep] = React.useState("/");
    const config = [
      { label: "Personal Details", key: "/", isActive: activeStep === "/" },
      { label: "Address", key: "/address", isActive: activeStep === "/address" },
      {
        label: "Payment",
        key: "/payment",
        isCompleted: true,
        isActive: activeStep === "/payment",
      },
      {
        label: "Confirmation",
        key: "/confirmation",
        isActive: activeStep === "/confirmation",
      },
    ];
    return (
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          Click a step to set it active
        </Typography>
        <Stepper
          config={config}
          variant="horizontal"
          onClick={(step) => setActiveStep(step.key)}
        />
      </Container>
    );
  },
};

export const WithCompletedSteps = {
  name: "With completed steps",
  render: () => (
    <Container padding="4">
      <Stepper
        config={[
          { label: "Step 1", key: "1", isCompleted: true },
          { label: "Step 2", key: "2", isCompleted: true },
          { label: "Step 3", key: "3", isActive: true },
          { label: "Step 4", key: "4" },
        ]}
        variant="horizontal"
      />
    </Container>
  ),
};

export default meta;
