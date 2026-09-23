# FilterBar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Cloud agent:** This plan is executed on a feature branch, not on `main`. Complete Task 0 before Task 1. After Task 6, complete Task 7: push the branch and open a pull request into `main` whose body shows a screenshot of the FilterBar playground. Do not push to `main`.

**Goal:** Ship `FilterBar`, a controlled toolbar of search, select, multi-select, and date-range fields that reports values for the app to apply to table rows.

**Architecture:** Pure helpers in `filter-bar-model.ts` own empty values, the active count, draft equality, and date-range checks. `FilterBar` renders `Input`, `Select`, and `Date` at `size="small"`. Bar fields call `onChange` immediately. Drawer fields edit a draft inside the existing `Drawer` until Apply. `Drawer` gains `isPrimaryButtonDisabled` so an inverted range can disable Apply.

**Tech Stack:** React 18, TypeScript, SCSS modules, Vitest, `@testing-library/react`, `@testing-library/user-event`, Storybook 10, the html-to-jsx converter.

**Spec:** `docs/superpowers/specs/2026-09-24-filter-bar-design.md`

## Branch and pull request

Cloud agents follow this. Local agents follow it too when the work should be reviewed before it lands.

- Branch name: `feat/filter-bar`, created from `main` in Task 0, before any implementation commit.
- Every task commit from Task 1 through Task 6 lands on `feat/filter-bar`. Do not commit this work on `main`.
- Do not stage unrelated files. In particular, leave `.gitignore` and `.superpowers/` out of these commits.
- Task 7 pushes `feat/filter-bar` and opens a pull request whose base is `main`.
- The pull request body must show a screenshot of the FilterBar playground. Use the desktop Playwright snapshot committed in Task 6. Embed it as an image, not only as a file link, so the picture is visible in the pull request description.

## Global Constraints

- `FilterBar` does not receive row data and does not filter rows.
- `onChange` receives a new object: the previous `values`, with the changed keys replaced. Keys the app included are preserved.
- Field types are only `search`, `select`, `multiSelect`, and `dateRange`.
- Every field renders at `size="small"`. Size is not a prop.
- Copy is fixed English: button `Filters` or `Filters {n}`, drawer title `Filters`, footer `Clear` then `Apply`, date labels `{label} from` and `{label} to`, error `From must be on or before To`.
- Drawer placement is `right`. Under 768px the existing Drawer bottom sheet is unchanged.
- No debounce, no URL sync, no custom field type.
- A missing `values` key is empty: `""`, `null`, `[]`, or `{ from: null, to: null }`.
- Date comparison uses the local calendar day (`getFullYear`, `getMonth`, `getDate`). Time of day is ignored. Same calendar day is valid.
- Select multi mode is `mode="multi"` (the Select prop). Do not invent a `multiple` prop.
- Public classes stay unhashed: `cp-filter-bar`, `cp-filter-bar__fields`, `cp-filter-bar__button`.

---

## File structure

| Path | Role |
|------|------|
| `src/components/filter-bar/filter-bar-types.ts` | Public field and value types |
| `src/components/filter-bar/filter-bar-model.ts` | Empty values, activity, equality, date checks, dedupe |
| `src/components/filter-bar/filter-bar-model.test.ts` | Unit tests for the model |
| `src/components/filter-bar/FilterBar.tsx` | Toolbar, draft, drawer |
| `src/components/filter-bar/FilterBar.module.scss` | Bar row, date pair, drawer stack |
| `src/components/filter-bar/FilterBar.test.tsx` | Component behavior |
| `src/components/filter-bar/index.ts` | Barrel |
| `src/components/drawer/Drawer.tsx` | `isPrimaryButtonDisabled` |
| `src/html-to-jsx/filter-bar-convert.ts` | HTML children → `fields` array |
| `docs/FilterBar.md` | Public doc and HTML prototype |
| `src/stories/filter-bar/filter-bar.stories.tsx` | Playground that filters a sample table |
| `src/stories/filter-bar/filter-bar.docs.mdx` | Storybook doc page |

---

### Task 0: Create the feature branch

Do this before Task 1. No implementation files change in this task.

- [ ] **Step 1: Branch from main**

```bash
git checkout main
git pull origin main
git checkout -b feat/filter-bar
```

Expected: `git status` shows `On branch feat/filter-bar`. Later task commits stay on this branch.

- [ ] **Step 2: Confirm the branch is not main**

```bash
git branch --show-current
```

Expected: `feat/filter-bar`

---

### Task 1: Disable the Drawer primary button

**Files:**
- Modify: `src/components/drawer/Drawer.tsx`
- Modify: `src/components/drawer/Drawer.test.tsx`
- Modify: `docs/Drawer.md`
- Modify: `src/html-to-jsx/component-manifest.json` (`Drawer.props`)

**Interfaces:**
- Consumes: existing `primaryButtonLabel` / `onPrimaryButtonClick` footer button.
- Produces: `isPrimaryButtonDisabled?: boolean` on `DrawerProps`. Default `false`. When `true`, the primary footer `Button` receives `isDisabled`.

- [ ] **Step 1: Write the failing test**

Add this test inside the existing `describe("Drawer")` in `src/components/drawer/Drawer.test.tsx`:

```tsx
it("disables the primary footer button when isPrimaryButtonDisabled is set", async () => {
  const user = userEvent.setup();
  const onPrimaryButtonClick = vi.fn();

  render(
    <Drawer
      isOpen
      title="Settings"
      dataTestId="settings-drawer"
      primaryButtonLabel="Save"
      onPrimaryButtonClick={onPrimaryButtonClick}
      isPrimaryButtonDisabled
    >
      Body
    </Drawer>,
  );

  const primary = screen.getByTestId("settings-drawer-primary");
  expect(primary).toBeDisabled();
  await user.click(primary);
  expect(onPrimaryButtonClick).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/drawer/Drawer.test.tsx -t "disables the primary footer button"`

Expected: FAIL because `isPrimaryButtonDisabled` is not a Drawer prop.

- [ ] **Step 3: Implement the prop**

In `DrawerProps`, after `onPrimaryButtonClick`:

```ts
/** When true, the primary footer button is disabled. Default false. */
isPrimaryButtonDisabled?: boolean;
```

Destructure `isPrimaryButtonDisabled = false`. Pass it in the `emitDataCp` props object, and add `isPrimaryButtonDisabled: false` to that call's defaults object.

On the primary footer `Button`, add `isDisabled={isPrimaryButtonDisabled}`.

- [ ] **Step 4: Document the prop**

In `docs/Drawer.md`, add a row to the props table after `onPrimaryButtonClick`:

| `isPrimaryButtonDisabled` | `boolean` | no | `false` | When true, the primary footer button is disabled. |

