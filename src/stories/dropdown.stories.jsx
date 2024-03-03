import { Dropdown, Button, Container, Typography } from "../index";

const meta = {
  title: "components/dropdown",
  component: Dropdown,
};

const Trigger = () => {
  return (
    <Container
      display="flex"
      paddingBottom="none"
      paddingTop="none"
      paddingRight="none"
      paddingLeft="none"
    >
      <Container
        marginLeft="auto"
        paddingBottom="none"
        paddingTop="none"
        paddingRight="none"
        paddingLeft="none"
      >
        <Button>Open Dropdown</Button>
      </Container>
    </Container>
  );
};

const Contents = () => {
  return (
    <Container>
      <Typography marginBottom="large">Welcome</Typography>
      <Button isFluid marginBottom="large" variant="outline">
        Logout
      </Button>
      <Button isFluid marginBottom="large" variant="outline">
        Logout
      </Button>
      <Button isFluid variant="outline">
        Logout
      </Button>
    </Container>
  );
};

export const Variants = {
  name: "Variants",
  argTypes: {
    align: {
      options: ["left", "right"],
      control: { type: "select" },
      defaultValue: "right",
      description: "Dropdown contents position",
    },
  },

  render: (args) => {
    return (
      <div>
        <Dropdown trigger={<Trigger />} content={<Contents />} {...args} />
      </div>
    );
  },
};

export default meta;
