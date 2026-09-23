# Typography type scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the locked two-scale type system from `docs/superpowers/specs/2026-09-23-typography-type-scale-design.md`: public `--cp-font-*` tokens and a `Typography` remap only.

**Architecture:** Size, leading, tracking, and weight live on `:root` as `--cp-font-*` tokens in both `tokens.css` and `reset.scss`. `Typography.module.scss` consumes those tokens only — no raw heading `px` and no `line-height: 1` on variants. Root `.cp-typography` is body (`md`) so a default `<p>` with no `variant` class still renders 16/24. `variant` names, HTML tags, and public classes do not change.

**Tech Stack:** React, TypeScript, SCSS modules, Vitest, Testing Library, Storybook, Playwright visual tests.

## Global Constraints

- Typography + tokens + docs only: do not retokenize Badge, Avatar, Modal, Drawer, Button, form helpers, or PageHeader
- Do not change `--font-size: 16px` or `body { line-height: 1 }` in `reset.scss`
- Do not add `variant` values (`display`, `title`, `caption`)
- Do not add a default variant that uses `--cp-font-size-3xl` (40px is override-only)
- Do not change `TypographyVariant` or public class names
- Spacing props stay suffix-only (`margin="b-2"`)
- Prefer component props over inline `style`
- jsdom does not apply CSS modules: assert token files and SCSS source contracts, not `getComputedStyle`
- `--cp-font-size-md` is the literal `16px`, not `var(--font-size)`

---

## File structure

| Path | Role |
|------|------|
| `src/styles/tokens.css` | Public `--cp-font-*` tokens (copied to `dist/tokens.css`) |
| `src/styles/reset.scss` | Same tokens on app `:root` |
| `src/test/tokens-css.test.ts` | Assert every font token value |
| `src/components/typography/Typography.module.scss` | Variant styles from tokens |
| `src/components/typography/Typography.test.tsx` | Public classes + SCSS contract |
| `src/components/typography/Typography.tsx` | Unchanged (no API work) |
| `docs/Typography.md` | Scale table + two-scale note |
| `src/stories/typography/typography.docs.mdx` | Same table |
| `llms.txt` | Two-scale guideline |
| `CHANGELOG.md` | Unreleased breaking entry |
| `docs/MIGRATION-v1.md` | Old vs new size table |
| `tests/visual/` | Regen kit/story snapshots after CSS change |

**Do not modify:** Button, form-controls, Modal, Drawer, Badge, Avatar, PageHeader component files (snapshot regen only if pixels shift).

---

### Task 1: Public font tokens

**Files:**
- Modify: `src/styles/tokens.css` (public component tokens block, after `--cp-form-control-height-large`)
- Modify: `src/styles/reset.scss` (same location — keep files in sync)
- Modify: `src/test/tokens-css.test.ts`

**Interfaces:**
- Consumes: existing `:root` public-token comment block
- Produces: `--cp-font-size-xs|sm|md|lg|xl|2xl|3xl|4xl`, `--cp-font-leading-*` (same suffixes), `--cp-font-tracking-display|title|heading|ui|caption`, `--cp-font-weight-regular|medium|bold`

- [ ] **Step 1: Write the failing token assertions**

In the source `tokens.css` test in `src/test/tokens-css.test.ts`, add:

```ts
    expect(css).toContain("--cp-font-size-xs: 12px");
    expect(css).toContain("--cp-font-size-sm: 14px");
    expect(css).toContain("--cp-font-size-md: 16px");
    expect(css).toContain("--cp-font-size-lg: 20px");
    expect(css).toContain("--cp-font-size-xl: 24px");
    expect(css).toContain("--cp-font-size-2xl: 32px");
    expect(css).toContain("--cp-font-size-3xl: 40px");
    expect(css).toContain("--cp-font-size-4xl: 48px");
    expect(css).toContain("--cp-font-leading-xs: 16px");
    expect(css).toContain("--cp-font-leading-sm: 20px");
    expect(css).toContain("--cp-font-leading-md: 24px");
    expect(css).toContain("--cp-font-leading-lg: 28px");
    expect(css).toContain("--cp-font-leading-xl: 32px");
    expect(css).toContain("--cp-font-leading-2xl: 40px");
    expect(css).toContain("--cp-font-leading-3xl: 48px");
    expect(css).toContain("--cp-font-leading-4xl: 56px");
    expect(css).toContain("--cp-font-tracking-display: -0.03em");
    expect(css).toContain("--cp-font-tracking-title: -0.02em");
    expect(css).toContain("--cp-font-tracking-heading: -0.015em");
    expect(css).toContain("--cp-font-tracking-ui: 0");
    expect(css).toContain("--cp-font-tracking-caption: 0.01em");
    expect(css).toContain("--cp-font-weight-regular: 400");
    expect(css).toContain("--cp-font-weight-medium: 600");
    expect(css).toContain("--cp-font-weight-bold: 700");
    expect(css).not.toContain("--cp-font-size-md: var(--font-size)");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/tokens-css.test.ts`

