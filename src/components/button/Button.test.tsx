import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";
import { CleanPlatePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { expectPublicClass } from "../../test/class-contract";

describe("Button public classes", () => {
  it("root uses cp-button and outline modifier", () => {
    render(<Button variant="outline">Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expectPublicClass(el, "cp-button");
    expectPublicClass(el, "cp-button--outline");
  });

  it("does not emit data-cp by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button").getAttribute("data-cp")).toBeNull();
  });

  it("does not emit data-cp without provider", () => {
    render(<Button variant="outline">A</Button>);
    expect(screen.getByRole("button").getAttribute("data-cp")).toBeNull();
  });

  it("emits non-default props inside provider", () => {
    render(
      <CleanPlatePrototypeAttributes>
        <Button variant="outline" margin="b-2">
          A
        </Button>
      </CleanPlatePrototypeAttributes>,
    );
    const el = screen.getByRole("button");
    expect(el.getAttribute("data-cp")).toBe("Button");
    expect(el.getAttribute("data-cp-variant")).toBe("outline");
    expect(el.getAttribute("data-cp-margin")).toBe("b-2");
    expect(el.getAttribute("data-cp-size")).toBeNull();
  });

  it("ignores click when isDisabled", async () => {
    const onClick = vi.fn();
    render(
      <Button isDisabled onClick={onClick}>
        Save
      </Button>,
    );
    screen.getByRole("button").click();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Button sizes", () => {
  it("applies medium class by default", () => {
    render(<Button>Save</Button>);
    expectPublicClass(screen.getByRole("button"), "cp-button--medium");
  });

  it("applies large class", () => {
    render(<Button size="large">Save</Button>);
    expectPublicClass(screen.getByRole("button"), "cp-button--large");
  });
});

describe("icon button square hit area", () => {
  const scss = readFileSync("src/components/button/Button.module.scss", "utf8");

  it("does not use a circular icon radius or legacy heights", () => {
    expect(scss).not.toMatch(/border-radius:\s*50%/);
    expect(scss).not.toMatch(/height:\s*50px/);
    expect(scss).not.toMatch(/height:\s*24px/);
    expect(scss).not.toMatch(/min-width:\s*96px/);
  });

  it("sizes icon-only buttons from height tokens with zero padding", () => {
    expect(scss).toMatch(
      /&\.cp-button--icon \{[\s\S]*width:\s*var\(--cp-button-height-small\)/,
    );
    expect(scss).toMatch(
      /&\.cp-button--icon \{[\s\S]*width:\s*var\(--cp-button-height-medium\)/,
    );
    expect(scss).toMatch(
      /&\.cp-button--icon \{[\s\S]*width:\s*var\(--cp-button-height-large\)/,
    );
    expect(scss).toMatch(/&\.cp-button--icon \{[\s\S]*padding:\s*0/);
  });
});
