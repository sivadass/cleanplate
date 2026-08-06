import React, { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ColorPicker from "./ColorPicker";

describe("ColorPicker", () => {
  it("opens the dialog and updates value from HEX input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker
        label="Brand color"
        value="#1264A3"
        onChange={onChange}
        dataTestId="brand-color"
      />,
    );

    await user.click(screen.getByTestId("brand-color-trigger"));
    await waitFor(() => {
      expect(screen.getByTestId("brand-color-panel")).toBeInTheDocument();
    });

    const hexInput = screen.getByTestId("brand-color-hex-input");
    await user.clear(hexInput);
    await user.type(hexInput, "#E89623");

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith("#E89623");
    });
  });

  it("supports clear action and hidden form input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ColorPicker
        label="Accent"
        value="#2E8B57"
        name="accent"
        onChange={onChange}
        dataTestId="accent-color"
      />,
    );

    const hidden = screen.getByTestId("accent-color-input");
    expect(hidden).toHaveAttribute("value", "#2E8B57");

    await user.click(screen.getByTestId("accent-color-clear"));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("works in controlled mode", async () => {
    const user = userEvent.setup();

    function ControlledPicker() {
      const [color, setColor] = useState<string | null>("#1264A3");
      return (
        <ColorPicker
          label="Controlled"
          value={color}
          onChange={setColor}
          dataTestId="controlled-color"
        />
      );
    }

    render(<ControlledPicker />);
    expect(screen.getByText("#1264A3")).toBeInTheDocument();

    await user.click(screen.getByTestId("controlled-color-trigger"));
    const hexInput = await screen.findByTestId("controlled-color-hex-input");
    await user.clear(hexInput);
    await user.type(hexInput, "#0D9488");

    await waitFor(() => {
      expect(screen.getByText("#0D9488")).toBeInTheDocument();
    });
  });
});
