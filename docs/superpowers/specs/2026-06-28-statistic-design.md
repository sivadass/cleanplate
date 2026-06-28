# Statistic component — design spec

**Status:** Approved (2026-06-28)  
**Scope:** Ship `<Statistic />` — numeric metric display for CleanPlate v1.  
**Source requirements:** Ant Design Statistic API (user-provided), adapted to CleanPlate conventions and brainstorming decisions (2026-06-28).

---

## 1. Summary

`Statistic` displays a labeled numeric metric: optional `title`, formatted `value`, optional `prefix` / `suffix`, loading state, and semantic value coloring. It composes `Spinner` for loading; consumers supply `Icon` (or other nodes) in `prefix` / `suffix`.

**v1 is numeric only:** no `Statistic.Timer`, no `formatter`, no CountUp animation. Consumers who need countdowns or custom renderers can use a follow-up release or pass a pre-formatted `string` `value`.

**Customization in v1:** root `className` and `margin` (suffix API) only. No per-slot `className` or `style` props. Documented BEM slot classes are stable hooks for consumer CSS.

**Implementation approach:** self-contained component with private `formatStatisticValue()` utility and dedicated SCSS for title/value scales per `size` (does not compose `Typography` internally).

---

## 2. Goals and non-goals

### In scope (v1)

- `title` (`ReactNode`), `value` (`string | number`).
- Number formatting: `precision`, `groupSeparator` (default `","`), `decimalSeparator` (default `"."`).
- `prefix` / `suffix` (`ReactNode`); hidden while `loading`.
- `valueTone`: `"default" | "positive" | "negative"` on the value element only.
- `size`: `"small" | "medium" | "large"`.
- `loading`: title remains visible; value row shows `Spinner`; prefix/suffix not rendered.
- `margin` (suffix API), `className`, `dataTestId`.
- Tabular numerals on value row for alignment.
- Unit tests for `formatStatisticValue()`.
- Storybook stories: basic, units (prefix/suffix), loading, in-card composition, value tones.

### Out of scope (v1)

| Item | Notes |
|------|--------|
| `Statistic.Timer` / countdown / countup | Future sub-component; `date-fns` already in package when needed |
| `formatter` prop | Pass `string` `value` for odd formats; add later if demand |
| CountUp / animated numbers | Not required |
| Slot `className` / `styles` props | Root `className` + documented BEM only |
| Built-in `Card` wrapper | Compose with `Container` or app card |
| `Intl.NumberFormat` / `locale` prop | Pass formatted string instead |
| `aria-live` / dynamic value announcements | Static values only in v1 |
| Public `--cp-statistic-*` token layer on `:root` | Use globals in SCSS; override via `className` + BEM |
| Inline `style` prop | Not exposed |

### Relationship to existing components

| Component | Use when |
|-----------|----------|
| `Typography` | General text; not for KPI metric layout |
| `Badge` | Short status labels / tags |
| `Spinner` | Loading indicator inside Statistic value row |
| `Icon` | Passed by consumer in `prefix` / `suffix` |
| `Container` | Layout grid for multiple stats or card padding |
| `Table` | Tabular data; Statistic for dashboard KPI tiles |
| `FeedbackState` | Empty/error regions, not metric highlights |

---

## 3. API

### Component signature

```tsx
<Statistic
  title="Active Users"
  value={112893}
  precision={2}
  groupSeparator=","
  decimalSeparator="."
  prefix={<Icon name="thumb_up" size="small" />}
  suffix="/ 100"
  valueTone="positive"
  size="medium"
  loading={false}
  margin="0"
  className="dashboard-stat"
  dataTestId="active-users-stat"
/>
```

### Props table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `ReactNode` | No | — | Label above the value row |
| `value` | `string \| number` | No | — | Metric; see formatting rules |
| `precision` | `number` | No | — | Fixed decimal places when `value` is a number |
| `groupSeparator` | `string` | No | `","` | Thousands separator for numeric values |
| `decimalSeparator` | `string` | No | `"."` | Decimal separator for numeric values |
| `prefix` | `ReactNode` | No | — | Node before value; omitted when `loading` |
| `suffix` | `ReactNode` | No | — | Node after value; omitted when `loading` |
| `valueTone` | `"default" \| "positive" \| "negative"` | No | `"default"` | Semantic color on value text |
| `size` | `"small" \| "medium" \| "large"` | No | `"medium"` | Title and value typographic scale |
| `loading` | `boolean` | No | `false` | Show `Spinner` in value row |
| `margin` | `string \| SpacingOption[]` | No | `"0"` | Framework suffix API (`"b-2"`, etc.) |
| `className` | `string` | No | `""` | Merged on root |
| `dataTestId` | `string` | No | — | `data-testid` on root |

