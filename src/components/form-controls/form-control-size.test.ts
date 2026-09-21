import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const scss = readFileSync(
  "src/components/form-controls/FormControls.module.scss",
  "utf8",
);
const reset = readFileSync("src/styles/reset.scss", "utf8");

describe("form control size CSS contract", () => {
  it("shared chrome uses height tokens instead of 50px", () => {
    expect(scss).toContain("height: var(--cp-form-control-height)");
    expect(scss).not.toMatch(/\.cp-form-control \{[^}]*height:\s*50px/);
    expect(scss).toContain("min-height: var(--cp-form-control-height)");
  });

  it("field wrapper assigns local size variables", () => {
    expect(scss).toContain(
      "--cp-form-control-height: var(--cp-form-control-height-medium)",
    );
    expect(scss).toContain(".cp-form-field--small");
    expect(scss).toContain(".cp-form-field--medium");
    expect(scss).toContain(".cp-form-field--large");
  });

  it("native input reset uses the medium height token", () => {
    expect(reset).toContain(
      "height: var(--cp-form-control-height-medium)",
    );
    expect(reset).not.toMatch(/input,[\s\S]*height:\s*50px/);
  });

  it("stepper action buttons size from the field height token", () => {
    expect(scss).toMatch(
      /\.cp-stepper-btn \{[^}]*width:\s*var\(--cp-form-control-height\)/,
    );
    expect(scss).toMatch(/\.cp-stepper-btn \{[^}]*height:\s*100%/);
  });

  it("size wrappers assign public radius tokens", () => {
    expect(scss).toContain(
      "--cp-form-control-radius: var(--cp-form-control-radius-small)",
    );
    expect(scss).toContain(
      "--cp-form-control-radius: var(--cp-form-control-radius-medium)",
    );
    expect(scss).toContain(
      "--cp-form-control-radius: var(--cp-form-control-radius-large)",
    );
    expect(scss).toContain(
      "border-radius: var(--cp-form-control-radius, var(--cp-form-control-radius-medium))",
    );
  });
});
