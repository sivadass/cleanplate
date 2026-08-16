# Agent HTML → React Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a regression-gated major (`1.0.0`) so design agents can author canonical-frame HTML (`data-cp-*` + public `cp-*` CSS) and a mechanical CLI converts it to CleanPlate React without guessing.

**Architecture:** Build the **test harness first** (public CSS contract, spacing API, docs contract, existing RTL). Rename every SCSS local to unique `cp-*` **while hashing still on**. Unhash in one gated commit. Then opt-in `data-cp` emission, `html-to-jsx` CLI, HTML recipes in existing `docs/*.md`, skills, and a Paper kit. Overlays follow Approach B tiers from the HLD.

**Tech Stack:** React 18, Vitest + Testing Library + jsdom, Rollup + Vite CSS Modules, Sass, cheerio (CLI), existing Storybook 7.

**Spec:** [docs/superpowers/specs/2026-08-14-agent-html-react-bridge-hld.md](../specs/2026-08-14-agent-html-react-bridge-hld.md)

## Global Constraints

- React component API is the single source of truth; HTML is a lossless encoding of that API.
- Converter never infers from class names; `class="cp-*"` on tagged nodes is visual only.
- Untagged markup passthrough as plain JSX (`class` → `className`).
- Hard-fail only for tagged nodes: unknown `data-cp` name or illegal enum/value.
- `data-cp-*` is not a production API; published `dist/` does not emit these attributes; Storybook/opt-in provider only.
- Inline geometry (`top` / `left` / `transform` / `width` / `maxHeight`) is decorative; converter strips it.
- No callbacks or functions in the HTML contract; hand-wire after conversion.
- Toast HTML recipe is a single card, not a stack.
- Table / AppShell require `data-cp-recipe`; two artboards, not one responsive HTML file.
- Do not ship dual hashed + public class systems.
- De-hashing is a **semver major** (`0.3.36` → `1.0.0`) with a migration note.
- Rename to unique `cp-*` **before** unhashing.
- Spacing props are suffix-only (`"0"`, `"b-2"`); never `"m-0"` / `"p-4"` / `"g-2"`.
- HTML recipes live in the same `docs/<Component>.md` (no second doc set).
- Manifest/schema versioning is deferred (v1).
- Out of scope: web components; LLM-only conversion; mapping focus trap / scroll lock / drag / Floating UI middleware into HTML.

## Stop gates (do not skip)

After **every** task:

```bash
npm test
npm run type-check
```

After any CSS or Rollup change, also:

```bash
npm run build-package
```

A wave is **not done** until:

1. `npm test` green (old behavioral tests + new contract tests).
2. `npm run type-check` green.
3. `npm run build-package` green.
4. New/updated contract tests for that wave green.
5. No new `margin = "m-0"` (or `"p-` / `"g-` prefixed defaults) in `src/`.

Do **not** unhash until Task 12’s uniqueness test passes.

Do **not** bump to `1.0.0` until Task 20’s release checklist passes.

## File structure

| Path | Responsibility |
| --- | --- |
| `src/test/css-modules-name.ts` | Shared `generateScopedName` used by Rollup, Vite, Storybook |
| `src/test/public-css-contract.test.ts` | Dist CSS: no hashes; every selector `cp-` or token/`@`/`:` |
| `src/test/spacing-api.test.ts` | `getSpacingClass` suffix-only + `cp-m-*` lookup |
| `src/test/docs-contract.test.ts` | Every export has docs; no prefixed spacing in docs; HTML Prototype section when recipes land |
| `src/test/class-contract.ts` | `expectPublicClass(el, "cp-button")` helper |
| `src/prototype/CleanPlatePrototypeAttributes.tsx` | Opt-in context for `data-cp` emission |
| `src/prototype/emit-data-cp.ts` | Builds `data-cp` + `data-cp-*` for non-default non-function props |
| `src/html-to-jsx/convert.ts` | Mechanical HTML → JSX |
| `src/html-to-jsx/cli.ts` | `npx cleanplate html-to-jsx` |
| `src/html-to-jsx/manifest.ts` | Loads generated manifest |
| `scripts/generate-component-manifest.mjs` | Emits `src/html-to-jsx/component-manifest.json` |
| `src/html-to-jsx/fixtures/**` | HTML in / JSX out fixtures per component |
| `src/styles/tokens.css` | `:root` variables only (copied from `reset.scss`) |
| `docs/MIGRATION-v1.md` | Hashed-class → `cp-*` consumer guide |
| `skills/cleanplate-html-prototype/SKILL.md` | Design/coding agent: write recipes |
| `skills/cleanplate-html-to-react/SKILL.md` | Coding agent: run CLI, do not invent |
| `docs/html/kit.html` | Paper/Claude Design sticker sheet (Tier 1 first) |

---

### Task 1: CSS Modules name helper + failing public-CSS contract

**Files:**
- Create: `src/test/css-modules-name.ts`
- Create: `src/test/public-css-contract.test.ts`
- Modify: `vite.config.mts` (css.modules.generateScopedName — **keep hashing** until Task 12)
- Test: `src/test/public-css-contract.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `cssModulesScopedName(name: string, filename: string): string` — Task 12 will switch it from hashed to `[local]`

- [ ] **Step 1: Write the helper (still hashed, so today’s build keeps working)**

```ts
// src/test/css-modules-name.ts
const HASH_LEN = 5;

/** Stable for a given (local, file). Used by Vite + Rollup until unhash. */
export function cssModulesScopedName(local: string, filename: string): string {
  if (process.env.CP_PUBLIC_CSS === "1") {
    return local;
  }
  let hash = 0;
  const key = `${filename}:${local}`;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  const token = hash.toString(36).slice(0, HASH_LEN).padEnd(HASH_LEN, "0");
  return `${local}-${token}`;
}