Not exposed in v1: `style`, `formatter`, slot class props, `valueStyle` (Ant deprecated).

### Types

```ts
type StatisticSize = "small" | "medium" | "large";
type StatisticValueTone = "default" | "positive" | "negative";

interface StatisticProps {
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
  margin?: string | SpacingOption[];
  className?: string;
  dataTestId?: string;
}
```

### Value formatting rules

1. **`value` is `string`:** render verbatim. Ignore `precision`, `groupSeparator`, and `decimalSeparator`.
2. **`value` is `number`:**
   - If not finite (`NaN`, `±Infinity`) → render em dash `"—"`.
   - Apply `precision` when defined (fixed decimal places via rounding; trailing zeros kept).
   - Split integer and fractional parts; insert `groupSeparator` between every three integer digits from the right.
   - Join parts with `decimalSeparator`.
3. **`value` omitted / `undefined`:** render nothing in the value slot (title and layout still render if `title` is set).
4. **Negative numbers:** leading minus on integer part; grouping applies to digits after the sign.

Formatting logic lives in `formatStatisticValue(value, options)` with unit tests (no DOM).

---

## 4. Layout and DOM

### Structure

```html
<div class="cp-statistic cp-statistic--medium" data-testid="…">
  <div class="cp-statistic__title">Active Users</div>
  <div class="cp-statistic__content" aria-busy="false">
    <span class="cp-statistic__prefix">…</span>
    <span class="cp-statistic__value cp-statistic__value--positive">112,893</span>
    <span class="cp-statistic__suffix">/ 100</span>
  </div>
</div>
```

When `loading={true}`:

```html
<div class="cp-statistic cp-statistic--medium cp-statistic--loading" …>
  <div class="cp-statistic__title">Active Users</div>
  <div class="cp-statistic__content" aria-busy="true">
    <!-- Spinner only; no prefix, value, or suffix nodes -->
  </div>
</div>
```

### Layout rules

- Root: block container.
- Title stacked above content row with `margin-bottom` from `--space-1` (small) or `--space-2` (medium/large).
- Content row: flex, `align-items: baseline`, gap `--space-1`.
- `font-variant-numeric: tabular-nums` on `__content` (and value).
- Prefix/suffix: inline-flex, aligned with value baseline; icons from consumer should use appropriate `Icon` `size` for the statistic `size` (document in Storybook).

### Size reference

Fixed in `Statistic.module.scss` (not exposed as public CSS variables in v1):

| `size` | Title font-size | Title color | Value font-size | Value weight |
|--------|-----------------|-------------|-----------------|--------------|
| `small` | 12px | `var(--text-subtle)` | 18px | 600 |
| `medium` | 14px | `var(--text-subtle)` | 24px | 600 |
| `large` | 14px | `var(--text-subtle)` | 32px | 600 |

`Spinner` size mapping when `loading`:

| Statistic `size` | `Spinner` `size` |
|------------------|------------------|
| `small` | `small` |
| `medium` | `medium` |
| `large` | `large` |

---

## 5. Styling and customization

### Value tones

Applied on `cp-statistic__value` only:

| `valueTone` | Color token |
|-------------|-------------|
| `default` | `var(--text-default)` |
| `positive` | `var(--green)` |
| `negative` | `var(--red)` |

Modifier classes: `cp-statistic__value--default` (optional explicit), `--positive`, `--negative`.

### Internal styling

- SCSS module: `Statistic.module.scss`, root class `cp-statistic`.
- Follow `.cursor/rules/scss-patterns.mdc`: `cp-` prefix, kebab-case, prefer CSS variables from `reset.scss`.
- Compose `Spinner` only; do not import `Typography`.

### Consumer overrides (v1)

| Mechanism | Supported |
|-----------|-----------|
| `className` on root | Yes |
| `margin` prop | Yes — suffix API per `llms.txt` |
| Targeting documented BEM slot classes | Yes |
| Per-slot `className` / `style` props | **No** |
| Public `--cp-statistic-*` on `:root` | **No** in v1 |

**Documented slot classes** (stable):

- `cp-statistic` — root
- `cp-statistic--small` | `--medium` | `--large`
- `cp-statistic--loading`
- `cp-statistic__title`
- `cp-statistic__content`
- `cp-statistic__prefix`
- `cp-statistic__value`
- `cp-statistic__value--default` | `--positive` | `--negative`
- `cp-statistic__suffix`

Example — card tile with custom padding:

```css
.dashboard-card .cp-statistic {
  padding: var(--space-4);
}
```

### In Card (composition pattern)

No Card component in CleanPlate. Document wrapping with `Container` or app markup:

```tsx
<Container padding="4" display="block" className="metric-card">
  <Statistic
    title="Active"
    value={11.28}
    precision={2}
    valueTone="positive"
    prefix={<Icon name="arrow_upward" size="small" />}
    suffix="%"
  />
</Container>
```

