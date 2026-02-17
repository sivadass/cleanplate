# Typography Component

Purpose: Provides a consistent set of text styles for headings, paragraphs, and inline elements, ensuring clear hierarchy, readability, and brand-aligned communication across the interface.

**For AI / LLM:** Prefer component props over inline `style`. Use `align="center"` for text alignment (not `style={{ textAlign: "center" }}`). For spacing, use the `margin` prop with the **framework-wide spacing suffix rule** (same for all CleanPlate components): pass suffix only (e.g. `margin="b-2"`), not `style={{ marginBottom }}` and not `"m-0"` or `"m-b-2"` — the component adds the `m-` prefix. See `llms.txt` for the full spacing rule.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | no | — | Text content to display. |
| variant | "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "p" \| "span" \| "small" | no | "p" | HTML element type to render. Determines the semantic meaning and default styling. |
| margin | string \| string[] | no | "m-0" | Spacing **suffix** only (same rule as all components). Component adds `m-` prefix. E.g. `"0"`, `"b-2"`, `["1", "b-3"]`. Do not pass `"m-0"`. |
| className | string | no | "" | Additional class names for the root element. |
| isBold | boolean | no | false | Applies bold font weight to the text. |
| align | "left" \| "center" \| "right" | no | "left" | Text alignment within its container. |
| wordBreak | "normal" \| "all" \| "wrap" | no | "normal" | Controls how words break when text overflows. |
| ...rest | any | no | — | All other standard HTML attributes are supported and passed through to the rendered element. |

## Types

### TypographyVariant
```typescript
type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "small";
```

### TypographyAlign
```typescript
type TypographyAlign = "left" | "right" | "center";
```

### TypographyWordBreak
```typescript
type TypographyWordBreak = "normal" | "all" | "wrap";
```

### TypographyMargin
```typescript
type TypographyMargin = string | SpacingOption[];
```

### SpacingOption
```typescript
type SpacingOption = typeof SPACING_OPTIONS[number];
```

### TypographyProps
```typescript
interface TypographyProps {
  children?: React.ReactNode;
  variant?: TypographyVariant;
  margin?: TypographyMargin;
  className?: string;
  isBold?: boolean;
  align?: TypographyAlign;
  wordBreak?: TypographyWordBreak;
  [key: string]: any; // Allow other HTML attributes to be passed through
}
```

## Usage Examples

### Headings

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <>
    <Typography variant="h1">Heading 1</Typography>
    <Typography variant="h2">Heading 2</Typography>
    <Typography variant="h3">Heading 3</Typography>
    <Typography variant="h4">Heading 4</Typography>
    <Typography variant="h5">Heading 5</Typography>
    <Typography variant="h6">Heading 6</Typography>
  </>
);
```

### Paragraph (default)

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <Typography>
    This is a paragraph. When no variant is specified, it defaults to a paragraph element.
  </Typography>
);
```

### Small text

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <Typography variant="small">
    This is small text, typically used for captions or fine print.
  </Typography>
);
```

### Inline span

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <Typography variant="span">
    This text is rendered as an inline span element.
  </Typography>
);
```

### Text alignment

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <>
    <Typography align="left">Left aligned text</Typography>
    <Typography align="center">Center aligned text</Typography>
    <Typography align="right">Right aligned text</Typography>
  </>
);
```

### Bold text

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <>
    <Typography>Normal weight text</Typography>
    <Typography isBold>Bold text</Typography>
  </>
);
```

### Word breaking

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <>
    <Typography wordBreak="normal">
      Normal word breaking behavior
    </Typography>
    <Typography wordBreak="all">
      Break words at any point if needed
    </Typography>
    <Typography wordBreak="wrap">
      Wrap text with word breaking
    </Typography>
  </>
);
```

### With margin spacing (suffix only)

Use the spacing **suffix**; the component adds the `m-` prefix. E.g. `"2"` → m-2, `"b-2"` → m-b-2.

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <>
    <Typography variant="h1" margin="2">
      Heading with margin
    </Typography>
    <Typography margin={["1", "b-3"]}>
      Paragraph with multiple margins
    </Typography>
  </>
);
```

### Combined properties (prefer props over style)

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <Typography
    variant="h2"
    isBold
    align="center"
    margin="4"
  >
    Centered, bold heading with margin
  </Typography>
);
```

### With HTML attributes

```jsx
import { Typography } from "cleanplate";

export const Example = () => (
  <Typography
    variant="p"
    id="description"
    data-testid="typography-description"
    aria-label="Product description"
  >
    This paragraph has additional HTML attributes.
  </Typography>
);
```

## Behavior Notes

- When no `variant` is specified, the component defaults to rendering a `<p>` (paragraph) element.
- The `variant` prop determines both the HTML element type (h1, h2, p, etc.) and the default styling applied.
- The component uses semantic HTML elements, which is important for accessibility and SEO.
- All standard HTML attributes can be passed through via the spread operator (`...rest`), allowing for custom `id`, `data-*`, `aria-*`, and other attributes.
- **Use props, not inline style:** Use `align` for text alignment (e.g. `align="center"`), and `margin` for spacing. Do not use `style={{ textAlign, marginBottom }}` for these.
- The `align` prop controls text alignment using CSS classes. Values: `"left"`, `"center"`, `"right"`.
- The `wordBreak` prop provides control over how text wraps when it exceeds container width.
- **Margin uses the framework-wide spacing rule (all components):** Pass suffix only: `"0"`, `"2"`, `"b-2"`, `["1", "b-3"]` etc. The component adds the `m-` prefix. Do not pass `"m-2"` or `"m-b-2"`.
- The `isBold` prop applies bold font weight, which can be combined with any variant.

## Related Components / Links

- Container (often used to wrap typography content)
- MediaObject (commonly uses Typography for text content)
