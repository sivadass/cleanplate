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
    variant: {
      options: ["primary", "secondary"],
      control: { type: "inline-radio" },
      description: "Variant of the pill",
    },
    mode: {
      options: ["read-only", "edit", "remove"],
      control: { type: "inline-radio" },
      description: "Mode of the pill",
    },
    isLoading: {
      control: { type: "boolean" },
    },
  },
  args: {
    variant: "primary",
    label: "Taxi",
    placeholder: "Add new tag",
    isLoading: "false",
  },
  render: (args) => {
    const [pillValue, setPillValue] = useState("Renting");
    const onChange = (v) => {
      setPillValue(v.target.value);
    };
    const onRemove = () => {
      setPillValue("");
    };
    return (
      <Container>
        <Pills
          {...args}
          label={pillValue}
          onChange={onChange}
          onRemove={onRemove}
        />
      </Container>
    );
  },
};

export default meta;
