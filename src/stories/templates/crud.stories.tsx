import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  Badge,
  BreadCrumb,
  Button,
  ConfirmDialog,
  Container,
  Drawer,
  Dropdown,
  Icon,
  MenuList,
  PageHeader,
  Statistic,
  Table,
  Typography,
} from "../../index";
import FilterBar from "../../components/filter-bar";
import type { FilterBarField, FilterBarValues } from "../../components/filter-bar";
import type { Option } from "../../components/form-controls/Select";
import type { TableColumn, TableRow } from "../../components/table";
import {
  ACTIVITIES,
  OWNER_OPTIONS,
  PROJECTS,
  STATUS_OPTIONS,
  AreaField,
  DateFieldControl,
  SelectField,
  TemplateShell,
  TextField,
  ownerOption,
  statusOption,
  type Project,
  type ProjectPriority,
  type ProjectStatus,
} from "./shared";

const FILTER_FIELDS: FilterBarField[] = [
  { id: "q", type: "search", label: "Search", placement: "bar", placeholder: "Project name" },
  { id: "status", type: "select", label: "Status", placement: "bar", options: STATUS_OPTIONS },
  { id: "owner", type: "multiSelect", label: "Owner", placement: "drawer", options: OWNER_OPTIONS },
  { id: "due", type: "dateRange", label: "Due", placement: "drawer" },
];

const EMPTY_FILTERS: FilterBarValues = {
  q: "",
  status: null,
  owner: [],
  due: { from: null, to: null },
};

type DrawerMode = { mode: "create" } | { mode: "edit"; id: string };

type ProjectFormValues = {
  name: string;
  status: Option | null;
  owner: Option | null;
  due: Date | null;
  description: string;
};

const EMPTY_FORM: ProjectFormValues = {
  name: "",
  status: null,
  owner: null,
  due: null,
  description: "",
};

const overviewColumn = { flex: "2 1 420px", minWidth: 0 };
const factsColumn = { flex: "1 1 260px", minWidth: 240 };
const metricColumn = { flex: "1 1 0", minWidth: 0 };

function parseDue(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function calendarDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function matchesFilters(project: Project, filters: FilterBarValues): boolean {
  const search = typeof filters.q === "string" ? filters.q.trim().toLowerCase() : "";
  if (search && !project.name.toLowerCase().includes(search)) {
    return false;
  }

  const status = filters.status;
  if (
    status !== null &&
    !Array.isArray(status) &&
    typeof status === "object" &&
    "value" in status &&
    project.status !== status.value
  ) {
    return false;
  }

  const owners = filters.owner;
  if (Array.isArray(owners) && owners.length > 0) {
    const allowed = new Set(owners.map((option) => option.label));
    if (!allowed.has(project.owner)) {
      return false;
    }
  }

  const due = filters.due;
  if (due !== null && typeof due === "object" && !Array.isArray(due) && "from" in due && "to" in due) {
    const rowDay = calendarDay(parseDue(project.due));
    if (due.from && rowDay < calendarDay(due.from)) {
      return false;
    }
    if (due.to && rowDay > calendarDay(due.to)) {
      return false;
    }
  }

  return true;
}

function statusBadge(status: ProjectStatus) {
  const variant = status === "done" ? "success" : status === "review" ? "warning" : "info";
  const label = status === "done" ? "Done" : status === "review" ? "Review" : "Active";
  return <Badge label={label} variant={variant} />;
}

function priorityBadge(priority: ProjectPriority) {
  const variant = priority === "High" ? "error" : priority === "Medium" ? "warning" : "default";
  return <Badge label={priority} variant={variant} />;
}

function DetailFact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Container
      display="flex"
      justify="space-between"
      align="center"
      padding="0"
      gap="3"
      margin="b-3"
    >
      <Typography variant="small">{label}</Typography>
      {children}
    </Container>
  );
}

function ProjectFormFields({
  control,
}: {
  control: ReturnType<typeof useForm<ProjectFormValues>>["control"];
}) {
  return (
    <>
      <TextField
        control={control}
        name="name"
        label="Name"
        rules={{ required: "Name is required" }}
      />
      <SelectField
        control={control}
        name="status"
        label="Status"
        options={STATUS_OPTIONS}
        rules={{ required: "Status is required" }}
      />
      <SelectField
        control={control}
        name="owner"
        label="Owner"
        options={OWNER_OPTIONS}
        rules={{ required: "Owner is required" }}
      />
      <DateFieldControl
        control={control}
        name="due"
        label="Due"
        rules={{ required: "Due date is required" }}
      />
      <AreaField control={control} name="description" label="Description" />
    </>
  );
}