Expected: FAIL — `--cp-font-size-xs` not found

- [ ] **Step 3: Add tokens to both token files**

Insert after `--cp-form-control-height-large: 52px;` in **both** `src/styles/tokens.css` and `src/styles/reset.scss`:

```css
  --cp-font-size-xs: 12px;
  --cp-font-size-sm: 14px;
  --cp-font-size-md: 16px;
  --cp-font-size-lg: 20px;
  --cp-font-size-xl: 24px;
  --cp-font-size-2xl: 32px;
  --cp-font-size-3xl: 40px;
  --cp-font-size-4xl: 48px;
  --cp-font-leading-xs: 16px;
  --cp-font-leading-sm: 20px;
  --cp-font-leading-md: 24px;
  --cp-font-leading-lg: 28px;
  --cp-font-leading-xl: 32px;
  --cp-font-leading-2xl: 40px;
  --cp-font-leading-3xl: 48px;
  --cp-font-leading-4xl: 56px;
  --cp-font-tracking-display: -0.03em;
  --cp-font-tracking-title: -0.02em;
  --cp-font-tracking-heading: -0.015em;
  --cp-font-tracking-ui: 0;
  --cp-font-tracking-caption: 0.01em;
  --cp-font-weight-regular: 400;
  --cp-font-weight-medium: 600;
  --cp-font-weight-bold: 700;
```

Leave `--font-size: 16px` and `body { line-height: 1 }` unchanged.

- [ ] **Step 4: Run tests and sync dist tokens if needed**

Run: `npm test -- src/test/tokens-css.test.ts`

Expected: source assertions PASS. If the `dist/tokens.css` copy test fails on stale contents, run `node scripts/copy-tokens.mjs` and re-run.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/reset.scss src/test/tokens-css.test.ts dist/tokens.css
git commit -m "$(cat <<'EOF'
feat: add public --cp-font-* type scale tokens

EOF
)"
```

---

### Task 2: Typography styles from tokens

**Files:**
- Modify: `src/components/typography/Typography.module.scss`
- Modify: `src/components/typography/Typography.test.tsx`
- Do not modify: `src/components/typography/Typography.tsx`

**Interfaces:**
- Consumes: `--cp-font-size-*`, `--cp-font-leading-*`, `--cp-font-tracking-*`, `--cp-font-weight-*` from Task 1
- Produces: variant classes wired to the spec mapping; root `.cp-typography` is body `md` so default (no `variant` class) is 16/24/400

- [ ] **Step 1: Write the failing SCSS contract tests**

Keep the existing public-class tests. Add this describe block to `src/components/typography/Typography.test.tsx`:

```tsx
import { readFileSync } from "node:fs";

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/typography/Typography.test.tsx`

Expected: FAIL — still contains `font-size: 60px` and `line-height: 1`

- [ ] **Step 3: Remap Typography.module.scss**

Replace the file contents with:

```scss
.cp-typography {
  font-family: inherit;
  font-size: var(--cp-font-size-md);
  font-weight: var(--cp-font-weight-regular);
  line-height: var(--cp-font-leading-md);
  letter-spacing: var(--cp-font-tracking-ui);
  color: var(--black);

  &.cp-typography--bold {
    font-weight: var(--cp-font-weight-bold);
  }

  &.cp-typography--h1 {
    font-size: var(--cp-font-size-4xl);
    font-weight: var(--cp-font-weight-bold);
    line-height: var(--cp-font-leading-4xl);
    letter-spacing: var(--cp-font-tracking-display);
  }

  &.cp-typography--h2 {
    font-size: var(--cp-font-size-2xl);
    font-weight: var(--cp-font-weight-bold);
    line-height: var(--cp-font-leading-2xl);
    letter-spacing: var(--cp-font-tracking-title);
  }

  &.cp-typography--h3 {
    font-size: var(--cp-font-size-xl);
    font-weight: var(--cp-font-weight-bold);
    line-height: var(--cp-font-leading-xl);
    letter-spacing: var(--cp-font-tracking-heading);
  }

  &.cp-typography--h4 {
    font-size: var(--cp-font-size-lg);
    font-weight: var(--cp-font-weight-medium);
    line-height: var(--cp-font-leading-lg);
    letter-spacing: var(--cp-font-tracking-ui);
  }

  &.cp-typography--h5 {
    font-size: var(--cp-font-size-md);
    font-weight: var(--cp-font-weight-medium);
    line-height: var(--cp-font-leading-md);
    letter-spacing: var(--cp-font-tracking-ui);
  }

  &.cp-typography--h6 {
    font-size: var(--cp-font-size-sm);
    font-weight: var(--cp-font-weight-medium);
    line-height: var(--cp-font-leading-sm);
    letter-spacing: var(--cp-font-tracking-caption);
  }

  &.cp-typography--span {
    font-size: var(--cp-font-size-md);
    font-weight: var(--cp-font-weight-regular);
    line-height: var(--cp-font-leading-md);
    letter-spacing: var(--cp-font-tracking-ui);
  }

  &.cp-typography--p {
    font-size: var(--cp-font-size-md);
    font-weight: var(--cp-font-weight-regular);
    line-height: var(--cp-font-leading-md);
    letter-spacing: var(--cp-font-tracking-ui);
  }

  &.cp-typography--small {
    font-size: var(--cp-font-size-xs);
    font-weight: var(--cp-font-weight-regular);
    line-height: var(--cp-font-leading-xs);
    letter-spacing: var(--cp-font-tracking-caption);
  }

  &.cp-typography--align-left {
    text-align: left;
  }

  &.cp-typography--align-center {
    text-align: center;
  }

  &.cp-typography--align-right {
    text-align: right;
  }

  &.cp-typography--word-break-normal {
    word-break: normal;
  }

  &.cp-typography--word-break-all {
    word-break: break-all;
  }

  &.cp-typography--word-break-wrap {
    word-wrap: break-word;
  }
}
```

Keep align / word-break blocks exactly as today. Do not touch `Typography.tsx`.

- [ ] **Step 4: Run tests**

Run: `npm test -- src/components/typography/Typography.test.tsx src/test/tokens-css.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/typography/Typography.module.scss src/components/typography/Typography.test.tsx
git commit -m "$(cat <<'EOF'
feat: remap Typography variants to the two-scale tokens

