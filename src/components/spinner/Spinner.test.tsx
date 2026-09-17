import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Spinner from "./Spinner";
import { expectPublicClass } from "../../test/class-contract";

describe("Spinner public classes", () => {
  it("root uses cp-spinner and large size", () => {
    const { container } = render(<Spinner size="large" />);
    const el = container.firstElementChild!;
    expectPublicClass(el, "cp-spinner");
    expectPublicClass(el, "cp-spinner--large");
  });

  it("does not inherit Container default padding that inflates the spinner", () => {
    const { container } = render(<Spinner />);
    const el = container.firstElementChild!;
    expect(el.className.split(/\s+/)).not.toContain("cp-p-4");
    expectPublicClass(el, "cp-p-0");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(<Spinner />);
    expect(container.firstElementChild!.getAttribute("data-cp")).toBeNull();
  });
});
