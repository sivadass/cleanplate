import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Stepper from "./Stepper";
import { expectPublicClass } from "../../test/class-contract";

describe("Stepper public classes", () => {
  it("root uses cp-stepper", () => {
    const { container } = render(
      <Stepper
        config={[
          { label: "Step 1", key: "step-1", isActive: true },
          { label: "Step 2", key: "step-2" },
        ]}
      />,
    );
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-stepper");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(
      <Stepper config={[{ label: "Step 1", key: "step-1" }]} />,
    );
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
