import { readFileSync } from "node:fs";
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

  it("emits item, count, separator, and link public classes", () => {
    const { container } = render(
      <Stepper
        config={[
          { label: "Profile", key: "#profile", isCompleted: true },
          { label: "Invite", key: "#invite", isActive: true },
          { label: "Billing", key: "#billing" },
        ]}
      />,
    );

    const items = container.querySelectorAll(".cp-stepper-item");
    expect(items).toHaveLength(3);
    expectPublicClass(items[0], "cp-stepper-item--completed");
    expectPublicClass(items[1], "cp-stepper-item--active");
    expectPublicClass(container.querySelector(".cp-stepper-count")!, "cp-stepper-count");
    expectPublicClass(
      container.querySelector(".cp-stepper-separator")!,
      "cp-stepper-separator",
    );
    expectPublicClass(container.querySelector(".cp-stepper-link")!, "cp-stepper-link");
  });

  it("sizes steps equally so HTML connectors meet for any step count", () => {
    const scss = readFileSync("src/components/stepper/Stepper.module.scss", "utf8");
    expect(scss).toMatch(/flex:\s*1 1 0/);
    expect(scss).not.toMatch(/space-evenly/);
    expect(scss).not.toMatch(/flex-basis:\s*var\(--length-quarter\)/);
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(
      <Stepper config={[{ label: "Step 1", key: "step-1" }]} />,
    );
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
