import { FormControls, Container } from "../index";

const meta = {
  title: "components/form-controls",
  component: FormControls,
};

export const Default = {
  name: "Input",
  render: () => {
    return (
      <Container>
        <Container>
          <FormControls.Input placeholder="Email Address" />
        </Container>
        <Container>
          <FormControls.Input
            label="Email Address"
            placeholder="user@acme.com"
          />
        </Container>
        <Container>
          <FormControls.Input
            label="Email Address"
            placeholder="user@acme.com"
            isRequired
            error="Email address is required"
          />
        </Container>

        <Container>
          <FormControls.Input
            label="Email Address"
            placeholder="user@acme.com"
            isRequired
            isFluid
            error="Email address is required"
          />
        </Container>
      </Container>
    );
  },
};

export const TextArea = {
  name: "TextArea",
  render: () => {
    return (
      <Container>
        <Container>
          <FormControls.TextArea placeholder="Email Address" />
        </Container>
        <Container>
          <FormControls.TextArea label="Message" placeholder="Hello world!" />
        </Container>
        <Container>
          <FormControls.TextArea
            label="Message"
            placeholder="Hello world!"
            isRequired
            error="Message is required"
          />
        </Container>
        <Container>
          <FormControls.TextArea
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
          />
        </Container>
      </Container>
    );
  },
};

export const Select = {
  name: "Select",
  render: () => {
    const options = [
      {
        label: "Apple",
        value: "apple",
      },
      {
        label: "Mango",
        value: "mango",
      },
      {
        label: "Orange",
        value: "orange",
      },
      {
        label: "Grapes",
        value: "grapes",
      },
      {
        label: "Musk Melon",
        value: "musk-melon",
      },
      {
        label: "Water Melon",
        value: "water-melon",
      },
      {
        label: "Strawberry",
        value: "strawberry",
      },
      {
        label: "Litchie",
        value: "litchie",
      },
    ];
    return (
      <Container>
        <Container>
          <FormControls.Select
            placeholder="Select a fruit"
            options={options}
            isMulti
            value={[]}
          />
        </Container>
        <Container>
          <FormControls.Select
            label="Message"
            placeholder="Hello world!"
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Select
            label="Message"
            placeholder="Hello world!"
            isRequired
            error="Message is required"
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Select
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Select
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Select
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Select
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Select
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
      </Container>
    );
  },
};

export const Date = {
  name: "Date",
  render: () => {
    const options = [
      {
        label: "Apple",
        value: "apple",
      },
      {
        label: "Mango",
        value: "mango",
      },
      {
        label: "Orange",
        value: "orange",
      },
      {
        label: "Grapes",
        value: "grapes",
      },
      {
        label: "Musk Melon",
        value: "musk-melon",
      },
      {
        label: "Water Melon",
        value: "water-melon",
      },
      {
        label: "Strawberry",
        value: "strawberry",
      },
      {
        label: "Litchie",
        value: "litchie",
      },
    ];
    return (
      <Container>
        <Container>
          <FormControls.Date placeholder="Select a fruit" options={options} />
        </Container>
        <Container>
          <FormControls.Date
            label="Message"
            placeholder="Hello world!"
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Date
            label="Message"
            placeholder="Select DOB"
            isRequired
            error="Message is required"
            defaultValue="31-05-1992"
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Date
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Date
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Date
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Date
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Date
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
      </Container>
    );
  },
};

export const Checkbox = {
  name: "Checkbox",
  render: () => {
    const options = [
      {
        label: "Apple",
        value: "apple",
      },
      {
        label: "Mango",
        value: "mango",
      },
      {
        label: "Orange",
        value: "orange",
      },
      {
        label: "Grapes",
        value: "grapes",
      },
      {
        label: "Musk Melon",
        value: "musk-melon",
      },
      {
        label: "Water Melon",
        value: "water-melon",
      },
      {
        label: "Strawberry",
        value: "strawberry",
      },
      {
        label: "Litchie",
        value: "litchie",
      },
    ];
    return (
      <Container>
        <Container>
          <FormControls.Checkbox
            placeholder="Select fruits"
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Checkbox
            label="Message"
            placeholder="Hello world!"
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Checkbox
            label="Message"
            placeholder="Hello world!"
            isRequired
            error="Message is required"
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Checkbox
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Checkbox
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Checkbox
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Checkbox
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Checkbox
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
      </Container>
    );
  },
};

export const Radio = {
  name: "Radio",
  render: () => {
    const options = [
      {
        label: "Apple",
        value: "apple",
      },
      {
        label: "Mango",
        value: "mango",
      },
      {
        label: "Orange",
        value: "orange",
      },
      {
        label: "Grapes",
        value: "grapes",
      },
      {
        label: "Musk Melon",
        value: "musk-melon",
      },
      {
        label: "Water Melon",
        value: "water-melon",
      },
      {
        label: "Strawberry",
        value: "strawberry",
      },
      {
        label: "Litchie",
        value: "litchie",
      },
    ];
    return (
      <Container>
        <Container>
          <FormControls.Radio placeholder="Select a fruit" options={options} />
        </Container>
        <Container>
          <FormControls.Radio
            label="Message"
            placeholder="Hello world!"
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Radio
            label="Message"
            placeholder="Hello world!"
            isRequired
            error="Message is required"
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Radio
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Radio
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Radio
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Radio
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
        <Container>
          <FormControls.Radio
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
            options={options}
          />
        </Container>
      </Container>
    );
  },
};

export const File = {
  name: "File",
  render: () => {
    return (
      <Container>
        <Container>
          <FormControls.File placeholder="Select a fruit" />
        </Container>
        <Container>
          <FormControls.File label="Message" placeholder="Hello world!" />
        </Container>
        <Container>
          <FormControls.File
            label="Message"
            placeholder="Hello world!"
            isRequired
            error="Message is required"
          />
        </Container>
        <Container>
          <FormControls.File
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
          />
        </Container>
        <Container>
          <FormControls.File
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
          />
        </Container>
        <Container>
          <FormControls.File
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
          />
        </Container>
        <Container>
          <FormControls.File
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
          />
        </Container>
        <Container>
          <FormControls.File
            label="Message"
            placeholder="Hello world!"
            isRequired
            isFluid
          />
        </Container>
      </Container>
    );
  },
};

export default meta;
