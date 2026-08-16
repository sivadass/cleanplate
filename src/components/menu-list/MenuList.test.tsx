import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MenuList from "./MenuList";
import { expectPublicClass } from "../../test/class-contract";

describe("MenuList public classes", () => {
  it("root uses cp-menu-list", () => {
    const { container } = render(
      <MenuList
        items={[{ label: "Home", value: "home" }]}
        activeItem="home"
      />,
    );
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-menu-list");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(
      <MenuList items={[{ label: "Home", value: "home" }]} />,
    );
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
