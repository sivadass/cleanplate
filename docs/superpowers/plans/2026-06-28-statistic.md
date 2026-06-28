# Statistic implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `<Statistic />` — numeric KPI metric display per `docs/superpowers/specs/2026-06-28-statistic-design.md`.

**Architecture:** Self-contained presentational component with a pure `formatStatisticValue()` utility for number grouping and precision. Composes `Spinner` for loading only. Title and value typography live in `Statistic.module.scss` (not `Typography`). Consumers pass `Icon` nodes in `prefix` / `suffix`; override styling via root `className` and documented global BEM class names in the SCSS module.

**Tech Stack:** React 18, TypeScript, SCSS modules, Vitest, `@testing-library/react`, Storybook 7.

**Spec:** `docs/superpowers/specs/2026-06-28-statistic-design.md`

---

## File structure

| Path | Role |
|------|------|
| `src/components/statistic/format-value.ts` | Pure number formatting util |
| `src/components/statistic/format-value.test.ts` | Unit tests for formatter |
| `src/components/statistic/Statistic.tsx` | Component + types |
| `src/components/statistic/Statistic.module.scss` | Layout, sizes, tones, BEM slots |
| `src/components/statistic/Statistic.test.tsx` | Component tests |
| `src/components/statistic/index.ts` | Barrel export + type re-exports |
| `src/index.js` | Add import/export |
| `docs/Statistic.md` | Public component doc |
| `src/stories/statistic/statistic.stories.jsx` | Storybook playground + scenarios |
| `src/stories/statistic/statistic.docs.mdx` | Storybook doc page |
| `llms.txt` | Manual index entry |
| `CHANGELOG.md` | Unreleased: new `Statistic` export |

---

### Task 1: `formatStatisticValue` utility (TDD)

**Files:**

- Create: `src/components/statistic/format-value.ts`
- Create: `src/components/statistic/format-value.test.ts`

- [ ] **Step 1: Write the failing tests**

`src/components/statistic/format-value.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatStatisticValue } from "./format-value";

describe("formatStatisticValue", () => {
  it("groups integer digits with default comma separator", () => {
    expect(formatStatisticValue(112893)).toBe("112,893");
  });

  it("applies precision with trailing zeros", () => {
    expect(formatStatisticValue(112893, { precision: 2 })).toBe("112,893.00");
  });

  it("supports custom group and decimal separators", () => {
    expect(
      formatStatisticValue(1234.56, {
        precision: 2,
        groupSeparator: " ",
        decimalSeparator: ",",
      }),
    ).toBe("1 234,56");
  });

  it("formats negative numbers with grouping", () => {
    expect(formatStatisticValue(-1234.5, { precision: 1 })).toBe("-1,234.5");
  });

  it("returns em dash for non-finite numbers", () => {
    expect(formatStatisticValue(Number.NaN)).toBe("—");
    expect(formatStatisticValue(Number.POSITIVE_INFINITY)).toBe("—");
    expect(formatStatisticValue(Number.NEGATIVE_INFINITY)).toBe("—");
  });

  it("passes strings through unchanged", () => {
    expect(formatStatisticValue("¥112,893")).toBe("¥112,893");
    expect(formatStatisticValue("1.2M users")).toBe("1.2M users");
  });

  it("formats small integers without unnecessary separators", () => {
    expect(formatStatisticValue(42)).toBe("42");
    expect(formatStatisticValue(0, { precision: 2 })).toBe("0.00");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/statistic/format-value.test.ts`

Expected: FAIL — cannot find module `./format-value`

- [ ] **Step 3: Write minimal implementation**

`src/components/statistic/format-value.ts`:

```ts
export type FormatStatisticValueOptions = {
  precision?: number;
  groupSeparator?: string;
  decimalSeparator?: string;
};

const NON_FINITE_DISPLAY = "—";

function groupIntegerDigits(digits: string, groupSeparator: string): string {
  if (digits.length <= 3) {
    return digits;
  }

  const groups: string[] = [];
  let index = digits.length;

  while (index > 0) {
    const start = Math.max(0, index - 3);
    groups.unshift(digits.slice(start, index));
    index = start;
  }

  return groups.join(groupSeparator);
}

export function formatStatisticValue(
  value: string | number,
  options: FormatStatisticValueOptions = {},
): string {
  if (typeof value === "string") {
    return value;
  }

  if (!Number.isFinite(value)) {
    return NON_FINITE_DISPLAY;
  }

  const {
    precision,
    groupSeparator = ",",
    decimalSeparator = ".",
  } = options;

  const raw =
    precision !== undefined ? value.toFixed(precision) : String(value);

  const [integerPart, fractionalPart] = raw.split(".");
  const isNegative = integerPart.startsWith("-");
  const unsignedInteger = isNegative ? integerPart.slice(1) : integerPart;
  const grouped = groupIntegerDigits(unsignedInteger, groupSeparator);
  const sign = isNegative ? "-" : "";

  if (fractionalPart !== undefined) {
    return `${sign}${grouped}${decimalSeparator}${fractionalPart}`;
  }

  return `${sign}${grouped}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/statistic/format-value.test.ts`

Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/statistic/format-value.ts src/components/statistic/format-value.test.ts
git commit -m "feat(statistic): add formatStatisticValue utility"
```

