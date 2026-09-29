import React from "react";
import { useMediaQuery } from "../../utils/use-media-query";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";
import {
  AppShell,
  Avatar,
  Container,
  Dropdown,
  FormControls,
  MenuList,
  Typography,
} from "../../index";
import type { Option } from "../../components/form-controls/Select";
import linkStyles from "./auth-link.module.scss";

const { Input, Select, TextArea, Date: DateField, Toggle } = FormControls;

export const LOGO_URL =
  "https://f005.backblazeb2.com/file/sivadass-cloud/cleanplate-logo.svg";

export const NAV_ITEMS = [
  { label: "Dashboard", value: "dashboard", icon: "speed" as const },
  { label: "Projects", value: "projects", icon: "folder" as const },
  { label: "Settings", value: "settings", icon: "settings" as const },
];

export const STATUS_OPTIONS: Option[] = [
  { value: "active", label: "Active" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

export const OWNER_OPTIONS: Option[] = [
  { value: "asha", label: "Asha" },
  { value: "leo", label: "Leo" },
  { value: "mira", label: "Mira" },
];

export type ProjectStatus = "active" | "review" | "done";

export type ProjectPriority = "High" | "Medium" | "Low";

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  owner: string;
  due: string;
  description: string;
  client: string;
  priority: ProjectPriority;
  budget: string;
  started: string;
  updated: string;
  region: string;
  tasksOpen: number;
  progress: number;
  scope: string;
};

export type Activity = {
  id: string;
  projectId: string;
  title: string;
  detail: string;
  actor: string;
  when: string;
};

export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Billing export",
    status: "active",
    owner: "Asha",
    due: "2026-08-10",
    description: "Nightly CSV of invoices for the finance workspace.",
    client: "Northstar Finance",
    priority: "High",
    budget: "$48,000",
    started: "2026-06-02",
    updated: "2 hours ago",
    region: "London",
    tasksOpen: 6,
    progress: 72,
    scope: "Map invoice columns, schedule the nightly run, and hand the file to finance before 06:00.",
  },
  {
    id: "p2",
    name: "Review queue",
    status: "review",
    owner: "Leo",
    due: "2026-08-22",
    description: "Triage incoming design reviews before they hit the board.",
    client: "Northstar Design",
    priority: "Medium",
    budget: "$22,400",
    started: "2026-07-01",
    updated: "5 hours ago",
    region: "Berlin",
    tasksOpen: 11,
    progress: 46,
    scope: "Route new reviews to the right owner and keep the board free of untriaged work.",
  },
  {
    id: "p3",
    name: "Archive cleanup",
    status: "done",
    owner: "Mira",
    due: "2026-09-01",
    description: "Retire unused project folders older than two years.",
    client: "Northstar Ops",
    priority: "Low",
    budget: "$9,600",
    started: "2026-05-12",
    updated: "12 days ago",
    region: "Remote",
    tasksOpen: 0,
    progress: 100,
    scope: "List stale folders, confirm owners, and archive anything untouched for two years.",
  },
  {
    id: "p4",
    name: "Beta rollout",
    status: "active",
    owner: "Leo",
    due: "2026-09-15",
    description: "Staged release of the new filter bar to the beta cohort.",
    client: "Northstar Product",
    priority: "High",
    budget: "$36,000",
    started: "2026-07-18",
    updated: "3 hours ago",
    region: "New York",
    tasksOpen: 4,
    progress: 61,
    scope: "Ship the filter bar to the beta cohort, watch the first week of usage, and hold the general release.",
  },
  {
    id: "p5",
    name: "Invoice reminders",
    status: "review",
    owner: "Asha",
    due: "2026-09-20",
    description: "Email sequence for unpaid invoices past seven days.",
    client: "Northstar Finance",
    priority: "Medium",
    budget: "$18,500",
    started: "2026-08-04",
    updated: "Yesterday",
    region: "London",
    tasksOpen: 3,
    progress: 54,
    scope: "Draft the reminder sequence, confirm the seven-day rule, and review copy with finance.",
  },
  {
    id: "p6",
    name: "Owner directory",
    status: "active",
    owner: "Mira",
    due: "2026-10-02",
    description: "Shared list of project owners and their backup contacts.",
    client: "Northstar Ops",
    priority: "Medium",
    budget: "$14,200",
    started: "2026-08-20",
    updated: "Yesterday",
    region: "Remote",
    tasksOpen: 8,
    progress: 33,
    scope: "Publish owners, backups, and the rule for who can reassign a project.",
  },
  {
    id: "p7",
    name: "Usage digest",
    status: "done",
    owner: "Asha",
    due: "2026-10-08",
    description: "Weekly summary of active projects and open reviews.",
    client: "Northstar Product",
    priority: "Low",
    budget: "$11,000",
    started: "2026-06-16",
    updated: "4 days ago",
    region: "Singapore",
    tasksOpen: 0,
    progress: 100,
    scope: "Send a Monday digest of active projects, open reviews, and anything past its due date.",
  },
  {
    id: "p8",
    name: "Access audit",
    status: "review",
    owner: "Leo",
    due: "2026-10-18",
    description: "Confirm who can edit projects after the last role change.",
    client: "Northstar Ops",
    priority: "High",
    budget: "$27,800",
    started: "2026-09-01",
    updated: "6 hours ago",
    region: "Berlin",
    tasksOpen: 9,
    progress: 28,
    scope: "Compare current edit access with the last role change and close anything that no longer matches.",
  },
];

