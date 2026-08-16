import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Badge from "./Badge";
import { expectPublicClass } from "../../test/class-contract";

describe("Badge public classes", () => {
  it("root uses cp-badge and warning variant", () => {
    render(<Badge label="New" variant="warning" />);
    const el = screen.getByText("New");
    expectPublicClass(el, "cp-badge");
    expectPublicClass(el, "cp-badge--warning");
  });

  it("does not emit data-cp by default", () => {
    render(<Badge label="New" />);
    expect(screen.getByText("New").getAttribute("data-cp")).toBeNull();
  });
});
