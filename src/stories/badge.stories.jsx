import { Badge } from "../index";

const meta = {
  component: Badge,
};

export const Default = {
  name: "Variants",
  render: () => (
    <div>
      <Badge label="Default" variant="default" />
      <Badge label="Info" variant="info" />
      <Badge label="Success" variant="success" />
      <Badge label="Warning" variant="warning" />
      <Badge label="Error" variant="error" />
    </div>
  ),
};

export default meta;
