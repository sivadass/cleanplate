import React from "react";
import {
  Table,
  Badge,
  Container,
  Dropdown,
  Button,
  Icon,
  MenuList,
} from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";
import type { TableProps, TableColumn, TableRow } from "../../components/table";
import type { MenuListItem } from "../../components/menu-list";
import type { DropdownRenderTriggerParams } from "../../components/dropdown";
import { tableDocsArgTypes } from "./table-arg-types";

const meta = {
  title: "atoms/Table/Playground",
  component: Table,
  parameters: {
    layout: "centered",
  },
  argTypes: tableDocsArgTypes,
};

const defaultColumns: TableColumn[] = [
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
    customRender: (rowData: TableRow, _column: TableColumn) => (
      <Container display="flex" justify="flex-end">
        <Badge label={String(rowData.age)} variant="success" />
      </Container>
    ),
  },
];

const defaultData: TableRow[] = [
  { name: "John Doe", age: 32, email: "john@doe.com" },
  {
    name: "Jane Doe",
    age: 29,
    email: "jane_is_oldest_member_of_out_group@doe.com",
  },
  { name: "Jimmy Doe", age: 3, email: "jimmy@doe.com" },
];

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
    columns: defaultColumns,
    mobileColumns: {
      title: "name",
      mediaAvatar: "name",
      description: "email",
    },
    data: defaultData,
  },
  render: (args: TableProps) => <Table {...args} />,
};

export const Mobile = {
  name: "Mobile",
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    columns: defaultColumns,
    mobileColumns: {
      title: "name",
      mediaAvatar: "name",
      description: "email",
      meta: "age",
      descriptionLineClamp: 2,
    },
    data: [
      { name: "John Doe", age: 32, email: "john@doe.com" },
    ],
  },
  render: (args: TableProps) => <Table {...args} />,
};

const rowActionsData: TableRow[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: "3",
    name: "Alex Lee",
    email: "alex@example.com",
    role: "Viewer",
    status: "Invited",
  },
];

const RowActionsMenu = ({
  row,
  onClose,
}: {
  row: TableRow;
  onClose?: () => void;
}) => {
  const menuItems: MenuListItem[] = [
    { label: "View details", value: "view", icon: "visibility" },
    { label: "Edit", value: "edit", icon: "edit" },
    { label: "Duplicate", value: "duplicate", icon: "content_copy" },
    { label: "Delete", value: "delete", icon: "delete" },
  ];

  const handleMenuClick = (item: MenuListItem) => {
    console.log(`${item.label} — ${String(row.name)}`);
    onClose?.();
  };

  return (
    <MenuList
      items={menuItems}
      direction="vertical"
      variant="light"
      size="small"
      onMenuClick={handleMenuClick}
    />
  );
};

const RowActionsCell = ({ row }: { row: TableRow }) => {
  const renderTrigger = ({ triggerProps }: DropdownRenderTriggerParams) => (
    <span ref={triggerProps.ref} style={{ display: "inline-flex" }}>
      <Button
        variant="icon"
        size="small"
        aria-label={`Actions for ${String(row.name)}`}
        className={triggerProps.className}
        onClick={(e) => {
          e.stopPropagation();
          (
            triggerProps.onClick as React.MouseEventHandler<HTMLButtonElement>
          )(e);
        }}
      >
        <Icon name="more_vert" size="small" />
      </Button>
    </span>
  );

  return (
    <Container
      display="flex"
      justify="flex-end"
      onClick={(e) => e.stopPropagation()}
    >
      <Dropdown
        placement="bottom-end"
        offset={4}
        content={<RowActionsMenu row={row} />}
        renderTrigger={renderTrigger}
      />
    </Container>
  );
};

const rowActionsColumns: TableColumn[] = [
  { id: "name", title: "Name", widthPercentage: "28%" },
  { id: "email", title: "Email", widthPercentage: "32%" },
  { id: "role", title: "Role", widthPercentage: "18%" },
  {
    id: "status",
    title: "Status",
    widthPercentage: "14%",
    textAlign: "center",
    customRender: (rowData: TableRow) => (
      <Container display="flex" justify="center">
        <Badge
          label={String(rowData.status)}
          variant={rowData.status === "Active" ? "success" : "warning"}
        />
      </Container>
    ),
  },
  {
    id: "actions",
    title: "",
    widthPercentage: "8%",
    textAlign: "right",
    customRender: (rowData: TableRow) => <RowActionsCell row={rowData} />,
  },
];

const paginatedColumns: TableColumn[] = [
  { id: "name", title: "Name", widthPercentage: "35%" },
  { id: "email", title: "Email", widthPercentage: "40%" },
  { id: "department", title: "Department", widthPercentage: "25%" },
];

const allPaginatedRows: TableRow[] = Array.from({ length: 47 }, (_, index) => ({
  id: String(index + 1),
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  department: ["Engineering", "Design", "Sales", "Support"][index % 4],
}));

const PaginatedTableDemo = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const start = (currentPage - 1) * rowsPerPage;
  const pageData = allPaginatedRows.slice(start, start + rowsPerPage);

  return (
    <Container width="full">
      <Table
        columns={paginatedColumns}
        data={pageData}
        totalItems={allPaginatedRows.length}
        totalLabel="Users"
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[
          { label: "5", value: 5 },
          { label: "10", value: 10 },
          { label: "20", value: 20 },
        ]}
        onPageChange={(page) => setCurrentPage(page)}
        onRowsPerPageChange={(rpp) => {
          setRowsPerPage(rpp);
          setCurrentPage(1);
        }}
      />
    </Container>
  );
};

export const WithPagination = {
  name: "With pagination",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Server-style pagination: keep `currentPage` and `rowsPerPage` in state, pass a slice of `data` for the current page, and set `totalItems` to the full dataset count. Built-in Pagination appears when `totalItems` > 0.",
      },
    },
  },
  render: () => <PaginatedTableDemo />,
};

export const RowActions = {
  name: "Row actions (dropdown menu)",
  parameters: {
    docs: {
      description: {
        story:
          "Per-row actions via an actions column: `customRender` with `Dropdown` (more_vert icon trigger) and `MenuList`. Use `stopPropagation` on the actions cell so opening the menu does not fire `onRowClick`.",
      },
    },
  },
  argTypes: {
    onRowClick: { action: "onRowClick" },
  },
  render: (args: Pick<TableProps, "onRowClick">) => (
    <Table
      columns={rowActionsColumns}
      data={rowActionsData}
      onRowClick={args.onRowClick}
      mobileColumns={{
        title: "name",
        description: "email",
        meta: "role",
        mediaAvatar: "name",
        action: (row) => <RowActionsCell row={row} />,
      }}
    />
  ),
};

export default meta;
