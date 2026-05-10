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
    const trigger = screen.getByRole("combobox", { name: /pick/i });
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    const grid = screen.getByRole("grid");
    const dayBtns = within(grid).getAllByRole("button");
    const day18Btn = dayBtns.find((b) => b.textContent === "18");
    expect(day18Btn).toBeDefined();
    await user.click(day18Btn!);
    await user.click(screen.getByRole("button", { name: /^ok$/i }));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1);
    });
    const called = onChange.mock.calls[0][0] as Date;
    expect(called.getFullYear()).toBe(2026);
    expect(called.getMonth()).toBe(4);
    expect(called.getDate()).toBe(18);
  });
});
