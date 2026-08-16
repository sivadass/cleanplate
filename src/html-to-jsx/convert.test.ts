import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { convertHtmlToJsx } from "./convert";
import { loadManifest } from "./manifest";

const manifest = loadManifest();
const fixturesDir = join(import.meta.dirname, "fixtures");

describe("convertHtmlToJsx", () => {
  it("converts a tagged Button", () => {
    const { jsx } = convertHtmlToJsx(
      `<button data-cp="Button" data-cp-variant="outline" data-cp-margin="b-2" class="cp-button cp-button--outline">Save</button>`,
      manifest,
    );
    expect(jsx).toContain('<Button variant="outline" margin="b-2">Save</Button>');
    expect(jsx).not.toContain("cp-button");
  });

  it("passthrough untagged div", () => {
    const { jsx } = convertHtmlToJsx(
      `<div class="wrapper"><button data-cp="Button">Save</button></div>`,
      manifest,
    );
    expect(jsx).toContain('<div className="wrapper">');
    expect(jsx).toContain("<Button>Save</Button>");
  });

  it("hard-fails unknown component", () => {
    expect(() => convertHtmlToJsx(`<div data-cp="Tabs"></div>`, manifest)).toThrow(
      /docs\//,
    );
  });

  it("hard-fails illegal enum", () => {
    expect(() =>
      convertHtmlToJsx(
        `<button data-cp="Button" data-cp-variant="primary">X</button>`,
        manifest,
      ),
    ).toThrow(/variant/);
  });

  it("strips inline geometry", () => {
    const { jsx } = convertHtmlToJsx(
      `<div data-cp="Dropdown" data-cp-placement="bottom-start"><button data-cp-slot="trigger" data-cp="Button">A</button><div data-cp-slot="content" style="top: 8px; left: 0">x</div></div>`,
      manifest,
    );
    expect(jsx).not.toMatch(/top:/);
    expect(jsx).toContain('placement="bottom-start"');
  });

  it("hard-fails unknown data-cp-* props", () => {
    expect(() =>
      convertHtmlToJsx(
        `<button data-cp="Button" data-cp-href="/x">X</button>`,
        manifest,
      ),
    ).toThrow(/Unknown prop "href".*docs\//);
  });

  it("hard-fails function props", () => {
    expect(() =>
      convertHtmlToJsx(
        `<button data-cp="Button" data-cp-on-click="handler">X</button>`,
        manifest,
      ),
    ).toThrow(/onClick|on-click|docs\//);
  });

  it("hard-fails Table without recipe", () => {
    expect(() =>
      convertHtmlToJsx(`<div data-cp="Table" class="cp-table"></div>`, manifest),
    ).toThrow(/recipe|docs\/Table/);
  });

  it("converts Table desktop recipe with columns and data", () => {
    const { jsx } = convertHtmlToJsx(
      `<div data-cp="Table" data-cp-recipe="desktop" class="cp-table"><table><thead><tr><th data-cp-col="name">Name</th></tr></thead><tbody><tr><td data-cp-field="name">Ada</td></tr></tbody></table></div>`,
      manifest,
    );
    expect(jsx).toContain('recipe="desktop"');
    expect(jsx).toContain("columns={");
    expect(jsx).toContain('title: "Name"');
    expect(jsx).toContain('name: "Ada"');
  });

  it("hard-fails AppShell without recipe", () => {
    expect(() =>
      convertHtmlToJsx(`<div data-cp="AppShell"></div>`, manifest),
    ).toThrow(/recipe|docs\/AppShell/);
  });

  it("toast fixture is a single card", () => {
    const html = readFileSync(
      join(fixturesDir, "toast.single.html"),
      "utf8",
    );
    expect(html.split('data-cp="Toast"').length - 1).toBe(1);
  });

  it("modal fixture is not nested in overflow hidden", () => {
    const html = readFileSync(join(fixturesDir, "modal.open.html"), "utf8");
    expect(html).toMatch(/cp-modal-overlay/);
    expect(html).not.toMatch(/overflow:\s*hidden/);
  });

  it("dropdown strips geometry and maps placement + slots", () => {
    const html = readFileSync(join(fixturesDir, "dropdown.open.html"), "utf8");
    const { jsx } = convertHtmlToJsx(html, manifest);
    expect(jsx).not.toMatch(/top:/);
    expect(jsx).not.toMatch(/left:/);
    expect(jsx).toContain('placement="bottom-start"');
    expect(jsx).toContain("trigger={");
    expect(jsx).toContain("content={");
  });
});

describe("html-to-jsx fixtures", () => {
  const htmlFixtures = readdirSync(fixturesDir).filter((file) =>
    file.endsWith(".html"),
  );

  for (const file of htmlFixtures) {
    it(`fixture ${file}`, () => {
      const html = readFileSync(join(fixturesDir, file), "utf8");
      const expected = readFileSync(
        join(fixturesDir, file.replace(/\.html$/, ".jsx")),
        "utf8",
      ).trim();
      expect(convertHtmlToJsx(html, loadManifest()).jsx.trim()).toBe(expected);
    });
  }
});
