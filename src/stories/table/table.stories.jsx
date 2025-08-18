import { Table, Badge, Container } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "atoms/Table/Playground",
  component: Table,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  argTypes: {
    variant: {
      options: ["default", "compact"],
      control: { type: "inline-radio" },
      description: "Type of the Table",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    onRowClick: { action: "onClick" },
    totalItems: { control: { type: "number", min: 0 } },
    currentPage: { control: { type: "number", min: 1 } },
    rowsPerPage: { control: { type: "number", min: 0 } },
  },
  args: {
    columns: [
      {
        id: "name",
        title: "Name",
        widthPercentage: "40%",
      },
      {
        id: "email",
        title: "Email Address with longest column text",
        widthPercentage: "40%",
      },
      {
        id: "age",
        title: "Age",
        widthPercentage: "8%",
        textAlign: "right",
        customRender: (a, b) => {
          return (
            <Container display="flex" justify="flex-end">
              <Badge label={a.age} variant="success" />
            </Container>
          );
        },
      },
    ],
    data: [
      {
        name: "John Doe",
        age: 32,
        email: "john@doe.com",
      },
      {
        name: "Jane Doe",
        age: 29,
        email: "jane_is_oldest_member_of_out_group@doe.com",
      },
      {
        name: "Jimmy Doe",
        age: 3,
        email: "jimmy@doe.com",
      },
    ],
  },
  render: (args) => {
    return <Table {...args} />;
  },
};

export default meta;
