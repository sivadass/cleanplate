import React from "react";
import { Pagination } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const meta = {
  title: "atoms/Pagination/Playground",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  name: "Default",
  argTypes: {
    variant: {
      options: ["default", "minimal"],
      control: { type: "inline-radio" },
      description: "Type of the Pagination",
    },
    margin: {
      options: SPACING_OPTIONS,
      control: { type: "inline-check" },
    },
    totalItems: { control: { type: "number", min: 0 } },
    currentPage: { control: { type: "number", min: 1 } },
    rowsPerPage: { control: { type: "number", min: 0 } },
  },
  args: {},
  render: (args) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handlePageChange = (p) => {
      setCurrentPage(p);
    };
    const handleRowsPerPageChange = (rPerPage) => {
      setRowsPerPage(rPerPage);
    };
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={(page, rPerPage) => handlePageChange(page, rPerPage)}
        onRowsPerPageChange={(rPerPage) => handleRowsPerPageChange(rPerPage)}
      />
    );
  },
};

export default meta;
