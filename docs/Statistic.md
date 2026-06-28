# Statistic Component

Purpose: Displays a labeled numeric metric for dashboards and summary tiles — optional title, formatted value, prefix/suffix, loading state, semantic value coloring, and optional card-style layout with icon, progress, description, and footer badge. Use it to highlight KPIs; not for inline tags (`Badge`) or general text (`Typography`). **Margin** uses the **framework-wide spacing suffix rule** (same for all components); see `llms.txt`.

**Note:** `Statistic.Timer` (countdown/countup) is planned for a future release — not in v1.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| title | ReactNode | no | — | Label above the value row (or in the header row when `icon` or `variant="card"`). |
| value | string \| number | no | — | Metric value; see formatting rules below. |
| precision | number | no | — | Fixed decimal places when `value` is a number. |
| groupSeparator | string | no | `","` | Thousands separator for numeric values. |
| decimalSeparator | string | no | `"."` | Decimal separator for numeric values. |
| prefix | ReactNode | no | — | Node before value; hidden when `loading`. |
| suffix | ReactNode | no | — | Node after value; hidden when `loading`. |
| icon | ReactNode | no | — | Node in the header row beside `title` (often `<Icon />`). |
| description | ReactNode | no | — | Subtext below value/progress (e.g. "8 active members"); hidden when `loading`. |
| progress | `StatisticProgress` | no | — | Progress bar below value; composes `ProgressBar`. Hidden when `loading`. |
| footer | `StatisticFooter` | no | — | Bottom row with optional label and badge; hidden when `loading`. |
| variant | `"plain"` \| `"card"` | no | `"plain"` | `"card"` adds border, padding, and white background. |
| tone | `"neutral"` \| `"success"` \| `"warning"` \| `"danger"` \| `"muted"` | no | `"neutral"` | Semantic tone for icon accent, value color, card surface (when `variant="card"`), and default `progress` / `footer.badge` variants. |
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

### StatisticTone
```typescript
type StatisticTone = "neutral" | "success" | "warning" | "danger" | "muted";
```

| Tone | Use for | Card surface | Value color | Default progress | Default badge |
| --- | --- | --- | --- | --- | --- |
| `neutral` | Totals / informational | White | Default | `default` | `default` |
| `success` | Completed / positive | Green tint | Default | `success` | `success` |
| `warning` | Attention needed | Orange tint | Default | `warning` | `warning` |
| `danger` | Critical / overdue | Red tint | Red | `error` | `error` |
| `muted` | Zero-state / inactive | Gray tint | Muted | `info` | `info` |

Override progress or badge colors with `progress.variant` or `footer.badgeVariant` when needed.

### StatisticVariant
```typescript
type StatisticVariant = "plain" | "card";
```

### StatisticProgress
```typescript
type StatisticProgressVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "error"
  | "warning";

interface StatisticProgress {
  value: number; // 0–100, passed to ProgressBar
  variant?: StatisticProgressVariant;
  size?: "small" | "medium" | "large";
}
```

### StatisticFooter
```typescript
interface StatisticFooter {
  label?: React.ReactNode;
  badge?: React.ReactNode; // string renders Badge; ReactNode renders as-is
  badgeVariant?: BadgeVariant;
}
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
  icon?: React.ReactNode;
  description?: React.ReactNode;
  progress?: StatisticProgress;
  footer?: StatisticFooter;
  variant?: StatisticVariant;
  tone?: StatisticTone;
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

### Semantic tones

```jsx
<Statistic variant="card" tone="neutral" title="Total billed" value={9000} prefix="₹" />
<Statistic variant="card" tone="success" title="Collected" value={3375} progress={{ value: 38 }} />
<Statistic variant="card" tone="warning" title="Outstanding" value={5625} prefix="₹" />
<Statistic variant="card" tone="danger" title="Overdue (>30d)" value={0} prefix="₹" />
<Statistic variant="card" tone="muted" title="Waived" value={0} progress={{ value: 0 }} />
```

### Value emphasis (plain)

```jsx
import { Statistic, Icon } from "cleanplate";

<Statistic
  variant="card"
  tone="success"
  title="Active"
  value={11.28}
  precision={2}
  prefix={<Icon name="arrow_upward" size="small" />}
  suffix="%"
