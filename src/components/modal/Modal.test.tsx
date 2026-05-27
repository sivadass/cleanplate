import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Modal from "./Modal";

describe("Modal", () => {
  it("calls onClose from the close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose} title="Settings">
        Body
      </Modal>
    );

    await user.click(screen.getByRole("button", { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape only when closeOnEscape is enabled", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = render(
      <Modal isOpen onClose={onClose} title="Escape Enabled">
        Body
      </Modal>
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Modal isOpen onClose={onClose} closeOnEscape={false} title="Escape Disabled">
        Body
      </Modal>
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on outside click only when closeOnOverlayClick is enabled", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = render(
      <Modal isOpen onClose={onClose} title="Overlay Enabled">
        Body
      </Modal>
    );

    await user.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Modal
        isOpen
        onClose={onClose}
        closeOnOverlayClick={false}
        title="Overlay Disabled"
      >
        Body
      </Modal>
    );

    await user.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps the modal mounted briefly to allow close transition", async () => {
    const { rerender } = render(
      <Modal isOpen title="Transition">
        Body
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(
      <Modal isOpen={false} title="Transition">
        Body
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
  });

  it("exposes suffixed data-testid hooks when dataTestId is set", () => {
    render(
      <Modal
        isOpen
        title="Settings"
        dataTestId="settings-modal"
        primaryButtonLabel="Save"
        secondaryButtonLabel="Cancel"
      >
        Body content
      </Modal>,
    );

    expect(screen.getByTestId("settings-modal")).toBeInTheDocument();
    expect(screen.getByTestId("settings-modal-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("settings-modal-header")).toBeInTheDocument();
    expect(screen.getByTestId("settings-modal-title")).toHaveTextContent(
      "Settings",
    );
    expect(screen.getByTestId("settings-modal-close")).toBeInTheDocument();
    expect(screen.getByTestId("settings-modal-body")).toHaveTextContent(
      "Body content",
    );
    expect(screen.getByTestId("settings-modal-footer")).toBeInTheDocument();
    expect(screen.getByTestId("settings-modal-primary")).toHaveTextContent(
      "Save",
    );
    expect(screen.getByTestId("settings-modal-secondary")).toHaveTextContent(
      "Cancel",
    );
  });
});