---

### Task 2: Statistic scaffold + failing component tests

**Files:**

- Create: `src/components/statistic/Statistic.tsx` (stub)
- Create: `src/components/statistic/Statistic.test.tsx`
- Create: `src/components/statistic/index.ts`

- [ ] **Step 1: Create stub component and barrel**

`src/components/statistic/Statistic.tsx`:

```tsx
import React from "react";
import { SPACING_OPTIONS } from "../../constants/common";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type StatisticSize = "small" | "medium" | "large";
export type StatisticValueTone = "default" | "positive" | "negative";
export type StatisticMargin = string | SpacingOption[];

export interface StatisticProps {
  title?: React.ReactNode;
  value?: string | number;
  precision?: number;
  groupSeparator?: string;
  decimalSeparator?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  valueTone?: StatisticValueTone;
  size?: StatisticSize;
  loading?: boolean;
  margin?: StatisticMargin;
  className?: string;
  dataTestId?: string;
}

const Statistic: React.FC<StatisticProps> = () => null;

export default Statistic;
```

`src/components/statistic/index.ts`:

```ts
import Statistic from "./Statistic";

export default Statistic;
export type {
  StatisticProps,
  StatisticSize,
  StatisticValueTone,
  StatisticMargin,
  SpacingOption,
} from "./Statistic";
```

- [ ] **Step 2: Write failing component tests**

`src/components/statistic/Statistic.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Statistic from "./Statistic";

describe("Statistic", () => {
  it("renders title and formatted value", () => {
    render(<Statistic title="Active Users" value={112893} />);
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("112,893")).toBeInTheDocument();
  });

  it("renders string value verbatim", () => {
    render(<Statistic title="Revenue" value="¥1.2M" />);
    expect(screen.getByText("¥1.2M")).toBeInTheDocument();
  });

  it("renders prefix and suffix when not loading", () => {
    render(
      <Statistic
        title="Feedback"
        value={93}
        prefix={<span data-testid="prefix-icon">↑</span>}
        suffix="/ 100"
      />,
    );
    expect(screen.getByTestId("prefix-icon")).toBeInTheDocument();
    expect(screen.getByText("/ 100")).toBeInTheDocument();
    expect(screen.getByText("93")).toBeInTheDocument();
  });

  it("shows Spinner and hides prefix, suffix, and value when loading", () => {
    render(
      <Statistic
        title="Active Users"
        value={112893}
        loading
        prefix={<span data-testid="prefix-icon">↑</span>}
        suffix="/ 100"
      />,
    );
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("progress_activity")).toBeInTheDocument();
    expect(screen.queryByText("112,893")).not.toBeInTheDocument();
    expect(screen.queryByTestId("prefix-icon")).not.toBeInTheDocument();
    expect(screen.queryByText("/ 100")).not.toBeInTheDocument();
  });

  it("sets aria-busy on content when loading", () => {
    const { container } = render(
      <Statistic title="Active Users" value={1} loading />,
    );
    const content = container.querySelector('[aria-busy="true"]');
    expect(content).toBeInTheDocument();
  });

  it("applies valueTone modifier class on value element", () => {
    render(
      <Statistic title="Active" value={11.28} precision={2} valueTone="positive" />,
    );
    const valueEl = screen.getByText("11.28");
    expect(valueEl.className).toMatch(/positive/);
  });

  it("applies dataTestId on root", () => {
    render(
      <Statistic title="Active Users" value={1} dataTestId="active-users-stat" />,
    );
    expect(screen.getByTestId("active-users-stat")).toBeInTheDocument();
  });

  it("merges className on root", () => {
    render(
      <Statistic
        title="Active Users"
        value={1}
        className="dashboard-stat"
        dataTestId="stat-root"
      />,
    );
    expect(screen.getByTestId("stat-root")).toHaveClass("dashboard-stat");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- src/components/statistic/Statistic.test.tsx`