export const HASHED_CLASS_RE = /(^|[,{\s])\.((?:[a-z][\w-]*))-[a-z0-9]{5}(?=[^\w-]|$)/i;
```

Note: do **not** wire `CP_PUBLIC_CSS=1` yet. Helper exists so Task 12 is a one-flag flip. Until then, leave Rollup on `"[local]-[hash:base64:5]"` so dist hashes stay as today (the contract test will fail on purpose after we add it against current dist).

- [ ] **Step 2: Write the failing dist contract test**

```ts
// src/test/public-css-contract.test.ts
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HASHED_CLASS_RE } from "./css-modules-name";

const DIST_CSS = "dist/index.css";

describe("public CSS contract (post-unhash)", () => {
  it.skipIf(!existsSync(DIST_CSS))("dist/index.css contains no CSS-module hashes", () => {
    const css = readFileSync(DIST_CSS, "utf8");
    expect(css).not.toMatch(HASHED_CLASS_RE);
  });

  it.skipIf(!existsSync(DIST_CSS))("component class selectors are cp- prefixed", () => {
    const css = readFileSync(DIST_CSS, "utf8");
    const selectors = [...css.matchAll(/\.([a-z][\w-]*)/gi)].map((m) => m[1]);
    const forbidden = selectors.filter(
      (s) =>
        !s.startsWith("cp-") &&
        !s.startsWith("toast-portal") &&
        s !== "open" &&
        s !== "active",
    );
    // After full rename this list must be empty. Until Task 12, this test is allowed
    // to fail — keep it skipped until Task 12 by using it.skip here, then enable.
    expect(forbidden, `non-cp selectors: ${forbidden.slice(0, 20).join(", ")}`).toEqual([]);
  });
});
```

**Gate adjustment:** keep both tests as `it.skip` with comment `enable in Task 12` so CI stays green. Task 12 unskips them.

- [ ] **Step 3: Run tests**

Run: `npm test -- src/test/public-css-contract.test.ts`
Expected: PASS (skipped)

- [ ] **Step 4: Commit**

```bash
git add src/test/css-modules-name.ts src/test/public-css-contract.test.ts
git commit -m "$(cat <<'EOF'
test: add skipped public CSS contract for unhash gate

EOF
)"
```

---

### Task 2: Spacing API unit tests (failing on prefixed defaults)

**Files:**
- Create: `src/test/spacing-api.test.ts`
- Modify: `src/utils/common.js` (Task 3 implements)
- Test: `src/test/spacing-api.test.ts`

**Interfaces:**
- Consumes: `getSpacingClass(config, styleObject, prefix)`
- Produces: suffix-only lookups; `"b-2"` + prefix `"cp-m"` → `styleObject["cp-m-b-2"]`

- [ ] **Step 1: Write failing tests against current `m-b-2` keys and prefixed `"m-0"` default**

```ts
import { describe, expect, it } from "vitest";
import { getSpacingClass } from "../utils/common";

const styles = {
  "m-b-2": "m-b-2-hash",
  "m-0": "m-0-hash",
  "m-m-0": undefined,
  "cp-m-b-2": "cp-m-b-2-hash",
  "cp-m-0": "cp-m-0-hash",
};

describe("getSpacingClass", () => {
  it("maps suffix b-2 with prefix m to m-b-2 (legacy keys, pre-rename)", () => {
    expect(getSpacingClass("b-2", styles, "m")).toBe("m-b-2-hash");
  });

  it("does not treat m-0 as a suffix (would look up m-m-0)", () => {
    expect(getSpacingClass("m-0", styles, "m")).not.toBeUndefined();
  });

  it("returns empty string for unknown suffix rather than the string 'm-0'", () => {
    expect(getSpacingClass("nope", styles, "m")).not.toBe("m-0");
  });
});
```

The second test documents the bug: `"m-0"` + prefix `"m"` → `"m-m-0"`. Task 3 will **reject** prefixed values (throw in test/dev, return `""` otherwise) so `"m-0"` is never a valid suffix.

- [ ] **Step 2: Run test to verify current behavior**

Run: `npm test -- src/test/spacing-api.test.ts`
Expected: first test PASS; second/third may FAIL (this is the bug inventory).

- [ ] **Step 3: Commit the failing/characterizing tests**

```bash
git add src/test/spacing-api.test.ts
git commit -m "$(cat <<'EOF'
test: characterize spacing suffix API vs prefixed m-0 bug

EOF
)"
```

---

### Task 3: Fix spacing defaults and `getSpacingClass`

**Files:**
- Modify: `src/utils/common.js`
- Modify every `margin = "m-0"` listed below
- Modify: `src/test/spacing-api.test.ts` (assert new behavior)
- Test: `src/test/spacing-api.test.ts` + full `npm test`

**Prefixed defaults to change to `"0"`:**
- `src/components/button/Button.tsx`
- `src/components/typography/Typography.tsx`
- `src/components/container/Container.tsx`
- `src/components/modal/Modal.tsx`
- `src/components/progress-bar/ProgressBar.jsx`

Leave already-correct `"0"` / `DEFAULT_FORM_FIELD_MARGIN` alone.

**Interfaces:**
- Produces: `getSpacingClass("0", styles, "m")` → `styles["m-0"]` (until Task 8 renames keys to `cp-m-0`)

- [ ] **Step 1: Implement `getSpacingClass` guard**

```js
const PREFIXED = /^(m|p|g)-/;

export const getSpacingClass = (marginConfig, styleObject, prefix) => {
  const one = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    if (PREFIXED.test(value)) {
      if (process.env.NODE_ENV !== "production") {
        throw new Error(
          `Spacing value "${value}" includes the ${prefix}- prefix. Use suffix-only (e.g. "0", "b-2").`,
        );
      }
      return "";
    }
    const key = `${prefix}-${value}`;
    return styleObject[key] ?? "";
  };
  if (typeof marginConfig === "string") return one(marginConfig);
  if (Array.isArray(marginConfig)) return marginConfig.map(one).filter(Boolean).join(" ");
  return "";
};
```

- [ ] **Step 2: Change defaults `margin = "m-0"` → `margin = "0"` in the five files above.**

- [ ] **Step 3: Update tests**

```ts
it("maps suffix 0 with prefix m to m-0", () => {
  expect(getSpacingClass("0", styles, "m")).toBe("m-0-hash");
});

