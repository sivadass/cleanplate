import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Icon from "./Icon";
import { expectPublicClass } from "../../test/class-contract";

describe("Icon public classes", () => {
  it("root uses cp-icon and medium size", () => {
    const { container } = render(<Icon name="home" size="medium" color="blue" />);
    const el = container.firstElementChild!;
    expectPublicClass(el, "cp-icon");
    expectPublicClass(el, "cp-icon--medium");
    expectPublicClass(el, "cp-icon--blue");
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(<Icon name="home" />);
    expect(container.firstElementChild!.getAttribute("data-cp")).toBeNull();
  });
});
