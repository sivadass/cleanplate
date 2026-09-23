import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TextArea from "./TextArea";
import Stepper from "./Stepper";
import File from "./File";
import Select from "./Select";
import DatePicker from "./Date";
import ColorPicker from "./ColorPicker";
import { expectPublicClass } from "../../test/class-contract";

describe("boxed control size classes", () => {
  it("TextArea applies medium by default and small when set", () => {
    const { rerender } = render(<TextArea label="Message" />);
    const root = () =>
      screen.getByLabelText("Message").closest(".cp-form-field") as HTMLElement;
    expectPublicClass(root(), "cp-form-field--medium");
    rerender(<TextArea label="Message" size="small" />);
    expectPublicClass(root(), "cp-form-field--small");
  });

  it("Stepper applies large size class", () => {
    render(<Stepper label="Qty" size="large" />);
    expectPublicClass(
      screen.getByLabelText("Qty").closest(".cp-form-field") as HTMLElement,
      "cp-form-field--large",
    );
  });

  it("File button applies small size class", () => {
    render(<File label="Upload" size="small" />);
    expectPublicClass(
      screen.getByLabelText("Upload").closest(".cp-form-field") as HTMLElement,
      "cp-form-field--small",
    );
  });

  it("Select Date and ColorPicker apply size on the field wrapper", () => {
    const { rerender } = render(
      <Select label="Fruit" options={[{ label: "Apple", value: "a" }]} size="small" />,
    );
    expectPublicClass(
      screen.getByLabelText("Fruit").closest(".cp-form-field") as HTMLElement,
      "cp-form-field--small",
    );
    rerender(<DatePicker label="DOB" size="large" />);
    expectPublicClass(
      screen.getByLabelText("DOB").closest(".cp-form-field") as HTMLElement,
      "cp-form-field--large",
    );
    rerender(<ColorPicker label="Brand" size="small" />);
    expectPublicClass(
      screen.getByLabelText("Brand").closest(".cp-form-field") as HTMLElement,
      "cp-form-field--small",
    );
  });
});
