import { readFileSync } from "node:fs";
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

  it("puts icon size, alignment, and label color on public menu-list classes", () => {
    const scss = readFileSync(
      "src/components/menu-list/MenuList.module.scss",
      "utf8",
    );
    expect(scss).toMatch(/\.cp-menu-list\s*\{/);
    expect(scss).toMatch(
      /\.cp-menu-list a,\s*\n\.cp-menu-list-wrapper a/,
    );
    expect(scss).toMatch(/\.cp-menu-list a[\s\S]*?align-items:\s*center/);
    expect(scss).toMatch(
      /\.cp-menu-list \.cp-icon\.cp-menu-list-item-icon[\s\S]*?font-size:\s*24px/,
    );
    expect(scss).toMatch(
      /\.cp-menu-list \.cp-typography\.cp-menu-list-item-label[\s\S]*?color:\s*var\(--primary-brand\)/,
    );
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(
      <MenuList items={[{ label: "Home", value: "home" }]} />,
    );
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
