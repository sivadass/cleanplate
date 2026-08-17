import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";
import { expectPublicClass } from "../../test/class-contract";

describe("Header public classes", () => {
  it("root uses cp-header", () => {
    const { container } = render(
      <Header menuItems={[{ label: "Home", value: "home" }]} />,
    );
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-header");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(
      <Header menuItems={[{ label: "Home", value: "home" }]} />,
    );
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
