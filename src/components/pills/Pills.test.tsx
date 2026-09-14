import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Pills from "./Pills";
import { expectPublicClass } from "../../test/class-contract";

describe("Pills public classes", () => {
  it("root uses cp-pills", () => {
    const { container } = render(<Pills label="Tag" mode="read-only" />);
    const root = container.querySelector(".cp-pills");
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-pills");
  });

  it("does not inherit Container default padding or gap that inflate the chip", () => {
    const { container } = render(<Pills label="Tag" mode="read-only" />);
    const root = container.querySelector(".cp-pills")!;
    const wrapper = container.querySelector(".cp-pills-wrapper")!;

    for (const el of [root, wrapper]) {
      const classes = el.className.split(/\s+/);
      expect(classes).not.toContain("cp-p-4");
      expect(classes).not.toContain("cp-g-4");
      expectPublicClass(el, "cp-p-0");
    }
  });

  it("does not inherit Input default margin that adds space below edit chips", () => {
    const { container } = render(<Pills label="Taxi" mode="edit" />);
    const field = container.querySelector(".cp-pills-input")!;
    expect(field.className.split(/\s+/)).not.toContain("cp-m-b-4");
  });

  it("overrides form-field width so the action button stays inside the chip", () => {
    const scss = readFileSync("src/components/pills/Pills.module.scss", "utf8");
    expect(scss).toMatch(/\.cp-pills-input[\s\S]*?width:\s*auto/);
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(<Pills label="Tag" />);
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