Expected: FAIL — component renders nothing / missing text

- [ ] **Step 4: Commit scaffold + tests**

```bash
git add src/components/statistic/Statistic.tsx src/components/statistic/Statistic.test.tsx src/components/statistic/index.ts
git commit -m "test(statistic): add component tests and stub"
```

---

### Task 3: Statistic styles + full implementation

**Files:**

- Create: `src/components/statistic/Statistic.module.scss`
- Modify: `src/components/statistic/Statistic.tsx`

- [ ] **Step 1: Add SCSS module**

`src/components/statistic/Statistic.module.scss`:

```scss
.cp-statistic {
  display: block;
  font-family: var(--font-family);
}

.cp-statistic__title {
  margin: 0;
  color: var(--text-subtle);
  line-height: 1.4;
}

.cp-statistic__content {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  font-variant-numeric: tabular-nums;
}

.cp-statistic__prefix,
.cp-statistic__suffix {
  display: inline-flex;
  align-items: baseline;
}

.cp-statistic__value {
  font-weight: 600;
  line-height: 1.2;
  color: var(--text-default);
}

.cp-statistic__value--positive {
  color: var(--green);
}

.cp-statistic__value--negative {
  color: var(--red);
}

.cp-statistic--small {
  .cp-statistic__title {
    font-size: 12px;
    margin-bottom: var(--space-1);
  }

  .cp-statistic__value {
    font-size: 18px;
  }
}

.cp-statistic--medium {
  .cp-statistic__title {
    font-size: 14px;
    margin-bottom: var(--space-2);
  }

  .cp-statistic__value {
    font-size: 24px;
  }
}

.cp-statistic--large {
  .cp-statistic__title {
    font-size: 14px;
    margin-bottom: var(--space-2);
  }

  .cp-statistic__value {
    font-size: 32px;
  }
}
```

- [ ] **Step 2: Implement Statistic component**

Replace `src/components/statistic/Statistic.tsx` with:

```tsx
import React from "react";
import Spinner from "../spinner";
import type { SpinnerSize } from "../spinner/Spinner";
import { SPACING_OPTIONS } from "../../constants/common";
import { getSpacingClass } from "../../utils/common";
import getClassNames from "../../utils/get-class-names";
import utilStyles from "../../styles/utils.module.scss";
import styles from "./Statistic.module.scss";
import { formatStatisticValue } from "./format-value";

export type SpacingOption = (typeof SPACING_OPTIONS)[number];
export type StatisticSize = "small" | "medium" | "large";
export type StatisticValueTone = "default" | "positive" | "negative";
export type StatisticMargin = string | SpacingOption[];

export interface StatisticProps {
  title?: React.ReactNode;
  value?: string | number;
  precision?: number;
  groupSeparator?: string;
  decimalSeparator?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  valueTone?: StatisticValueTone;
  size?: StatisticSize;
  loading?: boolean;
  margin?: StatisticMargin;
  className?: string;
  dataTestId?: string;
}

const mapStatisticSizeToSpinnerSize = (size: StatisticSize): SpinnerSize => {
  if (size === "small") return "small";
  if (size === "large") return "large";
  return "medium";
};

const Statistic: React.FC<StatisticProps> = ({
  title,
  value,
  precision,
  groupSeparator = ",",
  decimalSeparator = ".",
  prefix,
  suffix,
  valueTone = "default",
  size = "medium",
  loading = false,
  margin = "0",
  className = "",
  dataTestId,
}) => {
  const marginClass = getSpacingClass(margin, utilStyles, "m");

  const rootClassName = getClassNames(
    styles["cp-statistic"],
    styles[`cp-statistic--${size}`],
    loading ? styles["cp-statistic--loading"] : undefined,
    marginClass,
    className,
  );

  const formattedValue =
    value !== undefined
      ? formatStatisticValue(value, {
          precision,
          groupSeparator,
          decimalSeparator,
        })
      : null;

  const showPrefix = !loading && prefix != null;
  const showSuffix = !loading && suffix != null;
  const showValue = !loading && formattedValue != null && formattedValue !== "";

  const valueClassName = getClassNames(
    styles["cp-statistic__value"],
    valueTone === "positive" ? styles["cp-statistic__value--positive"] : undefined,
    valueTone === "negative" ? styles["cp-statistic__value--negative"] : undefined,
  );

  return (
    <div className={rootClassName} data-testid={dataTestId}>
      {title != null && title !== "" ? (
        <div className={styles["cp-statistic__title"]}>{title}</div>
      ) : null}
      <div
        className={styles["cp-statistic__content"]}
        aria-busy={loading || undefined}
      >
        {loading ? (
          <Spinner size={mapStatisticSizeToSpinnerSize(size)} margin="0" />
        ) : (
          <>
            {showPrefix ? (
              <span className={styles["cp-statistic__prefix"]}>{prefix}</span>
            ) : null}
            {showValue ? (
              <span className={valueClassName}>{formattedValue}</span>
            ) : null}
            {showSuffix ? (
              <span className={styles["cp-statistic__suffix"]}>{suffix}</span>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Statistic;
```

