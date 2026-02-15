import React, { useState } from "react";
import { Pills, Container } from "../../index";
import type { PillsProps } from "../../components/pills";

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
    isLoading: false,
    mode: "edit",
  },
  render: (args: PillsProps) => {
    const [pillValue, setPillValue] = useState(args.label ?? "");
    const onChange = (v: string) => {
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
