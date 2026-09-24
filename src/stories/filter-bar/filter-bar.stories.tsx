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

const priorityOptions: Option[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const teamOptions: Option[] = [
  { value: "core", label: "Core" },
  { value: "growth", label: "Growth" },
  { value: "support", label: "Support" },
];

const regionOptions: Option[] = [
  { value: "emea", label: "EMEA" },
  { value: "amer", label: "Americas" },
  { value: "apac", label: "APAC" },
];

const channelOptions: Option[] = [
  { value: "web", label: "Web" },
  { value: "email", label: "Email" },
  { value: "chat", label: "Chat" },
];

const sourceOptions: Option[] = [
  { value: "import", label: "Import" },
  { value: "manual", label: "Manual" },
];

const tagOptions: Option[] = [
  { value: "billing", label: "Billing" },
  { value: "launch", label: "Launch" },
  { value: "ops", label: "Ops" },
];

const responsiveFields: FilterBarField[] = [
  { id: "q", type: "search", label: "Search", placement: "bar", placeholder: "Name" },
  { id: "status", type: "select", label: "Status", placement: "bar", options: statusOptions },
  { id: "priority", type: "select", label: "Priority", placement: "bar", options: priorityOptions },
  { id: "owner", type: "multiSelect", label: "Owner", placement: "bar", options: ownerOptions },
  { id: "team", type: "multiSelect", label: "Team", placement: "bar", options: teamOptions },
  { id: "region", type: "select", label: "Region", placement: "bar", options: regionOptions },
  { id: "channel", type: "select", label: "Channel", placement: "bar", options: channelOptions },
  { id: "due", type: "dateRange", label: "Due", placement: "bar" },
  { id: "created", type: "dateRange", label: "Created", placement: "bar" },
  { id: "source", type: "select", label: "Source", placement: "drawer", options: sourceOptions },
  { id: "tags", type: "multiSelect", label: "Tags", placement: "drawer", options: tagOptions },
];

const responsiveColumns: TableColumn[] = [
  { id: "name", title: "Name", widthPercentage: "18%" },
  { id: "status", title: "Status", widthPercentage: "10%" },
  { id: "priority", title: "Priority", widthPercentage: "10%" },
  { id: "owner", title: "Owner", widthPercentage: "12%" },
  { id: "team", title: "Team", widthPercentage: "12%" },
  { id: "region", title: "Region", widthPercentage: "12%" },
  { id: "channel", title: "Channel", widthPercentage: "10%" },
  { id: "due", title: "Due", widthPercentage: "16%" },
];

const responsiveRows: TableRow[] = [
  {
    name: "Billing export",
    status: "active",
    priority: "high",
    owner: "Asha",
    team: "Core",
    region: "EMEA",
    channel: "Web",
    due: "2026-08-10",
  },
  {
    name: "Review queue",
    status: "review",
    priority: "medium",
    owner: "Leo",
    team: "Growth",
    region: "Americas",
    channel: "Email",
    due: "2026-08-22",
  },
  {
    name: "Archive cleanup",
    status: "done",
    priority: "low",
    owner: "Mira",
    team: "Support",
    region: "APAC",
    channel: "Chat",
    due: "2026-09-01",
  },
  {
    name: "Beta rollout",
    status: "active",
    priority: "high",
    owner: "Leo",
    team: "Core",
    region: "EMEA",
    channel: "Web",
    due: "2026-09-15",
  },
];

function selectedLabel(value: FilterBarValues[string]): string | null {
  if (value !== null && typeof value === "object" && !Array.isArray(value) && "label" in value) {
    return String(value.label);
  }
  return null;
}

function matchesResponsive(row: TableRow, filters: FilterBarValues): boolean {
  const search = typeof filters.q === "string" ? filters.q.trim().toLowerCase() : "";
  if (search && !String(row.name).toLowerCase().includes(search)) {
    return false;
  }

  for (const columnId of ["status", "priority", "region", "channel"] as const) {
    const label = selectedLabel(filters[columnId]);
    if (label !== null && row[columnId] !== label) {
      return false;
    }
  }

  for (const fieldId of ["owner", "team"] as const) {
    const selected = filters[fieldId];
    if (Array.isArray(selected) && selected.length > 0) {
      const allowed = new Set(selected.map((option) => option.label));
      if (!allowed.has(String(row[fieldId]))) {
        return false;
      }
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

const ResponsivePlayground = () => {
  const [values, setValues] = useState<FilterBarValues>({
    q: "",
    status: null,
    priority: null,
    owner: [],
    team: [],
    region: null,
    channel: null,
    due: { from: null, to: null },
    created: { from: null, to: null },
    source: null,
    tags: [],
  });

  const rows = useMemo(
    () => responsiveRows.filter((row) => matchesResponsive(row, values)),
    [values],
  );

  return (
    <>
      <FilterBar
        fields={responsiveFields}
        values={values}
        onChange={setValues}
        margin="b-4"
        buttonLabel="More filters"
      />
      <Table columns={responsiveColumns} data={rows} />
    </>
  );
};

export const Responsive = {
  name: "Responsive",
  parameters: {
    controls: { disable: true },
    layout: "fullscreen",
  },
  render: () => <ResponsivePlayground />,
};
