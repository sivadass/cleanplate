import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Pagination from "./Pagination";
import { expectPublicClass } from "../../test/class-contract";

describe("Pagination public classes", () => {
  it("root uses cp-pagination", () => {
    const { container } = render(
      <Pagination
        totalItems={100}
        currentPage={1}
        onPageChange={vi.fn()}
      />,
    );
    const root = container.querySelector(".cp-pagination");
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-pagination");
  });

  it("does not inherit Container default padding or gap that inflate the bar", () => {
    const { container } = render(
      <Pagination
        totalItems={100}
        currentPage={1}
        onPageChange={vi.fn()}
      />,
    );
    for (const selector of [
      ".cp-pagination-wrapper",
      ".cp-pagination-buttons-wrapper",
      ".cp-pagination-show-per-page",
      ".cp-pagination-total-count",
    ]) {
      const el = container.querySelector(selector)!;
      const classes = el.className.split(/\s+/);
      expect(classes, selector).not.toContain("cp-p-4");
      expect(classes, selector).not.toContain("cp-g-4");
      expectPublicClass(el, "cp-p-0");
      expectPublicClass(el, "cp-g-0");
    }
  });

  it("locks page buttons and rows select to small size tokens", () => {
    const { container } = render(
      <Pagination
        totalItems={100}
        currentPage={1}
        onPageChange={vi.fn()}
      />,
    );
    const pageButtons = container.querySelectorAll(".cp-pagination-button");
    expect(pageButtons.length).toBeGreaterThan(0);
    pageButtons.forEach((btn) => {
      expectPublicClass(btn, "cp-button--small");
    });
    const rowsSelect = container.querySelector(".cp-pagination-rows-select");
    expect(rowsSelect).toBeTruthy();
    expectPublicClass(rowsSelect!, "cp-form-field--small");

    const scss = readFileSync(
      "src/components/pagination/Pagination.module.scss",
      "utf8",
    );
    expect(scss).toMatch(
      /\.cp-pagination-buttons-wrapper[\s\S]*?gap:\s*var\(--space-2\)/,
    );
    expect(scss).toMatch(
      /\.cp-pagination-show-per-page[\s\S]*?gap:\s*var\(--space-2\)/,
    );
    expect(scss).toMatch(
      /\.cp-pagination-buttons-wrapper \.cp-button\.cp-pagination-button \{[\s\S]*min-width:\s*var\(--cp-form-control-height-small\)/,
    );
    expect(scss).not.toMatch(/height:\s*36px/);
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(
      <Pagination totalItems={100} currentPage={1} onPageChange={vi.fn()} />,
    );
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
