# Small field label and trigger icon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On `size="small"` form controls, field labels are 12px and trigger icons are 20px; multi-select chip close icons are white, and the selected-option check is centered in its circle.

**Architecture:** Size stays on the existing field classes. `--cp-form-label-font` drives `.cp-form-label`. `--cp-form-control-icon` becomes 20px on small, and trigger rules use a three-class selector so they beat `Icon`'s `.cp-icon.cp-icon--medium` (24px) and `.cp-icon.cp-icon--small` (16px). Chip color and the check circle are local Select style fixes. CSS module names are unhashed `[local]`, so `.cp-icon` in `FormControls.module.scss` matches the class from `Icon.module.css`.

**Tech Stack:** React, TypeScript, SCSS modules, Vitest, Testing Library.

## Global Constraints

- Small label: `var(--cp-font-size-xs)` (12px). Default, medium, and large labels: `var(--font-size)` (16px).
- Small control value type stays 14px (`--cp-form-control-font`).
- Small trigger icon: 20px. Medium stays 20px. Large stays 24px.
- Do not set a new line-height on `.cp-form-label`.
- `.cp-form-label-inline` keeps `font-size: inherit`. Segment option text keeps `font-size: var(--cp-form-control-font)`.
- Color-picker channel labels stay 12px on `.cp-color-picker-channel-field .cp-form-label`.
- Panel and option icons stay as they are: date picker header, panel back arrows, select option icons, file list icons, file card upload glyph.
- `Icon` public sizes stay 16 / 24 / 36. 20px is the form-control token only.
- No new public prop or class.
- Chip remove glyph: `var(--white)` at rest, `var(--primary-brand)` on hover. Chip fill, size, and hit target stay as they are.
- Selected `done` glyph: 16px, white, centered in the existing 22px `--primary-brand` circle with a white border.

---

### Task 1: Small field label token

**Files:**
- Modify: `src/components/form-controls/FormControls.module.scss` (field size blocks and `.cp-form-label`)
- Modify: `src/components/filter-bar/FilterBar.module.scss` (`.cp-filter-bar__button-label`)
- Modify: `docs/FormControls.md` (Sizes section)
- Test: `src/components/form-controls/small-field-label.test.ts`

**Interfaces:**
- Consumes: existing classes `.cp-form-field`, `.cp-form-field--small`, `.cp-form-field--medium`, `.cp-form-field--large`, `.cp-form-label`, `.cp-filter-bar__button-label`
- Produces: custom property `--cp-form-label-font` on those field classes. `.cp-form-label` reads `font-size: var(--cp-form-label-font, var(--font-size))`.

- [ ] **Step 1: Write the failing test**

Create `src/components/form-controls/small-field-label.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const formScss = readFileSync(
  resolve("src/components/form-controls/FormControls.module.scss"),
  "utf8",
);
const filterScss = readFileSync(
  resolve("src/components/filter-bar/FilterBar.module.scss"),
  "utf8",
);
const docs = readFileSync(resolve("docs/FormControls.md"), "utf8");

describe("small field label size", () => {
  it("sets a 12px label token on small fields and 16px otherwise", () => {
    expect(formScss).toMatch(
      /\.cp-form-field--small\s*\{[^}]*--cp-form-label-font:\s*var\(--cp-font-size-xs\)/,
    );
    expect(formScss).toMatch(
      /\.cp-form-field--medium\s*\{[^}]*--cp-form-label-font:\s*var\(--font-size\)/,
    );
    expect(formScss).toMatch(
      /\.cp-form-field--large\s*\{[^}]*--cp-form-label-font:\s*var\(--font-size\)/,
    );
    expect(formScss).toMatch(
      /\.cp-form-label\s*\{[^}]*font-size:\s*var\(--cp-form-label-font,\s*var\(--font-size\)\)/,
    );
  });

  it("matches the filter bar spacer to the small label box", () => {
    expect(filterScss).toMatch(
      /\.cp-filter-bar__button-label\s*\{[^}]*font-size:\s*var\(--cp-font-size-xs\)/,
    );
    expect(filterScss).toMatch(
      /\.cp-filter-bar__button-label\s*\{[^}]*line-height:\s*1;/,
    );
  });

  it("documents scaled labels", () => {
    expect(docs).toContain("12px on small");
    expect(docs).not.toContain("Field labels (`.cp-form-label`) do not scale.");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/form-controls/small-field-label.test.ts`

Expected: FAIL. The small-field block has no `--cp-form-label-font`.

- [ ] **Step 3: Write minimal implementation**

In `src/components/form-controls/FormControls.module.scss`, add the token to each field block:

