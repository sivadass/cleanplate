import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Statistic from "./Statistic";

describe("Statistic", () => {
  it("renders title and formatted value", () => {
    render(<Statistic title="Active Users" value={112893} />);
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("112,893")).toBeInTheDocument();
  });

  it("renders string value verbatim", () => {
    render(<Statistic title="Revenue" value="¥1.2M" />);
    expect(screen.getByText("¥1.2M")).toBeInTheDocument();
  });

  it("renders prefix and suffix when not loading", () => {
    render(
      <Statistic
        title="Feedback"
        value={93}
        prefix={<span data-testid="prefix-icon">↑</span>}
        suffix="/ 100"
      />,
    );
    expect(screen.getByTestId("prefix-icon")).toBeInTheDocument();
    expect(screen.getByText("/ 100")).toBeInTheDocument();
    expect(screen.getByText("93")).toBeInTheDocument();
  });

  it("shows Spinner and hides prefix, suffix, and value when loading", () => {
    render(
      <Statistic
        title="Active Users"
        value={112893}
        loading
        prefix={<span data-testid="prefix-icon">↑</span>}
        suffix="/ 100"
      />,
    );
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("progress_activity")).toBeInTheDocument();
    expect(screen.queryByText("112,893")).not.toBeInTheDocument();
    expect(screen.queryByTestId("prefix-icon")).not.toBeInTheDocument();
    expect(screen.queryByText("/ 100")).not.toBeInTheDocument();
  });

  it("sets aria-busy on content when loading", () => {
    const { container } = render(
      <Statistic title="Active Users" value={1} loading />,
    );
    const content = container.querySelector('[aria-busy="true"]');
    expect(content).toBeInTheDocument();
  });

  it("applies tone modifier class on root", () => {
    render(
      <Statistic
        title="Overdue"
        value={0}
        tone="danger"
        dataTestId="overdue-stat"
      />,
    );
    expect(screen.getByTestId("overdue-stat").className).toMatch(/tone-danger/);
  });

  it("defaults progress variant from tone", () => {
    const { container } = render(
      <Statistic
        title="Collected"
        value={3375}
        tone="success"
        progress={{ value: 38 }}
      />,
    );
    expect(
      container.querySelector('[class*="cp-statistic-progress"]'),
    ).toBeInTheDocument();
  });

  it("defaults footer badge variant from tone", () => {
    render(
      <Statistic
        title="Paid dues"
        value={3}
        tone="success"
        footer={{ label: "of 8 total", badge: "38%" }}
      />,
    );
    expect(screen.getByText("38%")).toBeInTheDocument();
  });

  it("applies dataTestId on root", () => {
    render(
      <Statistic title="Active Users" value={1} dataTestId="active-users-stat" />,
    );
    expect(screen.getByTestId("active-users-stat")).toBeInTheDocument();
  });

  it("merges className on root", () => {
    render(
      <Statistic
        title="Active Users"
        value={1}
        className="dashboard-stat"
        dataTestId="stat-root"
      />,
    );
    expect(screen.getByTestId("stat-root")).toHaveClass("dashboard-stat");
  });

  it("applies card variant class", () => {
    render(
      <Statistic
        variant="card"
        title="Total billed"
        value={9000}
        dataTestId="stat-card"
      />,
    );
    expect(screen.getByTestId("stat-card").className).toMatch(/card/);
  });

  it("renders icon in header row", () => {
    render(
      <Statistic
        title="Collected"
        value={3375}
        icon={<span data-testid="stat-icon">icon</span>}
      />,
    );
    expect(screen.getByTestId("stat-icon")).toBeInTheDocument();
  });

  it("renders description below value", () => {
    render(
      <Statistic
        title="Total billed"
        value={9000}
        description="8 active members"
      />,
    );
    expect(screen.getByText("8 active members")).toBeInTheDocument();
  });

  it("renders progress bar when progress is set", () => {
    const { container } = render(
      <Statistic
        title="Collected"
        value={3375}
        progress={{ value: 38, variant: "success" }}
      />,
    );
    expect(
      container.querySelector('[class*="cp-statistic-progress"]'),
    ).toBeInTheDocument();
  });

  it("renders footer label and badge", () => {
    render(
      <Statistic
        title="Paid dues"
        value={3}
        footer={{ label: "of 8 total", badge: "38%", badgeVariant: "success" }}
      />,
    );
    expect(screen.getByText("of 8 total")).toBeInTheDocument();
    expect(screen.getByText("38%")).toBeInTheDocument();
  });

  it("hides progress, description, and footer when loading", () => {
    const { container } = render(
      <Statistic
        title="Collected"
        value={3375}
        loading
        description="38% collection rate"
        progress={{ value: 38, variant: "success" }}
        footer={{ label: "of 8 total", badge: "38%" }}
      />,
    );
    expect(
      container.querySelector('[class*="cp-statistic-progress"]'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("38% collection rate")).not.toBeInTheDocument();
    expect(screen.queryByText("of 8 total")).not.toBeInTheDocument();
  });
});