it("throws in tests when value is already prefixed", () => {
  expect(() => getSpacingClass("m-0", styles, "m")).toThrow(/suffix-only/);
});
```

- [ ] **Step 4: Run**

Run: `npm test && npm run type-check`
Expected: PASS. If a component test still passes `margin="m-0"`, fix the caller.

- [ ] **Step 5: Commit**

```bash
git add src/utils/common.js src/components/button/Button.tsx src/components/typography/Typography.tsx src/components/container/Container.tsx src/components/modal/Modal.tsx src/components/progress-bar/ProgressBar.jsx src/test/spacing-api.test.ts
git commit -m "$(cat <<'EOF'
fix: suffix-only spacing defaults; reject prefixed m-/p-/g- values

EOF
)"
```

---

### Task 4: Docs hygiene + ProgressBar.md + root type re-exports

**Files:**
- Create: `docs/ProgressBar.md` (props from `src/components/progress-bar/ProgressBar.jsx`)
- Modify: `llms.txt` (add ProgressBar entry; keep suffix-only rule)
- Modify: `docs/Button.md`, `docs/Modal.md`, and any doc still showing `margin="m-0"` / `["m-1"]`
- Modify: `src/index.js` — add type re-exports **or** create `src/index.ts` if the build already type-checks `.ts`; otherwise add `export type` in a new `src/index.d.ts` companion. Prefer adding to each barrel and a root:

```ts
// append to src/index.js is invalid for types — add src/types-public.ts imported from a new export in dist via index.ts migration if needed.

// Practical path: create src/public-types.ts that re-exports all component types,
// and in package.json "types" keep dist/index.d.ts. Update build-types entry to emit:

export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./components/button";
// …one export type block covering every component index.ts
```

If `src/index.js` cannot hold `export type`, add `src/index.ts` that re-exports values + types and point Rollup `input` at it in a later commit. **Minimum for this task:** `dist/index.d.ts` after `build-types` must contain `export type { ButtonProps }`.

- Create: `src/test/docs-contract.test.ts`

```ts
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const EXPORTS = [
  "AppShell", "Typography", "Modal", "ConfirmDialog", "Button", "Badge", "Icon",
  "Container", "MediaObject", "Alert", "Avatar", "Stepper", "Toast", "Animated",
  "BreadCrumb", "Header", "PageHeader", "Footer", "FeedbackState", "MenuList",
  "Spinner", "Statistic", "ProgressBar", "Accordion", "BottomSheet", "Drawer",
  "Table", "Pagination", "Pills", "Dropdown",
];
// FormControls is docs/FormControls.md (one file)