- [ ] **Step 3: Run all statistic tests**

Run: `npm test -- src/components/statistic/`

Expected: PASS (all format-value + Statistic tests)

- [ ] **Step 4: Run type-check**

Run: `npm run type-check`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/statistic/Statistic.tsx src/components/statistic/Statistic.module.scss
git commit -m "feat(statistic): implement Statistic component with loading and value tones"
```

---

### Task 4: Package export

**Files:**

- Modify: `src/index.js`

- [ ] **Step 1: Wire export**

Add import (alphabetically after `Spinner`):

```js
import Statistic from "./components/statistic";
```

Add to named export list (alphabetically after `Spinner`):

```js
  Statistic,
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/index.js
git commit -m "feat(statistic): export Statistic from package entry"
```

---

### Task 5: Documentation

**Files:**

- Create: `docs/Statistic.md`
- Modify: `llms.txt`

- [ ] **Step 1: Write `docs/Statistic.md`**

Follow `docs/Badge.md` / `docs/Spinner.md` structure. Include:

- Purpose: labeled numeric KPI for dashboards; not `Badge` / `Typography`; **margin** suffix rule.
- Full props table from spec §3.
- Formatting rules: `string` passthrough, number grouping, non-finite → `—`.
- Examples: basic integer, precision, prefix `Icon` + suffix, loading, `valueTone` positive/negative, string value, `Container` card composition.
- Documented BEM slot classes for CSS overrides (list from spec §5).
- Note: **`Statistic.Timer` planned** — not in v1.
- Related: `Spinner`, `Icon`, `Container`, `Badge`, `Table`.

- [ ] **Step 2: Add `llms.txt` entry**

After `Spinner` block (~line 116), add:

```markdown
### Statistic Component
- File: `docs/Statistic.md`
- Purpose: Displays a labeled numeric metric (title + formatted value) with optional prefix/suffix, loading state, and semantic value coloring. For dashboard KPIs and summary tiles.
- Key Features: value string|number with grouping/precision, prefix/suffix ReactNode, valueTone default|positive|negative, sizes small|medium|large, loading (Spinner in value row), margin suffix API, className + documented BEM slots
- Types: StatisticProps, StatisticSize, StatisticValueTone, StatisticMargin, SpacingOption
- Related Components: Spinner (loading), Icon (prefix/suffix), Container (card/grid layout), Table (tabular data vs KPI tiles)
```

Add Quick Reference table row after Spinner row:

```markdown
| Statistic | `docs/Statistic.md` | Dashboard KPI metrics with formatting and loading |
```

Add `Statistic` to the Usage import example in `llms.txt`.

- [ ] **Step 3: Commit**

```bash
git add docs/Statistic.md llms.txt
git commit -m "docs: add Statistic component documentation"
```

---

### Task 6: Storybook

**Files:**

- Create: `src/stories/statistic/statistic.stories.jsx`
- Create: `src/stories/statistic/statistic.docs.mdx`

- [ ] **Step 1: Create stories**

`src/stories/statistic/statistic.stories.jsx`:

```jsx
import { Statistic, Container, Icon } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const SIZE_OPTIONS = ["small", "medium", "large"];
const VALUE_TONE_OPTIONS = ["default", "positive", "negative"];
const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);

const meta = {
  title: "atoms/Statistic/Playground",
  component: Statistic,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    precision: { control: "number" },
    valueTone: {
      options: VALUE_TONE_OPTIONS,
      control: { type: "select" },
    },
    size: {
      options: SIZE_OPTIONS,
      control: { type: "select" },
    },
    loading: { control: "boolean" },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
    },
    className: { control: "text" },
  },
  args: {
    title: "Active Users",
    value: 112893,
    size: "medium",
    valueTone: "default",
    loading: false,
    margin: "0",
  },
};

export default meta;

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4">
      <Statistic {...args} />
    </Container>
  ),
};

