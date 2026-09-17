import { describe, expect, it } from "vitest";
import { emitDataCp } from "./emit-data-cp";

describe("emitDataCp", () => {
  it("returns empty object when disabled", () => {
    expect(
      emitDataCp(false, "Button", { variant: "outline" }, { variant: "solid" }),
    ).toEqual({});
  });

  it("emits data-cp and non-default scalar props", () => {
    expect(
      emitDataCp(
        true,
        "Button",
        { variant: "outline", size: "medium", margin: "b-2" },
        { variant: "solid", size: "medium", margin: "0" },
      ),
    ).toEqual({
      "data-cp": "Button",
      "data-cp-variant": "outline",
      "data-cp-margin": "b-2",
    });
  });

  it("emits boolean true only", () => {
    expect(
      emitDataCp(
        true,
        "Button",
        { isLoading: true, isDisabled: false },
        { isLoading: false, isDisabled: false },
      ),
    ).toEqual({
      "data-cp": "Button",
      "data-cp-is-loading": "true",
    });
  });

  it("skips function props, children, className, and style", () => {
    expect(
      emitDataCp(
        true,
        "Button",
        {
          onClick: () => {},
          children: "Save",
          className: "x",
          style: { color: "red" },
          variant: "outline",
        },
        { variant: "solid" },
      ),
    ).toEqual({
      "data-cp": "Button",
      "data-cp-variant": "outline",
    });
  });

  it("skips React elements", () => {
    const el = <span>child</span>;
    expect(
      emitDataCp(true, "PageHeader", { primaryCta: el }, {}),
    ).toEqual({
      "data-cp": "PageHeader",
    });
  });
});
