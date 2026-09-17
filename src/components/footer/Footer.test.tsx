import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";
import { expectPublicClass } from "../../test/class-contract";

describe("Footer public classes", () => {
  it("root uses cp-footer", () => {
    const { container } = render(<Footer brandName="Acme" />);
    const root = container.querySelector("footer");
    expect(root).toBeTruthy();
    expectPublicClass(root!, "cp-footer");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(<Footer brandName="Acme" />);
    expect(container.querySelector("[data-cp]")).toBeNull();
  });
});
