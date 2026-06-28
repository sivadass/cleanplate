# Statistic Component

Purpose: Displays a labeled numeric metric for dashboards and summary tiles — optional title, formatted value, prefix/suffix, loading state, and semantic value coloring. Use it to highlight KPIs; not for inline tags (`Badge`) or general text (`Typography`). **Margin** uses the **framework-wide spacing suffix rule** (same for all components); see `llms.txt`.

**Note:** `Statistic.Timer` (countdown/countup) is planned for a future release — not in v1.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| title | ReactNode | no | — | Label above the value row. |
| value | string \| number | no | — | Metric value; see formatting rules below. |
| precision | number | no | — | Fixed decimal places when `value` is a number. |
| groupSeparator | string | no | `","` | Thousands separator for numeric values. |
| decimalSeparator | string | no | `"."` | Decimal separator for numeric values. |
| prefix | ReactNode | no | — | Node before value; hidden when `loading`. |
| suffix | ReactNode | no | — | Node after value; hidden when `loading`. |
| valueTone | `"default"` \| `"positive"` \| `"negative"` | no | `"default"` | Semantic color on the value text only. |
| size | `"small"` \| `"medium"` \| `"large"` | no | `"medium"` | Title and value typographic scale. |
| loading | boolean | no | `false` | Show `Spinner` in value row; title stays visible. |
| margin | string \| string[] | no | `"0"` | Spacing **suffix** for outer margin. The component adds the `m-` prefix (e.g. `"0"` → m-0, `"b-2"` → m-b-2). |
| className | string | no | `""` | Additional class names on the root element. |
| dataTestId | string | no | — | `data-testid` on the root element. |

## Types

### StatisticSize
```typescript
type StatisticSize = "small" | "medium" | "large";
```

### StatisticValueTone
```typescript
type StatisticValueTone = "default" | "positive" | "negative";
```

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### StatisticMargin
```typescript
type StatisticMargin = string | SpacingOption[];
```

### StatisticProps
```typescript
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
  margin?: StatisticMargin;
  className?: string;
  dataTestId?: string;
}
```

## Value formatting

1. **`value` is `string`:** rendered verbatim; `precision` and separators are ignored.
2. **`value` is `number`:** non-finite values (`NaN`, `±Infinity`) render as `—`. Otherwise apply `precision` (if set), group the integer part with `groupSeparator`, and join fractional part with `decimalSeparator`.
3. **`value` omitted:** no value text is rendered (title still shows if set).

## Usage Examples

### Basic

```jsx
import { Statistic } from "cleanplate";

export const Example = () => (
  <Statistic title="Active Users" value={112893} />
);
```

### Precision

```jsx
<Statistic title="Account Balance (CNY)" value={112893} precision={2} />
```

### Prefix and suffix

```jsx
import { Statistic, Icon } from "cleanplate";

<Statistic
  title="Feedback"
  value={1128}
  prefix={<Icon name="thumb_up" size="small" />}
/>
<Statistic title="Unmerged" value={93} suffix="/ 100" />
```

### Loading

```jsx
<Statistic title="Active Users" value={112893} loading />
```

### Value tones

```jsx
import { Statistic, Icon } from "cleanplate";

<Statistic
  title="Active"
  value={11.28}
  precision={2}
  valueTone="positive"
  prefix={<Icon name="arrow_upward" size="small" />}
  suffix="%"
/>
<Statistic
  title="Idle"
  value={9.3}
  precision={2}
  valueTone="negative"
  prefix={<Icon name="arrow_downward" size="small" />}
  suffix="%"
/>
```

### Pre-formatted string value

```jsx
<Statistic title="Revenue" value="¥1.2M" />
```

### In a card (composition)

CleanPlate has no `Card` component — wrap with `Container` or app markup:

```jsx
import { Statistic, Container, Icon } from "cleanplate";

<Container padding="4" display="block">
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

### Sizes

```jsx
<Statistic title="Small" value={112893} size="small" />
<Statistic title="Medium" value={112893} size="medium" />
<Statistic title="Large" value={112893} size="large" />
```

## Behavior Notes

- **Loading:** Title remains visible. The value row shows a `Spinner` sized to match `size`. `prefix` and `suffix` are not rendered while loading. The content row sets `aria-busy={true}` (no `--loading` CSS modifier on the root).
- **Layout:** Title stacked above a horizontal row (`prefix` + value + `suffix`), baseline-aligned with tabular numerals (`font-variant-numeric: tabular-nums` on the content row).
- **Accessibility:** Title renders in a `div` (not a heading) — parent owns page heading hierarchy. Value formatting is skipped while `loading`.
- **Customization:** Override via root `className` or target documented `cp-` slot classes in CSS (no per-slot `className` or `style` props in v1).

### Documented slot classes

- `cp-statistic` — root
- `cp-statistic-small` | `cp-statistic-medium` | `cp-statistic-large`
- `cp-statistic-title`
- `cp-statistic-content`
- `cp-statistic-prefix`
- `cp-statistic-value`
- `cp-statistic-value-positive` | `cp-statistic-value-negative`
- `cp-statistic-suffix`

Example override:

```css
.dashboard-card .cp-statistic {
  padding: var(--space-4);
}
```

## Related Components / Links

- Spinner (loading state inside value row)
- Icon (often used in `prefix` / `suffix`)
- Container (layout and card-style wrappers)
- Badge (short status labels — not KPI metrics)
- Table (tabular data; Statistic for dashboard tiles)
