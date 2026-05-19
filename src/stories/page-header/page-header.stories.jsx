import React from "react";
import { PageHeader, Button, Container, Icon } from "../../index";

const DEFAULT_MORE_ITEMS = [
  { label: "Export", onClick: () => console.log("Export") },
  { label: "Duplicate", onClick: () => console.log("Duplicate") },
  { label: "Settings", onClick: () => console.log("Settings") },
];

const meta = {
  title: "molecules/PageHeader/Playground",
  component: PageHeader,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: {
      control: "text",
      description: "Page title (left column)",
    },
    subtitle: {
      control: "text",
      description: "Optional subtitle below the title (left column)",
    },
    primaryCta: {
      control: false,
      description: "Primary call-to-action, e.g. a Button (right column)",
    },
    moreMenuItems: {
      control: false,
      description:
        "More menu items; renders three-dots icon and dropdown (right column)",
    },
    moreMenuContent: {
      control: false,
      description:
        "Custom content for the more menu dropdown instead of moreMenuItems",
    },
    className: {
      control: "text",
      description: "Additional class name for the root element",
    },
  },
  args: {
    title: "Dashboard",
    subtitle: "Overview of your projects and activity",
    primaryCta: <Button>Create project</Button>,
    moreMenuItems: DEFAULT_MORE_ITEMS,
    className: "",
  },
};

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4" width="full">
      <PageHeader
        title={args.title}
        subtitle={args.subtitle}
        primaryCta={args.primaryCta}
        moreMenuItems={args.moreMenuItems}
        className={args.className}
      />
    </Container>
  ),
};

export const Full = {
  name: "Full (title, subtitle, CTA, more menu)",
  render: () => (
    <Container padding="4" width="full">
      <PageHeader
        title="Projects"
        subtitle="Manage and track your team projects"
        primaryCta={<Button>New project</Button>}
        moreMenuItems={[
          { label: "Export", onClick: () => {} },
          { label: "Archive", onClick: () => {} },
          { label: "Settings", onClick: () => {} },
        ]}
      />
    </Container>
  ),
};

export const TitleAndSubtitleOnly = {
  name: "Title and subtitle only",
  render: () => (
    <Container padding="4" width="full">
      <PageHeader
        title="Settings"
        subtitle="Configure your account and preferences"
      />
    </Container>
  ),
};

export const WithPrimaryCtaOnly = {
  name: "With primary CTA only",
  render: () => (
    <Container padding="4" width="full">
      <PageHeader
        title="Documents"
        subtitle="All your documents in one place"
        primaryCta={<Button variant="solid">Upload</Button>}
      />
    </Container>
  ),
};

export const WithMoreMenuOnly = {
  name: "With more menu only",
  render: () => (
    <Container padding="4" width="full">
      <PageHeader
        title="Report"
        subtitle="Generated on 17 Feb 2025"
        moreMenuItems={[
          { label: "Print", onClick: () => console.log("Print") },
          { label: "Download PDF", onClick: () => console.log("Download") },
          { label: "Share", onClick: () => console.log("Share") },
        ]}
      />
    </Container>
  ),
};

export const CustomTitle = {
  name: "Custom title (ReactNode)",
  render: () => (
    <Container padding="4" width="full">
      <PageHeader
        title={
          <Container display="flex" align="center" gap="2" padding="0" margin="m-0">
            <Icon name="assignment" size="medium" />
            Custom title with icon
          </Container>
        }
        subtitle={
          <Container display="flex" align="center" gap="1" padding="0" margin="m-0">
            <Icon name="info" size="small" />
            Subtitle can be custom too
          </Container>
        }
        primaryCta={<Button size="small">Action</Button>}
      />
    </Container>
  ),
};

export default meta;