Add `isPrimaryButtonDisabled?: boolean;` to the `DrawerProps` block in that doc, after `onPrimaryButtonClick`.

In `src/html-to-jsx/component-manifest.json`, inside `Drawer.props`, add:

```json
"isPrimaryButtonDisabled": { "type": "boolean", "default": false }
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/drawer/Drawer.test.tsx -t "disables the primary footer button"`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/drawer/Drawer.tsx src/components/drawer/Drawer.test.tsx docs/Drawer.md src/html-to-jsx/component-manifest.json
git commit -m "feat(drawer): disable the primary footer button"
```

---

### Task 2: Filter value model

**Files:**
- Create: `src/components/filter-bar/filter-bar-types.ts`
- Create: `src/components/filter-bar/filter-bar-model.ts`
- Create: `src/components/filter-bar/filter-bar-model.test.ts`

**Interfaces:**
- Consumes: `Option` from `src/components/form-controls/Select.tsx`. `SpacingOption` from `src/constants/common` (`SPACING_OPTIONS`).
- Produces: the types and functions below. Later tasks import these names exactly.

```ts
export type FilterBarPlacement = "bar" | "drawer";

export interface FilterBarFieldBase {
  id: string;
  label: string;
  placement: FilterBarPlacement;
}

export interface FilterBarSearchField extends FilterBarFieldBase {
  type: "search";
  placeholder?: string;
}

export interface FilterBarSelectField extends FilterBarFieldBase {
  type: "select";
  options: Option[];
}

export interface FilterBarMultiSelectField extends FilterBarFieldBase {
  type: "multiSelect";
  options: Option[];
}

export interface FilterBarDateRangeField extends FilterBarFieldBase {
  type: "dateRange";
}

export type FilterBarField =
  | FilterBarSearchField
  | FilterBarSelectField
  | FilterBarMultiSelectField
  | FilterBarDateRangeField;

export interface FilterBarDateRangeValue {
  from: Date | null;
  to: Date | null;
}

export type FilterBarFieldValue =
  | string
  | Option
  | null
  | Option[]
  | FilterBarDateRangeValue;

export type FilterBarValues = Record<string, FilterBarFieldValue>;

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type FilterBarMargin = string | SpacingOption[];

export interface FilterBarProps {
  fields: FilterBarField[];
  values: FilterBarValues;
  onChange: (values: FilterBarValues) => void;
  className?: string;
  margin?: FilterBarMargin;
  dataTestId?: string;
}
```

```ts
export const DATE_RANGE_ERROR = "From must be on or before To";

export function emptyValue(field: FilterBarField): FilterBarFieldValue
export function readValue(field: FilterBarField, values: FilterBarValues): FilterBarFieldValue
export function isCalendarDayAfter(from: Date, to: Date): boolean
export function sameCalendarDay(a: Date | null, b: Date | null): boolean
export function isDateRangeInvalid(value: FilterBarDateRangeValue): boolean
export function isFieldActive(field: FilterBarField, value: FilterBarFieldValue): boolean
export function activeDrawerCount(fields: FilterBarField[], values: FilterBarValues): number
export function drawerDraftEqualsCommitted(fields: FilterBarField[], committed: FilterBarValues, draft: FilterBarValues): boolean
export function dedupeFields(fields: FilterBarField[]): { fields: FilterBarField[]; duplicateIds: string[] }
export function withFieldValue(values: FilterBarValues, id: string, next: FilterBarFieldValue): FilterBarValues
```

- [ ] **Step 1: Write the failing tests**

Create `src/components/filter-bar/filter-bar-model.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { FilterBarField } from "./filter-bar-types";
import {
  DATE_RANGE_ERROR,
  activeDrawerCount,
  dedupeFields,
  drawerDraftEqualsCommitted,
  emptyValue,
  isDateRangeInvalid,
  isFieldActive,
  readValue,
  withFieldValue,
} from "./filter-bar-model";

const search: FilterBarField = { id: "q", type: "search", label: "Search", placement: "bar" };
const status: FilterBarField = {
  id: "status",
  type: "select",
  label: "Status",
  placement: "bar",
  options: [{ value: "active", label: "Active" }],
};
const owner: FilterBarField = {
  id: "owner",
  type: "multiSelect",
  label: "Owner",
  placement: "drawer",
  options: [{ value: "asha", label: "Asha" }],
};
const due: FilterBarField = { id: "due", type: "dateRange", label: "Due", placement: "drawer" };

