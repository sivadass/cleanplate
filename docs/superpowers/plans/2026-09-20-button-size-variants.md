# Button size variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remap `Button` to 32 / 44 / 52, add `large`, and add `prefixIcon` / `suffixIcon` per `docs/superpowers/specs/2026-09-20-button-size-variants-design.md`.

**Architecture:** Size metrics live on `:root` as `--cp-button-*` tokens (same override pattern as `--cp-form-control-radius`). `Button.module.scss` consumes those tokens only — no raw size pixels. `prefixIcon` / `suffixIcon` are Material Symbol names; Button renders `Icon` without `size` or `color` and sizes/colors the slots in CSS. `variant="icon"` is a square at the size height, not a circle. HTML-to-JSX strips painted icon-slot spans so recipes stay mechanical.

**Tech Stack:** React, TypeScript, SCSS modules, Vitest, Testing Library, Storybook, Playwright visual tests, html-to-jsx converter.

## Global Constraints

- Primitive only: do not restyle Modal, Drawer, Pagination, Pills, PageHeader, or FeedbackState
- Form controls stay 50px; do not add field `size` or change `reset.scss` `input/select/textarea { height: 50px }`
- `Icon` public sizes stay `small | medium | large` (16 / 24 / 36); 20px is Button CSS only
- Spacing props stay suffix-only (`margin="b-2"`)
- Prefer component props over inline `style`
- Public classes stay `cp-*` (unhashed); size class is always present (`cp-button--small|medium|large`)
- `prefixIcon` / `suffixIcon` inherit button `color`; decorative (`aria-hidden`)
- Do not introduce `icon` / `endIcon` prop names

---

## File structure

| Path | Role |
|------|------|
| `src/styles/reset.scss` | `--cp-button-*` tokens on `:root` (app CSS) |
| `src/styles/tokens.css` | Same tokens for HTML / Paper (`dist/tokens.css` copy) |
| `src/test/tokens-css.test.ts` | Assert tokens exist; still no `.cp-button` in tokens.css |
| `src/components/button/Button.tsx` | `ButtonSize` + `prefixIcon` / `suffixIcon` |
| `src/components/button/Button.module.scss` | Size, slots, square icon-only |
| `src/components/button/Button.test.tsx` | Unit + SCSS contract tests |
| `src/html-to-jsx/component-manifest.json` | `large`, `prefixIcon`, `suffixIcon` |
| `src/html-to-jsx/convert.ts` | Strip Button icon-slot spans from children |
| `src/html-to-jsx/convert.test.ts` | Converter cases |
| `src/html-to-jsx/fixtures/button.prefix.html` | HTML recipe fixture |
| `src/html-to-jsx/fixtures/button.prefix.jsx` | Expected JSX |
| `src/stories/button/button.stories.jsx` | Playground + size matrix |
| `src/stories/button/button.docs.mdx` | Storybook docs |
| `docs/Button.md` | Public docs + HTML recipe |
| `docs/MIGRATION-v1.md` | Breaking remap note |
| `llms.txt` | Index sizes + prefix/suffix |
| `CHANGELOG.md` | Unreleased entry |
| `docs/html/kit.html` | Optional prefix example; default row may stay medium |

**Do not modify:** `src/components/form-controls/**`, Modal/Drawer/Pills/FeedbackState/Pagination/PageHeader components (snapshot regen only).

---

### Task 1: Button size tokens

**Files:**
- Modify: `src/styles/reset.scss` (immediately after `--cp-form-control-radius`)
- Modify: `src/styles/tokens.css` (same location — keep files in sync)
- Modify: `src/test/tokens-css.test.ts`

**Interfaces:**
- Consumes: existing `:root` public-token comment block
- Produces: `--cp-button-height-small|medium|large`, `--cp-button-font-*`, `--cp-button-pad-x-*`, `--cp-button-pad-icon-*`, `--cp-button-icon-*`, `--cp-button-gap-*` with values from the spec table

- [ ] **Step 1: Write the failing token assertions**