describe("docs contract", () => {
  it("has a markdown file per top-level component", () => {
    const missing = EXPORTS.filter((name) => !existsSync(`docs/${name}.md`));
    expect(missing).toEqual([]);
    expect(existsSync("docs/FormControls.md")).toBe(true);
  });

  it("does not teach prefixed spacing in docs or llms.txt", () => {
    const files = ["llms.txt", "AGENTS.md", ...readdirSync("docs").filter((f) => f.endsWith(".md")).map((f) => `docs/${f}`)];
    const hits: string[] = [];
    for (const f of files) {
      if (f.startsWith("docs/superpowers") || f === "docs/MIGRATION-v1.md") continue;
      const text = readFileSync(f, "utf8");
      if (/margin=\{?"m-/.test(text) || /padding=\{?"p-/.test(text) || /gap=\{?"g-/.test(text)) {
        hits.push(f);
      }
    }
    expect(hits, `prefixed spacing in ${hits.join(", ")}`).toEqual([]);
  });
});
```

- [ ] **Step 1: Write `docs-contract.test.ts`, run, expect FAIL** (ProgressBar.md missing; Button.md still has `m-0`).

Run: `npm test -- src/test/docs-contract.test.ts`
Expected: FAIL

- [ ] **Step 2: Add `docs/ProgressBar.md`** mirroring Button.md structure (Purpose, Props table with suffix-only `margin`, Types, examples). Read `ProgressBar.jsx` for the real prop list; do not invent props.

- [ ] **Step 3: Replace prefixed spacing examples in all `docs/*.md` + `llms.txt`.** Search: `margin="m-`, `["m-`, `padding="p-`.

- [ ] **Step 4: Re-export types from the package entry** so `import type { ButtonProps } from "cleanplate"` works. Run `npm run build-types` and grep `dist/index.d.ts` for `ButtonProps`.

- [ ] **Step 5: Run `npm test && npm run type-check`** — PASS

- [ ] **Step 6: Commit**

```bash
git add docs llms.txt src/test/docs-contract.test.ts src/index.js src/index.ts dist/index.d.ts
git commit -m "$(cat <<'EOF'
docs: suffix-only spacing, ProgressBar.md, root type re-exports

EOF
)"
```

---

### Task 5: Rename spacing utility locals to `cp-m-*` / `cp-p-*` / `cp-g-*`

**Files:**
- Modify: `src/styles/utils.module.scss` (`.m-b-2` → `.cp-m-b-2` via nesting `.cp-m { &-b-2 { } }` or flat `.cp-m-b-2`)
- Modify: `src/utils/common.js` callers: `getSpacingClass(margin, utilStyles, "cp-m")` etc.
- Grep: `getSpacingClass(` in `src/` and update third arg `"m"` → `"cp-m"`, `"p"` → `"cp-p"`, `"g"` → `"cp-g"`
- Modify: `src/test/spacing-api.test.ts` keys to `cp-m-b-2`

**Guardrail:** after this, `styles["m-b-2"]` is undefined. Any missed caller silently drops spacing — catch with:

```ts
it("looks up cp-m-b-2", () => {
  expect(getSpacingClass("b-2", { "cp-m-b-2": "x" }, "cp-m")).toBe("x");
});
```

And a grep gate in the same test file:

```ts
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

it("no getSpacingClass still uses prefix m/p/g without cp-", () => {
  const out = execSync(
    `rg -n "getSpacingClass\\([^,]+,[^,]+,\\s*\\"(m|p|g)\\"" src || true`,
    { encoding: "utf8" },
  );
  expect(out.trim()).toBe("");
});
```

- [ ] **Step 1: Rename SCSS locals; update prefixes; update tests.**
- [ ] **Step 2: `npm test && npm run type-check`**
- [ ] **Step 3: Commit** `refactor: prefix spacing utility classes with cp-m/cp-p/cp-g`

---

## Component CSS migration protocol (Tasks 6–11)

Execute this protocol per component. Do **not** unhash. Do **not** change visual CSS values.

1. Rename every SCSS/CSS module local to unique `cp-<component>` / `cp-<component>--<modifier>` / `cp-<component>__<slot>` (BEM). No bare `.button`, `.medium`, `.overlay`, `.modal`.
2. Update `styles["old"]` lookups in TSX to `styles["cp-button"]` etc.
3. Add or extend `src/components/<name>/<Name>.test.tsx` using `expectPublicClass` (Task 6 helper) so the root has `cp-<name>` in `className` (hashed suffix allowed until Task 12).
4. Keep all existing behavioral tests passing (Modal dismiss, Drawer, Date, Statistic, …).
5. `npm test && npm run type-check`
6. Commit per family (not one giant commit).

`expectPublicClass` (create in Task 6):

```ts
// src/test/class-contract.ts
export function expectPublicClass(el: Element, publicName: string) {
  const ok = [...el.classList].some(
    (c) => c === publicName || c.startsWith(`${publicName}-`),
  );
  if (!ok) {
    throw new Error(`expected class ${publicName} (or hashed), got ${el.className}`);
  }
}
```

After Task 12, tighten to `expect(el).toHaveClass(publicName)`.

---

### Task 6: Button golden migration + class helper

**Files:**
- Create: `src/test/class-contract.ts`
- Create: `src/components/button/Button.test.tsx`
- Modify: `src/components/button/Button.module.scss`
- Modify: `src/components/button/Button.tsx`

**Rename map:**

| Old local | New local |
| --- | --- |
| `button` | `cp-button` |
| `small` / `medium` | `cp-button--small` / `cp-button--medium` |
| `outline` / `ghost` / `icon` | `cp-button--outline` / `--ghost` / `--icon` |
| `fluid` / `disabled` / `loading` | `cp-button--fluid` / `--disabled` / `--loading` |
| `cp-button-loader` | keep |

Solid variant stays the base `.cp-button` (no `--solid` class), matching today’s “solid is default, no `.solid` rule”.

- [ ] **Step 1: Write failing Button class test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";
import { expectPublicClass } from "../../test/class-contract";

describe("Button public classes", () => {
  it("root uses cp-button and outline modifier", () => {
    render(<Button variant="outline">Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expectPublicClass(el, "cp-button");
    expectPublicClass(el, "cp-button--outline");
  });

  it("does not emit data-cp by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button").getAttribute("data-cp")).toBeNull();
  });

  it("ignores click when isDisabled", async () => {
    const onClick = vi.fn();
    render(
      <Button isDisabled onClick={onClick}>
        Save
      </Button>,
    );
    screen.getByRole("button").click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run** `npm test -- src/components/button/Button.test.tsx` — FAIL on `cp-button`
- [ ] **Step 3: Rename SCSS + TSX class maps** (`styles["cp-button"]`, `styles[\`cp-button--${size}\`]`, skip `--solid`)
- [ ] **Step 4: Run tests** — PASS
- [ ] **Step 5: Commit** `refactor: Button public cp-button BEM classes`

---

### Task 7: Wave A primitives CSS rename

**Files (each: module scss/css + tsx + new or extended test):**
- `src/components/typography/`
- `src/components/icon/`
- `src/components/container/`
- `src/components/alert/`
- `src/components/badge/`
- `src/components/avatar/`
- `src/components/spinner/`

**Rename maps (minimum root):**
- Typography: `typography` → `cp-typography`; variants `h1`→`cp-typography--h1`; `bold`→`cp-typography--bold`; `align-center`→`cp-typography--align-center`
- Icon: `cp-icon` keep; size/color → `cp-icon--medium`, `cp-icon--black`
- Container: `container` → `cp-container`; `display-flex` → `cp-container--display-flex`; `width-full` → `cp-container--width-full`; `align-*` / `justify-*` / `border` similarly
- Alert / Badge / Avatar / Spinner: `cp-alert`, `cp-badge`, `cp-avatar`, `cp-spinner` + `--<variant|size>`

For each, add a test: render default + one variant; `expectPublicClass` on root; **no `data-cp`**.

Keep Icon ligature text and Material font behavior unchanged.

- [ ] **Step 1: Implement all seven using Task 6 protocol**
- [ ] **Step 2: `npm test && npm run type-check`**
- [ ] **Step 3: Commit** `refactor: public cp-* classes for Wave A primitives`

---

### Task 8: Wave B remaining isomorphic CSS rename

**Files:** Accordion, MenuList, stepper (wizard), Pills, MediaObject, BreadCrumb, Header, Footer, PageHeader, FeedbackState, Statistic, ProgressBar, Animated, Pagination

Root names: `cp-accordion`, `cp-menu-list`, `cp-stepper`, `cp-pills`, `cp-media-object` (already), `cp-breadcrumb`, `cp-header`, `cp-footer`, `cp-page-header` (already), `cp-feedback-state`, `cp-statistic`, `cp-progress-bar`, `cp-animated`, `cp-pagination`.

Pagination embeds Select — **do not** change Select yet; only Pagination wrapper classes.

- [ ] **Step 1: Protocol per component + `expectPublicClass` test**
- [ ] **Step 2: `npm test`** (include existing FeedbackState/Statistic tests)
- [ ] **Step 3: Commit** `refactor: public cp-* classes for Wave B shells and display`

---

### Task 9: Wave C FormControls isomorphic CSS rename

**Files:**
- `src/components/form-controls/FormControls.module.scss` (shared)
- Input, TextArea, Checkbox, Radio, Toggle, File, SegmentedControl, form Stepper
- **Do not** change Select/Date/ColorPicker **panel** class names in a way that breaks tests; if they share `.cp-form-*` / `.cp-select-*` already, keep and only rename unprefixed leftovers.

Many FormControls locals are already `cp-form-*` / `cp-input-*`. Grep the module for selectors that do **not** start with `cp-` and rename those only.

- [ ] **Step 1: Grep + rename unprefixed locals; extend SegmentedControl/Date tests if class assertions needed**
- [ ] **Step 2: `npm test -- src/components/form-controls`**
- [ ] **Step 3: Commit** `refactor: ensure FormControls locals are unique cp-*`

---

### Task 10: Wave D Table + AppShell CSS rename (Tier 3 chrome only)

**Files:** `src/components/table/`, `src/components/app-shell/`

- `table` → `cp-table`, `core-table` → `cp-table-core`
- AppShell already `cp-app-shell`; rename any unprefixed slot locals to `cp-app-shell__body` etc.

No dual-recipe HTML yet. Behavior (resize mobile swap, portal drawer) must keep passing — add a Table test that at default (jsdom width) renders `table`/`cp-table-core`, and a test that with mocked `viewportWidth < 768` + `mobileColumns` renders MediaObject.

- [ ] **Step 1: Class rename + Table desktop/mobile tree tests**
- [ ] **Step 2: `npm test`**
- [ ] **Step 3: Commit** `refactor: Table and AppShell public cp-* classes`

---

### Task 11: Wave E–F overlay and floater CSS rename (still hashed)

**Files:** Modal, Drawer, ConfirmDialog, Toast, BottomSheet, Dropdown, Select, Date, ColorPicker

**Required public names (HLD):**
- `cp-modal`, `cp-modal-overlay`, `cp-modal-overlay-open`, size `cp-modal--medium`
- `cp-drawer`, `cp-drawer-overlay`, `cp-drawer--placement-right`, `cp-drawer-mobile-sheet`
- `cp-confirm-dialog`, `cp-confirm-dialog-overlay`, `cp-confirm-dialog--open`
- `cp-toast`, `cp-toast-container`, `cp-toast--success` (etc.)
- `cp-bottom-sheet`, `cp-bottom-sheet-overlay`, `cp-bottom-sheet--snap-30` (and 60/90)
- `cp-dropdown`, `cp-dropdown-floating` — add **canonical** `top: 100%; left: 0` on `.cp-dropdown-floating` **in CSS**. React still sets `style={floatingStyles}` which overrides for real runtime. HTML recipes rely on the CSS default when no inline style.
- Select/Date: keep `cp-select-*` / `cp-date-picker-*`; add nothing that fights `floatingStyles`

BottomSheet: add snap modifier classes **in addition to** inline transform so HTML can use class-only. React may keep inline transform for drag; both can coexist.

- [ ] **Step 1: Rename + extend Modal.test.tsx / Drawer.test.tsx with `expectPublicClass` on dialog/overlay**
- [ ] **Step 2: `npm test`**
- [ ] **Step 3: Commit** `refactor: overlay and floater public cp-* classes`

---

### Task 12: Unhash CSS Modules (the breaking change)

**Files:**
- Modify: `rollup.config.mjs` — `generateScopedName: "[local]"` **or** `cssModulesScopedName` with `CP_PUBLIC_CSS=1` in `build-package`
- Modify: `vite.config.mts`:

```ts
css: {
  modules: { generateScopedName: "[local]" },
  preprocessorOptions: { scss: { api: "modern" } },
},
```

- Modify: Storybook — `.storybook/main.js` `viteFinal` to set the same `css.modules.generateScopedName: "[local]"`
- Modify: `src/test/public-css-contract.test.ts` — **unskip** both tests
- Modify: `src/test/class-contract.ts` — `expect(el).toHaveClass(publicName)` exact match
- Modify: `package.json` version `0.3.36` → `1.0.0` **only in Task 20**; this task is still Unreleased breaking in CHANGELOG
- Modify: `CHANGELOG.md` Unreleased Breaking: hashed classes removed; use `cp-*`
- Create: `docs/MIGRATION-v1.md`

**Uniqueness pre-check (run before flipping the flag):**

```bash
# After build with hashing still on, list locals. After unhash, duplicate locals collide.
node -e "
const {readFileSync}=require('fs');
const css=readFileSync('dist/index.css','utf8');
const locals=[...css.matchAll(/\\.([a-z][\\\\w-]*)-[A-Za-z0-9_-]{5}/g)].map(m=>m[1]);
const counts=locals.reduce((a,n)=>(a[n]=(a[n]||0)+1,a),{});
const dup=Object.entries(counts).filter(([,c])=>c>1).sort((a,b)=>b[1]-a[1]);
console.log(dup.slice(0,30));
"
```

If duplicates include `medium`, `overlay`, `content` — **stop**, finish renaming, do not unhash.

- [ ] **Step 1: `npm run build-package` then uniqueness script — empty dup list of generic names**
- [ ] **Step 2: Switch generateScopedName to `[local]` in Rollup + Vite + Storybook**
- [ ] **Step 3: Unskip public-css-contract tests; tighten `expectPublicClass`**
- [ ] **Step 4: `npm test && npm run type-check && npm run build-package && npm test -- src/test/public-css-contract.test.ts`**
Expected: PASS; `dist/index.css` contains `.cp-button` not `.cp-button-xxxxx`
- [ ] **Step 5: Write `docs/MIGRATION-v1.md`:** replace hashed selectors with `cp-*`; `className` prop still works; no dual class system
- [ ] **Step 6: Commit** `feat!: unhash CSS modules; public cp-* class API`

---

### Task 13: Publish `tokens.css`

**Files:**
- Create: `src/styles/tokens.css` — copy only the `:root { … }` block from `src/styles/reset.scss` (no reset element rules)
- Modify: `rollup.config.mjs` **or** `package.json` `build-package` to copy `src/styles/tokens.css` → `dist/tokens.css`
- Modify: `package.json` `files` already includes `dist`
- Create: `src/test/tokens-css.test.ts`

```ts
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

it("dist/tokens.css exposes spacing and brand tokens", () => {
  expect(existsSync("dist/tokens.css")).toBe(true);
  const css = readFileSync("dist/tokens.css", "utf8");
  expect(css).toContain("--space-4");
  expect(css).toContain("--primary-brand");
  expect(css).not.toContain(".cp-button");
});
```

Run `build-package` before this test, or have the test read `src/styles/tokens.css` and a separate script test for dist. Prefer testing source plus a build script unit:

```js
// scripts/copy-tokens.mjs
import { copyFileSync } from "fs";
copyFileSync("src/styles/tokens.css", "dist/tokens.css");
```

Add to `build-package`: `&& node scripts/copy-tokens.mjs`

- [ ] **Step 1: Extract tokens; copy script; test**
- [ ] **Step 2: `npm run build-package && npm test -- src/test/tokens-css.test.ts`**
- [ ] **Step 3: Commit** `feat: publish dist/tokens.css for Paper token sync`

---

### Task 14: Opt-in `data-cp` emission (default off)

**Files:**
- Create: `src/prototype/CleanPlatePrototypeAttributes.tsx`
- Create: `src/prototype/emit-data-cp.ts`
- Create: `src/prototype/emit-data-cp.test.tsx`
- Modify: Button (golden) then remaining components in the same pattern
- Modify: `.storybook/preview.js` wrap with provider
- Export provider from `src/index.js` as `CleanPlatePrototypeAttributes`

```tsx
// src/prototype/CleanPlatePrototypeAttributes.tsx
import React from "react";

const Ctx = React.createContext(false);

export function CleanPlatePrototypeAttributes({
  enabled = true,
  children,
}: {
  enabled?: boolean;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={enabled}>{children}</Ctx.Provider>;
}

export function usePrototypeAttributes() {
  return React.useContext(Ctx);
}
```

```ts
// src/prototype/emit-data-cp.ts
const GEOMETRY = new Set(["top", "left", "transform", "width", "maxHeight"]);

export function emitDataCp(
  enabled: boolean,
  component: string,
  props: Record<string, unknown>,
  defaults: Record<string, unknown>,
): Record<string, string> {
  if (!enabled) return {};
  const out: Record<string, string> = { "data-cp": component };
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === "function") continue;
    if (key === "children" || key === "className" || key === "style") continue;
    if (value === undefined || value === defaults[key]) continue;
    if (ReactIsValidElement(value)) continue;
    const attr = "data-cp-" + key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
    if (typeof value === "boolean") {
      if (value) out[attr] = "true";
      continue;
    }
    if (typeof value === "string" || typeof value === "number") {
      out[attr] = String(value);
    }
  }
  return out;
}
```

Do not import a fake `ReactIsValidElement` — use `import { isValidElement } from "react"`.

Button usage:

```tsx
const prototype = usePrototypeAttributes();
const dataCp = emitDataCp(prototype, "Button", { variant, size, isLoading, isDisabled, isFluid, margin }, {
  variant: "solid", size: "medium", isLoading: false, isDisabled: false, isFluid: false, margin: "0",
});
// <button {...dataCp} ...>
```

Tests:

```tsx
it("does not emit data-cp without provider", () => {
  render(<Button variant="outline">A</Button>);
  expect(screen.getByRole("button").getAttribute("data-cp")).toBeNull();
});

it("emits non-default props inside provider", () => {
  render(
    <CleanPlatePrototypeAttributes>
      <Button variant="outline" margin="b-2">A</Button>
    </CleanPlatePrototypeAttributes>,
  );
  const el = screen.getByRole("button");
  expect(el.getAttribute("data-cp")).toBe("Button");
  expect(el.getAttribute("data-cp-variant")).toBe("outline");
  expect(el.getAttribute("data-cp-margin")).toBe("b-2");
  expect(el.getAttribute("data-cp-size")).toBeNull(); // default medium omitted
});
```

**Guardrail:** `npm run build-package` then grep `dist/index.js` is allowed to contain the string `data-cp` (the helper exists) but a production render test using the **CJS bundle** without provider must not put `data-cp` on the DOM. The unit test above is the gate.

Wire Storybook:

```js
import { CleanPlatePrototypeAttributes } from "../src/prototype/CleanPlatePrototypeAttributes";
export const decorators = [
  (Story) => (
    <CleanPlatePrototypeAttributes>
      <Story />
    </CleanPlatePrototypeAttributes>
  ),
];
```

Apply `emitDataCp` to all components that will have HTML recipes (every export). Function props never appear (HLD).

- [ ] **Step 1: Provider + emit helper + Button tests**
- [ ] **Step 2: Wire remaining components (same defaults as their props)**
- [ ] **Step 3: `npm test && npm run type-check`**
- [ ] **Step 4: Commit** `feat: opt-in data-cp attributes via CleanPlatePrototypeAttributes`

---

### Task 15: `html-to-jsx` converter core (TDD)

**Files:**
- Create: `src/html-to-jsx/convert.ts`
- Create: `src/html-to-jsx/convert.test.ts`
- Create: `src/html-to-jsx/manifest.ts`
- Create: `src/html-to-jsx/component-manifest.json` (hand-start for Button; generator in Task 16)

**Interfaces:**
- Produces: `convertHtmlToJsx(html: string, manifest: Manifest): { jsx: string }`
- Throws `ConvertError` with `docs/Button.md` pointer

Minimal manifest shape:

```ts
export type Manifest = {
  components: Record<string, {
    exportName: string; // Button or FormControls.Input
    tier: 1 | 2 | 3 | 4;
    props: Record<string, { type: "string" | "boolean" | "enum" | "number"; values?: string[]; default?: unknown }>;
    slots?: string[];
    recipes?: string[];
  }>;
};
```

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { convertHtmlToJsx } from "./convert";
import { loadManifest } from "./manifest";

const manifest = loadManifest();

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
  expect(() => convertHtmlToJsx(`<div data-cp="Tabs"></div>`, manifest)).toThrow(/docs\//);
});

it("hard-fails illegal enum", () => {
  expect(() =>
    convertHtmlToJsx(`<button data-cp="Button" data-cp-variant="primary">X</button>`, manifest),
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

it("does not emit function props", () => {
  const { jsx } = convertHtmlToJsx(
    `<button data-cp="Button" data-cp-on-click="handler">X</button>`,
    manifest,
  );
  expect(jsx).not.toContain("onClick");
});
```

For the last test: **illegal** `data-cp-on-click` should hard-fail (unknown prop), not silently drop — that prevents hallucination. Manifest Button props have no `onClick`.

- [ ] **Step 2: Run — FAIL (module missing)**
- [ ] **Step 3: Implement `convert.ts` with cheerio:** walk DOM; tagged → component; slots → props; untagged → tag + className; strip geometry keys from style; unknown attr `data-cp-*` not in manifest → throw
- [ ] **Step 4: Tests PASS**
- [ ] **Step 5: Commit** `feat: html-to-jsx converter with hard-fail and passthrough`

---

### Task 16: Manifest generator + CLI + fixture corpus

**Files:**
- Create: `scripts/generate-component-manifest.mjs`
- Create: `src/html-to-jsx/cli.ts`
- Create: `src/html-to-jsx/fixtures/button.open.html` + `button.open.jsx`
- Modify: `package.json` `bin`: `"cleanplate": "./dist/cli.js"` or `"scripts/cleanplate-html-to-jsx.mjs"` running via `tsx`/`node`
- Modify: `package.json` scripts: `"html-to-jsx": "node src/html-to-jsx/cli.js"` after build

Practical CLI (no extra bundling complexity): `scripts/cleanplate-html-to-jsx.mjs` that imports compiled convert from dist **or** uses `npx tsx src/html-to-jsx/cli.ts` in this repo.

```js
#!/usr/bin/env node
import { readFileSync } from "fs";
import { convertHtmlToJsx } from "../src/html-to-jsx/convert.ts"; // use .js after build
```

Fixture runner in `convert.test.ts`:

```ts
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(__dirname, "fixtures");
for (const file of readdirSync(dir).filter((f) => f.endsWith(".html"))) {
  it(`fixture ${file}`, () => {
    const html = readFileSync(join(dir, file), "utf8");
    const expected = readFileSync(join(dir, file.replace(/\.html$/, ".jsx")), "utf8").trim();
    expect(convertHtmlToJsx(html, loadManifest()).jsx.trim()).toBe(expected);
  });
}
```

Add fixtures as components gain recipes (Tasks 17–19). This task: Button + untagged wrapper + illegal variant.

Hand-write `component-manifest.json` for all **v1** components (Wave A) in this task; expand in later tasks. Generator can start as a JSON file committed to git (source of truth for v1) if parsing TS props is too large — **committed JSON is acceptable**; generator is optional if it would be a second incomplete parser. Prefer **hand-maintained JSON + docs-contract that every `docs/*.md` HTML recipe round-trips**.

- [ ] **Step 1: CLI reads a file, writes JSX to stdout, exit 1 on ConvertError**
- [ ] **Step 2: Button fixtures green**
- [ ] **Step 3: Commit** `feat: cleanplate html-to-jsx CLI and Button fixtures`

---

### Task 17: HTML Prototype sections + skills + kit (v1 primitives)

**Files:**
- Modify: `docs/Button.md`, `Typography.md`, `Icon.md`, `Container.md`, `Alert.md`, `Badge.md`, `Avatar.md`, `Spinner.md`, `FormControls.md` (Input only subsection)
- Modify: `llms.txt`, `AGENTS.md`
- Create: `CLAUDE.md` (pointer: follow `AGENTS.md` + `llms.txt`)
- Create: `skills/cleanplate-html-prototype/SKILL.md`
- Create: `skills/cleanplate-html-to-react/SKILL.md`
- Create: `docs/html/kit.html`
- Modify: `src/test/docs-contract.test.ts` — for v1 names, require a heading `## HTML prototype`

Recipe format (Button):

```html
<button data-cp="Button" data-cp-variant="outline" data-cp-margin="b-2" class="cp-button cp-button--outline cp-m-b-2">Save</button>
```

Plus the React equivalent already in the doc.

`kit.html`: `<link>` comment to unpkg `cleanplate@1.0.0/dist/index.css` + Inter + Material Symbols + one row of v1 components with `data-cp`.

Skill html-to-react: **must run the CLI**; never invent JSX; if CLI fails, fix HTML.

- [ ] **Step 1: Docs + skills + kit**
- [ ] **Step 2: For each v1 recipe, add a fixture and `npm test -- src/html-to-jsx`**
- [ ] **Step 3: Commit** `docs: HTML prototype recipes and agent skills for v1 primitives`

---

### Task 18: Remaining Tier 1 + Tier 3 recipes (Accordion … Table/AppShell)

**Files:** matching `docs/*.md` + `src/html-to-jsx/fixtures/` + manifest JSON entries

Table: two fixtures `table.desktop.html` / `table.mobile.html` with `data-cp-recipe="desktop"|"mobile"`. Converter emits `<Table>` with columns inferred from `th` text as static column titles (strings only; `customRender` is a function — **out of contract**, cells become children/text).

If Table columns cannot be lossless without functions, convert to:

```jsx
<Table
  recipe="desktop"
  columns={[{ id: "name", title: "Name" }]}
  data={[{ name: "Ada" }]}
/>
```

only when `data-cp-col` / `data-cp-field` exist on cells. Document that in `docs/Table.md`. Missing recipe → hard-fail.

AppShell: `data-cp-recipe="desktop" | "mobile-drawer"`.

- [ ] **Step 1: Manifest + fixtures + docs for Wave B/C/D**
- [ ] **Step 2: `npm test`**
- [ ] **Step 3: Commit** `feat: HTML recipes for remaining Tier 1 and Table/AppShell`

---

### Task 19: Tier 2 and Tier 4 recipes

**Files:** docs + fixtures for Modal, Drawer, ConfirmDialog, Toast, BottomSheet, Dropdown, Select, Date, ColorPicker

**Guardrails encoded as tests:**

```ts
it("toast fixture is a single card", () => {
  const html = readFileSync("src/html-to-jsx/fixtures/toast.single.html", "utf8");
  expect(html.split("data-cp=\"Toast\"").length - 1).toBe(1);
});

it("modal fixture is not nested in overflow hidden", () => {
  const html = readFileSync("src/html-to-jsx/fixtures/modal.open.html", "utf8");
  expect(html).toMatch(/cp-modal-overlay/);
});

it("dropdown strips geometry and maps placement + slots", () => {
  // use convertHtmlToJsx on dropdown.open.html
});
```

Date fixture: **one** frozen month grid (fixed `data-cp` dates as text, not calendar math). ColorPicker: frozen `--cp-color-picker-hue` and thumb `%` in HTML; converter maps `value` hex string only.

- [ ] **Step 1: Fixtures + docs closed/open + artboard-root note**
- [ ] **Step 2: Tests PASS**
- [ ] **Step 3: Commit** `feat: overlay and floater HTML recipes (Approach B)`

---

### Task 20: Release 1.0.0 checklist

**Files:** `package.json` version, `CHANGELOG.md`, `README.md` (LLM section + tokens.css + html-to-jsx + major migration link)

Checklist (all must be true):

```bash
npm test
npm run type-check
npm run build-package
npm test -- src/test/public-css-contract.test.ts src/test/docs-contract.test.ts src/html-to-jsx/convert.test.ts
```

- `dist/index.css` has `.cp-button` and no `HASHED_CLASS_RE`
- `dist/tokens.css` exists
- `import type { ButtonProps } from "cleanplate"` works (`dist/index.d.ts`)
- Button without provider has no `data-cp`
- CHANGELOG Breaking lists hashed-class removal
- `docs/MIGRATION-v1.md` published (not in `docs/*.md` glob if we don’t want it on npm — **include it**: add `docs/MIGRATION-v1.md` to `package.json` files or keep inside `docs/` and expand files glob; currently `docs/*.md` **would** publish MIGRATION which is correct)

- [ ] **Step 1: Set version `1.0.0`**
- [ ] **Step 2: Run full checklist**
- [ ] **Step 3: Commit** `chore: release 1.0.0 public CSS and HTML bridge`

Do not `npm publish` unless explicitly asked.

---

## Regression matrix (quality bar)

| Gate | When | Pass criteria |
| --- | --- | --- |
| Existing RTL (Modal, Drawer, Date, Statistic, …) | Every task | `npm test` green |
| Spacing suffix-only | Task 3+ | prefixed values throw in tests; defaults `"0"` |
| Docs no `margin="m-` | Task 4+ | `docs-contract` |
| Unique `cp-*` locals | Before Task 12 | uniqueness script |
| Unhashed dist CSS | Task 12+ | `public-css-contract` |
| Exact `toHaveClass("cp-button")` | Task 12+ | class-contract |
| No `data-cp` in consumer DOM | Task 14+ | Button test without provider |
| Converter hard-fail | Task 15+ | unknown / illegal enum |
| Untagged passthrough | Task 15+ | wrapper `className` |
| Strip geometry | Task 15+ | Dropdown fixture |
| No function props from HTML | Task 15+ | `data-cp-on-click` hard-fail |
| Single Toast | Task 19 | fixture count |
| Table dual recipe | Task 18 | missing recipe hard-fail |
| tokens.css | Task 13+ | `--space-4` present, no component classes |

## Spec coverage

| HLD section | Tasks |
| --- | --- |
| §4 conversion contract | 14, 15, 16 |
| §5 Tier 1 | 6–9, 17–18 |
| §5 Tier 2–4 | 11, 19 |
| §6 CSS unhash + tokens + canonical placement | 5–13 |
| §7 CLI, skills, docs | 16–17 |
| §8 v1 vs later | 17 then 18–19 |
| Semver major + migration | 12, 20 |
| No callbacks | 15 (hard-fail unknown function-ish attrs) |
| Single toast | 19 |

## Execution notes

- Stop after Task 17 for an internal v1 preview **without** publishing; Task 12 is still the consumer-breaking CSS cutover — do not release hashed `cp-*` names as if they were public.
- Prefer one family commit per wave so bisect stays possible.
- If uniqueness fails at Task 12, go back to the colliding component; do not add a second class system.
