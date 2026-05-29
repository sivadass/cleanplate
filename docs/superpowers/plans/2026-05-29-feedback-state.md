# FeedbackState implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `<FeedbackState />` — unified empty/error region component per `docs/superpowers/specs/2026-05-29-feedback-state-design.md`.

**Architecture:** Single presentational component composing `Typography`, `Button`, and `Icon`. Media slot resolves `illustration` (URL `<img>` or node) before `icon`. Actions use `Button` only (`onClick`). Styling in `FeedbackState.module.scss` with global tokens from `reset.scss`; consumers override via root `className` and documented BEM slot classes. No public `--cp-feedback-state-*` token layer in v1.

**Tech Stack:** React 18, TypeScript, SCSS modules, Vitest, `@testing-library/react`, Storybook 7.

**Spec:** `docs/superpowers/specs/2026-05-29-feedback-state-design.md`

---

## File structure

| Path | Role |
|------|------|
| `src/components/feedback-state/FeedbackState.tsx` | Component + types |
| `src/components/feedback-state/FeedbackState.module.scss` | Layout, sizes, motion, slot classes |
| `src/components/feedback-state/FeedbackState.test.tsx` | Component tests |
| `src/components/feedback-state/index.ts` | Barrel export + type re-exports |
| `src/index.js` | Add import/export |
| `docs/FeedbackState.md` | Public component doc |
| `src/stories/feedback-state/feedback-state.stories.jsx` | Storybook playground + scenarios |
| `src/stories/feedback-state/feedback-state.docs.mdx` | Optional MDX doc page (match Alert pattern) |
| `llms.txt` | Manual index entry (Component block + Quick Reference) |
| `CHANGELOG.md` | Unreleased: new `FeedbackState` export |

---

### Task 1: Scaffold + failing tests (media precedence & roles)

**Files:**

- Create: `src/components/feedback-state/FeedbackState.test.tsx`
- Create: `src/components/feedback-state/FeedbackState.tsx` (minimal stub)
- Create: `src/components/feedback-state/index.ts`

- [ ] **Step 1: Create stub component**

`src/components/feedback-state/FeedbackState.tsx`:

```tsx
import React from "react";
import { SPACING_OPTIONS } from "../../constants/common";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type FeedbackStateVariant = "empty" | "error";
export type FeedbackStateSize = "small" | "medium" | "large";
export type FeedbackStateTitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
export type FeedbackStateRole = "alert" | "status" | "none";

export type ActionConfig = {
  label: string;
  onClick: () => void;
};

export interface FeedbackStateProps {
  variant: FeedbackStateVariant;
  title: string;
  titleTag?: FeedbackStateTitleTag;
  description?: string | React.ReactNode;
  illustration?: string | React.ReactNode;
  illustrationAlt?: string;
  icon?: import("../icon/material-icon-names").MaterialIconName;
  size?: FeedbackStateSize;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  onRetry?: () => void;
  retryLabel?: string;
  errorCode?: string | number;
  errorDetails?: string;
  role?: FeedbackStateRole;
  margin?: string | SpacingOption[];
  className?: string;
  dataTestId?: string;
}

const FeedbackState: React.FC<FeedbackStateProps> = () => null;

export default FeedbackState;
```

`src/components/feedback-state/index.ts`:

```ts
export { default } from "./FeedbackState";
export type {
  FeedbackStateProps,
  FeedbackStateVariant,
  FeedbackStateSize,
  FeedbackStateTitleTag,
  FeedbackStateRole,
  ActionConfig,
} from "./FeedbackState";
```

- [ ] **Step 2: Write failing tests**