EOF
)"
```

---

### Task 3: Docs, changelog, migration

**Files:**
- Modify: `docs/Typography.md`
- Modify: `src/stories/typography/typography.docs.mdx`
- Modify: `llms.txt`
- Modify: `CHANGELOG.md`
- Modify: `docs/MIGRATION-v1.md`

**Interfaces:**
- Consumes: locked variant table from the spec (h1 48/56/700/-0.03em … small 12/16/400)
- Produces: published docs that match the shipped CSS

- [ ] **Step 1: Add the scale table to `docs/Typography.md`**

Insert after the opening purpose paragraph (before `## Props / Inputs`):

```md
## Type scale

Two scales that meet at 24px. UI sizes are a 4px grid plus **14px** (`sm`). Display sizes are Major Third from 24, snapped: 32 / 40 / 48. `h4`–`h6` reuse UI sizes. `--cp-font-size-3xl` (40px) has no default variant — override `h1` or `h2` if a product needs it.

| variant | Size | Line-height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| `h1` | 48 (`4xl`) | 56 | 700 | −0.03em |
| `h2` | 32 (`2xl`) | 40 | 700 | −0.02em |
| `h3` | 24 (`xl`) | 32 | 700 | −0.015em |
| `h4` | 20 (`lg`) | 28 | 600 | 0 |
| `h5` | 16 (`md`) | 24 | 600 | 0 |
| `h6` | 14 (`sm`) | 20 | 600 | +0.01em |
| `p` / `span` | 16 (`md`) | 24 | 400 | 0 |
| `small` | 12 (`xs`) | 16 | 400 | +0.01em |

Public tokens: `--cp-font-size-*`, `--cp-font-leading-*`, `--cp-font-tracking-*`, `--cp-font-weight-*`. `isBold` sets weight to 700 and does not change size or tracking.
```

- [ ] **Step 2: Mirror the table in Storybook docs**

Append to `src/stories/typography/typography.docs.mdx` after the props table:

```mdx
### Type scale

UI 12–24px (4px grid + 14px). Display 32 / 40 / 48 (Major Third from 24). `h4`–`h6` reuse UI sizes.

| variant | Size | Line-height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| `h1` | 48 | 56 | 700 | −0.03em |
| `h2` | 32 | 40 | 700 | −0.02em |
| `h3` | 24 | 32 | 700 | −0.015em |
| `h4` | 20 | 28 | 600 | 0 |
| `h5` | 16 | 24 | 600 | 0 |
| `h6` | 14 | 20 | 600 | +0.01em |
| `p` / `span` | 16 | 24 | 400 | 0 |
| `small` | 12 | 16 | 400 | +0.01em |
```

- [ ] **Step 3: Update `llms.txt` Typography guideline**

Replace the `### Typography` bullet list with:

