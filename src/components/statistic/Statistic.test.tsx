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

  it("applies valueTone modifier class on value element", () => {
    render(
      <Statistic title="Active" value={11.28} precision={2} valueTone="positive" />,
    );
    const valueEl = screen.getByText("11.28");
    expect(valueEl.className).toMatch(/positive/);
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
});
