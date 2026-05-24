import React, { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DatePickerField from "./Date";

describe("Date (calendar picker)", () => {
  it("opens, selects a day, OK commits onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DatePickerField
        label="Pick"
        value={new Date(2026, 4, 10)}
        onChange={onChange}
        dataTestId="dp"
      />,
    );
    await user.click(screen.getByTestId("dp-trigger"));
    await waitFor(() => {
      expect(screen.getByTestId("dp-panel")).toBeInTheDocument();
    });
    await user.click(screen.getByTestId("dp-day-2026-05-18"));
    await user.click(screen.getByTestId("dp-done"));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1);
    });
    const called = onChange.mock.calls[0][0] as Date;
    expect(called.getFullYear()).toBe(2026);
    expect(called.getMonth()).toBe(4);
    expect(called.getDate()).toBe(18);
  });

  it("controlled mode with non-null initial value does not cause infinite re-renders", () => {
    let renderCount = 0;

    function ControlledDateTest() {
      const [billDate, setBillDate] = useState<Date | null>(
        () => new Date(2026, 4, 15),
      );
      renderCount += 1;
      return (
        <DatePickerField
          label="Bill date"
          name="billDate"
          value={billDate}
          onChange={setBillDate}
          clearable={false}
          isRequired
          dataTestId="controlled-date"
        />
      );
    }

    render(<ControlledDateTest />);

    expect(screen.getByRole("combobox", { name: /bill date/i })).toBeInTheDocument();
    expect(screen.getByText("May 15, 2026")).toBeInTheDocument();
    expect(renderCount).toBeLessThan(5);
  });

  it("controlled mode allows date changes without infinite loops", async () => {
    const user = userEvent.setup();

    function ControlledDateInteraction() {
      const [date, setDate] = useState<Date | null>(() => new Date(2026, 4, 10));
      return (
        <DatePickerField
          label="Test date"
          value={date}
          onChange={setDate}
          dataTestId="interactive-date"
        />
      );
    }

    render(<ControlledDateInteraction />);

    const trigger = screen.getByRole("combobox", { name: /test date/i });
    expect(screen.getByText("May 10, 2026")).toBeInTheDocument();

    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const grid = screen.getByRole("grid");
    const dayBtns = within(grid).getAllByRole("button");
    const day20Btn = dayBtns.find((b) => b.textContent === "20");
    expect(day20Btn).toBeDefined();
    await user.click(day20Btn!);
    await user.click(screen.getByRole("button", { name: /^done$/i }));

    await waitFor(() => {
      expect(screen.getByText("May 20, 2026")).toBeInTheDocument();
    });
  });
});
