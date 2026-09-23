import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { expectPublicClass } from "../../test/class-contract";
import FilterBar from "./FilterBar";
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
}: {
  fields: FilterBarField[];
  initial: FilterBarValues;
  onChange?: (values: FilterBarValues) => void;
}) {
  const [values, setValues] = useState(initial);
  return (
    <FilterBar
      fields={fields}
      values={values}
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
