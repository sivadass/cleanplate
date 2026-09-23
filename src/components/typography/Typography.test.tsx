import { readFileSync } from "node:fs";
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

describe("Typography type scale contract", () => {
  const scss = readFileSync(
    "src/components/typography/Typography.module.scss",
    "utf8",
  );

  it("does not hard-code the old heading ladder", () => {
    expect(scss).not.toMatch(/font-size:\s*60px/);
    expect(scss).not.toMatch(/font-size:\s*50px/);
    expect(scss).not.toMatch(/font-size:\s*40px/);
    expect(scss).not.toMatch(/font-size:\s*30px/);
    expect(scss).not.toMatch(/font-size:\s*18px/);
    expect(scss).not.toMatch(/line-height:\s*1;/);
  });

  it("maps variants to public font tokens", () => {
    expect(scss).toMatch(
      /\.cp-typography\s*\{[\s\S]*font-family:\s*var\(--cp-font-family\)/,
    );
    expect(scss).toMatch(
      /\.cp-typography\s*\{[\s\S]*font-size:\s*var\(--cp-font-size-md\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h1\s*\{[\s\S]*font-size:\s*var\(--cp-font-size-4xl\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h1\s*\{[\s\S]*line-height:\s*var\(--cp-font-leading-4xl\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h1\s*\{[\s\S]*font-weight:\s*var\(--cp-font-weight-bold\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h1\s*\{[\s\S]*letter-spacing:\s*var\(--cp-font-tracking-display\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h2\s*\{[\s\S]*font-size:\s*var\(--cp-font-size-2xl\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h3\s*\{[\s\S]*font-size:\s*var\(--cp-font-size-xl\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h4\s*\{[\s\S]*font-size:\s*var\(--cp-font-size-lg\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h4\s*\{[\s\S]*font-weight:\s*var\(--cp-font-weight-medium\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h5\s*\{[\s\S]*font-size:\s*var\(--cp-font-size-md\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--h6\s*\{[\s\S]*font-size:\s*var\(--cp-font-size-sm\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--small\s*\{[\s\S]*font-size:\s*var\(--cp-font-size-xs\)/,
    );
    expect(scss).toMatch(
      /&\.cp-typography--bold\s*\{[\s\S]*font-weight:\s*var\(--cp-font-weight-bold\)/,
    );
  });
});
