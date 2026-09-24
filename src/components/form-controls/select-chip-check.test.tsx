import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Select from "./Select";

const formScss = readFileSync(
  resolve("src/components/form-controls/FormControls.module.scss"),
  "utf8",
);

const options = [
  { label: "Leo", value: "leo" },
  { label: "Mira", value: "mira" },
];

describe("select chip and selected check", () => {
  it("does not paint the chip remove icon with the gray Icon color", () => {
    render(
      <Select
        label="Owner"
        mode="multi"
        options={options}
        value={[{ label: "Leo", value: "leo" }]}
        onChange={() => {}}
      />,
    );
    const remove = screen.getByRole("button", { name: "Remove Leo" });
    const icon = remove.querySelector(".cp-icon");
    expect(icon).not.toBeNull();
    expect(icon).not.toHaveClass("cp-icon--gray");
  });

  it("renders the selected check with the circle class", async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Owner"
        mode="multi"
        options={options}
        value={[{ label: "Leo", value: "leo" }]}
        onChange={() => {}}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    const check = document.querySelector(".cp-select-field-option-selected");
    expect(check).not.toBeNull();
    expect(check).toHaveClass("cp-icon");
    expect(check?.textContent).toBe("done");
  });

  it("centers a 16px check and colors the chip glyph from the chip rule", () => {
    expect(formScss).toContain(".cp-select-chip-remove .cp-icon.cp-icon");
    expect(formScss).toMatch(
      /\.cp-select-chip-remove[^{]*\{[^}]*\.cp-icon\.cp-icon\s*\{[^}]*color:\s*var\(--white\)/,
    );
    expect(formScss).toContain(
      ".cp-select-field-option-trailing .cp-select-field-option-selected.cp-icon",
    );
    expect(formScss).toMatch(
      /\.cp-select-field-option-selected\.cp-icon\s*\{[^}]*font-size:\s*16px/,
    );
    expect(formScss).toMatch(
      /\.cp-select-field-option-selected\.cp-icon\s*\{[^}]*display:\s*inline-flex/,
    );
  });
});