export const ACTIVITIES: Activity[] = [
  { id: "a1", projectId: "p1", title: "Exported March invoices", detail: "Nightly file delivered to finance.", actor: "Asha", when: "2h ago" },
  { id: "a2", projectId: "p1", title: "Updated the column map", detail: "Added tax and currency columns.", actor: "Leo", when: "1d ago" },
  { id: "a3", projectId: "p1", title: "Fixed a failed run", detail: "Empty currency codes were skipped.", actor: "Mira", when: "3d ago" },
  { id: "a4", projectId: "p1", title: "Agreed the 06:00 handoff", detail: "Finance confirmed the delivery window.", actor: "Asha", when: "1w ago" },
  { id: "a5", projectId: "p2", title: "Moved 12 items to review", detail: "Untriaged cards cleared from the inbox.", actor: "Mira", when: "5h ago" },
  { id: "a6", projectId: "p2", title: "Assigned a backup reviewer", detail: "Leo covers Asha's queue this week.", actor: "Leo", when: "2d ago" },
  { id: "a7", projectId: "p2", title: "Closed duplicate reviews", detail: "Four repeat submissions were merged.", actor: "Asha", when: "4d ago" },
  { id: "a8", projectId: "p3", title: "Archived 40 folders", detail: "Owners confirmed each one was unused.", actor: "Mira", when: "12d ago" },
  { id: "a9", projectId: "p3", title: "Published the archive list", detail: "Ops signed off on the final set.", actor: "Leo", when: "2w ago" },
  { id: "a10", projectId: "p3", title: "Marked the project done", detail: "No open tasks remain.", actor: "Mira", when: "2w ago" },
  { id: "a11", projectId: "p4", title: "Opened the beta cohort", detail: "Forty accounts received the filter bar.", actor: "Leo", when: "3h ago" },
  { id: "a12", projectId: "p4", title: "Logged the first week of usage", detail: "Filters are used on most listing visits.", actor: "Asha", when: "1d ago" },
  { id: "a13", projectId: "p4", title: "Held the general release", detail: "Waiting on the beta review.", actor: "Leo", when: "2d ago" },
  { id: "a14", projectId: "p5", title: "Reviewed reminder copy", detail: "Finance asked for a shorter second email.", actor: "Asha", when: "Yesterday" },
  { id: "a15", projectId: "p5", title: "Set the seven-day rule", detail: "Reminders start after the due date plus seven days.", actor: "Leo", when: "3d ago" },
  { id: "a16", projectId: "p5", title: "Drafted the sequence", detail: "Three emails, then a manual follow-up.", actor: "Mira", when: "1w ago" },
  { id: "a17", projectId: "p6", title: "Added backup contacts", detail: "Each owner now has a named backup.", actor: "Mira", when: "Yesterday" },
  { id: "a18", projectId: "p6", title: "Published the directory", detail: "Shared with ops and finance.", actor: "Asha", when: "4d ago" },
  { id: "a19", projectId: "p6", title: "Wrote the reassignment rule", detail: "Only the owner or backup can hand a project over.", actor: "Leo", when: "1w ago" },
  { id: "a20", projectId: "p7", title: "Sent the Monday digest", detail: "Active projects and open reviews included.", actor: "Asha", when: "4d ago" },
  { id: "a21", projectId: "p7", title: "Added overdue items", detail: "Anything past due is called out first.", actor: "Mira", when: "1w ago" },
  { id: "a22", projectId: "p7", title: "Closed the project", detail: "The digest now sends on its own.", actor: "Asha", when: "2w ago" },
  { id: "a23", projectId: "p8", title: "Compared edit access", detail: "Nine accounts no longer match their role.", actor: "Leo", when: "6h ago" },
  { id: "a24", projectId: "p8", title: "Flagged stale editors", detail: "Listed for ops to confirm.", actor: "Mira", when: "1d ago" },
  { id: "a25", projectId: "p8", title: "Started the audit", detail: "Pulled access after the last role change.", actor: "Leo", when: "5d ago" },
];

