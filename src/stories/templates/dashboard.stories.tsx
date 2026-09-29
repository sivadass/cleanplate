import React from "react";
import {
  Container,
  Icon,
  PageHeader,
  Statistic,
  Table,
  Typography,
} from "../../index";
import { ACTIVITIES, PROJECTS, TemplateShell } from "./shared";

const cardStyle = { flex: "1 1 0", minWidth: 0 };
const columnStyle = { flex: "1 1 0", minWidth: 0 };

const DashboardPage = () => {
  const active = PROJECTS.filter((project) => project.status === "active").length;
  const review = PROJECTS.filter((project) => project.status === "review").length;
  const done = PROJECTS.filter((project) => project.status === "done").length;

  return (
    <TemplateShell active="dashboard">
      <PageHeader
        title="Dashboard"
        subtitle="A snapshot of the Northstar workspace."
      />
      <Container display="flex" gap="4" padding="0" margin="t-6">
        <Container display="block" padding="0" gap="0" style={cardStyle}>
          <Statistic
            variant="card"
            tone="neutral"
            icon={<Icon name="folder" size="small" />}
            title="Projects"
            value={PROJECTS.length}
            description="In this workspace"
          />
        </Container>
        <Container display="block" padding="0" gap="0" style={cardStyle}>
          <Statistic
            variant="card"
            tone="success"
            icon={<Icon name="check_circle" size="small" />}
            title="Active"
            value={active}
            description="Currently in progress"
          />
        </Container>
        <Container display="block" padding="0" gap="0" style={cardStyle}>
          <Statistic
            variant="card"
            tone="warning"
            icon={<Icon name="rate_review" size="small" />}
            title="In review"
            value={review}
            description="Waiting on a decision"
          />
        </Container>
        <Container display="block" padding="0" gap="0" style={cardStyle}>
          <Statistic
            variant="card"
            tone="muted"
            icon={<Icon name="task_alt" size="small" />}
            title="Done"
            value={done}
            description="Closed this cycle"
          />
        </Container>
      </Container>
      <Container display="flex" gap="6" padding="0" margin="t-6">
        <Container display="block" padding="0" gap="0" style={columnStyle}>
          <Typography variant="h5" margin="b-4">
            Projects
          </Typography>
          <Table
            hidePagination
            padding="0"
            columns={[
              { id: "name", title: "Name" },
              { id: "owner", title: "Owner" },
              { id: "status", title: "Status" },
            ]}
            data={PROJECTS.slice(0, 5)}
          />
        </Container>
        <Container display="block" padding="0" gap="0" style={columnStyle}>
          <Typography variant="h5" margin="b-4">
            Activity
          </Typography>
          <Table
            hidePagination
            padding="0"
            columns={[
              { id: "title", title: "Update", widthPercentage: "46%" },
              { id: "actor", title: "By", widthPercentage: "27%" },
              { id: "when", title: "When", widthPercentage: "27%" },
            ]}
            data={ACTIVITIES.slice(0, 5)}
          />
        </Container>
      </Container>
    </TemplateShell>
  );
};

const meta = {
  title: "templates/Dashboard",
  parameters: { layout: "fullscreen" },
};

export default meta;

export const Page = {
  name: "Page",
  render: () => <DashboardPage />,
};
