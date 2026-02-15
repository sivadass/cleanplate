import React from "react";
import { Pagination } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";
import type { PaginationProps } from "../../components/pagination";

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
    totalLabel: { control: { type: "text" } },
    currentPage: { control: { type: "number", min: 1 } },
    rowsPerPage: { control: { type: "number", min: 0 } },
  },
  args: {
    totalItems: 120,
    totalLabel: "Items",
    currentPage: 1,
    rowsPerPage: 10,
  },
  render: (args: PaginationProps) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handlePageChange = (p: number) => {
      setCurrentPage(p);
    };
    const handleRowsPerPageChange = (rPerPage: number) => {
      setRowsPerPage(rPerPage);
      setCurrentPage(1);
    };
    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={(page) => handlePageChange(page)}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    );
  },
};

export default meta;
