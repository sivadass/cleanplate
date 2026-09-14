import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Alert from "./Alert";
import { expectPublicClass } from "../../test/class-contract";

describe("Alert public classes", () => {
  it("root uses cp-alert and success variant", () => {
    const { container } = render(<Alert message="Saved" variant="success" />);
    const el = container.firstElementChild!;
    expectPublicClass(el, "cp-alert");
    expectPublicClass(el, "cp-alert--success");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(<Alert message="Saved" />);
    expect(container.firstElementChild!.getAttribute("data-cp")).toBeNull();
  });
});
