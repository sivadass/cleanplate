import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Input from "./Input";
import { CleanPlatePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { expectPublicClass } from "../../test/class-contract";

function fieldRoot(): HTMLElement {
  return screen.getByLabelText("Email").closest(".cp-form-field") as HTMLElement;
}

describe("Input sizes", () => {
  it("applies medium class by default", () => {
    render(<Input label="Email" />);
    expectPublicClass(fieldRoot(), "cp-form-field--medium");
  });

  it("applies small and large classes", () => {
    const { rerender } = render(<Input label="Email" size="small" />);
    expectPublicClass(fieldRoot(), "cp-form-field--small");
    rerender(<Input label="Email" size="large" />);
    expectPublicClass(fieldRoot(), "cp-form-field--large");
  });

  it("omits default size from prototype attributes", () => {
    render(
      <CleanPlatePrototypeAttributes>
        <Input label="Email" />
      </CleanPlatePrototypeAttributes>,
    );
    expect(fieldRoot().getAttribute("data-cp")).toBe("FormControls.Input");
    expect(fieldRoot().getAttribute("data-cp-size")).toBeNull();
  });

  it("emits data-cp-size when small", () => {
    render(
      <CleanPlatePrototypeAttributes>
        <Input label="Email" size="small" />
      </CleanPlatePrototypeAttributes>,
    );
    expect(fieldRoot().getAttribute("data-cp-size")).toBe("small");
  });
});