export function statusOption(status: ProjectStatus): Option {
  return STATUS_OPTIONS.find((option) => option.value === status) ?? STATUS_OPTIONS[0];
}

export function ownerOption(owner: string): Option | null {
  return OWNER_OPTIONS.find((option) => option.label === owner) ?? null;
}

export function AuthLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      className={linkStyles["cp-auth-link"]}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}

const CURRENT_USER = {
  name: "Asha",
  email: "asha@northstar.example",
};

const ACCOUNT_MENU_ITEMS = [
  { label: "Settings", value: "settings", icon: "settings" as const },
  { label: "Log out", value: "logout", icon: "logout" as const },
];

function AccountMenuContent({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div
        style={{
          padding: "var(--space-2) var(--space-4) var(--space-3) var(--space-4)",
          marginBottom: "var(--space-2)",
          borderBottom: "1px solid var(--gray-100)",
        }}
      >
        <Typography variant="small" margin="0" style={{ color: "var(--text-muted)" }}>
          Signed in as
        </Typography>
        <Typography variant="p" margin="t-2" isBold style={{ color: "var(--text-default)" }}>
          {CURRENT_USER.name}
        </Typography>
        <Typography
          variant="small"
          margin="t-2"
          wordBreak="wrap"
          style={{ color: "var(--text-subtle)" }}
        >
          {CURRENT_USER.email}
        </Typography>
      </div>
      <MenuList
        items={ACCOUNT_MENU_ITEMS}
        direction="vertical"
        variant="light"
        size="small"
        margin="0"
        onMenuClick={() => {
          onClose?.();
        }}
      />
    </>
  );
}

function AccountMenu() {
  return (
    <Dropdown
      placement="bottom-end"
      offset={8}
      trigger={<Avatar name={CURRENT_USER.name} size="medium" margin="0" tabIndex={0} />}
      content={<AccountMenuContent />}
    />
  );
}

export function TemplateShell({
  active,
  children,
}: {
  active: string;
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <AppShell
      sidebar={{ items: NAV_ITEMS, activeItem: active, variant: "light" }}
      header={{
        logoUrl: LOGO_URL,
        menuItems: NAV_ITEMS,
        showCenterMenu: false,
        activeMenuItem: active,
        headerRight: <AccountMenu />,
      }}
      footer={{
        brandName: "Northstar",
        poweredByLabel: "Powered by CleanPlate",
        poweredByLink: "https://github.com/sivadass/cleanplate",
      }}
    >
      <Container padding={isMobile ? "4" : "8"}>{children}</Container>
    </AppShell>
  );
}

export function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <Container
      display="flex"
      justify="center"
      align="center"
      padding={["t-6", "x-4", "b-6"]}
      style={{ minHeight: "100vh" }}
    >
      <Container width="medium" display="block" padding="8" showBorder borderRadius="medium">
        {children}
      </Container>
    </Container>
  );
}

type FieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  rules?: RegisterOptions<T, FieldPath<T>>;
  label: string;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  type = "text",
  autoComplete,
  placeholder,
  margin,
}: Omit<FieldProps<T>, "label"> & {
  label?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  margin?: "0" | "b-1" | "b-2" | "b-3" | "b-4";
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Input
          name={field.name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          label={label}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
          isFluid
          margin={margin}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function AreaField<T extends FieldValues>({
  control,
  name,
  rules,
  label,
}: FieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextArea
          name={field.name}
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          label={label}
          isFluid
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  options,
}: FieldProps<T> & { options: Option[] }) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Select
          name={field.name}
          label={label}
          options={options}
          value={field.value ?? null}
          onChange={field.onChange}
          isFluid
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function DateFieldControl<T extends FieldValues>({
  control,
  name,
  rules,
  label,
}: FieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <DateField
          name={field.name}
          label={label}
          value={field.value ?? null}
          onChange={field.onChange}
          isFluid
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function ToggleField<T extends FieldValues>({
  control,
  name,
  label,
}: Omit<FieldProps<T>, "rules">) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Toggle
          name={field.name}
          label={label}
          checked={Boolean(field.value)}
          onChange={field.onChange}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
