import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";
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