`src/components/feedback-state/FeedbackState.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FeedbackState from "./FeedbackState";

describe("FeedbackState", () => {
  it("defaults role to status for empty variant", () => {
    render(<FeedbackState variant="empty" title="No items" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("defaults role to alert for error variant", () => {
    render(<FeedbackState variant="error" title="Failed to load" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("omits role when role is none", () => {
    const { container } = render(
      <FeedbackState variant="empty" title="No items" role="none" />
    );
    expect(container.querySelector("[role]")).toBeNull();
  });

  it("renders illustration img when illustration is a URL string", () => {
    render(
      <FeedbackState
        variant="empty"
        title="No results"
        illustration="/assets/empty.png"
        illustrationAlt="No results illustration"
      />
    );
    const img = screen.getByRole("img", { name: "No results illustration" });
    expect(img).toHaveAttribute("src", "/assets/empty.png");
  });

  it("prefers illustration over icon", () => {
    render(
      <FeedbackState
        variant="empty"
        title="No results"
        illustration="/assets/empty.png"
        icon="search_off"
      />
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.queryByText("search_off")).not.toBeInTheDocument();
  });

  it("renders icon when illustration is omitted", () => {
    render(
      <FeedbackState variant="empty" title="No results" icon="folder_open" />
    );
    expect(screen.getByText("folder_open")).toBeInTheDocument();
  });

  it("uses primaryAction over onRetry", async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();
    const onRetry = vi.fn();

    render(
      <FeedbackState
        variant="error"
        title="Error"
        primaryAction={{ label: "Contact support", onClick: onPrimary }}
        onRetry={onRetry}
      />
    );

    await user.click(screen.getByRole("button", { name: "Contact support" }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();
  });

  it("renders retry button when onRetry is set and primaryAction is absent", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <FeedbackState variant="error" title="Error" onRetry={onRetry} />
    );

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("applies dataTestId on root", () => {
    render(
      <FeedbackState
        variant="empty"
        title="No items"
        dataTestId="projects-empty"
      />
    );
    expect(screen.getByTestId("projects-empty")).toBeInTheDocument();
  });

  it("merges className on root", () => {
    render(
      <FeedbackState
        variant="empty"
        title="No items"
        className="my-module-empty"
      />
    );
    expect(screen.getByRole("status")).toHaveClass("my-module-empty");
  });
});
```

- [ ] **Step 3: Run tests — expect failures**

Run: `npm test -- src/components/feedback-state/FeedbackState.test.tsx`

Expected: FAIL (component returns `null`, queries miss elements).

- [ ] **Step 4: Commit scaffold**

```bash
git add src/components/feedback-state/
git commit -m "test: add FeedbackState scaffold and failing tests"
```

---

### Task 2: Implement component logic (no SCSS polish yet)

**Files:**

- Modify: `src/components/feedback-state/FeedbackState.tsx`
- Create: `src/components/feedback-state/FeedbackState.module.scss` (minimal root + slots)

- [ ] **Step 1: Add helpers and render tree**

Implement in `FeedbackState.tsx`:

- Import `Typography`, `Button`, `Icon`, `getSpacingClass`, `getClassNames`, `utilStyles`, `styles`.
- `useId()` for title id; root `aria-labelledby={titleId}` when `role !== "none"`.
- `resolvePrimaryAction()`: `primaryAction` ?? (`onRetry` ? `{ label: retryLabel ?? "Try again", onClick: onRetry }` : null).
- Media: if `typeof illustration === "string"` → `<img className={styles["cp-feedback-state__media-img"]} src={illustration} alt={illustrationAlt ?? ""} />` inside `div.cp-feedback-state__media` with `aria-hidden={!illustrationAlt}` when decorative; if `illustration` is node → render node in `__media`; else if `icon` → `<Icon name={icon} size={mapSize(size)} color={variant === "error" ? "red" : "gray"} />`.
- `mapSize`: `small → small`, `medium → medium`, `large → large` for Icon; default `medium`.
- Title: dynamic tag from `titleTag` (default `h2`) with `id={titleId}`, class `cp-feedback-state__title`.
- Description: `Typography` variant `p`, class `__description`, `align="center"`.
- `errorCode`: optional span with class `__error-code` when set.
- Actions: flex row `__actions` — primary `Button variant="solid"`, secondary `Button variant="ghost"`.
- `errorDetails`: when string set, render `<details className={styles["cp-feedback-state__details"]}><summary>Show details</summary>{errorDetails}</details>`.
- Root: `getClassNames(styles["cp-feedback-state"], styles[`cp-feedback-state--${size}`], styles[`cp-feedback-state--${variant}`], marginClass, className)`; `data-testid={dataTestId}`.

