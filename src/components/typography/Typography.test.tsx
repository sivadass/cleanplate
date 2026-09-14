import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Typography from "./Typography";
import { expectPublicClass } from "../../test/class-contract";

describe("Typography public classes", () => {
  it("root uses cp-typography and h1 variant", () => {
    render(<Typography variant="h1">Title</Typography>);
    const el = screen.getByText("Title");
    expectPublicClass(el, "cp-typography");
    expectPublicClass(el, "cp-typography--h1");
  });

  it("does not emit data-cp by default", () => {
    render(<Typography>Body</Typography>);
    expect(screen.getByText("Body").getAttribute("data-cp")).toBeNull();
  });
});
