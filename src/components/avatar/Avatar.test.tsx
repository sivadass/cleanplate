import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Avatar from "./Avatar";
import { expectPublicClass } from "../../test/class-contract";

describe("Avatar public classes", () => {
  it("root uses cp-avatar and small size", () => {
    render(<Avatar name="Jane Doe" size="small" />);
    const el = screen.getByTitle("Jane Doe");
    expectPublicClass(el, "cp-avatar");
    expectPublicClass(el, "cp-avatar--small");
  });

  it("does not emit data-cp by default", () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByTitle("Jane Doe").getAttribute("data-cp")).toBeNull();
  });
});
