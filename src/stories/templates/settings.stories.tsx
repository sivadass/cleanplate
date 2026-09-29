import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, MenuList, PageHeader, Typography } from "../../index";
import {
  SelectField,
  TemplateShell,
  TextField,
  ToggleField,
  AreaField,
} from "./shared";

const TABS = [
  { label: "Profile", value: "profile" },
  { label: "Notifications", value: "notifications" },
  { label: "Security", value: "security" },
  { label: "Billing", value: "billing" },
];

type ProfileValues = { name: string; email: string; bio: string };
type NotificationValues = { email: boolean; product: boolean; weekly: boolean };
type SecurityValues = { currentPassword: string; nextPassword: string };
type BillingValues = {
  company: string;
  plan: { value: string; label: string } | null;
};

const PLAN_OPTIONS = [
  { value: "starter", label: "Starter" },
  { value: "team", label: "Team" },
  { value: "business", label: "Business" },
];

function ProfilePanel() {
  const [notice, setNotice] = useState("");
  const { control, handleSubmit } = useForm<ProfileValues>({
    defaultValues: {
      name: "Asha Raman",
      email: "asha@northstar.example",
      bio: "Owns billing and the weekly digest.",
    },
  });

  return (
    <form onSubmit={handleSubmit(() => setNotice("Profile saved."))}>
      {notice ? <Alert variant="success" margin="b-4" message={notice} /> : null}
      <TextField control={control} name="name" label="Name" rules={{ required: "Name is required" }} />
      <TextField
        control={control}
        name="email"
        label="Email"
        type="email"
        rules={{ required: "Email is required" }}
      />
      <AreaField control={control} name="bio" label="Bio" />
      <Button type="submit" variant="solid">
        Save profile
      </Button>
    </form>
  );
}

function NotificationsPanel() {
  const [notice, setNotice] = useState("");
  const { control, handleSubmit } = useForm<NotificationValues>({
    defaultValues: { email: true, product: true, weekly: false },
  });

  return (
    <form onSubmit={handleSubmit(() => setNotice("Notification preferences saved."))}>
      {notice ? <Alert variant="success" margin="b-4" message={notice} /> : null}
      <ToggleField control={control} name="email" label="Email me when a project changes" />
      <ToggleField control={control} name="product" label="Product updates" />
      <ToggleField control={control} name="weekly" label="Weekly digest" />
      <Button type="submit" variant="solid">
        Save notifications
      </Button>
    </form>
  );
}

function SecurityPanel() {
  const [notice, setNotice] = useState("");
  const { control, handleSubmit, reset } = useForm<SecurityValues>({
    defaultValues: { currentPassword: "", nextPassword: "" },
  });

  return (
    <form
      onSubmit={handleSubmit(() => {
        setNotice("Password updated.");
        reset();
      })}
    >
      {notice ? <Alert variant="success" margin="b-4" message={notice} /> : null}
      <TextField
        control={control}
        name="currentPassword"
        label="Current password"
        type="password"
        autoComplete="current-password"
        rules={{ required: "Current password is required" }}
      />
      <TextField
        control={control}
        name="nextPassword"
        label="New password"
        type="password"
        autoComplete="new-password"
        rules={{
          required: "New password is required",
          minLength: { value: 8, message: "Use at least 8 characters" },
        }}
      />
      <Button type="submit" variant="solid">
        Update password
      </Button>
    </form>
  );
}

function BillingPanel() {
  const [notice, setNotice] = useState("");
  const { control, handleSubmit } = useForm<BillingValues>({
    defaultValues: { company: "Northstar", plan: PLAN_OPTIONS[1] },
  });

  return (
    <form onSubmit={handleSubmit(() => setNotice("Billing details saved."))}>
      {notice ? <Alert variant="success" margin="b-4" message={notice} /> : null}
      <TextField
        control={control}
        name="company"
        label="Company"
        rules={{ required: "Company is required" }}
      />
      <SelectField
        control={control}
        name="plan"
        label="Plan"
        options={PLAN_OPTIONS}
        rules={{ required: "Plan is required" }}
      />
      <Button type="submit" variant="solid">
        Save billing
      </Button>
    </form>
  );
}

const SettingsPage = () => {
  const [tab, setTab] = useState("profile");

  return (
    <TemplateShell active="settings">
      <PageHeader title="Settings" subtitle="Workspace preferences for Northstar." />
      <MenuList
        items={TABS}
        direction="horizontal"
        activeItem={tab}
        margin="b-4"
        onMenuClick={(item) => setTab(item.value)}
      />
      <Typography variant="h5" margin="b-3">
        {TABS.find((item) => item.value === tab)?.label}
      </Typography>
      {tab === "profile" && <ProfilePanel />}
      {tab === "notifications" && <NotificationsPanel />}
      {tab === "security" && <SecurityPanel />}
      {tab === "billing" && <BillingPanel />}
    </TemplateShell>
  );
};

const meta = {
  title: "templates/Settings",
  parameters: { layout: "fullscreen" },
};

export default meta;

export const Page = {
  name: "Page",
  render: () => <SettingsPage />,
};
