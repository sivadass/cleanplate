import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SegmentedControl from "./SegmentedControl";

const baseOptions = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
] as const;

describe("SegmentedControl", () => {
  it("renders legend and segmented options", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        options={[...baseOptions]}
        dataTestId="view"
      />
    );

    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByTestId("view-options")).toHaveAttribute(
      "role",
      "radiogroup"
    );
    expect(screen.getByTestId("view-input-day")).toBeInTheDocument();
    expect(screen.getByTestId("view-label-week")).toBeInTheDocument();
  });

  it("fires onChange with next value in controlled mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <SegmentedControl
        label="View"
        name="view"
        value="day"
        onChange={onChange}
        options={[...baseOptions]}
        dataTestId="view"
      />
    );

    await user.click(screen.getByTestId("view-label-week"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBe("week");
  });

  it("does not clear selection when re-clicking the selected segment", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <SegmentedControl
        label="View"
        name="view"
        value="week"
        onChange={onChange}
        options={[...baseOptions]}
        dataTestId="view"
      />
    );

    await user.click(screen.getByTestId("view-label-week"));

    expect(screen.getByTestId("view-input-week")).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports uncontrolled defaultValue", async () => {
    const user = userEvent.setup();

    render(
      <SegmentedControl
        label="View"
        name="view"
        defaultValue="day"
        options={[...baseOptions]}
        dataTestId="view"
      />
    );

    expect(screen.getByTestId("view-input-day")).toBeChecked();

    await user.click(screen.getByTestId("view-label-month"));

    expect(screen.getByTestId("view-input-month")).toBeChecked();
  });

  it("disables all options when group is disabled", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        isDisabled
        options={[...baseOptions]}
        dataTestId="view"
      />
    );

    expect(screen.getByTestId("view-input-day")).toBeDisabled();
    expect(screen.getByTestId("view-input-week")).toBeDisabled();
    expect(screen.getByTestId("view-input-month")).toBeDisabled();
  });

  it("disables only the configured option", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        options={[
          { label: "Day", value: "day" },
          { label: "Week", value: "week", isDisabled: true },
        ]}
        dataTestId="view"
      />
    );

    expect(screen.getByTestId("view-input-day")).not.toBeDisabled();
    expect(screen.getByTestId("view-input-week")).toBeDisabled();
  });

  it("shows required indicator and marks first enabled radio as required", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        isRequired
        options={[
          { label: "Day", value: "day", isDisabled: true },
          { label: "Week", value: "week" },
        ]}
        dataTestId="view"
      />
    );

    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByTestId("view-input-week")).toBeRequired();
    expect(screen.getByTestId("view-input-week")).toHaveAttribute(
      "aria-required",
      "true"
    );
  });

  it("renders error message as an alert and wires test id suffix", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        error="Pick a view"
        options={[...baseOptions]}
        dataTestId="view"
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Pick a view");
    expect(screen.getByTestId("view-error")).toHaveTextContent("Pick a view");
  });

  it("uses ariaLabel for icon-only options", () => {
    render(
      <SegmentedControl
        label="Align"
        name="align"
        options={[
          {
            value: "left",
            icon: <span data-testid="icon-left" />,
            ariaLabel: "Align left",
          },
          {
            value: "right",
            icon: <span data-testid="icon-right" />,
            ariaLabel: "Align right",
          },
        ]}
        dataTestId="align"
      />
    );

    expect(screen.getByTestId("align-input-left")).toHaveAccessibleName(
      "Align left"
    );
    expect(screen.getByTestId("align-input-right")).toHaveAccessibleName(
      "Align right"
    );
  });

  it("applies small size class", () => {
    const { container } = render(
      <SegmentedControl
        label="View"
        name="view"
        size="small"
        options={[...baseOptions]}
      />
    );

    expect(
      container.querySelector("[class*='cp-segmented-control--small']")
    ).toBeTruthy();
  });

  it("uses option-level input test id override", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        dataTestId="view"
        options={[
          { label: "Day", value: "day", dataTestId: "day-input-custom" },
          { label: "Week", value: "week" },
        ]}
      />
    );

    expect(screen.getByTestId("day-input-custom")).toBeInTheDocument();
    expect(screen.getByTestId("view-input-week")).toBeInTheDocument();
  });
});
