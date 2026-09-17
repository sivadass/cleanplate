import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Animated from "./Animated";
import { expectPublicClass } from "../../test/class-contract";

describe("Animated public classes", () => {
  it("root uses cp-animated", () => {
    const { container } = render(<Animated>Content</Animated>);
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-animated");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(<Animated>Content</Animated>);
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
