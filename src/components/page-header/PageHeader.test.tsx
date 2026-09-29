import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PageHeader from "./PageHeader";
import { expectPublicClass } from "../../test/class-contract";

function buttonsNamed(name: string) {
  return screen.getAllByRole("button", { name });
}

describe("PageHeader primary CTA", () => {
  it("renders a labeled button and an icon button when an icon is set", () => {
    render(
      <PageHeader
        title="Projects"
        primaryCta={{ label: "New project", icon: "add" }}
      />,
    );

    const [wide, narrow] = buttonsNamed("New project");
    expect(wide.className).not.toContain("cp-button--icon");
    expect(wide).not.toHaveAttribute("aria-label");
    expect(wide).toHaveTextContent("New project");
    expectPublicClass(narrow, "cp-button--icon");
    expect(narrow).toHaveAttribute("aria-label", "New project");
  });

  it("keeps a labeled button at both breakpoints when no icon resolves", () => {
    render(
      <PageHeader title="Documents" primaryCta={{ label: "Upload" }} />,
    );

    const buttons = buttonsNamed("Upload");
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button.className).not.toContain("cp-button--icon");
      expect(button).not.toHaveAttribute("aria-label");
    }
  });

  it("keeps the text label on small screens when mobile.variant is solid", () => {
    render(
      <PageHeader
        title="Projects"
        primaryCta={{
          label: "New project",
          icon: "add",
          mobile: { variant: "solid" },
        }}
      />,
    );

    const [wide, narrow] = buttonsNamed("New project");
    expect(wide.className).not.toContain("cp-button--icon");
    expect(narrow.className).not.toContain("cp-button--icon");
    expect(narrow).toHaveTextContent("New project");
    expect(narrow).not.toHaveAttribute("aria-label");
  });

  it("uses an icon button only on small screens when the icon is set on mobile", () => {
    render(
      <PageHeader
        title="Projects"
        primaryCta={{
          label: "New project",
          mobile: { icon: "add" },
        }}
      />,
    );

    const [wide, narrow] = buttonsNamed("New project");
    expect(wide.className).not.toContain("cp-button--icon");
    expect(wide).toHaveTextContent("New project");
    expectPublicClass(narrow, "cp-button--icon");
    expect(narrow).toHaveAttribute("aria-label", "New project");
  });

  it("falls back to a labeled solid button when variant is icon and no icon is set", () => {
    render(
      <PageHeader
        title="Projects"
        primaryCta={{ label: "Save", variant: "icon" }}
      />,
    );

    const buttons = buttonsNamed("Save");
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button.className).not.toContain("cp-button--icon");
      expect(button).toHaveTextContent("Save");
    }
  });

  it("calls the shared onClick from the wide button", () => {
    const onClick = vi.fn();
    render(
      <PageHeader
        title="Projects"
        primaryCta={{ label: "New project", icon: "add", onClick }}
      />,
    );

    buttonsNamed("New project")[0].click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a React element once", () => {
    render(
      <PageHeader
        title="Projects"
        primaryCta={<button type="button">Custom</button>}
      />,
    );

    expect(buttonsNamed("Custom")).toHaveLength(1);
  });
});

describe("PageHeader margin", () => {
  it("defaults to b-4", () => {
    const { container } = render(<PageHeader title="Projects" />);
    expectPublicClass(container.querySelector("header")!, "cp-m-b-4");
  });

  it("omits the default bottom margin when margin is 0", () => {
    const { container } = render(<PageHeader title="Projects" margin="0" />);
    const header = container.querySelector("header")!;
    expect(header.className.split(/\s+/)).not.toContain("cp-m-b-4");
    expectPublicClass(header, "cp-m-0");
  });
});
