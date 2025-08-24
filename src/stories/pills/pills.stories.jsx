import { useState } from "react";
import { Pills, Container } from "../../index";

const meta = {
  title: "atoms/Pills/Playground",
  component: Pills,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  argTypes: {
    mode: {
      options: ["read-only", "edit", "remove"],
      control: { type: "inline-radio" },
      description: "Mode of the pill",
    },
    isLoading: {
      control: { type: "boolean" },
    },
    isDisabled: {
      control: { type: "boolean" },
    },
  },
  args: {
    label: "Taxi",
    placeholder: "Add new tag",
    isLoading: "false",
    mode: "edit",
  },
  render: (args) => {
    const [pillValue, setPillValue] = useState(args.label);
    const onChange = (v) => {
      setPillValue(v);
    };
    const onRemove = () => {
      setPillValue("");
    };
    return (
      <Container>
        <Pills
          {...args}
          label={pillValue}
          onSubmit={onChange}
          onRemove={onRemove}
        />
      </Container>
    );
  },
};

export default meta;