Minimal `FeedbackState.module.scss`:

```scss
.cp-feedback-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
}

.cp-feedback-state__media {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cp-feedback-state__title {
  color: var(--text-default);
}

.cp-feedback-state__description {
  color: var(--text-subtle);
}

.cp-feedback-state__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
}
```

- [ ] **Step 2: Run tests**

Run: `npm test -- src/components/feedback-state/FeedbackState.test.tsx`

Expected: PASS (all Task 1 tests).

- [ ] **Step 3: Commit**

```bash
git add src/components/feedback-state/FeedbackState.tsx src/components/feedback-state/FeedbackState.module.scss
git commit -m "feat: implement FeedbackState component logic"
```

---

### Task 3: Size variants, motion, and SCSS completion

**Files:**

- Modify: `src/components/feedback-state/FeedbackState.module.scss`

- [ ] **Step 1: Add size modifiers**

```scss
.cp-feedback-state--small {
  min-height: 120px;
  .cp-feedback-state__media-img {
    max-width: 48px;
    max-height: 48px;
  }
}

.cp-feedback-state--medium {
  min-height: 240px;
  .cp-feedback-state__media-img {
    max-width: 120px;
    max-height: 120px;
  }
}

.cp-feedback-state--large {
  min-height: 360px;
  .cp-feedback-state__media-img {
    max-width: 200px;
    max-height: 200px;
  }
}

.cp-feedback-state__error-code {
  color: var(--error);
  font-weight: 600;
}

.cp-feedback-state__details {
  color: var(--text-muted);
  font-size: 0.875rem;
  text-align: left;
  max-width: var(--length-medium);
}

.cp-feedback-state {
  animation: cp-feedback-state-enter 180ms ease-out;
}

@keyframes cp-feedback-state-enter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cp-feedback-state {
    animation: none;
  }
}
```

- [ ] **Step 2: Add test for errorDetails disclosure**

Append to `FeedbackState.test.tsx`:

```tsx
  it("renders error details in a details element", () => {
    render(
      <FeedbackState
        variant="error"
        title="Error"
        errorDetails="ECONNREFUSED"
      />
    );
    expect(screen.getByText("Show details")).toBeInTheDocument();
    expect(screen.getByText("ECONNREFUSED")).toBeInTheDocument();
  });
```

- [ ] **Step 3: Run tests**

Run: `npm test -- src/components/feedback-state/FeedbackState.test.tsx`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/feedback-state/
git commit -m "feat: FeedbackState sizes, motion, and error details styles"
```

---

### Task 4: Package export

**Files:**

- Modify: `src/index.js`

- [ ] **Step 1: Wire export**

Add import:

```js
import FeedbackState from "./components/feedback-state";
```

Add to named export list (alphabetically near `Footer` / `FormControls`):

```js
  FeedbackState,
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`

Expected: PASS (no errors from FeedbackState types).

- [ ] **Step 3: Commit**

```bash
git add src/index.js
git commit -m "feat: export FeedbackState from package entry"
```

---

### Task 5: Documentation

**Files:**

- Create: `docs/FeedbackState.md`
- Modify: `llms.txt`

- [ ] **Step 1: Write `docs/FeedbackState.md`**

Follow `templates/docs-template-sample.md` section order. Include:

- Purpose: empty/error **regions**; not `Alert`/`Toast`; **margin** suffix rule; **no** hosted illustrations.
- Full props table from spec §3.
- Examples: icon-only empty, illustration URL, error with `onRetry`, `errorDetails`, `className` override snippet.
- Behavior: media precedence, action precedence, default roles, decorative `illustrationAlt`.
- Related: `Alert`, `Toast`, `Button`, `Icon`, `Typography`, `Container`.

- [ ] **Step 2: Add `llms.txt` entry**

After `Alert` block, add:

```markdown
### FeedbackState Component
- File: `docs/FeedbackState.md`
- Purpose: Unified empty and error region for cards, panels, tables, and content areas. Consumer-supplied illustration URL (png/jpg/svg) or Material `icon`; optional primary/secondary actions (`onClick` only).
- Key Features: variant empty|error, sizes small|medium|large, stacked layout, errorCode/errorDetails, onRetry shorthand, className overrides, dataTestId, margin suffix API
- Types: FeedbackStateProps, FeedbackStateVariant, FeedbackStateSize, ActionConfig, ...
```

Add Quick Reference table row if the file has that section.

- [ ] **Step 3: Commit**

```bash
git add docs/FeedbackState.md llms.txt
git commit -m "docs: add FeedbackState component documentation"
```

---

### Task 6: Storybook

**Files:**

- Create: `src/stories/feedback-state/feedback-state.stories.jsx`
- Create: `src/stories/feedback-state/feedback-state.docs.mdx` (optional; copy Alert MDX header pattern)

- [ ] **Step 1: Playground story**

```jsx
import { FeedbackState, Container } from "../../index";

