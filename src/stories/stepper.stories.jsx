import React from "react";
import { Stepper, Container } from "../index";
import { SPACING_OPTIONS } from "../constants/common";

const meta = {
  title: "components/stepper",
  component: Stepper,
};

export const Playground = {
  name: "Playground",
  argTypes: {
    variant: {
      options: ["horizontal", "vertical"],
      control: { type: "select" },
      description: "Direction of stepper",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    config: {},
  },

  render: (args) => {
    const [activeStep, setActiveStep] = React.useState("/");
    return (
      <Container>
        <Stepper
          config={[
            {
              label: "Personal Details",
              key: "/",
              isActive: "/" === activeStep,
            },
            {
              label: "Address",
              key: "/address",
              isActive: "/address" === activeStep,
            },
            {
              label: "Payment",
              key: "/payment",
              isCompleted: true,
              isActive: "/payment" === activeStep,
            },
            {
              label: "Confirmation",
              key: "/confirmation",
              isActive: "/confirmation" === activeStep,
            },
          ]}
          onClick={(step) => setActiveStep(step.key)}
          {...args}
        />
      </Container>
    );
  },
};

export default meta;