const CrudPage = ({ initialView }: { initialView: "list" | "details" }) => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [filters, setFilters] = useState<FilterBarValues>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [view, setView] = useState<"list" | "details">(initialView);
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const [drawer, setDrawer] = useState<DrawerMode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<ProjectFormValues>({ defaultValues: EMPTY_FORM });

  useEffect(() => {
    if (drawer?.mode === "edit") {
      const project = projects.find((item) => item.id === drawer.id);
      if (!project) {
        return;
      }
      form.reset({
        name: project.name,
        status: statusOption(project.status),
        owner: ownerOption(project.owner),
        due: parseDue(project.due),
        description: project.description,
      });
      return;
    }
    if (drawer?.mode === "create") {
      form.reset(EMPTY_FORM);
    }
  }, [drawer, form, projects]);

  const filtered = useMemo(
    () => projects.filter((project) => matchesFilters(project, filters)),
    [projects, filters],
  );

  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];
  const related = ACTIVITIES.filter((activity) => activity.projectId === selected?.id);

  const openDrawer = (mode: DrawerMode) => {
    setDrawer(mode);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const openDetails = (row: TableRow) => {
    setSelectedId(String(row.id));
    setView("details");
  };

  const saveProject = form.handleSubmit((values) => {
    const existing =
      drawer?.mode === "edit" ? projects.find((project) => project.id === drawer.id) : undefined;
    const next: Project = {
      client: "Northstar",
      priority: "Medium",
      budget: "$12,000",
      started: format(new Date(), "yyyy-MM-dd"),
      region: "Remote",
      tasksOpen: 0,
      progress: 0,
      scope: values.description,
      ...existing,
      id: existing?.id ?? `p${Date.now()}`,
      name: values.name,
      status: (values.status?.value as ProjectStatus) ?? "active",
      owner: values.owner?.label ?? "",
      due: values.due ? format(values.due, "yyyy-MM-dd") : "",
      description: values.description,
      updated: "Just now",
    };
    setProjects((current) =>
      drawer?.mode === "edit"
        ? current.map((project) => (project.id === next.id ? next : project))
        : [next, ...current],
    );
    closeDrawer();
  });

  const rowActions = (row: TableRow) => (
    <Container
      display="flex"
      justify="flex-end"
      padding="0"
      onClick={(event) => event.stopPropagation()}
    >
      <Dropdown
        placement="bottom-end"
        trigger={
          <Button
            variant="icon"
            size="small"
            type="button"
            aria-label="Project actions"
            prefixIcon="more_vert"
          />
        }
        content={
          <MenuList
            direction="vertical"
            variant="light"
            size="small"
            items={[
              { label: "Edit", value: "edit" },
              { label: "Delete", value: "delete" },
            ]}
            onMenuClick={(item) => {
              if (item.value === "edit") {
                openDrawer({ mode: "edit", id: String(row.id) });
              }
              if (item.value === "delete") {
                setDeleteId(String(row.id));
              }
            }}
          />
        }
      />
    </Container>
  );

  const columns: TableColumn[] = [
    { id: "name", title: "Name", widthPercentage: "28%" },
    {
      id: "status",
      title: "Status",
      widthPercentage: "16%",
      customRender: (row) => statusBadge(row.status as ProjectStatus),
    },
    { id: "owner", title: "Owner", widthPercentage: "18%" },
    { id: "due", title: "Due", widthPercentage: "18%" },
    {
      id: "actions",
      title: "",
      widthPercentage: "20%",
      textAlign: "right",
      customRender: (row) => rowActions(row),
    },
  ];

  return (
    <TemplateShell active="projects">
      {view === "list" ? (
        <>
          <BreadCrumb
            margin="b-4"
            items={[{ label: "Home", href: "#home" }, { label: "Projects" }]}
          />
          <PageHeader
            title="Projects"
            subtitle="Track work across the Northstar workspace."
            primaryCta={{
              label: "Create Project",
              icon: "add",
              variant: "solid",
              size: "small",
              onClick: () => openDrawer({ mode: "create" }),
              mobile: {
                icon: "add",
                variant: "icon",
                size: "medium",
              },
            }}
            margin="b-4"
          />
          <FilterBar
            fields={FILTER_FIELDS}
            values={filters}
            margin="b-4"
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
            padding="0"
          />
          <Table
            padding="0"
            columns={columns}
            data={pageRows}
            totalItems={filtered.length}
            currentPage={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(nextPage, nextRows) => {
              setPage(nextPage);
              setRowsPerPage(nextRows);
            }}
            onRowClick={openDetails}
            mobileColumns={{
              title: "name",
              subtitle: "owner",
              description: "due",
              mediaAvatar: "name",
              action: (row) => rowActions(row),
            }}
          />
        </>
      ) : (
        <>
          <div
            onClick={(event) => {
              const link = (event.target as HTMLElement).closest("a");
              if (link?.getAttribute("href") === "#projects") {
                event.preventDefault();
                setView("list");
              }
            }}
          >
            <BreadCrumb
              margin="b-4"
              items={[
                { label: "Home", href: "#home" },
                { label: "Projects", href: "#projects" },
                { label: selected?.name ?? "Project" },
              ]}
            />
          </div>
          <PageHeader
            title={selected?.name ?? "Project"}
            subtitle={selected?.description}
            primaryCta={{
              label: "Approve",
              icon: "check",
              variant: "solid",
              size: "small",
              onClick: () => {
                if (!selected) return;
                setProjects((current) =>
                  current.map((project) =>
                    project.id === selected.id
                      ? { ...project, status: "done", updated: "Just now" }
                      : project,
                  ),
                );
              },
              mobile: {
                icon: "check",
                variant: "icon",
                size: "medium",
              },
            }}
            moreMenuItems={[
              {
                label: "Edit",
                onClick: () => {
                  if (selected) openDrawer({ mode: "edit", id: selected.id });
                },
              },
              {
                label: "Delete",
                onClick: () => {
                  if (selected) setDeleteId(selected.id);
                },
              },
            ]}
          />
          <Container display="flex" align="start" gap="6" padding="0" margin="t-6">
            <Container display="block" padding="0" gap="0" style={overviewColumn}>
              <Container display="block" padding="6" gap="0" showBorder>
                <Typography variant="h5" margin="b-3">
                  Overview
                </Typography>
                <Typography variant="p">{selected?.description}</Typography>
                <Typography variant="h6" margin={["t-6", "b-2"]}>
                  Scope
                </Typography>
                <Typography variant="p">{selected?.scope}</Typography>
              </Container>
              <Container display="flex" gap="4" padding="0" margin="t-6">
                <Container display="block" padding="0" gap="0" style={metricColumn}>
                  <Statistic
                    variant="card"
                    tone="neutral"
                    icon={<Icon name="payments" size="small" />}
                    title="Budget"
                    value={selected?.budget ?? ""}
                    description="Approved for this project"
                  />
                </Container>
                <Container display="block" padding="0" gap="0" style={metricColumn}>
                  <Statistic
                    variant="card"
                    tone={selected && selected.tasksOpen > 0 ? "warning" : "success"}
                    icon={<Icon name="task_alt" size="small" />}
                    title="Open tasks"
                    value={selected?.tasksOpen ?? 0}
                    description="Still on the board"
                  />
                </Container>
                <Container display="block" padding="0" gap="0" style={metricColumn}>
                  <Statistic
                    variant="card"
                    tone="neutral"
                    icon={<Icon name="trending_up" size="small" />}
                    title="Progress"
                    value={selected?.progress ?? 0}
                    suffix="%"
                    progress={{ value: selected?.progress ?? 0 }}
                    description="Share of scope completed"
                  />
                </Container>
              </Container>
            </Container>
            <Container display="block" padding="6" gap="0" showBorder style={factsColumn}>
              <Typography variant="h5" margin="b-4">
                Details
              </Typography>
              {selected ? (
                <>
                  <DetailFact label="Status">{statusBadge(selected.status)}</DetailFact>
                  <DetailFact label="Priority">{priorityBadge(selected.priority)}</DetailFact>
                  <DetailFact label="Owner">
                    <Typography variant="p">{selected.owner}</Typography>
                  </DetailFact>
                  <DetailFact label="Client">
                    <Typography variant="p">{selected.client}</Typography>
                  </DetailFact>
                  <DetailFact label="Region">
                    <Typography variant="p">{selected.region}</Typography>
                  </DetailFact>
                  <DetailFact label="Started">
                    <Typography variant="p">{selected.started}</Typography>
                  </DetailFact>
                  <DetailFact label="Due">
                    <Typography variant="p">{selected.due}</Typography>
                  </DetailFact>
                  <DetailFact label="Last update">
                    <Typography variant="p">{selected.updated}</Typography>
                  </DetailFact>
                </>
              ) : null}
            </Container>
          </Container>
          <Container display="block" padding="0" gap="0" margin="t-6">
            <Typography variant="h5" margin="b-1">
              Activity
            </Typography>
            <Typography variant="p" margin="b-4">
              Recent updates from the people working on this project.
            </Typography>
            <Table
              hidePagination
              padding="0"
              columns={[
                { id: "title", title: "Update", widthPercentage: "24%" },
                { id: "detail", title: "Detail", widthPercentage: "46%" },
                { id: "actor", title: "By", widthPercentage: "15%" },
                { id: "when", title: "When", widthPercentage: "15%" },
              ]}
              data={related}
            />
          </Container>
        </>
      )}

      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        title={drawer?.mode === "edit" ? "Edit project" : "Create project"}
        placement="right"
        size="medium"
        primaryButtonLabel="Save"
        onPrimaryButtonClick={saveProject}
        secondaryButtonLabel="Cancel"
        onSecondaryButtonClick={closeDrawer}
      >
        <ProjectFormFields control={form.control} />
      </Drawer>

      <ConfirmDialog
        isOpen={deleteId != null}
        variant="destructive"
        title="Delete project"
        description="This removes the project from the listing. This story keeps the change in memory only."
        primaryButtonLabel="Delete"
        secondaryButtonLabel="Cancel"
        onClose={() => setDeleteId(null)}
        onPrimaryButtonClick={() => {
          setProjects((current) => current.filter((project) => project.id !== deleteId));
          if (selectedId === deleteId) {
            setView("list");
          }
          setDeleteId(null);
        }}
      />
    </TemplateShell>
  );
};

const meta = {
  title: "templates/CRUD",
  parameters: { layout: "fullscreen" },
};

export default meta;

export const Listing = {
  name: "Listing",
  render: () => <CrudPage initialView="list" />,
};

export const Details = {
  name: "Details",
  render: () => <CrudPage initialView="details" />,
};