/>
<Statistic variant="card" tone="danger" title="Overdue" value={0} prefix="₹" />
```

### Pre-formatted string value

```jsx
<Statistic title="Revenue" value="¥1.2M" />
```

### Card variant with icon and description

```jsx
import { Statistic, Icon } from "cleanplate";

<Statistic
  variant="card"
  icon={<Icon name="group" size="small" />}
  title="Total billed"
  value={9000}
  prefix="₹"
  description="8 active members"
/>
```

### Progress and footer badge

```jsx
<Statistic
  variant="card"
  tone="success"
  icon={<Icon name="check_circle" size="small" />}
  title="Paid dues"
  value={3}
  progress={{ value: 38 }}
  footer={{ label: "of 8 total", badge: "38%" }}
/>
```

### Dashboard grid (composition)

Use `Container` for multi-card layouts — no built-in grid component:

```jsx
import { Statistic, Container, Icon, Typography } from "cleanplate";

<Container padding="4" display="block" gap="4">
  <Container display="flex" gap="4" style={{ flexWrap: "wrap" }}>
    <Container display="block" style={{ flex: "1 1 200px" }}>
      <Statistic
        variant="card"
        icon={<Icon name="group" size="small" />}
        title="Total billed"
        value={9000}
        prefix="₹"
        description="8 active members"
      />
    </Container>
    <Container display="block" style={{ flex: "1 1 200px" }}>
      <Statistic
        variant="card"
        icon={<Icon name="check_circle" size="small" />}
        title="Collected"
        value={3375}
        prefix="₹"
        progress={{ value: 38, variant: "success", size: "small" }}
        description="38% collection rate"
      />
    </Container>
  </Container>

  <Typography variant="h5" margin="b-2">
    Due status breakdown
  </Typography>
  <Container display="flex" gap="4" style={{ flexWrap: "wrap" }}>
    {/* more Statistic cards */}
  </Container>
</Container>
```

### Sizes

```jsx
<Statistic title="Small" value={112893} size="small" />
<Statistic title="Medium" value={112893} size="medium" />
<Statistic title="Large" value={112893} size="large" />
```

## Behavior Notes

- **Loading:** Title and icon remain visible. The value row shows a `Spinner` sized to match `size`. `prefix`, `suffix`, `progress`, `description`, and `footer` are not rendered while loading. The content row sets `aria-busy={true}`.
- **Header row:** When `variant="card"` or `icon` is set, `title` renders in a horizontal header row with the icon. Otherwise `title` stacks above the value row as before.
- **Layout:** Value row is horizontal (`prefix` + value + `suffix`), baseline-aligned with tabular numerals (`font-variant-numeric: tabular-nums` on the content row).
- **Progress:** Composes `ProgressBar` with `progress.value` (0–100). Default bar size is `small`; override via `progress.size`.
- **Footer badge:** When `footer.badge` is a string, renders `Badge` using `footer.badgeVariant` or the tone default. Pass a `ReactNode` for custom badge content.
- **Accessibility:** Title renders in a `div` (not a heading) — parent owns page heading hierarchy. Value formatting is skipped while `loading`.
- **Customization:** Override via root `className` or target documented `cp-` slot classes in CSS (no per-slot `className` or `style` props).

### Documented slot classes

- `cp-statistic` — root
- `cp-statistic-card`
- `cp-statistic-small` | `cp-statistic-medium` | `cp-statistic-large`
- `cp-statistic-header`
- `cp-statistic-icon`
- `cp-statistic-title`
- `cp-statistic-content`
- `cp-statistic-prefix`
- `cp-statistic-value`
- `cp-statistic-tone-neutral` | `cp-statistic-tone-success` | `cp-statistic-tone-warning` | `cp-statistic-tone-danger` | `cp-statistic-tone-muted`
- `cp-statistic-suffix`
- `cp-statistic-progress`
- `cp-statistic-description`
- `cp-statistic-footer`
- `cp-statistic-footer-label`
- `cp-statistic-footer-badge`

Example override:

```css
.dashboard-card .cp-statistic {
  padding: var(--space-4);
}
```

## Related Components / Links

- Spinner (loading state inside value row)
- Icon (header icon, or `prefix` / `suffix`)
- ProgressBar (composed when `progress` is set)
- Badge (composed for string `footer.badge`)
- Container (multi-card dashboard layouts)
- Typography (section headings above stat groups)
- Table (tabular data; Statistic for dashboard tiles)