In `src/test/tokens-css.test.ts`, add to the source `tokens.css` test (keep `.cp-button` absence):

```ts
expect(css).toContain("--cp-button-height-small: 32px");
expect(css).toContain("--cp-button-height-medium: 44px");
expect(css).toContain("--cp-button-height-large: 52px");
expect(css).toContain("--cp-button-font-small: 14px");
expect(css).toContain("--cp-button-icon-medium: 20px");
expect(css).toContain("--cp-button-pad-icon-small: 12px");
expect(css).toContain("--cp-button-gap-small: 4px");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/tokens-css.test.ts`

Expected: FAIL — `--cp-button-height-small` not found

- [ ] **Step 3: Add tokens to both token files**

Insert after `--cp-form-control-radius: var(--radius-large);` in **both** `src/styles/reset.scss` and `src/styles/tokens.css`:

```css
  --cp-button-height-small: 32px;
  --cp-button-height-medium: 44px;
  --cp-button-height-large: 52px;
  --cp-button-font-small: 14px;
  --cp-button-font-medium: 16px;
  --cp-button-font-large: 16px;
  --cp-button-pad-x-small: 16px;
  --cp-button-pad-x-medium: 24px;
  --cp-button-pad-x-large: 32px;
  --cp-button-pad-icon-small: 12px;
  --cp-button-pad-icon-medium: 20px;
  --cp-button-pad-icon-large: 24px;
  --cp-button-icon-small: 16px;
  --cp-button-icon-medium: 20px;
  --cp-button-icon-large: 24px;
  --cp-button-gap-small: 4px;
  --cp-button-gap-medium: 8px;
  --cp-button-gap-large: 8px;
```

Do not change `button, input, select, textarea { height: 50px }` in `reset.scss`.

- [ ] **Step 4: Run tests**

Run: `npm test -- src/test/tokens-css.test.ts`

Expected: PASS (source file). Dist copy test still passes if `dist/tokens.css` is stale until next `build-package`; if the dist test fails because it reads an old copy, run `node scripts/copy-tokens.mjs` once so `dist/tokens.css` matches source.

- [ ] **Step 5: Commit**

```bash
git add src/styles/reset.scss src/styles/tokens.css src/test/tokens-css.test.ts dist/tokens.css
git commit -m "$(cat <<'EOF'
feat: add Button size tokens on :root

Give Button a themable 32/44/52 scale without scattering pixels in component SCSS.
EOF
)"
```

---

### Task 2: Size classes and square icon-only chrome

**Files:**
- Modify: `src/components/button/Button.tsx` (`ButtonSize` union only in this task)
- Modify: `src/components/button/Button.module.scss` (replace size + icon geometry)
- Modify: `src/components/button/Button.test.tsx`

**Interfaces:**
- Consumes: `--cp-button-*` tokens from Task 1
- Produces: `type ButtonSize = "small" | "medium" | "large"`; classes `cp-button--small|medium|large`; icon-only square using `height` token; no `border-radius: 50%`, no `min-width: 96px`, no hardcoded `height: 50px` / `24px` / `6px`

- [ ] **Step 1: Write failing tests**

Replace the `"icon button circular hit area"` describe in `Button.test.tsx` and add size-class tests:

```tsx
describe("Button sizes", () => {
  it("applies medium class by default", () => {
    render(<Button>Save</Button>);
    expectPublicClass(screen.getByRole("button"), "cp-button--medium");
  });

  it("applies large class", () => {
    render(<Button size="large">Save</Button>);
    expectPublicClass(screen.getByRole("button"), "cp-button--large");
  });
});

describe("icon button square hit area", () => {
  const scss = readFileSync("src/components/button/Button.module.scss", "utf8");

  it("does not use a circular icon radius or legacy heights", () => {
    expect(scss).not.toMatch(/border-radius:\s*50%/);
    expect(scss).not.toMatch(/height:\s*50px/);
    expect(scss).not.toMatch(/height:\s*24px/);
    expect(scss).not.toMatch(/min-width:\s*96px/);
  });

  it("sizes icon-only buttons from height tokens with zero padding", () => {
    expect(scss).toMatch(
      /&\.cp-button--icon \{[\s\S]*width:\s*var\(--cp-button-height-small\)/,
    );
    expect(scss).toMatch(
      /&\.cp-button--icon \{[\s\S]*width:\s*var\(--cp-button-height-medium\)/,
    );
    expect(scss).toMatch(
      /&\.cp-button--icon \{[\s\S]*width:\s*var\(--cp-button-height-large\)/,
    );
    expect(scss).toMatch(/&\.cp-button--icon \{[\s\S]*padding:\s*0/);
  });
});
```