const meta = {
  title: "atoms/FeedbackState/Playground",
  component: FeedbackState,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { options: ["empty", "error"], control: { type: "select" } },
    size: { options: ["small", "medium", "large"], control: { type: "select" } },
    title: { control: "text" },
    description: { control: "text" },
    icon: { control: "text" },
    illustration: { control: "text" },
  },
  args: {
    variant: "empty",
    size: "medium",
    title: "No projects yet",
    description: "Create your first project to get started.",
    icon: "folder_open",
    margin: "0",
  },
};

export default meta;

export const Default = {
  render: (args) => (
    <Container padding="4" width="medium">
      <FeedbackState {...args} />
    </Container>
  ),
};
```

Add named stories: `WithIllustrationUrl`, `ErrorWithRetry`, `ErrorWithDetails`, `SmallInTable` (wrap in narrow `Container`), `CustomClassName`.

- [ ] **Step 2: Verify Storybook**

Run: `npm run storybook` (manual): open **atoms/FeedbackState/Playground**, toggle variant/size.

- [ ] **Step 3: Commit**

```bash
git add src/stories/feedback-state/
git commit -m "docs: add FeedbackState Storybook stories"
```

---

### Task 7: Changelog + full verification

**Files:**

- Modify: `CHANGELOG.md`

- [ ] **Step 1: Changelog entry**

Under `## Unreleased`, add `### Added`:

```markdown
- **`FeedbackState`**: unified empty/error region component (`variant`, `illustration` URL or `icon`, actions, `onRetry`, `errorDetails`). See `docs/FeedbackState.md`.
```

- [ ] **Step 2: Full test suite**

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 3: Build package**

Run: `npm run build-package`

Expected: succeeds; `dist/index.d.ts` exports `FeedbackState`.

- [ ] **Step 4: Commit**

```bash
git add CHANGELOG.md
git commit -m "chore: changelog for FeedbackState component"
```

---

## Plan self-review (vs spec)

| Spec requirement | Task |
|------------------|------|
| Single `FeedbackState`, variants empty/error | Task 2 |
| `illustration` URL / node, no slugs | Task 2 |
| `icon` when no illustration | Task 1–2 tests + impl |
| Actions onClick only | Task 2 |
| `onRetry` vs `primaryAction` | Task 1–2 |
| Sizes small/medium/large | Task 3 |
| Stacked layout | Task 2 SCSS |
| `errorCode`, `errorDetails` | Task 2–3 |
| Default roles + `role="none"` | Task 1–2 |
| `titleTag`, `margin`, `className`, `dataTestId` | Task 2 |
| No public token layer; className overrides | Task 3 + docs Task 5 |
| Internal motion + reduced motion | Task 3 |
| Export + docs + stories | Tasks 4–6 |
| CHANGELOG | Task 7 |

No TBD steps. No horizontal layout / CDN / href / animate prop.

---

## References

- Spec: `docs/superpowers/specs/2026-05-29-feedback-state-design.md`
- Patterns: `src/components/alert/Alert.tsx`, `src/components/accordion/Accordion.tsx` (`titleTag`), `src/components/modal/Modal.test.tsx`
