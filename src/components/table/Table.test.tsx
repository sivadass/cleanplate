import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { expectPublicClass } from "../../test/class-contract";
import Table from "./Table";

const columns = [
  { id: "name", title: "Name" },
  { id: "role", title: "Role" },
];

const data = [
  { name: "Ada", role: "Engineer" },
  { name: "Grace", role: "Scientist" },
];

const mobileColumns = {
  title: "name",
  subtitle: "role",
};

describe("Table public classes", () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it("renders desktop table with cp-table and cp-table-core", () => {
    const { container } = render(
      <Table columns={columns} data={data} hidePagination />,
    );

    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-table");

    const table = container.querySelector("table");
    expect(table).toBeTruthy();
    expectPublicClass(table!, "cp-table-core");
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("renders MediaObject rows on narrow viewport when mobileColumns is set", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { container } = render(
      <Table
        columns={columns}
        data={data}
        mobileColumns={mobileColumns}
        hidePagination
      />,
    );

    expect(container.querySelector("table")).toBeNull();
    expectPublicClass(
      container.querySelector("[class*='cp-media-object']")!,
      "cp-media-object",
    );
    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });
});
