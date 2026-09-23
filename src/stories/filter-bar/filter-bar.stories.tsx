import React, { useMemo, useState } from "react";
import FilterBar from "../../components/filter-bar";
import Table from "../../components/table";
import type { FilterBarField, FilterBarValues } from "../../components/filter-bar";
import type { TableColumn, TableRow } from "../../components/table";
import type { Option } from "../../components/form-controls/Select";

const statusOptions: Option[] = [
  { value: "active", label: "Active" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

const ownerOptions: Option[] = [
  { value: "asha", label: "Asha" },
  { value: "leo", label: "Leo" },
  { value: "mira", label: "Mira" },
];

const fields: FilterBarField[] = [
  { id: "q", type: "search", label: "Search", placement: "bar", placeholder: "Name" },
  { id: "status", type: "select", label: "Status", placement: "bar", options: statusOptions },
  { id: "owner", type: "multiSelect", label: "Owner", placement: "drawer", options: ownerOptions },
  { id: "due", type: "dateRange", label: "Due", placement: "drawer" },
];

const columns: TableColumn[] = [
  { id: "name", title: "Name", widthPercentage: "30%" },
  { id: "status", title: "Status", widthPercentage: "20%" },
  { id: "owner", title: "Owner", widthPercentage: "20%" },
  { id: "due", title: "Due", widthPercentage: "30%" },
];

const sampleRows: TableRow[] = [
  { name: "Billing export", status: "active", owner: "Asha", due: "2026-08-10" },
  { name: "Review queue", status: "review", owner: "Leo", due: "2026-08-22" },
  { name: "Archive cleanup", status: "done", owner: "Mira", due: "2026-09-01" },
  { name: "Beta rollout", status: "active", owner: "Leo", due: "2026-09-15" },
];

function parseDue(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function calendarDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function matchesFilters(row: TableRow, filters: FilterBarValues): boolean {
  const search = typeof filters.q === "string" ? filters.q.trim().toLowerCase() : "";
  if (search && !String(row.name).toLowerCase().includes(search)) {
    return false;
  }

  const status = filters.status;
  if (
    status !== null &&
    !Array.isArray(status) &&
    typeof status === "object" &&
    "value" in status &&
    row.status !== status.value
  ) {
    return false;
  }

  const owners = filters.owner;
  if (Array.isArray(owners) && owners.length > 0) {
    const allowed = new Set(owners.map((option) => option.label));
    if (!allowed.has(String(row.owner))) {
      return false;
    }
  }

  const due = filters.due;
  if (due !== null && typeof due === "object" && !Array.isArray(due) && "from" in due && "to" in due) {
    const rowDue = parseDue(String(row.due));
    const rowDay = calendarDay(rowDue);
    if (due.from && rowDay < calendarDay(due.from)) {
      return false;
    }
    if (due.to && rowDay > calendarDay(due.to)) {
      return false;
    }
  }

  return true;
}

const FilterBarPlayground = () => {
  const [values, setValues] = useState<FilterBarValues>({
    q: "",
    status: null,
    owner: [],
    due: { from: null, to: null },
  });

  const rows = useMemo(
    () => sampleRows.filter((row) => matchesFilters(row, values)),
    [values],
  );

  return (
    <>
      <FilterBar fields={fields} values={values} onChange={setValues} margin="b-4" />
      <Table columns={columns} data={rows} />
    </>
  );
};

const meta = {
  title: "atoms/FilterBar/Playground",
  component: FilterBar,
  parameters: {
    layout: "padded",
  },
};

export default meta;

export const Default = {
  name: "Default",
  render: () => <FilterBarPlayground />,
};
