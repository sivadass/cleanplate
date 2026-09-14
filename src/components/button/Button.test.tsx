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

describe("icon button circular hit area", () => {
  const scss = readFileSync("src/components/button/Button.module.scss", "utf8");

  it("small icon buttons set equal width and height with no horizontal padding", () => {
    const smallBlock = scss.match(
      /&\.cp-button--small \{([\s\S]*?)\n  &\.cp-button--medium/,
    )?.[1];
    expect(smallBlock).toBeDefined();
    const smallIcon = smallBlock!.match(/&\.cp-button--icon \{([^}]*)\}/);
    expect(smallIcon).not.toBeNull();
    expect(smallIcon![1]).toMatch(/width:\s*24px/);
    expect(smallIcon![1]).toMatch(/min-width:\s*24px/);
    expect(smallIcon![1]).toMatch(/padding:\s*0/);
  });
});
