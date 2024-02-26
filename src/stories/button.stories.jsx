import { Button } from "../index";

const meta = {
  component: Button,
};

export const Default = {
  name: "Medium",
  render: () => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Button onClick={() => alert("Hello world!")} marginLeft="extra-large">
          Save
        </Button>
        <Button isLoading onClick={() => alert("Hello world!")}>
          Save
        </Button>
        <Button isDisabled onClick={() => alert("Hello world!")}>
          Save
        </Button>
        <Button
          size="medium"
          variant="outline"
          onClick={() => alert("Hello world!")}
        >
          Save
        </Button>
        <Button
          size="medium"
          variant="outline"
          isLoading
          onClick={() => alert("Hello world!")}
        >
          Save
        </Button>
        <Button
          size="medium"
          variant="outline"
          isDisabled
          onClick={() => alert("Hello world!")}
        >
          Save
        </Button>
      </div>
    );
  },
};
export const Small = {
  name: "Small",
  render: () => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Button size="small" onClick={() => alert("Hello world!")}>
          Save
        </Button>
        <Button size="small" isLoading onClick={() => alert("Hello world!")}>
          Save
        </Button>
        <Button size="small" isDisabled onClick={() => alert("Hello world!")}>
          Save
        </Button>
        <Button
          size="small"
          variant="outline"
          onClick={() => alert("Hello world!")}
        >
          Save
        </Button>
        <Button
          size="small"
          variant="outline"
          isLoading
          onClick={() => alert("Hello world!")}
        >
          Save
        </Button>
        <Button
          size="small"
          variant="outline"
          isDisabled
          onClick={() => alert("Hello world!")}
        >
          Save
        </Button>
      </div>
    );
  },
};

export default meta;