```scss
.cp-form-field {
  --cp-form-control-height: var(--cp-form-control-height-medium);
  --cp-form-control-radius: var(--cp-form-control-radius-medium);
  --cp-form-control-font: 16px;
  --cp-form-label-font: var(--font-size);
  --cp-form-control-pad-x: 16px;
  --cp-form-control-icon: 20px;
  --cp-form-control-textarea-min: 88px;
  /* existing properties stay */
}

.cp-form-field--small {
  --cp-form-control-height: var(--cp-form-control-height-small);
  --cp-form-control-radius: var(--cp-form-control-radius-small);
  --cp-form-control-font: 14px;
  --cp-form-label-font: var(--cp-font-size-xs);
  --cp-form-control-pad-x: 12px;
  --cp-form-control-icon: 16px;
  --cp-form-control-textarea-min: 72px;
}

.cp-form-field--medium {
  --cp-form-control-height: var(--cp-form-control-height-medium);
  --cp-form-control-radius: var(--cp-form-control-radius-medium);
  --cp-form-control-font: 16px;
  --cp-form-label-font: var(--font-size);
  --cp-form-control-pad-x: 16px;
  --cp-form-control-icon: 20px;
  --cp-form-control-textarea-min: 88px;
}

.cp-form-field--large {
  --cp-form-control-height: var(--cp-form-control-height-large);
  --cp-form-control-radius: var(--cp-form-control-radius-large);
  --cp-form-control-font: 16px;
  --cp-form-label-font: var(--font-size);
  --cp-form-control-pad-x: 20px;
  --cp-form-control-icon: 24px;
  --cp-form-control-textarea-min: 104px;
}
```

Leave `--cp-form-control-icon: 16px` on small for this task. Task 2 changes it to 20px.

`.cp-form-label`:

```scss
.cp-form-label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-subtle);
  font-size: var(--cp-form-label-font, var(--font-size));
}
```

Do not add `line-height` here. `.cp-form-label-inline` stays `font-size: inherit`.

In `src/components/filter-bar/FilterBar.module.scss`:

```scss
.cp-filter-bar__button-label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--cp-font-size-xs);
  line-height: 1;
  color: transparent;
  user-select: none;
}
```

In `docs/FormControls.md`, replace only the label sentence. Leave the glyph sentence for Task 2.

