import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { expectPublicClass } from "../../test/class-contract";
import FilterBar from "./FilterBar";
import { DATE_RANGE_ERROR } from "./filter-bar-model";
import type { FilterBarField, FilterBarValues } from "./filter-bar-types";

const status: FilterBarField = {
  id: "status",
  type: "select",
  label: "Status",
  placement: "bar",
  options: [
    { value: "active", label: "Active" },
    { value: "review", label: "Review" },
  ],
};

function Harness({
  fields,
  initial,
  onChange,
  dataTestId,
}: {
  fields: FilterBarField[];
  initial: FilterBarValues;
  onChange?: (values: FilterBarValues) => void;
  dataTestId?: string;
}) {
  const [values, setValues] = useState(initial);
  return (
    <FilterBar
      fields={fields}
      values={values}
      dataTestId={dataTestId}
      onChange={(next) => {
        onChange?.(next);
        setValues(next);
      }}
    />
  );
}

describe("FilterBar bar", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("calls onChange with the full values object when search changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        fields={[{ id: "q", type: "search", label: "Search", placement: "bar" }]}
        initial={{ q: "", extra: "keep" }}
        onChange={onChange}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Search" }), "a");
    expect(onChange).toHaveBeenCalledWith({ q: "a", extra: "keep" });
  });

  it("calls onChange when a bar select changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness fields={[status]} initial={{ status: null }} onChange={onChange} />);

    await user.click(screen.getByRole("combobox", { name: "Status" }));
    await user.click(await screen.findByRole("option", { name: "Active" }));
    expect(onChange).toHaveBeenCalledWith({
      status: expect.objectContaining({ value: "active", label: "Active" }),
    });
  });

  it("renders nothing when fields is empty", () => {
    const { container } = render(
      <FilterBar fields={[]} values={{}} onChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a missing value as empty", () => {
    render(
      <FilterBar
        fields={[{ id: "q", type: "search", label: "Search", placement: "bar" }]}
        values={{}}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Search" })).toHaveValue("");
  });

  it("renders only the first field when ids are duplicated and warns in development", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <FilterBar
        fields={[
          { id: "q", type: "search", label: "Search", placement: "bar" },
          { id: "q", type: "search", label: "Query", placement: "bar" },
        ]}
        values={{ q: "" }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Query" })).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith('FilterBar: duplicate field id "q" ignored.');
    warn.mockRestore();
  });

  it("exposes the public root class and margin class", () => {
    const { container } = render(
      <FilterBar
        fields={[{ id: "q", type: "search", label: "Search", placement: "bar" }]}
        values={{ q: "" }}
        onChange={vi.fn()}
        margin="b-2"
      />,
    );
    const root = container.firstElementChild as Element;
    expectPublicClass(root, "cp-filter-bar");
    expect(root.className).toContain("cp-m-b-2");
  });
});

const owner: FilterBarField = {
  id: "owner",
  type: "multiSelect",
  label: "Owner",
  placement: "drawer",
  options: [
    { value: "asha", label: "Asha" },
    { value: "leo", label: "Leo" },
  ],
};

const team: FilterBarField = {
  id: "team",
  type: "select",
  label: "Team",
  placement: "drawer",
  options: [{ value: "core", label: "Core" }],
};

describe("FilterBar drawer", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("hides the Filters button when every field is in the bar", () => {
    render(
      <FilterBar
        fields={[{ id: "q", type: "search", label: "Search", placement: "bar" }]}
        values={{ q: "" }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.queryByRole("button", { name: "Filters" })).not.toBeInTheDocument();
  });

  it("shows Filters or Filters N from committed drawer values", () => {
    const { rerender } = render(
      <FilterBar fields={[owner]} values={{ owner: [] }} onChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();

    rerender(
      <FilterBar
        fields={[owner, team]}
        values={{
          owner: [{ value: "asha", label: "Asha" }],
          team: { value: "core", label: "Core" },
        }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Filters 2" })).toBeInTheDocument();
  });

  it("does not call onChange until Apply, and keeps a bar edit made while open", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        fields={[
          { id: "q", type: "search", label: "Search", placement: "bar" },
          owner,
        ]}
        initial={{ q: "", owner: [] }}
        onChange={onChange}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Search" }), "a");
    onChange.mockClear();

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("combobox", { name: "Owner" }));
    await user.click(await screen.findByRole("option", { name: "Asha" }));
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(onChange).toHaveBeenLastCalledWith({
      q: "a",
      owner: [expect.objectContaining({ value: "asha" })],
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Apply without onChange when the draft matches", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness fields={[owner]} initial={{ owner: [] }} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("commits cleared drawer values only after Apply", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        fields={[owner]}
        initial={{ owner: [{ value: "asha", label: "Asha" }] }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filters 1" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onChange).toHaveBeenCalledWith({ owner: [] });
  });

  it("drops the draft on close, Escape, and overlay pointerdown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const fields = [owner];
    const initial = { owner: [] as FilterBarValues["owner"] };

    render(
      <FilterBar fields={fields} values={initial} onChange={onChange} dataTestId="filters" />,
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("combobox", { name: "Owner" }));
    await user.click(await screen.findByRole("option", { name: "Asha" }));
    await user.click(screen.getByRole("button", { name: /close drawer/i }));
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.keyboard("{Escape}");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.pointerDown(screen.getByTestId("filters-drawer-overlay"));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes and drops the draft when drawer field ids change while open", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <FilterBar fields={[owner]} values={{ owner: [] }} onChange={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(
      <FilterBar fields={[team]} values={{ team: null }} onChange={vi.fn()} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

const due: FilterBarField = { id: "due", type: "dateRange", label: "Due", placement: "drawer" };
const dueBar: FilterBarField = { id: "due", type: "dateRange", label: "Due", placement: "bar" };

function enabledDayIds(prefix: string): string[] {
  return screen
    .getAllByTestId(new RegExp(`^${prefix}-day-`))
    .map((element) => element.getAttribute("data-testid") ?? "")
    .filter((id) => {
      const element = screen.getByTestId(id);
      return element.getAttribute("aria-disabled") !== "true" && !element.hasAttribute("disabled");
    });
}

async function commitEdgeDay(
  user: ReturnType<typeof userEvent.setup>,
  prefix: string,
  edge: "first" | "last",
) {
  await user.click(screen.getByTestId(`${prefix}-trigger`));
  const ids = enabledDayIds(prefix);
  const dayId = edge === "first" ? ids[0] : ids[ids.length - 1];
  await user.click(screen.getByTestId(dayId));
  await user.click(screen.getByTestId(`${prefix}-done`));
}

describe("FilterBar date range", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("shows the error and disables Apply when from is after to", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterBar
        dataTestId="filters"
        fields={[due]}
        values={{ due: { from: null, to: null } }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await commitEdgeDay(user, "filters-field-due-from", "last");
    await commitEdgeDay(user, "filters-field-due-to", "first");

    expect(screen.getByText("From must be on or before To")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("commits a from-only bar range and then refuses an earlier to", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        dataTestId="filters"
        fields={[dueBar]}
        initial={{ due: { from: null, to: null } }}
        onChange={onChange}
      />,
    );

    await commitEdgeDay(user, "filters-field-due-from", "last");
    expect(onChange).toHaveBeenCalledTimes(1);
    await commitEdgeDay(user, "filters-field-due-to", "first");
    expect(screen.getByText(DATE_RANGE_ERROR)).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("counts a partial committed range as one Filters field", () => {
    render(
      <FilterBar
        fields={[due]}
        values={{ due: { from: new Date(2026, 7, 1), to: null } }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Filters 1" })).toBeInTheDocument();
  });
});