```md
### Typography
- **Text alignment:** Use the `align` prop. Example: `<Typography align="center">` not `style={{ textAlign: "center" }}`. Values: `"left"`, `"center"`, `"right"`.
- **Spacing:** Use `margin` with the suffix rule (see above).
- **Bold:** Use `isBold` prop, not `style={{ fontWeight: "bold" }}`.
- **Hierarchy:** Use `variant` (`h1`–`h6`, `p`, `span`, `small`). Do not set inline `fontSize`. Sizes come from the two-scale tokens (UI 12/14/16/20/24, display 32/40/48). `h1` is 48; `h5` is 16/600 (same size as body, heavier). Need a 20 or 24 heading? Use `h4` or `h3`, not `h5`.
```

Also update the Typography Component index blurb (around line 72) Key Features to mention the two-scale tokens.

- [ ] **Step 4: Changelog + migration**

In `CHANGELOG.md` under `## Unreleased` → `### Breaking`, add:

```md
- **Typography type scale:** Headings remap 60/50/40/30/24/18 → **48/32/24/20/16/14**. `small` is **12px** (was 14px). Heading line-height is no longer `1`. Public tokens `--cp-font-size-*`, `--cp-font-leading-*`, `--cp-font-tracking-*`, `--cp-font-weight-*`. Class names unchanged. See `docs/Typography.md`.
```

In `docs/MIGRATION-v1.md`, add a section before `## Need help?`:

```md
## Typography type scale (1.0.0-beta.x)

Visual remap only. `variant` names and `cp-typography--*` classes are unchanged.

| Variant | Before | After |
| --- | --- | --- |
| `h1` | 60px / 60px | 48px / 56px / 700 / −0.03em |
| `h2` | 50px / 50px | 32px / 40px / 700 / −0.02em |
| `h3` | 40px / 40px | 24px / 32px / 700 / −0.015em |
| `h4` | 30px / 30px | 20px / 28px / 600 |
| `h5` | 24px / 24px | 16px / 24px / 600 |
| `h6` | 18px / 18px | 14px / 20px / 600 |
| `p` / `span` | 16px / 24px | 16px / 24px / 400 |
| `small` | 14px / 20px | 12px / 16px / 400 |

`h5` is now body-sized semibold — use `h3` or `h4` for 24/20. Apps that need the old 14px caption should use `h6` or a local style. Override tokens after importing `cleanplate/dist/index.css` (for example `--cp-font-size-4xl`) rather than targeting hashed classes.
```

- [ ] **Step 5: Commit**

```bash
git add docs/Typography.md src/stories/typography/typography.docs.mdx llms.txt CHANGELOG.md docs/MIGRATION-v1.md
git commit -m "$(cat <<'EOF'
docs: document the Typography two-scale remap

EOF
)"
```

---

### Task 4: Visual snapshot fallout

**Files:**
- Modify: Playwright baselines under `tests/visual/` that include Typography or kit row `typography`
- Do not restyle other components to “fix” diffs

**Interfaces:**
- Consumes: new Typography CSS from Task 2
- Produces: updated snapshots accepted as remap fallout

- [ ] **Step 1: Run the kit typography visual test**

Run: `npm run test:visual -- tests/visual/kit.spec.ts -g kit-row-typography`

Expected: FAIL — pixel diff on `#kit-row-typography` (body leading 16/24 vs previous inherit/`line-height: 1`)

- [ ] **Step 2: Update snapshots**

Run: `npm run test:visual:update -- tests/visual/kit.spec.ts -g kit-row-typography`

If other visual specs fail only because they embed `Typography` headings (Storybook story shots), update those the same way. Do not change Modal/Drawer/PageHeader SCSS to hide the diff.

- [ ] **Step 3: Re-run visual tests that you updated**

Run: `npm run test:visual -- tests/visual/kit.spec.ts -g kit-row-typography`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add tests/visual
git commit -m "$(cat <<'EOF'
test: update typography visual snapshots for the type scale remap

EOF
)"
```

---

## Spec coverage

| Spec section | Task |
|---|---|
| Public `--cp-font-size/leading/tracking/weight-*` | Task 1 |
| `--cp-font-size-md` is literal `16px` | Task 1 |
| `--font-size` / body `line-height: 1` unchanged | Task 1 constraint |
| Variant mapping + `isBold` → bold token | Task 2 |
| Default no-variant `<p>` is `md` | Task 2 root styles |
| No new variants; 3xl unused by default | Tasks 1–2 (token only) |
| Markup / prototype / class names unchanged | Task 2 (TSX not touched) |
| `docs/Typography.md`, Storybook, `llms.txt` | Task 3 |
| `CHANGELOG` + `MIGRATION-v1` | Task 3 |
| Token + Typography tests | Tasks 1–2 |
| Visual regen, no composite restyle | Task 4 |
| Other components out of scope | Global constraints |
