import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FeedbackState from "./FeedbackState";

describe("FeedbackState", () => {
  it("defaults role to status for empty variant", () => {
    render(<FeedbackState variant="empty" title="No items" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("defaults role to alert for error variant", () => {
    render(<FeedbackState variant="error" title="Failed to load" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("omits role when role is none", () => {
    const { container } = render(
      <FeedbackState variant="empty" title="No items" role="none" />
    );
    expect(container.querySelector("[role]")).toBeNull();
  });

  it("renders illustration img when illustration is a URL string", () => {
    render(
      <FeedbackState
        variant="empty"
        title="No results"
        illustration="/assets/empty.png"
        illustrationAlt="No results illustration"
      />
    );
    const img = screen.getByRole("img", { name: "No results illustration" });
    expect(img).toHaveAttribute("src", "/assets/empty.png");
  });

  it("prefers illustration over icon", () => {
    render(
      <FeedbackState
        variant="empty"
        title="No results"
        illustration="/assets/empty.png"
        icon="search_off"
      />
    );
    expect(
      document.querySelector('img[src="/assets/empty.png"]')
    ).toBeInTheDocument();
    expect(screen.queryByText("search_off")).not.toBeInTheDocument();
  });

  it("renders icon when illustration is omitted", () => {
    render(
      <FeedbackState variant="empty" title="No results" icon="folder_open" />
    );
    expect(screen.getByText("folder_open")).toBeInTheDocument();
  });

  it("uses primaryAction over onRetry", async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();
    const onRetry = vi.fn();

    render(
      <FeedbackState
        variant="error"
        title="Error"
        primaryAction={{ label: "Contact support", onClick: onPrimary }}
        onRetry={onRetry}
      />
    );

    await user.click(screen.getByRole("button", { name: "Contact support" }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();
  });

  it("renders retry button when onRetry is set and primaryAction is absent", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<FeedbackState variant="error" title="Error" onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("applies dataTestId on root", () => {
    render(
      <FeedbackState
        variant="empty"
        title="No items"
        dataTestId="projects-empty"
      />
    );
    expect(screen.getByTestId("projects-empty")).toBeInTheDocument();
  });

  it("merges className on root", () => {
    render(
      <FeedbackState
        variant="empty"
        title="No items"
        className="my-module-empty"
      />
    );
    expect(screen.getByRole("status")).toHaveClass("my-module-empty");
  });

  it("renders error details in a details element", () => {
    render(
      <FeedbackState
        variant="error"
        title="Error"
        errorDetails="ECONNREFUSED"
      />
    );
    expect(screen.getByText("Show details")).toBeInTheDocument();
    expect(screen.getByText("ECONNREFUSED")).toBeInTheDocument();
  });
});