export const WithPrecision = {
  name: "With precision",
  render: () => (
    <Container padding="4">
      <Statistic
        title="Account Balance (CNY)"
        value={112893}
        precision={2}
      />
    </Container>
  ),
};

export const PrefixAndSuffix = {
  name: "Prefix and suffix",
  render: () => (
    <Container padding="4" display="flex" gap="4">
      <Statistic
        title="Feedback"
        value={1128}
        prefix={<Icon name="thumb_up" size="small" />}
      />
      <Statistic title="Unmerged" value={93} suffix="/ 100" />
    </Container>
  ),
};

export const Loading = {
  name: "Loading",
  render: () => (
    <Container padding="4">
      <Statistic title="Active Users" value={112893} loading />
    </Container>
  ),
};

export const ValueTones = {
  name: "Value tones",
  render: () => (
    <Container padding="4" display="flex" gap="4">
      <Container
        padding="4"
        display="block"
        className=""
        style={{
          background: "var(--gray-100)",
          borderRadius: "var(--radius-medium)",
        }}
      >
        <Statistic
          title="Active"
          value={11.28}
          precision={2}
          valueTone="positive"
          prefix={<Icon name="arrow_upward" size="small" />}
          suffix="%"
        />
      </Container>
      <Container
        padding="4"
        display="block"
        style={{
          background: "var(--gray-100)",
          borderRadius: "var(--radius-medium)",
        }}
      >
        <Statistic
          title="Idle"
          value={9.3}
          precision={2}
          valueTone="negative"
          prefix={<Icon name="arrow_downward" size="small" />}
          suffix="%"
        />
      </Container>
    </Container>
  ),
};

export const Sizes = {
  name: "Sizes",
  render: () => (
    <Container padding="4" display="flex" gap="4" align="flex-end">
      <Statistic title="Small" value={112893} size="small" />
      <Statistic title="Medium" value={112893} size="medium" />
      <Statistic title="Large" value={112893} size="large" />
    </Container>
  ),
};
```

- [ ] **Step 2: Create MDX doc page**

`src/stories/statistic/statistic.docs.mdx` — mirror `src/stories/spinner/spinner.docs.mdx`:

- Import `Meta`, `ArgsTable` from `@storybook/blocks`
- Import `Statistic`, `Container`, `Icon` from `../../index`
- `<Meta title="atoms/Statistic/Documentation" />`
- Sections: purpose, features (formatting, tones, sizes, loading), usage import, examples (basic, prefix/suffix, loading, card composition with `Container`), BEM override note, related components, note that Timer is future work.

- [ ] **Step 3: Verify Storybook builds (optional smoke)**

Run: `npm run build-storybook`

Expected: PASS (or skip if slow; at minimum stories file has no syntax errors)

- [ ] **Step 4: Commit**

```bash
git add src/stories/statistic/statistic.stories.jsx src/stories/statistic/statistic.docs.mdx
git commit -m "docs(storybook): add Statistic stories and documentation"
```

---

### Task 7: Changelog + final verification

**Files:**

- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add CHANGELOG entry**

Under `## Unreleased` → `### Added`:

```markdown
- **`Statistic`**: labeled numeric KPI display (`title`, `value`, `precision`, `prefix`/`suffix`, `valueTone`, `size`, `loading`). See `docs/Statistic.md`. `Statistic.Timer` is planned for a future release.
```

- [ ] **Step 2: Run full test suite**

Run: `npm test`

Expected: PASS

- [ ] **Step 3: Run type-check**

Run: `npm run type-check`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add CHANGELOG.md
git commit -m "chore: add Statistic to CHANGELOG"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| `title`, `value`, formatting props | Task 1, 3 |
| `prefix` / `suffix`, hidden when loading | Task 2, 3 |
| `valueTone` default \| positive \| negative | Task 2, 3 |
| `size` small \| medium \| large | Task 3 |
| `loading` → Spinner, title visible | Task 2, 3 |
| `margin`, `className`, `dataTestId` | Task 3 |
| Tabular nums | Task 3 (SCSS) |
| BEM slot classes documented | Task 5 |
| Unit tests for formatter | Task 1 |
| Component tests | Task 2, 3 |
| Storybook scenarios | Task 6 |
| Package export | Task 4 |
| `llms.txt` + `docs/Statistic.md` | Task 5 |
| CHANGELOG | Task 7 |
| No Timer / formatter / Intl | Omitted by design |

## Placeholder scan

- [x] No TBD / TODO steps
- [x] All code blocks are complete
- [x] Commands and expected outputs specified per task
