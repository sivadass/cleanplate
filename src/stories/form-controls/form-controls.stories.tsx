import React, { useState } from "react";
import { FormControls, Container, Typography } from "../../index";

const selectOptions = [
  { label: "Apple", value: "apple" },
  { label: "Mango", value: "mango" },
  { label: "Orange", value: "orange" },
  { label: "Grapes", value: "grapes" },
];

const meta = {
  title: "atoms/FormControls/Playground",
  component: FormControls.Input,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label above the field",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    isRequired: {
      control: "boolean",
      description: "Show required indicator",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the input",
    },
    isFluid: {
      control: "boolean",
      description: "Full width",
    },
    error: {
      control: "text",
      description: "Error message below the field",
    },
  },
  args: {
    label: "Email",
    placeholder: "user@example.com",
    isRequired: false,
    isDisabled: false,
    isFluid: false,
    error: "",
  },
};

export const Default = {
  name: "Default",
  render: (args: React.ComponentProps<typeof FormControls.Input>) => (
    <Container padding="4">
      <FormControls.Input {...args} />
    </Container>
  ),
};

export const Input = {
  name: "Input",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Input
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <FormControls.Input placeholder="Email Address" />
        <FormControls.Input
          label="Email Address"
          placeholder="user@acme.com"
        />
        <FormControls.Input
          label="Email Address"
          placeholder="user@acme.com"
          isRequired
          error="Email address is required"
        />
        <FormControls.Input
          label="Email Address"
          placeholder="user@acme.com"
          isRequired
          isFluid
        />
      </div>
    </Container>
  ),
};

export const TextArea = {
  name: "TextArea",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        TextArea
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <FormControls.TextArea placeholder="Message" />
        <FormControls.TextArea label="Message" placeholder="Hello world!" />
        <FormControls.TextArea
          label="Message"
          placeholder="Hello world!"
          isRequired
          error="Message is required"
        />
        <FormControls.TextArea
          label="Message"
          placeholder="Hello world!"
          isRequired
          isFluid
        />
      </div>
    </Container>
  ),
};

export const Select = {
  name: "Select",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Select
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <FormControls.Select
          placeholder="Select a fruit"
          options={selectOptions}
        />
        <FormControls.Select
          label="Fruit"
          placeholder="Select a fruit"
          options={selectOptions}
        />
        <FormControls.Select
          label="Fruit"
          placeholder="Select a fruit"
          isRequired
          error="Please select a fruit"
          options={selectOptions}
        />
        <FormControls.Select
          label="Fruits (multi)"
          placeholder="Select fruits"
          options={selectOptions}
          isMulti
        />
      </div>
    </Container>
  ),
};

export const Date = {
  name: "Date",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Date
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <FormControls.Date label="Date of birth" />
        <FormControls.Date
          label="Date of birth"
          defaultValue="31-05-1992"
        />
        <FormControls.Date
          label="Date of birth"
          isRequired
          error="Date is required"
        />
        <FormControls.Date label="Date of birth" isFluid />
      </div>
    </Container>
  ),
};

export const Checkbox = {
  name: "Checkbox",
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Container padding="4">
        <Typography variant="h5" margin="m-0 m-b-2">
          Checkbox
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <FormControls.Checkbox
            label="Accept terms and conditions?"
            name="accept"
            id="accept"
            value={checked}
            onChange={(v) => setChecked(v)}
          />
        </div>
      </Container>
    );
  },
};

export const Radio = {
  name: "Radio",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Radio
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <FormControls.Radio label="Option A" name="radio" value="a" />
        <FormControls.Radio label="Option B" name="radio" value="b" />
        <FormControls.Radio label="Option C" name="radio" value="c" />
      </div>
    </Container>
  ),
};

export const File = {
  name: "File",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        File
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <FormControls.File label="Upload file" />
        <FormControls.File label="Upload file" isRequired error="File is required" />
        <FormControls.File label="Upload file" isFluid />
      </div>
    </Container>
  ),
};

export const Toggle = {
  name: "Toggle",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Toggle
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <FormControls.Toggle label="Toggle option" name="toggle" value="on" />
      </div>
    </Container>
  ),
};

export const Stepper = {
  name: "Stepper (form control)",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">
        Stepper (form control)
      </Typography>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <FormControls.Stepper label="Step" placeholder="Enter value" />
        <FormControls.Stepper label="Step" isRequired error="Required" />
      </div>
    </Container>
  ),
};

export default meta;