describe("filter-bar model", () => {
  it("uses an empty value when the key is missing", () => {
    expect(readValue(search, {})).toBe("");
    expect(readValue(status, {})).toBeNull();
    expect(readValue(owner, {})).toEqual([]);
    expect(readValue(due, {})).toEqual({ from: null, to: null });
  });

  it("returns the stored value when the key is present", () => {
    expect(readValue(search, { q: "bill" })).toBe("bill");
  });

  it("treats a non-empty search string as active, including whitespace", () => {
    expect(isFieldActive(search, "")).toBe(false);
    expect(isFieldActive(search, " ")).toBe(true);
  });

  it("counts a date range as one active drawer field when either end is set", () => {
    expect(activeDrawerCount([owner, due], { owner: [], due: { from: null, to: null } })).toBe(0);
    expect(
      activeDrawerCount([owner, due], {
        owner: [{ value: "asha", label: "Asha" }],
        due: { from: new Date(2026, 7, 1), to: null },
      }),
    ).toBe(2);
  });

  it("rejects a from day that is after to, and accepts the same calendar day", () => {
    expect(DATE_RANGE_ERROR).toBe("From must be on or before To");
    expect(
      isDateRangeInvalid({
        from: new Date(2026, 7, 14, 18, 0),
        to: new Date(2026, 7, 14, 1, 0),
      }),
    ).toBe(false);
    expect(
      isDateRangeInvalid({
        from: new Date(2026, 7, 15),
        to: new Date(2026, 7, 14),
      }),
    ).toBe(true);
    expect(isDateRangeInvalid({ from: new Date(2026, 7, 1), to: null })).toBe(false);
  });

  it("compares drawer drafts by option value and calendar day", () => {
    const committed = {
      owner: [{ value: "asha", label: "Asha" }],
      due: { from: new Date(2026, 7, 1, 8), to: null },
    };
    const same = {
      owner: [{ value: "asha", label: "Other label" }],
      due: { from: new Date(2026, 7, 1, 20), to: null },
    };
    const differentOrder = {
      owner: [
        { value: "leo", label: "Leo" },
        { value: "asha", label: "Asha" },
      ],
      due: { from: new Date(2026, 7, 1), to: null },
    };
    expect(drawerDraftEqualsCommitted([owner, due], committed, same)).toBe(true);
    expect(
      drawerDraftEqualsCommitted(
        [owner],
        { owner: [{ value: "asha", label: "Asha" }, { value: "leo", label: "Leo" }] },
        differentOrder,
      ),
    ).toBe(false);
  });

  it("keeps the first field when ids repeat", () => {
    const second = { ...search, label: "Query", placement: "drawer" as const };
    expect(dedupeFields([search, second])).toEqual({
      fields: [search],
      duplicateIds: ["q"],
    });
  });

  it("replaces one key and preserves the rest", () => {
    expect(withFieldValue({ q: "", status: null }, "q", "a")).toEqual({
      q: "a",
      status: null,
    });
    expect(emptyValue(search)).toBe("");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/filter-bar/filter-bar-model.test.ts`

Expected: FAIL with cannot find module `./filter-bar-model`.

- [ ] **Step 3: Write the types and model**

Create `src/components/filter-bar/filter-bar-types.ts` with the type block in this task's Interfaces, importing `Option` from `../form-controls/Select` and `SPACING_OPTIONS` from `../../constants/common`.

Create `src/components/filter-bar/filter-bar-model.ts`:

```ts
import type { Option } from "../form-controls/Select";
import type {
  FilterBarDateRangeValue,
  FilterBarField,
  FilterBarFieldValue,
  FilterBarValues,
} from "./filter-bar-types";

export const DATE_RANGE_ERROR = "From must be on or before To";

export function emptyValue(field: FilterBarField): FilterBarFieldValue {
  switch (field.type) {
    case "search":
      return "";
    case "select":
      return null;
    case "multiSelect":
      return [];
    case "dateRange":
      return { from: null, to: null };
  }
}

export function readValue(field: FilterBarField, values: FilterBarValues): FilterBarFieldValue {
  if (!(field.id in values) || values[field.id] === undefined) {
    return emptyValue(field);
  }
  return values[field.id];
}

export function withFieldValue(
  values: FilterBarValues,
  id: string,
  next: FilterBarFieldValue,
): FilterBarValues {
  return { ...values, [id]: next };
}

function calendarParts(date: Date): [number, number, number] {
  return [date.getFullYear(), date.getMonth(), date.getDate()];
}

export function isCalendarDayAfter(from: Date, to: Date): boolean {
  const [fromYear, fromMonth, fromDay] = calendarParts(from);
  const [toYear, toMonth, toDay] = calendarParts(to);
  if (fromYear !== toYear) return fromYear > toYear;
  if (fromMonth !== toMonth) return fromMonth > toMonth;
  return fromDay > toDay;
}

export function sameCalendarDay(a: Date | null, b: Date | null): boolean {
  if (a === null || b === null) return a === b;
  return !isCalendarDayAfter(a, b) && !isCalendarDayAfter(b, a);
}

export function isDateRangeInvalid(value: FilterBarDateRangeValue): boolean {
  if (value.from === null || value.to === null) return false;
  return isCalendarDayAfter(value.from, value.to);
}

function isOption(value: FilterBarFieldValue): value is Option {
  return value !== null && typeof value === "object" && !Array.isArray(value) && "value" in value && !("from" in value);
}

function isOptionArray(value: FilterBarFieldValue): value is Option[] {
  return Array.isArray(value);
}

function isDateRangeValue(value: FilterBarFieldValue): value is FilterBarDateRangeValue {
  return value !== null && typeof value === "object" && !Array.isArray(value) && "from" in value && "to" in value;
}

export function isFieldActive(field: FilterBarField, value: FilterBarFieldValue): boolean {
  switch (field.type) {
    case "search":
      return value !== "";
    case "select":
      return value !== null;
    case "multiSelect":
      return isOptionArray(value) && value.length > 0;
    case "dateRange":
      return isDateRangeValue(value) && (value.from !== null || value.to !== null);
  }
}

export function activeDrawerCount(fields: FilterBarField[], values: FilterBarValues): number {
  return fields.filter((field) => field.placement === "drawer" && isFieldActive(field, readValue(field, values))).length;
}

function optionValues(value: FilterBarFieldValue): Array<string | number> | null {
  if (!isOptionArray(value)) return null;
  return value.map((option) => option.value);
}

export function drawerDraftEqualsCommitted(
  fields: FilterBarField[],
  committed: FilterBarValues,
  draft: FilterBarValues,
): boolean {
  return fields
    .filter((field) => field.placement === "drawer")
    .every((field) => {
      const left = readValue(field, committed);
      const right = readValue(field, draft);
      switch (field.type) {
        case "search":
          return left === right;
        case "select": {
          if (left === null || right === null) return left === right;
          if (!isOption(left) || !isOption(right)) return false;
          return left.value === right.value;
        }
        case "multiSelect": {
          const leftValues = optionValues(left);
          const rightValues = optionValues(right);
          if (leftValues === null || rightValues === null) return false;
          if (leftValues.length !== rightValues.length) return false;
          return leftValues.every((item, index) => item === rightValues[index]);
        }
        case "dateRange": {
          if (!isDateRangeValue(left) || !isDateRangeValue(right)) return false;
          return sameCalendarDay(left.from, right.from) && sameCalendarDay(left.to, right.to);
        }
      }
    });
}

export function dedupeFields(fields: FilterBarField[]): {
  fields: FilterBarField[];
  duplicateIds: string[];
} {
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const unique: FilterBarField[] = [];
  for (const field of fields) {
    if (seen.has(field.id)) {
      if (!duplicateIds.includes(field.id)) duplicateIds.push(field.id);
      continue;
    }
    seen.add(field.id);
    unique.push(field);
  }
  return { fields: unique, duplicateIds };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/filter-bar/filter-bar-model.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/filter-bar/filter-bar-types.ts src/components/filter-bar/filter-bar-model.ts src/components/filter-bar/filter-bar-model.test.ts
git commit -m "feat(filter-bar): add filter value helpers"
```

---

### Task 3: Bar fields

**Files:**
- Create: `src/components/filter-bar/FilterBar.tsx`
- Create: `src/components/filter-bar/FilterBar.module.scss`
- Create: `src/components/filter-bar/FilterBar.test.tsx`
- Create: `src/components/filter-bar/index.ts`

**Interfaces:**
- Consumes: `FilterBarProps`, `readValue`, `withFieldValue`, `dedupeFields`, `emptyValue` from Task 2. `Input` and `Select` from `../form-controls`. `Button` from `../button`. `getSpacingClass` from `../../utils/common`. `getClassNames` from `../../utils/get-class-names`.
- Produces: default export `FilterBar`. Bar `search`, `select`, and `multiSelect` fields call `onChange` on each change. Drawer fields are not rendered yet.

- [ ] **Step 1: Write the failing tests**

Create `src/components/filter-bar/FilterBar.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectPublicClass } from "../../test/class-contract";
import FilterBar from "./FilterBar";
import type { FilterBarField, FilterBarValues } from "./filter-bar-types";

const status: FilterBarField = {
  id: "status",
  type: "select",
  label: "Status",
  placement: "bar",
  options: [
    { value: "active", label: "Active" },
    { value: "review", label: "Review" },
  ],
};

function Harness({
  fields,
  initial,
  onChange,
}: {
  fields: FilterBarField[];
  initial: FilterBarValues;
  onChange?: (values: FilterBarValues) => void;
}) {
  const [values, setValues] = useState(initial);
  return (
    <FilterBar
      fields={fields}
      values={values}
      onChange={(next) => {
        onChange?.(next);
        setValues(next);
      }}
    />
  );
}

describe("FilterBar bar", () => {
  it("calls onChange with the full values object when search changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        fields={[{ id: "q", type: "search", label: "Search", placement: "bar" }]}
        initial={{ q: "", extra: "keep" }}
        onChange={onChange}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Search" }), "a");
    expect(onChange).toHaveBeenCalledWith({ q: "a", extra: "keep" });
  });

  it("calls onChange when a bar select changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness fields={[status]} initial={{ status: null }} onChange={onChange} />);

    await user.click(screen.getByRole("combobox", { name: "Status" }));
    await user.click(await screen.findByRole("option", { name: "Active" }));
    expect(onChange).toHaveBeenCalledWith({
      status: expect.objectContaining({ value: "active", label: "Active" }),
    });
  });

  it("renders nothing when fields is empty", () => {
    const { container } = render(
      <FilterBar fields={[]} values={{}} onChange={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a missing value as empty", () => {
    render(
      <FilterBar
        fields={[{ id: "q", type: "search", label: "Search", placement: "bar" }]}
        values={{}}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Search" })).toHaveValue("");
  });

  it("renders only the first field when ids are duplicated and warns in development", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <FilterBar
        fields={[
          { id: "q", type: "search", label: "Search", placement: "bar" },
          { id: "q", type: "search", label: "Query", placement: "bar" },
        ]}
        values={{ q: "" }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Query" })).not.toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith('FilterBar: duplicate field id "q" ignored.');
    warn.mockRestore();
  });

  it("exposes the public root class and margin class", () => {
    const { container } = render(
      <FilterBar
        fields={[{ id: "q", type: "search", label: "Search", placement: "bar" }]}
        values={{ q: "" }}
        onChange={vi.fn()}
        margin="b-2"
      />,
    );
    const root = container.firstElementChild as Element;
    expectPublicClass(root, "cp-filter-bar");
    expect(root.className).toContain("cp-m-b-2");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/filter-bar/FilterBar.test.tsx`

Expected: FAIL with cannot find module `./FilterBar`.

- [ ] **Step 3: Implement the bar**

Create `src/components/filter-bar/FilterBar.tsx`:

```tsx
import React, { useEffect, useMemo } from "react";
import styles from "./FilterBar.module.scss";
import utilStyles from "../../styles/utils.module.scss";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import { Input, Select } from "../form-controls";
import type { Option } from "../form-controls/Select";
import { usePrototypeAttributes } from "../../prototype/CleanPlatePrototypeAttributes";
import { emitDataCp } from "../../prototype/emit-data-cp";
import type { FilterBarFieldValue, FilterBarProps } from "./filter-bar-types";
import { dedupeFields, readValue, withFieldValue } from "./filter-bar-model";

function controlTestId(base: string | undefined, id: string): string | undefined {
  return base ? `${base}-field-${id}` : undefined;
}

const FilterBar: React.FC<FilterBarProps> = ({
  fields,
  values,
  onChange,
  className = "",
  margin = "0",
  dataTestId,
}) => {
  const prototypeEnabled = usePrototypeAttributes();
  const dataCp = emitDataCp(prototypeEnabled, "FilterBar", { margin }, { margin: "0" });
  const { fields: uniqueFields, duplicateIds } = useMemo(() => dedupeFields(fields), [fields]);
  const duplicateKey = duplicateIds.join("\0");

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || duplicateKey.length === 0) return;
    for (const id of duplicateKey.split("\0")) {
      console.warn(`FilterBar: duplicate field id "${id}" ignored.`);
    }
  }, [duplicateKey]);

  if (uniqueFields.length === 0) return null;

  const barFields = uniqueFields.filter((field) => field.placement === "bar");
  const marginClass = getSpacingClass(margin, utilStyles, "cp-m");

  return (
    <div
      {...dataCp}
      className={getClassNames(styles["cp-filter-bar"], marginClass, className)}
      data-testid={dataTestId}
    >
      <div className={styles["cp-filter-bar__fields"]}>
        {barFields.map((field) => {
          const value = readValue(field, values);
          const testId = controlTestId(dataTestId, field.id);
          if (field.type === "search") {
            return (
              <Input
                key={field.id}
                label={field.label}
                placeholder={field.placeholder}
                size="small"
                value={typeof value === "string" ? value : ""}
                onChange={(event) => onChange(withFieldValue(values, field.id, event.target.value))}
                dataTestId={testId}
              />
            );
          }
          if (field.type === "select" || field.type === "multiSelect") {
            const multi = field.type === "multiSelect";
            const selectValue: Option | Option[] | null = multi
              ? Array.isArray(value)
                ? value
                : []
              : value !== null && !Array.isArray(value) && typeof value === "object" && "value" in value
                ? value
                : null;
            return (
              <Select
                key={field.id}
                label={field.label}
                size="small"
                mode={multi ? "multi" : "single"}
                options={field.options}
                value={selectValue}
                onChange={(next: Option | Option[] | null) =>
                  onChange(withFieldValue(values, field.id, next as FilterBarFieldValue))
                }
                dataTestId={testId}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FilterBar;
```

Create `src/components/filter-bar/FilterBar.module.scss`:

```scss
.cp-filter-bar {
  font-family: inherit;
}

.cp-filter-bar__fields {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-2);
}

.cp-filter-bar__date-range {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-2);
}

.cp-filter-bar__drawer-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);

  .cp-filter-bar__date-range {
    flex-direction: column;
    align-items: stretch;
  }
}
```

Create `src/components/filter-bar/index.ts`:

```ts
export { default } from "./FilterBar";
export type {
  FilterBarProps,
  FilterBarField,
  FilterBarFieldValue,
  FilterBarValues,
  FilterBarDateRangeValue,
  FilterBarPlacement,
  FilterBarMargin,
  SpacingOption,
} from "./filter-bar-types";
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/filter-bar/FilterBar.test.tsx src/components/filter-bar/filter-bar-model.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/filter-bar/FilterBar.tsx src/components/filter-bar/FilterBar.module.scss src/components/filter-bar/FilterBar.test.tsx src/components/filter-bar/index.ts
git commit -m "feat(filter-bar): render bar search and select fields"
```

---

### Task 4: Drawer draft

**Files:**
- Modify: `src/components/filter-bar/FilterBar.tsx`
- Modify: `src/components/filter-bar/FilterBar.test.tsx`

**Interfaces:**
- Consumes: `Drawer` default export. `activeDrawerCount`, `drawerDraftEqualsCommitted`, `emptyValue`, `readValue`, `withFieldValue`.
- Produces: Filters button, draft state, Apply / Clear / dismiss. Drawer `dataTestId` is `${dataTestId}-drawer` when `dataTestId` is set. Date-range fields are still not rendered.

- [ ] **Step 1: Write the failing tests**

Append this describe block to `FilterBar.test.tsx`. Import `fireEvent` from `@testing-library/react`.

```tsx
const owner: FilterBarField = {
  id: "owner",
  type: "multiSelect",
  label: "Owner",
  placement: "drawer",
  options: [
    { value: "asha", label: "Asha" },
    { value: "leo", label: "Leo" },
  ],
};

const team: FilterBarField = {
  id: "team",
  type: "select",
  label: "Team",
  placement: "drawer",
  options: [{ value: "core", label: "Core" }],
};

describe("FilterBar drawer", () => {
  it("hides the Filters button when every field is in the bar", () => {
    render(
      <FilterBar
        fields={[{ id: "q", type: "search", label: "Search", placement: "bar" }]}
        values={{ q: "" }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.queryByRole("button", { name: "Filters" })).not.toBeInTheDocument();
  });

  it("shows Filters or Filters N from committed drawer values", () => {
    const { rerender } = render(
      <FilterBar fields={[owner]} values={{ owner: [] }} onChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();

    rerender(
      <FilterBar
        fields={[owner, team]}
        values={{
          owner: [{ value: "asha", label: "Asha" }],
          team: { value: "core", label: "Core" },
        }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Filters 2" })).toBeInTheDocument();
  });

  it("does not call onChange until Apply, and keeps a bar edit made while open", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        fields={[
          { id: "q", type: "search", label: "Search", placement: "bar" },
          owner,
        ]}
        initial={{ q: "", owner: [] }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("combobox", { name: "Owner" }));
    await user.click(await screen.findByRole("option", { name: "Asha" }));
    expect(onChange).not.toHaveBeenCalled();

    await user.type(screen.getByRole("textbox", { name: "Search" }), "a");
    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(onChange).toHaveBeenLastCalledWith({
      q: "a",
      owner: [expect.objectContaining({ value: "asha" })],
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Apply without onChange when the draft matches", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness fields={[owner]} initial={{ owner: [] }} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("commits cleared drawer values only after Apply", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        fields={[owner]}
        initial={{ owner: [{ value: "asha", label: "Asha" }] }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filters 1" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(onChange).toHaveBeenCalledWith({ owner: [] });
  });

  it("drops the draft on close, Escape, and overlay pointerdown", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const fields = [owner];
    const initial = { owner: [] as FilterBarValues["owner"] };

    render(
      <FilterBar fields={fields} values={initial} onChange={onChange} dataTestId="filters" />,
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("combobox", { name: "Owner" }));
    await user.click(await screen.findByRole("option", { name: "Asha" }));
    await user.click(screen.getByRole("button", { name: /close drawer/i }));
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.keyboard("{Escape}");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filters" }));
    fireEvent.pointerDown(screen.getByTestId("filters-drawer-overlay"));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes and drops the draft when drawer field ids change while open", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <FilterBar fields={[owner]} values={{ owner: [] }} onChange={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(
      <FilterBar fields={[team]} values={{ team: null }} onChange={vi.fn()} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
```

Add `import { fireEvent, render, screen } from "@testing-library/react";` by replacing the existing render import.

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `npx vitest run src/components/filter-bar/FilterBar.test.tsx -t "FilterBar drawer"`

Expected: FAIL because the Filters button is missing.

- [ ] **Step 3: Add the drawer**

Extend `FilterBar.tsx`:

- Track `isOpen`, `draft: FilterBarValues`, and `openIdsRef: string | null`.
- `openDrawer` copies `readValue` for each drawer field into `draft`, stores `drawerIdsKey` on the ref, and sets `isOpen` true.
- An effect depends on `[isOpen, drawerIdsKey]`. When `isOpen` is true and `openIdsRef.current !== drawerIdsKey`, clear the ref, `setDraft({})`, and `setIsOpen(false)`. Do not close on the open itself: `openDrawer` sets the ref to the current key before `setIsOpen(true)`.
- `dismiss` sets `isOpen` false and `draft` to `{}`.
- `clearDraft` sets every drawer field in `draft` to `emptyValue(field)`.
- `apply` returns immediately when any drawer date range in the draft is invalid (no date fields exist yet, so this guard stays false). If `drawerDraftEqualsCommitted(drawerFields, values, draft)`, call `dismiss` and return. Otherwise `onChange` the latest `values` with each drawer id overwritten by its draft value (`readValue(field, draft)`), then `dismiss`.
- Render `Button` after the bar fields, inside `.cp-filter-bar__fields`, only when `drawerFields.length > 0`. `variant="outline"`, `size="small"`, `type="button"`, class `styles["cp-filter-bar__button"]`, `data-testid={dataTestId ? `${dataTestId}-button` : undefined}`. Label is `Filters` when `activeDrawerCount(drawerFields, values)` is 0, otherwise ``Filters ${count}``. `onClick={openDrawer}`.
- Render `Drawer` with `isOpen`, `onClose={dismiss}`, `title="Filters"`, `placement="right"`, `primaryButtonLabel="Apply"`, `onPrimaryButtonClick={apply}`, `secondaryButtonLabel="Clear"`, `onSecondaryButtonClick={clearDraft}`, `isPrimaryButtonDisabled={false}` for this task, and `dataTestId={dataTestId ? `${dataTestId}-drawer` : undefined}`.
- Drawer children are a `div` with class `styles["cp-filter-bar__drawer-fields"]` containing each drawer `select` and `multiSelect`. Use `isFluid`, `size="small"`, and values from `draft` via `readValue`. Their `onChange` updates `draft` only.

Use these handlers. `drawerFields` is the deduped list filtered to `placement: "drawer"`. `drawerIdsKey` is `drawerFields.map((field) => field.id).join("\0")`.

```tsx
const openIdsRef = useRef<string | null>(null);

function openDrawer() {
  const next: FilterBarValues = {};
  for (const field of drawerFields) {
    next[field.id] = readValue(field, values);
  }
  setDraft(next);
  openIdsRef.current = drawerIdsKey;
  setIsOpen(true);
}

function dismiss() {
  openIdsRef.current = null;
  setDraft({});
  setIsOpen(false);
}

function clearDraft() {
  const next: FilterBarValues = {};
  for (const field of drawerFields) {
    next[field.id] = emptyValue(field);
  }
  setDraft(next);
}

function apply() {
  if (drawerDraftEqualsCommitted(drawerFields, values, draft)) {
    dismiss();
    return;
  }
  const next = { ...values };
  for (const field of drawerFields) {
    next[field.id] = readValue(field, draft);
  }
  onChange(next);
  dismiss();
}

useEffect(() => {
  if (!isOpen) return;
  if (openIdsRef.current !== drawerIdsKey) dismiss();
}, [isOpen, drawerIdsKey]);
```

The Filters button count uses committed `values`, not the draft. Import `useRef` and `useState` from React, plus `Button`, `Drawer`, `activeDrawerCount`, `drawerDraftEqualsCommitted`, and `emptyValue`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/filter-bar/FilterBar.test.tsx src/components/drawer/Drawer.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/filter-bar/FilterBar.tsx src/components/filter-bar/FilterBar.test.tsx
git commit -m "feat(filter-bar): draft drawer filters until Apply"
```

---

### Task 5: Date range

**Files:**
- Modify: `src/components/filter-bar/FilterBar.tsx`
- Modify: `src/components/filter-bar/FilterBar.test.tsx`

**Interfaces:**
- Consumes: `Date` from `../form-controls` (import as `DateField` so it does not shadow the global `Date`). `DATE_RANGE_ERROR`, `isDateRangeInvalid`, `FilterBarDateRangeValue`.
- Produces: two `DateField`s per `dateRange`, labeled `{label} from` and `{label} to`. Bar ranges commit only when valid. Drawer Apply is disabled while any drawer range is invalid.

- [ ] **Step 1: Write the failing tests**

Append to `FilterBar.test.tsx`:

```tsx
const due: FilterBarField = { id: "due", type: "dateRange", label: "Due", placement: "drawer" };
const dueBar: FilterBarField = { id: "due", type: "dateRange", label: "Due", placement: "bar" };

function enabledDayIds(prefix: string): string[] {
  return screen
    .getAllByTestId(new RegExp(`^${prefix}-day-`))
    .map((element) => element.getAttribute("data-testid") ?? "")
    .filter((id) => {
      const element = screen.getByTestId(id);
      return element.getAttribute("aria-disabled") !== "true" && !element.hasAttribute("disabled");
    });
}

async function commitEdgeDay(
  user: ReturnType<typeof userEvent.setup>,
  prefix: string,
  edge: "first" | "last",
) {
  await user.click(screen.getByTestId(`${prefix}-trigger`));
  const ids = enabledDayIds(prefix);
  const dayId = edge === "first" ? ids[0] : ids[ids.length - 1];
  await user.click(screen.getByTestId(dayId));
  await user.click(screen.getByTestId(`${prefix}-done`));
}

describe("FilterBar date range", () => {
  it("shows the error and disables Apply when from is after to", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterBar
        dataTestId="filters"
        fields={[due]}
        values={{ due: { from: null, to: null } }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await commitEdgeDay(user, "filters-field-due-from", "last");
    await commitEdgeDay(user, "filters-field-due-to", "first");

    expect(screen.getByText("From must be on or before To")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("commits a from-only bar range and then refuses an earlier to", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Harness
        dataTestId="filters"
        fields={[dueBar]}
        initial={{ due: { from: null, to: null } }}
        onChange={onChange}
      />,
    );

    await commitEdgeDay(user, "filters-field-due-from", "last");
    expect(onChange).toHaveBeenCalledTimes(1);
    await commitEdgeDay(user, "filters-field-due-to", "first");
    expect(screen.getByText(DATE_RANGE_ERROR)).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("counts a partial committed range as one Filters field", () => {
    render(
      <FilterBar
        fields={[due]}
        values={{ due: { from: new Date(2026, 7, 1), to: null } }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "Filters 1" })).toBeInTheDocument();
  });
});
```

Import `DATE_RANGE_ERROR` from `./filter-bar-model`. Add optional `dataTestId?: string` to `Harness` and pass it to `FilterBar`. `Date` opens from `{dataTestId}-trigger`, stages a day, and commits on `{dataTestId}-done`. From and To use `${dataTestId}-field-${id}-from` and `${dataTestId}-field-${id}-to`. The grid's first enabled day is earlier than its last enabled day, including the leading and trailing days around the open month.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/filter-bar/FilterBar.test.tsx -t "FilterBar date range"`

Expected: FAIL because Due from is not rendered.

- [ ] **Step 3: Render and validate date ranges**

Add a helper in `FilterBar.tsx`:

```tsx
function asDateRange(value: FilterBarFieldValue): FilterBarDateRangeValue {
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "from" in value &&
    "to" in value
  ) {
    return value;
  }
  return { from: null, to: null };
}
```

Render each `dateRange` with this component. `source` is `"bar"` or `"drawer"`. Bar `onCommit` is the valid-only `onChange` path. Drawer `onCommit` writes the draft and ignores validity.

```tsx
function DateRangeFields({
  field,
  range,
  error,
  isFluid,
  testId,
  onChange,
}: {
  field: FilterBarDateRangeField;
  range: FilterBarDateRangeValue;
  error?: string;
  isFluid?: boolean;
  testId?: string;
  onChange: (next: FilterBarDateRangeValue) => void;
}) {
  return (
    <div className={styles["cp-filter-bar__date-range"]}>
      <DateField
        label={`${field.label} from`}
        size="small"
        isFluid={isFluid}
        value={range.from}
        onChange={(from) => onChange({ ...range, from })}
        dataTestId={testId ? `${testId}-from` : undefined}
      />
      <DateField
        label={`${field.label} to`}
        size="small"
        isFluid={isFluid}
        value={range.to}
        error={error}
        onChange={(to) => onChange({ ...range, to })}
        dataTestId={testId ? `${testId}-to` : undefined}
      />
    </div>
  );
}
```

Bar state is `barDateDraft: Record<string, FilterBarDateRangeValue>`. Display `barDateDraft[field.id] ?? asDateRange(readValue(field, values))`. Pass `error` when `isDateRangeInvalid` of that displayed range. On change:

```tsx
function changeBarDate(fieldId: string, next: FilterBarDateRangeValue) {
  if (isDateRangeInvalid(next)) {
    setBarDateDraft((current) => ({ ...current, [fieldId]: next }));
    return;
  }
  setBarDateDraft((current) => {
    const copy = { ...current };
    delete copy[fieldId];
    return copy;
  });
  onChange(withFieldValue(values, fieldId, next));
}
```

Drawer `onChange` for a range only updates `draft`. Set Drawer's `isPrimaryButtonDisabled` when any drawer `dateRange` has `isDateRangeInvalid(asDateRange(readValue(field, draft)))`. Clearing the draft uses `emptyValue`, and an empty range is valid, so the error goes away before Apply.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/filter-bar/FilterBar.test.tsx src/components/filter-bar/filter-bar-model.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/filter-bar/FilterBar.tsx src/components/filter-bar/FilterBar.test.tsx
git commit -m "feat(filter-bar): validate date ranges before commit"
```

---

### Task 6: Docs, export, story, and HTML converter

**Files:**
- Modify: `src/index.js`
- Modify: `src/public-types.ts`
- Modify: `llms.txt`
- Modify: `CHANGELOG.md` (`## Unreleased` / `### Added`)
- Modify: `src/html-to-jsx/convert.ts`
- Modify: `src/html-to-jsx/component-manifest.json`
- Modify: `src/html-to-jsx/convert.test.ts`
- Create: `src/html-to-jsx/filter-bar-convert.ts`
- Create: `docs/FilterBar.md`
- Create: `src/stories/filter-bar/filter-bar.stories.tsx`
- Create: `src/stories/filter-bar/filter-bar.docs.mdx`

**Interfaces:**
- Consumes: `FilterBar` default export and the types from `src/components/filter-bar/index.ts`. `convertTableComponent` is the pattern for a special-cased converter: `convert.ts` calls it before the generic path.
- Produces: package export `FilterBar`, doc `docs/FilterBar.md`, manifest key `"FilterBar"`, and JSX `fields` from HTML children.

- [ ] **Step 1: Write the failing converter test**

Add to `src/html-to-jsx/convert.test.ts`:

```ts
it("converts FilterBar fields into a fields array", () => {
  const jsx = convertHtmlToJsx(
    `<div data-cp="FilterBar" class="cp-filter-bar">
      <div data-cp-type="search" data-cp-id="q" data-cp-label="Search" data-cp-placement="bar" data-cp-placeholder="Find"></div>
      <div data-cp-type="select" data-cp-id="status" data-cp-label="Status" data-cp-placement="bar">
        <div data-cp-value="active" data-cp-label="Active"></div>
      </div>
      <div data-cp-type="dateRange" data-cp-id="due" data-cp-label="Due" data-cp-placement="drawer"></div>
    </div>`,
    manifest,
  );
  expect(jsx).toContain("<FilterBar");
  expect(jsx).toContain('type: "search"');
  expect(jsx).toContain('id: "q"');
  expect(jsx).toContain('placeholder: "Find"');
  expect(jsx).toContain('type: "select"');
  expect(jsx).toContain('value: "active"');
  expect(jsx).toContain('type: "dateRange"');
  expect(jsx).not.toContain("onChange");
  expect(jsx).not.toContain("values=");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/html-to-jsx/convert.test.ts -t "converts FilterBar"`

Expected: FAIL with Unknown component "FilterBar".

- [ ] **Step 3: Convert, export, and document**

Add a manifest entry:

```json
"FilterBar": {
  "exportName": "FilterBar",
  "tier": 2,
  "props": {
    "margin": { "type": "string", "default": "0" }
  }
}
```

Create `src/html-to-jsx/filter-bar-convert.ts`. Copy `escapeJsxString` and `formatJsxObjectLiteral` from `src/html-to-jsx/table-convert.ts` into this file (they are not exported). Export `convertFilterBarComponent($, element, entry)`.

It reads direct element children that have `data-cp-type`. Allowed types: `search`, `select`, `multiSelect`, `dateRange`. Each child requires `data-cp-id`, `data-cp-label`, and `data-cp-placement` (`bar` or `drawer`). Throw `ConvertError` with `docsPathForComponent("FilterBar")` when any of those are missing or the type/placement is illegal. `search` may set `placeholder` from `data-cp-placeholder`. `select` and `multiSelect` collect nested elements with `data-cp-value` and `data-cp-label` into `options: { value, label }[]`. `dateRange` has no options. Root `data-cp-margin` becomes a `margin` prop when it is not `"0"`. Return a self-closing `<FilterBar fields={...} />` using `formatJsxObjectLiteral` for the array. Do not emit `values` or `onChange`.

In `convertTaggedComponent`, before the Table branch:

```ts
if (componentName === "FilterBar") {
  return convertFilterBarComponent($, element, entry);
}
```

In `src/index.js`, import `FilterBar` from `./components/filter-bar` and add it to the export list next to `Table`.

In `src/public-types.ts`, export `FilterBarProps`, `FilterBarField`, `FilterBarFieldValue`, `FilterBarValues`, `FilterBarDateRangeValue`, `FilterBarPlacement`, and `FilterBarMargin` from `./components/filter-bar`.

Add an Unreleased Added bullet in `CHANGELOG.md`:

```md
- **FilterBar:** Controlled search, select, multi-select, and date-range fields for filtering a table. Bar fields update immediately. Drawer fields apply on Apply. See `docs/FilterBar.md`.
```

Add a `### FilterBar Component` section to `llms.txt` after the Table section, and a Quick Reference row after Table:

```md
### FilterBar Component
- File: `docs/FilterBar.md`
- Purpose: Collects search, select, multi-select, and date-range values above a table. The app filters the rows.
- Key Features: fields (id, type, label, placement bar|drawer), controlled values and onChange, drawer draft with Apply and Clear, date-range validation, margin suffix API. Fields are small (32px).
- Types: FilterBarProps, FilterBarField, FilterBarFieldValue, FilterBarValues, FilterBarDateRangeValue, FilterBarPlacement, FilterBarMargin, SpacingOption
- Related Components: Table (consumer filters its data), FormControls.Input, FormControls.Select, FormControls.Date, Drawer, Button
```

```md
| FilterBar | `docs/FilterBar.md` | Filter toolbar for tables and lists |
```

Write `docs/FilterBar.md` with the purpose, props table, type blocks, and usage example from the spec. State that `from` alone means on or after that local calendar day, `to` alone means on or before, and both is a closed range, and that `FilterBar` does not apply that meaning. Include this HTML prototype and the JSX the converter emits:

```html
<div data-cp="FilterBar" class="cp-filter-bar">
  <div data-cp-type="search" data-cp-id="q" data-cp-label="Search" data-cp-placement="bar"></div>
  <div data-cp-type="select" data-cp-id="status" data-cp-label="Status" data-cp-placement="bar">
    <div data-cp-value="active" data-cp-label="Active"></div>
  </div>
  <div data-cp-type="multiSelect" data-cp-id="owner" data-cp-label="Owner" data-cp-placement="drawer">
    <div data-cp-value="asha" data-cp-label="Asha"></div>
  </div>
  <div data-cp-type="dateRange" data-cp-id="due" data-cp-label="Due" data-cp-placement="drawer"></div>
</div>
```

```jsx
<FilterBar fields={[
  { id: "q", type: "search", label: "Search", placement: "bar" },
  { id: "status", type: "select", label: "Status", placement: "bar", options: [{ value: "active", label: "Active" }] },
  { id: "owner", type: "multiSelect", label: "Owner", placement: "drawer", options: [{ value: "asha", label: "Asha" }] },
  { id: "due", type: "dateRange", label: "Due", placement: "drawer" },
]} />
```

The doc must say the app adds `values` and `onChange` after conversion.

Create `src/stories/filter-bar/filter-bar.stories.tsx` with `title: "atoms/FilterBar/Playground"`. The story holds sample rows (`name`, `status`, `owner`, `due` as `yyyy-MM-dd` strings) and filter state. It renders `FilterBar` with Search and Status in the bar, Owner (`multiSelect`) and Due (`dateRange`) in the drawer, then a `Table` of the rows that match: case-insensitive `name` contains the search string; status matches when set; owner matches when the multi-select is non-empty; `due` is on or after `from` and on or before `to` when those ends are set. Keep that predicate inside the story file. Do not export it.

Create `src/stories/filter-bar/filter-bar.docs.mdx` with `<Meta title="atoms/FilterBar/Documentation" />`, a short description, and the same usage example as the doc. Import `FilterBar` from `../../index` only if the page renders it; otherwise the Meta page can stay markdown plus a code sample, matching `src/stories/badge/badge.docs.mdx` by importing `{ Meta }` from `@storybook/addon-docs/blocks`.

- [ ] **Step 4: Run the converter and unit tests**

Run: `npx vitest run src/html-to-jsx/convert.test.ts src/components/filter-bar/FilterBar.test.tsx src/components/drawer/Drawer.test.tsx`

Expected: PASS

- [ ] **Step 5: Snapshot the story**

Run: `npm run build-storybook`

Then: `npm run test:visual:update -- tests/visual/stories.spec.ts -g atoms-filterbar-playground`

Expected: one new screenshot under `tests/visual/stories.spec.ts-snapshots/` for the FilterBar playground story. If the id differs, the Playwright output prints the story id from `storybook-static/index.json`; rerun with that id. Do not update unrelated snapshots.

- [ ] **Step 6: Commit**

```bash
git add src/index.js src/public-types.ts llms.txt CHANGELOG.md docs/FilterBar.md src/stories/filter-bar src/html-to-jsx/filter-bar-convert.ts src/html-to-jsx/convert.ts src/html-to-jsx/convert.test.ts src/html-to-jsx/component-manifest.json tests/visual/stories.spec.ts-snapshots
git commit -m "docs(filter-bar): export FilterBar and document the HTML prototype"
```

---

### Task 7: Pull request to main, with a screenshot

**Files:**
- Use the desktop snapshot committed in Task 6: `tests/visual/stories.spec.ts-snapshots/atoms-filterbar-playground--default-desktop-linux.png`
- If that filename is different, use the new `*filterbar*desktop*.png` in that snapshots directory. Do not use the mobile snapshot as the only image.

**Interfaces:**
- Consumes: branch `feat/filter-bar` from Task 0, and the snapshot from Task 6.
- Produces: a pull request into `main` whose description renders the playground screenshot.

- [ ] **Step 1: Confirm the branch and the screenshot**

```bash
git branch --show-current
git status
```

Expected: branch is `feat/filter-bar`, and the working tree is clean. The desktop snapshot file exists. If the status is not clean, commit the remaining plan files on this branch before pushing. Do not commit `.gitignore` or `.superpowers/`.

- [ ] **Step 2: Push the feature branch**

```bash
git push -u origin feat/filter-bar
```

Expected: the remote has `feat/filter-bar`. Do not push `main`.

- [ ] **Step 3: Open the pull request**

Resolve the image URL from the repo remote and this branch. For an `https://github.com/OWNER/REPO.git` remote, the image is:

`https://github.com/OWNER/REPO/raw/feat/filter-bar/tests/visual/stories.spec.ts-snapshots/atoms-filterbar-playground--default-desktop-linux.png`

Use the real owner, repo, and snapshot filename. Then:

```bash
gh pr create --base main --head feat/filter-bar --title "feat(filter-bar): add a filter toolbar for tables" --body "$(cat <<'EOF'
## Summary
- Adds `FilterBar`, a controlled toolbar of search, select, multi-select, and date-range fields.
- Bar fields update immediately. Drawer fields stay in a draft until Apply.
- `Drawer` can disable its primary footer button while a date range is invalid.

## Screenshot
![FilterBar playground](IMAGE_URL)

## Test plan
- [ ] Bar search and select call `onChange` immediately
- [ ] Drawer edits wait for Apply; Clear, close, and Escape drop the draft
- [ ] An inverted date range shows "From must be on or before To" and disables Apply
- [ ] Storybook playground filters the sample table
- [ ] `npx vitest run src/components/filter-bar src/components/drawer/Drawer.test.tsx src/html-to-jsx/convert.test.ts`

EOF
)"
```

Replace `IMAGE_URL` in the body with the raw URL from this step before running the command. The screenshot must be an image in the pull request description, above the test plan.

Expected: `gh` prints the pull request URL. The description shows the FilterBar playground image. The base branch is `main`.

---

## Spec coverage

| Spec requirement | Task |
|---|---|
| Controlled `fields` / `values` / `onChange` | 3 |
| `search`, `select`, `multiSelect` | 3 |
| `dateRange` From / To labels | 5 |
| Bar updates immediately | 3, 5 |
| Drawer draft, Apply, Clear, dismiss | 4 |
| Apply skips `onChange` when the draft matches | 2, 4 |
| Apply keeps a bar edit made while the drawer is open | 4 |
| Filters button and committed count | 4, 5 |
| Drawer from the right, existing mobile sheet | 4 |
| Inverted range error and disabled Apply | 1, 5 |
| Bar inverted range is not committed | 5 |
| Duplicate id uses the first and warns | 2, 3 |
| Missing value and empty `fields` | 2, 3 |
| `isPrimaryButtonDisabled` | 1 |
| Docs, llms.txt, Storybook, HTML converter, package export | 6 |
| No row filtering helper | story predicate stays in the story file |