---

## 6. Accessibility

- **Title:** rendered in a `div` (`.cp-statistic__title`), not a heading — parent owns page heading hierarchy.
- **Loading:** `aria-busy={true}` on `__content` while loading; `false` otherwise.
- **Decorative prefix icons:** consumers should pass `aria-hidden` on decorative icons or use `Icon` with appropriate labeling when the icon conveys meaning.
- **No `aria-live` in v1** — values are static; dynamic updates are out of scope.
- **Color:** `valueTone` is visual emphasis; `title` and any suffix text should carry meaning (e.g. `"Active Users"`, `suffix="%"`).

---

## 7. Architecture

```
Statistic
├── formatStatisticValue()  → string (pure util + tests)
├── renderTitle()           → optional __title
└── renderContent()
    ├── loading → <Spinner size={mapped} />
    └── else → prefix + formatted value + suffix
```

**Dependencies:** `Spinner`, `getSpacingClass`, `getClassNames`, `SPACING_OPTIONS`.

**Rejected alternatives (brainstorming):**

| Approach | Why not |
|----------|---------|
| Compose `Typography` | Variant mapping awkward for KPI scales |
| `Intl.NumberFormat` | Conflicts with explicit separator props; string escape hatch suffices |
| Ant-style `classNames` / `styles` | User chose minimal customization |

---

## 8. Testing

**Unit tests (`format-value.test.ts`):**

- Integer grouping: `112893` → `112,893`
- `precision={2}`: `112893` → `112,893.00`
- Custom separators: `groupSeparator=" "`, `decimalSeparator=","`
- Negative numbers: `-1234.5` with precision
- Non-finite: `NaN`, `Infinity` → `"—"`
- String passthrough: no formatting applied

**Component tests (Vitest + Testing Library):**

- Renders title and formatted value
- `loading` shows Spinner, hides prefix/suffix/value
- `valueTone` applies modifier class on value
- `dataTestId` on root
- `className` merged on root
- String `value` rendered verbatim

**Storybook:**

- Basic (integer + precision)
- Prefix icon + suffix text
- Loading
- Positive / negative tones (card-style layout)
- Three sizes side by side

---

## 9. Documentation and exports

- Add `docs/Statistic.md` (props, formatting rules, BEM overrides, card composition, relation to future Timer).
- Register in `llms.txt` component index.
- Export from package entry: `Statistic`, `StatisticProps`, related types.
- **CHANGELOG** entry for new component (minor version bump).
- Note in docs: **`Statistic.Timer` is planned** — not in v1.

---

## 10. Files to touch (implementation preview)

| File | Action |
|------|--------|
| `src/components/statistic/Statistic.tsx` | Create |
| `src/components/statistic/Statistic.module.scss` | Create |
| `src/components/statistic/format-value.ts` | Create |
| `src/components/statistic/format-value.test.ts` | Create |
| `src/components/statistic/Statistic.test.tsx` | Create |
| `src/components/statistic/index.ts` | Create |
| Package barrel (`src/index.ts` or equivalent) | Export component |
| `docs/Statistic.md` | Create |
| `src/stories/statistic/*` | Stories |
| `llms.txt` | Index entry |

No changes to `reset.scss` for v1.

---

## 11. Decisions log (brainstorming)

| Topic | Decision |
|-------|----------|
| Scope | Numeric `Statistic` only — no `Timer` in v1 |
| Formatting | Built-in only; no `formatter`; `value: string \| number` |
| Sizes | `small` \| `medium` \| `large` |
| Value emphasis | `valueTone`: `default` \| `positive` \| `negative` |
| Loading | Title visible; `Spinner` in value row; hide prefix/suffix |
| Customization | Root `className` + `margin` only; BEM documented |
| Implementation | Self-contained + `formatStatisticValue()` util |
| Invalid numbers | Render `"—"` |

---

## 12. Self-review checklist

- [x] No TBD placeholders in behaviour sections.
- [x] API consistent with CleanPlate: `dataTestId`, `margin` suffix, `className`, size naming.
- [x] Scope fits one implementation plan.
- [x] Formatting rules explicit for string vs number vs non-finite.
- [x] Loading behaviour matches user approval (title + Spinner only).
- [x] Out-of-scope list matches all brainstorming decisions.
- [x] No contradiction between minimal customization and documented BEM slots.

---

## 13. References

- Ant Design Statistic: https://ant.design/components/statistic/
- Patterns: `docs/Spinner.md`, `docs/Badge.md`, `docs/FeedbackState.md`, `llms.txt` spacing rules.
- SCSS rules: `.cursor/rules/scss-patterns.mdc`.