Keep existing public-class / data-cp / disabled tests.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/button/Button.test.tsx`

Expected: FAIL — no `cp-button--large`; SCSS still has `50px` / `50%` / `24px`

- [ ] **Step 3: Extend the type**

In `Button.tsx`:

```ts
export type ButtonSize = "small" | "medium" | "large";
```

No other TSX behavior in this task (`size` class map already interpolates).

- [ ] **Step 4: Replace size + icon geometry in SCSS**

Rewrite `src/components/button/Button.module.scss` to this (keep variant colors/hover/loader animation; drop circular icon and raw size pixels):

```scss
.cp-button-loader {
  animation: spin-animation 1s infinite;
  animation-timing-function: linear;
  display: inline-block;
  color: inherit;
}

@keyframes spin-animation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.cp-button {
  font-family: inherit;
  font-size: var(--cp-button-font-medium);
  height: var(--cp-button-height-medium);
  padding: 0 var(--cp-button-pad-x-medium);
  border: 1px solid transparent;
  background: var(--primary-brand);
  color: #fff;
  border-radius: var(--cp-form-control-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  column-gap: var(--cp-button-gap-medium);
  justify-content: center;

  .cp-button__prefix-icon,
  .cp-button__suffix-icon,
  .cp-button-loader {
    font-size: var(--cp-button-icon-medium);
    color: inherit;
    line-height: 1;
  }

  &:hover {
    background: var(--primary-brand-darker);
  }
  &.cp-button--disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
  &.cp-button--loading {
    cursor: not-allowed;
  }
  &.cp-button--fluid {
    width: 100%;
  }

  &.cp-button--small {
    height: var(--cp-button-height-small);
    font-size: var(--cp-button-font-small);
    padding: 0 var(--cp-button-pad-x-small);
    column-gap: var(--cp-button-gap-small);
    .cp-button__prefix-icon,
    .cp-button__suffix-icon,
    .cp-button-loader {
      font-size: var(--cp-button-icon-small);
    }
    &.cp-button--has-prefix {
      padding-left: var(--cp-button-pad-icon-small);
    }
    &.cp-button--has-suffix {
      padding-right: var(--cp-button-pad-icon-small);
    }
    &.cp-button--icon {
      width: var(--cp-button-height-small);
      min-width: var(--cp-button-height-small);
      padding: 0;
    }
  }

  &.cp-button--medium {
    height: var(--cp-button-height-medium);
    font-size: var(--cp-button-font-medium);
    padding: 0 var(--cp-button-pad-x-medium);
    column-gap: var(--cp-button-gap-medium);
    .cp-button__prefix-icon,
    .cp-button__suffix-icon,
    .cp-button-loader {
      font-size: var(--cp-button-icon-medium);
    }
    &.cp-button--has-prefix {
      padding-left: var(--cp-button-pad-icon-medium);
    }
    &.cp-button--has-suffix {
      padding-right: var(--cp-button-pad-icon-medium);
    }
    &.cp-button--icon {
      width: var(--cp-button-height-medium);
      min-width: var(--cp-button-height-medium);
      padding: 0;
    }
  }

  &.cp-button--large {
    height: var(--cp-button-height-large);
    font-size: var(--cp-button-font-large);
    padding: 0 var(--cp-button-pad-x-large);
    column-gap: var(--cp-button-gap-large);
    .cp-button__prefix-icon,
    .cp-button__suffix-icon,
    .cp-button-loader {
      font-size: var(--cp-button-icon-large);
    }
    &.cp-button--has-prefix {
      padding-left: var(--cp-button-pad-icon-large);
    }
    &.cp-button--has-suffix {
      padding-right: var(--cp-button-pad-icon-large);
    }
    &.cp-button--icon {
      width: var(--cp-button-height-large);
      min-width: var(--cp-button-height-large);
      padding: 0;
    }
  }

  &.cp-button--outline {
    color: var(--primary-brand);
    border-color: var(--primary-brand);
    background: var(--white);
    &:hover {
      background: var(--primary-brand-light);
      border-color: var(--primary-brand);
      color: var(--primary-brand);
    }
    .cp-button-loader {
      color: var(--primary-brand);
    }
  }
  &.cp-button--ghost {
    color: var(--primary-brand);
    border-color: transparent;
    background: transparent;
    &:hover {
      background: var(--primary-brand-lightest);
      border-color: var(--primary-brand-lightest);
    }
    .cp-button-loader {
      color: var(--primary-brand);
    }
  }
  &.cp-button--icon {
    color: var(--primary-brand);
    border-color: transparent;
    background: transparent;
    padding: 0;
    flex-shrink: 0;
    &:hover {
      background: var(--primary-brand-lightest);
      border-color: var(--primary-brand-lightest);
    }
    .cp-button-loader {
      color: var(--primary-brand);
    }
  }
}
```

- [ ] **Step 5: Run tests**

Run: `npm test -- src/components/button/Button.test.tsx`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/button/Button.tsx src/components/button/Button.module.scss src/components/button/Button.test.tsx
git commit -m "$(cat <<'EOF'
feat: remap Button sizes to 32/44/52

Replace the 24/50 gap with a three-step tokenized scale and square icon-only hit areas.
EOF
)"
```

---

### Task 3: `prefixIcon`, `suffixIcon`, and loading slot

**Files:**
- Modify: `src/components/button/Button.tsx`
- Modify: `src/components/button/Button.test.tsx`

**Interfaces:**
- Consumes: `ButtonSize` from Task 2; `MaterialIconName` from `src/components/icon/material-icon-names.ts`; slot classes from Task 2 SCSS
- Produces: optional `prefixIcon?: MaterialIconName` and `suffixIcon?: MaterialIconName` on `ButtonProps`. Classes `cp-button--has-prefix` / `cp-button--has-suffix` when a label button has those slots (not on `variant="icon"`). Loading shows `progress_activity` in the prefix slot and hides `prefixIcon`. Icon-only with `prefixIcon` does not render `children`.

- [ ] **Step 1: Write failing tests**

Append to `Button.test.tsx`:

```tsx
describe("prefix and suffix icons", () => {
  it("renders prefix and suffix and marks padding modifiers", () => {
    render(
      <Button prefixIcon="add" suffixIcon="expand_more">
        Next
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Next" });
    expectPublicClass(el, "cp-button--has-prefix");
    expectPublicClass(el, "cp-button--has-suffix");
    expect(el.querySelector(".cp-button__prefix-icon")).toHaveTextContent("add");
    expect(el.querySelector(".cp-button__suffix-icon")).toHaveTextContent(
      "expand_more",
    );
    expect(el.querySelector(".cp-button__prefix-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("replaces prefix with loader while loading and keeps the label", () => {
    render(
      <Button prefixIcon="add" isLoading>
        Next
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Next" });
    expect(el.querySelector(".cp-button__prefix-icon")).toBeNull();
    expect(el.querySelector(".cp-button-loader")).not.toBeNull();
    expectPublicClass(el, "cp-button--has-prefix");
  });

  it("uses prefixIcon as the glyph for icon-only and hides children", () => {
    render(
      <Button variant="icon" prefixIcon="close" aria-label="Close">
        should-not-show
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Close" });
    expect(el).not.toHaveTextContent("should-not-show");
    expect(el.querySelector(".cp-button__prefix-icon")).toHaveTextContent(
      "close",
    );
    expect(el.classList.contains("cp-button--has-prefix")).toBe(false);
  });

  it("emits prefix icon on prototype attributes", () => {
    render(
      <CleanPlatePrototypeAttributes>
        <Button prefixIcon="add">Next</Button>
      </CleanPlatePrototypeAttributes>,
    );
    const el = screen.getByRole("button");
    expect(el.getAttribute("data-cp-prefix-icon")).toBe("add");
    expect(el.getAttribute("data-cp-size")).toBeNull();
  });

  it("emits size when large", () => {
    render(
      <CleanPlatePrototypeAttributes>
        <Button size="large">Go</Button>
      </CleanPlatePrototypeAttributes>,
    );
    expect(screen.getByRole("button").getAttribute("data-cp-size")).toBe(
      "large",
    );
  });
});
```

If `toHaveTextContent` on `.cp-icon` fails because the glyph is a text node of the Material name, that is correct (`Icon` renders `{name}`).

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/button/Button.test.tsx`

Expected: FAIL — `prefixIcon` is not a valid prop / class missing

- [ ] **Step 3: Implement Button.tsx**

Replace `src/components/button/Button.tsx` with:

```tsx
import React from "react";
import Icon from "../icon";
import type { MaterialIconName } from "../icon/material-icon-names";
import styles from "./Button.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import { SPACING_OPTIONS } from "../../constants/common";
import getClassNames from "../../utils/get-class-names";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";

export type ButtonSize = "small" | "medium" | "large";

export type ButtonVariant = "solid" | "outline" | "ghost" | "icon";

export type SpacingOption = typeof SPACING_OPTIONS[number];

export type ButtonMargin = string | SpacingOption[];

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> {
  children?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  isFluid?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  prefixIcon?: MaterialIconName;
  suffixIcon?: MaterialIconName;
  margin?: ButtonMargin;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      isLoading = false,
      isDisabled = false,
      isFluid = false,
      size = "medium",
      variant = "solid",
      prefixIcon,
      suffixIcon,
      margin = "0",
      onClick,
      className = "",
      type = "button",
      ...rest
    },
    ref,
  ) {
    const prototypeEnabled = usePrototypeAttributes();
    const dataCp = emitDataCp(
      prototypeEnabled,
      "Button",
      {
        variant,
        size,
        isLoading,
        isDisabled,
        isFluid,
        margin,
        type,
        prefixIcon,
        suffixIcon,
      },
      {
        variant: "solid",
        size: "medium",
        isLoading: false,
        isDisabled: false,
        isFluid: false,
        margin: "0",
        type: "button",
        prefixIcon: undefined,
        suffixIcon: undefined,
      },
    );

    const marginClass = getSpacingClass(margin, utilStyles, "cp-m");
    const isIconOnly = variant === "icon";
    const hasPrefix = Boolean(isLoading || prefixIcon);
    const hasSuffix = Boolean(suffixIcon);
    const showChildren = !isIconOnly || (!prefixIcon && !isLoading);

    const buttonClasses = getClassNames(
      styles["cp-button"],
      styles[`cp-button--${size}`],
      variant !== "solid" ? styles[`cp-button--${variant}`] : "",
      {
        [styles["cp-button--fluid"]]: isFluid,
        [styles["cp-button--disabled"]]: isDisabled,
        [styles["cp-button--loading"]]: isLoading,
        [styles["cp-button--has-prefix"]]: hasPrefix && !isIconOnly,
        [styles["cp-button--has-suffix"]]: hasSuffix && !isIconOnly,
      },
      marginClass,
      className,
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled || isLoading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <button
        {...dataCp}
        ref={ref}
        className={buttonClasses}
        type={type}
        disabled={isDisabled || isLoading}
        {...rest}
        onClick={handleClick}
      >
        {isLoading && (
          <Icon
            name="progress_activity"
            className={styles["cp-button-loader"]}
          />
        )}
        {prefixIcon && !isLoading && (
          <Icon
            name={prefixIcon}
            className={styles["cp-button__prefix-icon"]}
            aria-hidden={true}
          />
        )}
        {showChildren ? children : null}
        {suffixIcon && (
          <Icon
            name={suffixIcon}
            className={styles["cp-button__suffix-icon"]}
            aria-hidden={true}
          />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
```

Do not pass `size` or `color` to these `Icon`s.

- [ ] **Step 4: Run tests and type-check**

Run: `npm test -- src/components/button/Button.test.tsx`

Expected: PASS

Run: `npx tsc --noEmit`

Expected: PASS (`ButtonSize` / `ButtonProps` flow through `src/public-types.ts` automatically)

- [ ] **Step 5: Commit**

```bash
git add src/components/button/Button.tsx src/components/button/Button.test.tsx
git commit -m "$(cat <<'EOF'
feat: add Button prefixIcon and suffixIcon

Own glyph size and padding from Button tokens so label+icon layouts match the size spec.
EOF
)"
```

---

### Task 4: HTML-to-JSX manifest and slot stripping

**Files:**
- Modify: `src/html-to-jsx/component-manifest.json` (`Button.props`)
- Modify: `src/html-to-jsx/convert.ts`
- Modify: `src/html-to-jsx/convert.test.ts`
- Create: `src/html-to-jsx/fixtures/button.prefix.html`
- Create: `src/html-to-jsx/fixtures/button.prefix.jsx`

**Interfaces:**
- Consumes: `prefixIcon` / `suffixIcon` / `size: large` from Task 3
- Produces: `convertHtmlToJsx` maps `data-cp-prefix-icon` → `prefixIcon="add"` and omits `.cp-button__prefix-icon` / `.cp-button__suffix-icon` elements from children. `size` enum values `["small", "medium", "large"]`.

- [ ] **Step 1: Write failing converter tests**

Add to `src/html-to-jsx/convert.test.ts`:

```ts
  it("maps Button prefixIcon and strips painted icon slots", () => {
    const { jsx } = convertHtmlToJsx(
      `<button data-cp="Button" data-cp-prefix-icon="add" class="cp-button cp-button--medium cp-button--has-prefix"><span class="cp-icon cp-button__prefix-icon" aria-hidden="true">add</span>Next</button>`,
      manifest,
    );
    expect(jsx).toContain('<Button prefixIcon="add">Next</Button>');
    expect(jsx).not.toContain("cp-button__prefix-icon");
    expect(jsx).not.toContain("<span");
  });

  it("allows Button size large", () => {
    const { jsx } = convertHtmlToJsx(
      `<button data-cp="Button" data-cp-size="large" class="cp-button cp-button--large">Go</button>`,
      manifest,
    );
    expect(jsx).toContain('<Button size="large">Go</Button>');
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/html-to-jsx/convert.test.ts`

Expected: FAIL — unknown prop `prefixIcon` and/or illegal `large`

- [ ] **Step 3: Update the Button manifest entry**

In `src/html-to-jsx/component-manifest.json`, replace the `Button.props` `size` + add icon props:

```json
        "size": {
          "type": "enum",
          "values": ["small", "medium", "large"],
          "default": "medium"
        },
        "prefixIcon": { "type": "string" },
        "suffixIcon": { "type": "string" },
```

Keep existing `isLoading`, `isDisabled`, `isFluid`, `variant`, `margin`, `type`.

- [ ] **Step 4: Strip icon-slot children for Button**

In `src/html-to-jsx/convert.ts`, add helpers above `convertTaggedComponent`:

```ts
const BUTTON_ICON_SLOT_CLASSES = new Set([
  "cp-button__prefix-icon",
  "cp-button__suffix-icon",
]);

function classListContains(classAttr: string | undefined, name: string): boolean {
  return (classAttr ?? "").split(/\s+/).includes(name);
}

function isButtonIconSlot(element: HtmlElement): boolean {
  return [...BUTTON_ICON_SLOT_CLASSES].some((slotClass) =>
    classListContains(element.attribs["class"], slotClass),
  );
}
```

Inside `convertTaggedComponent`, in the `.contents().toArray().forEach` callback, after `child.type !== "tag"` check and **before** `convertNode`, add:

```ts
      if (componentName === "Button" && isButtonIconSlot(child as HtmlElement)) {
        return;
      }
```

(`child` is the tag node; cast to `HtmlElement`.)

- [ ] **Step 5: Add fixtures**

`src/html-to-jsx/fixtures/button.prefix.html`:

```html
<button data-cp="Button" data-cp-prefix-icon="add" class="cp-button cp-button--medium cp-button--has-prefix"><span class="cp-icon cp-button__prefix-icon" aria-hidden="true">add</span>Next</button>
```

`src/html-to-jsx/fixtures/button.prefix.jsx`:

```jsx
<Button prefixIcon="add">Next</Button>
```

If `convert.test.ts` auto-loads all fixtures via `readdirSync`, this pair is picked up automatically — run the file and fix whitespace if a fixture test fails.

- [ ] **Step 6: Run tests**

Run: `npm test -- src/html-to-jsx/convert.test.ts`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/html-to-jsx/component-manifest.json src/html-to-jsx/convert.ts src/html-to-jsx/convert.test.ts src/html-to-jsx/fixtures/button.prefix.html src/html-to-jsx/fixtures/button.prefix.jsx
git commit -m "$(cat <<'EOF'
feat: convert Button prefixIcon HTML recipes

Keep HTML kits paintable while JSX uses prefixIcon instead of nested icon chrome.
EOF
)"
```

---

### Task 5: Docs, stories, migration, changelog

**Files:**
- Modify: `docs/Button.md`
- Modify: `src/stories/button/button.docs.mdx`
- Modify: `src/stories/button/button.stories.jsx`
- Modify: `docs/MIGRATION-v1.md`
- Modify: `llms.txt` (Button bullet only)
- Modify: `CHANGELOG.md` (`## Unreleased`)
- Modify: `docs/html/kit.html` (optional one prefix example; keep default medium row)

**Interfaces:**
- Consumes: public API from Task 3; HTML recipe from Task 4
- Produces: docs that list `small | medium | large`, `prefixIcon` / `suffixIcon`, square icon-only, and “use `size="large"` next to 50px fields.” No leftover “44px compact padding” lie.

- [ ] **Step 1: Update `docs/Button.md`**

- Props table: `size` → `"small" | "medium" | "large"`; add `prefixIcon` and `suffixIcon` (`MaterialIconName`, optional).
- `ButtonSize` type: `"small" | "medium" | "large"`.
- `ButtonProps` interface: add the two icon props.
- Sizes example: include `large`.
- New examples: prefix, suffix, both; icon-only with `prefixIcon` + `aria-label`.
- Behavior notes: replace the medium-icon 44px padding sentence with: icon-only is square at the size height; glyphs 16 / 20 / 24; use `size="large"` beside form fields (fields stay 50px).
- HTML prototype: add the prefix recipe from the spec (painted span + `data-cp-prefix-icon`).

- [ ] **Step 2: Update Storybook MDX and stories**

`button.docs.mdx`: sizes `small`, `medium`, `large`; prefix/suffix; same behavior notes as docs.

`button.stories.jsx`:

- `size` control options: `["small", "medium", "large"]`
- Add `prefixIcon` / `suffixIcon` text controls
- Change `IconVariant` to `prefixIcon: "close"` (no child `Icon` required)
- Add a static `Sizes` story for visual baselines:

```jsx
export const Sizes = {
  name: "Sizes",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["small", "medium", "large"]).map((size) => (
        <div key={size} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button size={size}>Next</Button>
          <Button size={size} prefixIcon="add">Next</Button>
          <Button size={size} suffixIcon="expand_more">Next</Button>
          <Button size={size} variant="icon" prefixIcon="refresh" aria-label="Refresh" />
        </div>
      ))}
    </div>
  ),
};
```

(Inline `style` on the **story wrapper** is fine; do not put layout `style` on `Button`.)

- [ ] **Step 3: Migration, llms, changelog**

`docs/MIGRATION-v1.md` — add a short section **Button sizes (1.0.0-beta.x)**:

- `small` 24→32, `medium` 50→44 (min-width 96 removed), new `large` 52
- `variant="icon"` is square, not circular
- `prefixIcon` / `suffixIcon` names
- Form fields still 50px; pass `size="large"` to sit beside inputs

`llms.txt` Button Key Features: sizes `(small, medium, large)`, prefix/suffix icons.

`CHANGELOG.md` under `## Unreleased` (replace `_No unreleased changes._`):

```md
## Unreleased

### Breaking

- **Button sizes:** `small` is 32px (was 24px). `medium` (default) is 44px (was 50px) and no longer has `min-width: 96px`. `variant="icon"` is a square at the size height, not a circle. New `large` is 52px. Form controls remain 50px — use `size="large"` next to fields. See `docs/Button.md`.

### Added

- **Button `prefixIcon` / `suffixIcon`:** Material Symbol names; Button owns glyph size (16 / 20 / 24) and asymmetric padding.
```

- [ ] **Step 4: Run docs contract**

Run: `npm test -- src/test/docs-contract.test.ts src/components/button/Button.test.tsx src/html-to-jsx/convert.test.ts`

Expected: PASS (no prefixed spacing regressions)

- [ ] **Step 5: Commit**

```bash
git add docs/Button.md src/stories/button/button.docs.mdx src/stories/button/button.stories.jsx docs/MIGRATION-v1.md llms.txt CHANGELOG.md docs/html/kit.html
git commit -m "$(cat <<'EOF'
docs: document Button size remap and prefix icons

Record the breaking 32/44/52 scale and the new icon props for consumers and agents.
EOF
)"
```

---

### Task 6: Visual baselines

**Files:**
- Update: `tests/visual/stories.spec.ts-snapshots/atoms-button-playground--*.png`
- Update: any other snapshots that shift because in-library Buttons inherit the new `small` / `medium` (Modal, Drawer, Pagination, kit, demos). **Do not change those components’ source to chase pixels.**

**Interfaces:**
- Consumes: Task 2–5 visual output
- Produces: regenerated Playwright screenshots that match the new primitive

- [ ] **Step 1: Run visual tests once to see failures**

Run: `npm run test:visual`

Expected: FAIL on Button stories and many composite/kit shots (height/radius/icon shape)

- [ ] **Step 2: Update snapshots**

Run: `npm run test:visual:update`

Review Button + kit diffs. Composite diffs are accepted fallout from the remap, not a restyle pass.

- [ ] **Step 3: Re-run visual tests**

Run: `npm run test:visual`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add tests/visual
git commit -m "$(cat <<'EOF'
test: refresh visuals for Button size remap

Capture 32/44/52 and square icon-only; accept inherited composite snapshot shifts.
EOF
)"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|---|---|
| `small` 32 / `medium` 44 default / `large` 52 | 1–2 |
| `--cp-button-*` tokens, no raw size px | 1–2 |
| Drop min-width 96 and 6px small radius | 2 |
| Square `variant="icon"`, form-control radius | 2 |
| `prefixIcon` / `suffixIcon` names, inherit color, 16/20/24 | 3 |
| Loading replaces prefix slot | 3 |
| Icon-only + `prefixIcon` hides children; old children Icon still works | 3 |
| `data-cp-prefix-icon`, omit default medium | 3 |
| Converter strips slot spans; manifest `large` | 4 |
| Docs, MDX, llms, migration, changelog | 5 |
| Visual regen; composites not restyled | 6 |
| Form controls stay 50px | Global + Task 1 (do not touch field height) |
| Icon API unchanged | Global |
