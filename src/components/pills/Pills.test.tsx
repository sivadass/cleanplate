import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Pills from "./Pills";
import { expectPublicClass } from "../../test/class-contract";

describe("Pills public classes", () => {
  it("root uses cp-pills", () => {
    render(<Pills label="Tag" mode="read-only" />);
    const root = screen.getByText("Tag").closest('[class*="cp-pills"]');
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-pills");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(<Pills label="Tag" />);
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
