import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Pagination from "./Pagination";
import { expectPublicClass } from "../../test/class-contract";

describe("Pagination public classes", () => {
  it("root uses cp-pagination", () => {
    render(
      <Pagination
        totalItems={100}
        currentPage={1}
        onPageChange={vi.fn()}
      />,
    );
    const root = screen.getByText(/Total Items/i).closest('[class*="cp-pagination"]');
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-pagination");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(
      <Pagination totalItems={100} currentPage={1} onPageChange={vi.fn()} />,
    );
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
