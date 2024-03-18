import { Stepper } from "../index";
import { SPACING_OPTIONS } from "../constants/common";

const meta = {
  title: "components/stepper",
  component: Stepper,
};

export const Playground = {
  name: "Playground",
  argTypes: {
    variant: {
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
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
        {/* <Stepper.Wrapper variant="h1" isBold={false} {...args}>
          <Stepper.StepperItem order={1}>
            <a href="/1">Step 1</a>
          </Stepper.StepperItem>
          <Stepper.Separator />
          <Stepper.StepperItem order={2}>
            <a href="/2">Step 2</a>
          </Stepper.StepperItem>
          <Stepper.Separator />
          <Stepper.StepperItem order={3}>
            <a href="/3">Step 3</a>
          </Stepper.StepperItem>
          <Stepper.Separator />
          <Stepper.StepperItem order={4}>
            <a href="/4">Step 4</a>
          </Stepper.StepperItem>
        </Stepper.Wrapper> */}
        <Stepper
          config={[
            {
              label: "Personal Details",
              link: "/",
            },
            {
              label: "Address",
              link: "/address",
            },
            {
              label: "Payment",
              link: "/payment",
              isCompleted: true,
            },
            {
              label: "Confirmation",
              link: "/confirmation",
            },
          ]}
        />
      </div>
    );
  },
};

export default meta;
