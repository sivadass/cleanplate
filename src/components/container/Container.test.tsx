import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Container from "./Container";
import { expectPublicClass } from "../../test/class-contract";

describe("Container public classes", () => {
  it("root uses cp-container and display-flex modifier", () => {
    render(
      <Container display="flex" data-testid="box">
        Content
      </Container>,
    );
    const el = screen.getByTestId("box");
    expectPublicClass(el, "cp-container");
    expectPublicClass(el, "cp-container--display-flex");
  });

  it("does not emit data-cp by default", () => {
    render(<Container data-testid="box">Content</Container>);
    expect(screen.getByTestId("box").getAttribute("data-cp")).toBeNull();
  });
});