Replace `Field labels (`.cp-form-label`) do not scale.` with `Field labels (`.cp-form-label`) use `--cp-form-label-font`: 12px on small, 16px on medium and large.`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/form-controls/small-field-label.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/form-controls/FormControls.module.scss src/components/form-controls/small-field-label.test.ts src/components/filter-bar/FilterBar.module.scss docs/FormControls.md docs/superpowers/specs/2026-09-24-small-field-label-design.md
git commit -m "fix: scale small field labels to 12px"
```

---

### Task 2: Small trigger icons at 20px

**Files:**
- Modify: `src/components/form-controls/FormControls.module.scss` (small icon token and trigger icon selectors)
- Test: `src/components/form-controls/small-field-label.test.ts`

**Interfaces:**
- Consumes: `--cp-form-control-icon` from Task 1
- Produces: small fields set `--cp-form-control-icon: 20px`. Trigger glyph rules use three class selectors so they override `.cp-icon.cp-icon--medium` and `.cp-icon.cp-icon--small`.

- [ ] **Step 1: Write the failing test**

Append to the `describe` in `src/components/form-controls/small-field-label.test.ts`:

```ts
it("sets small trigger icons to 20px with a selector that beats Icon sizes", () => {
  expect(formScss).toMatch(
    /\.cp-form-field--small\s*\{[^}]*--cp-form-control-icon:\s*20px/,
  );
  expect(formScss).toContain(".cp-select-field-arrow.cp-icon.cp-icon");
  expect(formScss).toContain(".cp-input-search-clear .cp-icon.cp-icon");
  expect(formScss).toContain(".cp-stepper-btn .cp-icon.cp-icon");
  expect(formScss).toContain(".cp-file-trigger-button .cp-icon.cp-icon");
  expect(formScss).toContain(".cp-select-trigger-clear .cp-icon.cp-icon");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/form-controls/small-field-label.test.ts`

Expected: FAIL. Small icon token is `16px`, and the doubled `.cp-icon.cp-icon` selectors are absent.

- [ ] **Step 3: Write minimal implementation**

Change only the small block's icon token:

```scss
.cp-form-field--small {
  --cp-form-control-icon: 20px;
}
```

Medium stays `20px`. Large stays `24px`.

Raise these existing rules from two classes to three. Keep every other declaration in the rule.

Search icon (already three classes via the wrapper; leave it):

```scss
.cp-input-search-wrapper .cp-input-search-icon.cp-icon {
  font-size: var(--cp-form-control-icon);
}
```

Search clear, inside `.cp-input-search-clear`:

```scss
.cp-icon.cp-icon {
  font-size: var(--cp-form-control-icon);
}
```

The compiled selector is `.cp-input-search-clear .cp-icon.cp-icon`.

Stepper, inside `.cp-stepper-btn`:

```scss
.cp-icon.cp-icon {
  font-size: var(--cp-form-control-icon);
  color: inherit;
}
```

Select, date, and color-picker trigger glyphs:

```scss
.cp-select-field-arrow.cp-icon.cp-icon {
  margin-left: 8px;
  font-size: var(--cp-form-control-icon);
  line-height: 1;
  color: var(--text-muted);
}
```

Trigger clear (select, date, color picker share `.cp-select-trigger-clear`). Add inside that rule:

```scss
.cp-icon.cp-icon {
  font-size: var(--cp-form-control-icon);
}
```

File button, inside `.cp-file-field`:

```scss
.cp-file-trigger-button .cp-icon.cp-icon {
  font-size: var(--cp-form-control-icon);
}
```

Do not change date-picker header icons, panel back arrows, select option icons, file list icons, or `.cp-file-trigger-card` upload glyph.

In `docs/FormControls.md`, replace `scale 16 / 20 / 24` with `scale 20 / 20 / 24`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/form-controls/small-field-label.test.ts src/components/form-controls/boxed-size.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/form-controls/FormControls.module.scss src/components/form-controls/small-field-label.test.ts docs/FormControls.md
git commit -m "fix: size small form trigger icons at 20px"
```

---

### Task 3: Chip remove color and selected check position

**Files:**
- Modify: `src/components/form-controls/Select.tsx` (chip remove `Icon`, around the `Remove ${opt.label}` button)
- Modify: `src/components/form-controls/FormControls.module.scss` (`.cp-select-chip-remove`, `.cp-select-field-option-selected`)
- Test: `src/components/form-controls/select-chip-check.test.tsx`

**Interfaces:**
- Consumes: `Select` multi `value` as `Option[]`. Chip remove button `aria-label` is ``Remove ${label}``. Selected row renders `<Icon name="done" className={styles["cp-select-field-option-selected"]} />`.
- Produces: chip close icon has no `color` prop. `.cp-select-chip-remove .cp-icon.cp-icon` is white, and brand green on hover. `.cp-select-field-option-trailing .cp-select-field-option-selected.cp-icon` is a centered 16px glyph.

- [ ] **Step 1: Write the failing test**

Create `src/components/form-controls/select-chip-check.test.tsx`:

```tsx
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
      <Select label="Owner" mode="multi" options={options} onChange={() => {}} />,
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
```

`mode="multi"` is the prop that shows chips. The chip button name stays `Remove Leo`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/form-controls/select-chip-check.test.tsx`

Expected: FAIL. The remove icon has class `cp-icon--gray`. The check rule is a single class at `font-size: 16px` without `inline-flex`, so the source assertions fail.

- [ ] **Step 3: Write minimal implementation**

In `src/components/form-controls/Select.tsx`, change the chip icon to:

```tsx
<Icon name="close" size="small" />
```

Remove `color="gray"` only. Leave `size="small"`.

Replace `.cp-select-chip-remove` color rules with:

```scss
.cp-select-chip-remove {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--white);
  cursor: pointer;
  line-height: 1;
  border-radius: var(--radius-round);

  .cp-icon.cp-icon {
    line-height: 1;
    color: var(--white);
  }

  &:hover:not(:disabled) {
    background: var(--white);

    .cp-icon.cp-icon {
      color: var(--primary-brand);
    }
  }
}
```

Replace `.cp-select-field-option-selected` with a selector that beats `.cp-icon.cp-icon--medium`:

```scss
.cp-select-field-option-trailing .cp-select-field-option-selected.cp-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-brand);
  color: var(--white);
  height: 22px;
  width: 22px;
  line-height: 1;
  font-size: 16px;
  border-radius: var(--radius-round);
  border: 1px solid var(--white);
}
```

Delete the old one-class `.cp-select-field-option-selected` block so the 24px Icon size cannot tie with it.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/form-controls/select-chip-check.test.tsx src/components/form-controls/small-field-label.test.ts src/components/form-controls/boxed-size.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/form-controls/Select.tsx src/components/form-controls/FormControls.module.scss src/components/form-controls/select-chip-check.test.tsx
git commit -m "fix: color select chip remove icons and center the selected check"
```
