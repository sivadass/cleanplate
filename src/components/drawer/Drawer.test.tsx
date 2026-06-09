import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Drawer from "./Drawer";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("Drawer", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls onClose from the close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Drawer isOpen onClose={onClose} title="Settings">
        Body
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: /close drawer/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape only when closeOnEscape is enabled", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = render(
      <Drawer isOpen onClose={onClose} title="Escape Enabled">
        Body
      </Drawer>,
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Drawer
        isOpen
        onClose={onClose}
        closeOnEscape={false}
        title="Escape Disabled"
      >
        Body
      </Drawer>,
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on outside click only when closeOnOverlayClick is enabled", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = render(
      <Drawer isOpen onClose={onClose} title="Overlay Enabled">
        Body
      </Drawer>,
    );

    await user.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Drawer
        isOpen
        onClose={onClose}
        closeOnOverlayClick={false}
        title="Overlay Disabled"
      >
        Body
      </Drawer>,
    );

    await user.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps the drawer mounted briefly to allow close transition", async () => {
    const { rerender } = render(
      <Drawer isOpen title="Transition">
        Body
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(
      <Drawer isOpen={false} title="Transition">
        Body
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  });

  it("exposes suffixed data-testid hooks when dataTestId is set", () => {
    render(
      <Drawer
        isOpen
        title="Settings"
        dataTestId="settings-drawer"
        primaryButtonLabel="Save"
        secondaryButtonLabel="Cancel"
        tertiaryButtonLabel="Help"
      >
        Body content
      </Drawer>,
    );

    expect(screen.getByTestId("settings-drawer")).toBeInTheDocument();
    expect(screen.getByTestId("settings-drawer-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("settings-drawer-header")).toBeInTheDocument();
    expect(screen.getByTestId("settings-drawer-title")).toHaveTextContent(
      "Settings",
    );
    expect(screen.getByTestId("settings-drawer-close")).toBeInTheDocument();
    expect(screen.getByTestId("settings-drawer-body")).toHaveTextContent(
      "Body content",
    );
    expect(screen.getByTestId("settings-drawer-footer")).toBeInTheDocument();
    expect(screen.getByTestId("settings-drawer-primary")).toHaveTextContent(
      "Save",
    );
    expect(screen.getByTestId("settings-drawer-secondary")).toHaveTextContent(
      "Cancel",
    );
    expect(screen.getByTestId("settings-drawer-tertiary")).toHaveTextContent(
      "Help",
    );
  });

  it("renders tertiary-only footer with ghost button", () => {
    render(
      <Drawer
        isOpen
        title="Info"
        tertiaryButtonLabel="Learn more"
        dataTestId="info-drawer"
      >
        Body
      </Drawer>,
    );

    expect(screen.getByTestId("info-drawer-footer")).toBeInTheDocument();
    expect(screen.getByTestId("info-drawer-tertiary")).toHaveTextContent(
      "Learn more",
    );
    expect(screen.queryByTestId("info-drawer-primary")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("info-drawer-secondary"),
    ).not.toBeInTheDocument();
  });

  it("applies mobile bottom sheet class below 768px", () => {
    mockMatchMedia(true);

    render(
      <Drawer isOpen placement="right" title="Mobile">
        Body
      </Drawer>,
    );

    const panel = screen.getByRole("dialog");
    expect(panel.className).toMatch(/cp-drawer-mobile-sheet/);
    expect(panel.className).toMatch(/placement-bottom/);
  });

  it("uses ariaLabel when no title is provided", () => {
    render(
      <Drawer isOpen ariaLabel="Filter options" showCloseButton={false}>
        Body
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toHaveAttribute(
      "aria-label",
      "Filter options",
    );
  });

  it("warns when open without title or ariaLabel", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <Drawer isOpen showCloseButton={false}>
        Body
      </Drawer>,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      "CleanPlate Drawer: provide `title` or `ariaLabel` so the dialog has an accessible name.",
    );

    warnSpy.mockRestore();
  });

  it("merges footerClassName on the footer row", () => {
    render(
      <Drawer
        isOpen
        title="Settings"
        primaryButtonLabel="Save"
        footerClassName="custom-footer"
        dataTestId="settings-drawer"
      >
        Body
      </Drawer>,
    );

    expect(screen.getByTestId("settings-drawer-footer")).toHaveClass(
      "custom-footer",
    );
  });
});
