import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProgressBar from "./ProgressBar";
import { expectPublicClass } from "../../test/class-contract";

describe("ProgressBar", () => {
  it("defaults to medium size without Container padding that inflates height", () => {
    const { container } = render(<ProgressBar value={45} />);
    const root = container.querySelector(".cp-progress-bar")!;
    const track = container.querySelector(".cp-progress-bar-track")!;
    const fill = container.querySelector(".cp-progress-bar-fill")!;

    expectPublicClass(root, "cp-progress-bar");
    expectPublicClass(root, "cp-progress-bar--medium");

    for (const el of [root, track, fill]) {
      expect(el.className.split(/\s+/)).not.toContain("cp-p-4");
      expectPublicClass(el, "cp-p-0");
    }
  });

  it("beats Container padding in public CSS when cp-p-4 is present", () => {
    const scss = readFileSync(
      "src/components/progress-bar/ProgressBar.module.scss",
      "utf8",
    );
    expect(scss).toMatch(/\.cp-progress-bar[\s\S]*?&.cp-container[\s\S]*?padding:\s*0/);
  });

  it("does not emit data-cp by default", () => {
    const { container } = render(<ProgressBar value={45} />);
    expect(container.firstElementChild!.getAttribute("data-cp")).toBeNull();
  });
});
