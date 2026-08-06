# SegmentedControl implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `FormControls.SegmentedControl` — compact single-select segmented form control per `docs/superpowers/specs/2026-08-06-segmented-control-design.md`.

**Architecture:** Mirror `FormControls.Radio`: `<fieldset>` + `<legend>`, visually hidden native radios, controlled/uncontrolled via `value` / `defaultValue`. Contiguous equal-width segment chrome in `FormControls.module.scss` (Stepper-like shell, not MenuList pills). No `forwardRef`. Flat `options[]` API.

**Tech stack:** React, TypeScript, SCSS modules, Vitest, `@testing-library/react`, `@testing-library/user-event`, Storybook CSF/MDX.

**Spec:** `docs/superpowers/specs/2026-08-06-segmented-control-design.md`

**Guidelines:** [Apple HIG segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls), [M3 segmented buttons](https://m3.material.io/components/segmented-buttons/overview) — single-select only in v1.

## Global constraints

- Single-select only; no click-to-deselect
- Always equal-width segments (`flex: 1`)
- `size`: `"small" | "medium"` (default `"medium"`)
- Icon-only segments require `ariaLabel`
- Spacing props use suffix-only API (`margin="b-4"`)
- Prefer component props over inline `style`
- Match Radio `dataTestId` suffix scheme and FormControls naming (`isDisabled`, `isRequired`, `isFluid`)

---

## File structure

| Path | Role |
|------|------|
| `src/components/form-controls/SegmentedControl.tsx` | Component + types |
| `src/components/form-controls/SegmentedControl.test.tsx` | Component tests |
| `src/components/form-controls/FormControls.module.scss` | `.cp-segmented-control-*` styles |
| `src/components/form-controls/index.ts` | Namespace + named + type exports |
| `src/stories/form-controls/form-controls.stories.tsx` | Storybook playground |
| `src/stories/form-controls/form-controls.docs.mdx` | Storybook docs (update if present) |
| `docs/FormControls.md` | Public FormControls doc |
| `llms.txt` | Index + MenuList distinction |
| `CHANGELOG.md` | Unreleased entry |
| `docs/superpowers/specs/2026-08-06-segmented-control-design.md` | Approved design (written 2026-08-06; do not recreate) |

**Reference implementations to copy patterns from:**

- State / a11y / E2E: `src/components/form-controls/Radio.tsx` (`toKey`, controlled detect, fieldset, radiogroup, required on first enabled)
- Contiguous shell / dividers: Stepper styles in `FormControls.module.scss` (`.cp-stepper-shell`, `.cp-stepper-divider`)
- Test style: `src/components/form-controls/ColorPicker.test.tsx`

---

### Task 1: Failing tests (TDD)

**Files:**

- Create: `src/components/form-controls/SegmentedControl.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SegmentedControl from "./SegmentedControl";

const baseOptions = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
] as const;

describe("SegmentedControl", () => {
  it("renders legend and segments from options", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        options={[...baseOptions]}
        dataTestId="view"
      />,
    );
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByTestId("view-options")).toHaveAttribute(
      "role",
      "radiogroup",
    );
    expect(screen.getByTestId("view-input-day")).toBeInTheDocument();
    expect(screen.getByTestId("view-label-week")).toBeInTheDocument();
  });

  it("fires onChange with next value in controlled mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="View"
        name="view"
        value="day"
        onChange={onChange}
        options={[...baseOptions]}
        dataTestId="view"
      />,
    );
    await user.click(screen.getByTestId("view-label-week"));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toBe("week");
  });

  it("does not clear selection when re-clicking the selected segment", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="View"
        name="view"
        value="week"
        onChange={onChange}
        options={[...baseOptions]}
        dataTestId="view"
      />,
    );
    await user.click(screen.getByTestId("view-label-week"));
    expect(screen.getByTestId("view-input-week")).toBeChecked();
    // Native radios typically do not fire change when already selected
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports uncontrolled defaultValue", async () => {
    const user = userEvent.setup();
    render(
      <SegmentedControl
        label="View"
        name="view"
        defaultValue="day"
        options={[...baseOptions]}
        dataTestId="view"
      />,
    );
    expect(screen.getByTestId("view-input-day")).toBeChecked();
    await user.click(screen.getByTestId("view-label-month"));
    expect(screen.getByTestId("view-input-month")).toBeChecked();
  });

  it("disables all segments when isDisabled", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        isDisabled
        options={[...baseOptions]}
        dataTestId="view"
      />,
    );
    expect(screen.getByTestId("view-input-day")).toBeDisabled();
    expect(screen.getByTestId("view-input-week")).toBeDisabled();
  });

  it("disables a single option", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        options={[
          { label: "Day", value: "day" },
          { label: "Week", value: "week", isDisabled: true },
        ]}
        dataTestId="view"
      />,
    );
    expect(screen.getByTestId("view-input-day")).not.toBeDisabled();
    expect(screen.getByTestId("view-input-week")).toBeDisabled();
  });

  it("marks required on legend and first enabled input", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        isRequired
        options={[
          { label: "Day", value: "day", isDisabled: true },
          { label: "Week", value: "week" },
        ]}
        dataTestId="view"
      />,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByTestId("view-input-week")).toBeRequired();
  });

  it("exposes error message with alert role", () => {
    render(
      <SegmentedControl
        label="View"
        name="view"
        error="Pick a view"
        options={[...baseOptions]}
        dataTestId="view"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Pick a view");
  });

  it("uses ariaLabel for icon-only segments", () => {
    render(
      <SegmentedControl
        label="Align"
        name="align"
        options={[
          {
            value: "left",
            icon: <span data-testid="icon-left" />,
            ariaLabel: "Align left",
          },
          {
            value: "right",
            icon: <span data-testid="icon-right" />,
            ariaLabel: "Align right",
          },
        ]}
        dataTestId="align"
      />,
    );
    expect(screen.getByTestId("align-input-left")).toHaveAccessibleName(
      "Align left",
    );
  });

  it("applies small size class on the field", () => {
    const { container } = render(
      <SegmentedControl
        label="View"
        name="view"
        size="small"
        options={[...baseOptions]}
      />,
    );
    expect(
      container.querySelector("[class*='cp-segmented-control--small']"),
    ).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- SegmentedControl
```

Expected: FAIL — `SegmentedControl` module not found / cannot resolve.

- [ ] **Step 3: Commit** (only if the user asked for commits)

```bash
git add src/components/form-controls/SegmentedControl.test.tsx
git commit -m "$(cat <<'EOF'
test: add failing SegmentedControl coverage

EOF
)"
```

---

### Task 2: Component implementation

**Files:**

- Create: `src/components/form-controls/SegmentedControl.tsx`
- Modify: `src/components/form-controls/index.ts`

**Interfaces:**

- Consumes: `FormFieldMargin`, `DEFAULT_FORM_FIELD_MARGIN`, `getFormFieldMarginClass` from `./form-field-margin`; `getClassNames`; `FormControls.module.scss`
- Produces: default export `SegmentedControl`; types `SegmentedControlProps`, `SegmentedControlOption`, `SegmentedControlValue`, `SegmentedControlSize`

- [ ] **Step 1: Implement `SegmentedControl.tsx`**

Follow `Radio.tsx` structure:

- `toKey` / `segmentedFieldTestId` helpers (same as Radio’s `toKey` / `radioFieldTestId`)
- Controlled when `value !== undefined`
- Fieldset + legend + radiogroup track
- Map options → visually hidden radio + label segment
- Segment content order: `icon` (aria-hidden) then visible `label` text
- Accessible name: if `ariaLabel` set, put `aria-label={ariaLabel}` on the input; if icon-only and no `ariaLabel`, still set something documentable — prefer requiring `ariaLabel` per spec
- Size classes: `cp-segmented-control--small` | `cp-segmented-control--medium`
- Root classes: `cp-form-field`, `cp-segmented-control-field`, fluid + margin helpers
- Error block identical to Radio (`role="alert"`, `cp-form-error-message`)
- Do **not** implement click-to-deselect logic

Skeleton (complete against Radio; adjust class names for segmented chrome):

```tsx
import React, { useId, useState } from "react";
import styles from "./FormControls.module.scss";
import {
  DEFAULT_FORM_FIELD_MARGIN,
  getFormFieldMarginClass,
  type FormFieldMargin,
} from "./form-field-margin";
import getClassNames from "../../utils/get-class-names";

export type SegmentedControlValue = string | number;
export type SegmentedControlSize = "small" | "medium";

export interface SegmentedControlOption {
  label?: string;
  value: SegmentedControlValue;
  icon?: React.ReactNode;
  ariaLabel?: string;
  isDisabled?: boolean;
  dataTestId?: string;
  id?: string;
}

export interface SegmentedControlProps {
  options: [SegmentedControlOption, ...SegmentedControlOption[]];
  name: string;
  label: string;
  id?: string;
  value?: SegmentedControlValue;
  defaultValue?: SegmentedControlValue;
  onChange?: (
    value: SegmentedControlValue,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  size?: SegmentedControlSize;
  isDisabled?: boolean;
  isRequired?: boolean;
  isFluid?: boolean;
  error?: string;
  margin?: FormFieldMargin;
  className?: string;
  dataTestId?: string;
}

// Implement body mirroring Radio.tsx with segmented track markup.
```

- [ ] **Step 2: Export from `index.ts`**

Add to default namespace object, named exports, and type exports:

```ts
import SegmentedControl from "./SegmentedControl";

// in default object:
SegmentedControl,

// named:
export { ..., SegmentedControl };

export type {
  SegmentedControlProps,
  SegmentedControlOption,
  SegmentedControlValue,
  SegmentedControlSize,
} from "./SegmentedControl";
```

- [ ] **Step 3: Commit** (if user requested)

```bash
git add src/components/form-controls/SegmentedControl.tsx src/components/form-controls/index.ts
git commit -m "$(cat <<'EOF'
feat: add FormControls.SegmentedControl component shell

EOF
)"
```

---

### Task 3: Styles

**Files:**

- Modify: `src/components/form-controls/FormControls.module.scss`

- [ ] **Step 1: Add `.cp-segmented-control-field` block**

Requirements from spec:

- Track: flex row, border, `border-radius: var(--cp-form-control-radius)`, overflow hidden
- Segments: `flex: 1`, equal width; internal hairline dividers
- Selected (`input:checked + label` or equivalent sibling pattern): `--primary-brand` fill + high-contrast text/icon
- Hover on enabled unselected
- Focus-visible outline on segment (`2px solid var(--primary-brand); outline-offset: 2px`)
- Disabled opacity ~0.45
- Invalid: `data-invalid="true"` red border/outline
- `--small` / `--medium` height/padding/font (medium ≈ form control ~50px)
- Visually hide native radio (reuse `.cp-visually-hidden`)
- Do not invent new public CSS variables

Place styles near other form-control field blocks; keep `cp-` naming.

- [ ] **Step 2: Run tests**

```bash
npm test -- SegmentedControl
```

Expected: PASS (adjust selectors/classes if size-class assertion needs the exact CSS module local name pattern used in the repo).

- [ ] **Step 3: Commit** (if user requested)

```bash
git add src/components/form-controls/FormControls.module.scss src/components/form-controls/SegmentedControl.tsx
git commit -m "$(cat <<'EOF'
style: add SegmentedControl track and segment states

EOF
)"
```

---

### Task 4: Storybook + public docs

**Files:**

- Modify: `src/stories/form-controls/form-controls.stories.tsx`
- Modify: `src/stories/form-controls/form-controls.docs.mdx` (if present)
- Modify: `docs/FormControls.md`
- Modify: `llms.txt`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add stories**

Follow existing FormControls story patterns (`useArgs` for controlled value):

- Text-only (Day/Week/Month)
- Icon + label
- Icon-only
- `size="small"` vs `medium`
- `isFluid`
- Disabled / required / error
- Optionally add to `AllControls` composition story

- [ ] **Step 2: Update `docs/FormControls.md`**

- Add row to controls overview table
- Props / option types / examples
- E2E suffix table (same as Radio)
- When-to-use: vs Radio, Checkbox, MenuList
- Guidance: 2–5 segments; content consistency; not for top-level nav

- [ ] **Step 3: Update `llms.txt`**

- List `SegmentedControl` under FormControls
- Note: tabs/nav → MenuList; compact form single-select → SegmentedControl

- [ ] **Step 4: `CHANGELOG.md`**

Under Unreleased:

```md
- Added `FormControls.SegmentedControl` (single-select equal-width segments; label and/or icon).
```

- [ ] **Step 5: Commit** (if user requested)

```bash
git add src/stories/form-controls docs/FormControls.md llms.txt CHANGELOG.md
git commit -m "$(cat <<'EOF'
docs: document FormControls.SegmentedControl

EOF
)"
```

---

### Task 5: Verify

- [ ] **Step 1: Run unit tests**

```bash
npm test -- SegmentedControl
```

Expected: all PASS.

- [ ] **Step 2: Visual smoke (Storybook)**

```bash
npm run storybook
```

Check: equal widths, selected contrast, focus ring, small vs medium, disabled/error, icon-only names via a11y tree if available.

- [ ] **Step 3: Spec coverage checklist**

Confirm each spec section has a corresponding deliverable:

- Single-select / no deselect → tests
- Equal width / sizes / tokens → SCSS
- A11y fieldset/radiogroup → component + tests
- E2E suffixes → component + tests
- Docs vs MenuList/Radio → FormControls.md + llms.txt
- Out of v1 items absent from API

---

## Execution notes

- Do not add multi-select, vertical orientation, or compound `.Item` in this plan.
- Prefer copying Radio helpers over inventing new ID/test-id schemes.
- Commit only when the user explicitly asks.
