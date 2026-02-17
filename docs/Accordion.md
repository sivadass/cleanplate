# Accordion Component

Purpose: Displays collapsible panels from an array of title and content items. Use for FAQ sections, feature lists, or expandable content. Supports grouped or spaced layout, icon styles (expand arrows or plus/minus), semantic headings (h2–h6) for SEO FAQ pages, allowMultiple, and margin/padding spacing.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| items | AccordionItem[] | yes | — | Array of { title, content } items. |
| allowMultiple | boolean | no | false | Allow multiple panels open at once. |
| defaultExpandedIndex | number \| number[] | no | 0 | Index(es) of panel(s) open initially. |
| iconVariant | "expand" \| "plus" | no | "expand" | Icon style: expand (arrows) or plus (+/-). |
| variant | "grouped" \| "spaced" | no | "grouped" | Visual layout: grouped (one unit) or spaced (separate items, e.g. FAQ). |
| titleTag | "span" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" | no | "span" | Semantic HTML for title; h2–h6 for SEO FAQ pages. |
| margin | string \| SpacingOption[] | no | — | Spacing suffix(s) for outer margin; component adds m- prefix. |
| padding | string \| SpacingOption[] | no | — | Spacing suffix(s) for inner padding; component adds p- prefix. |
| className | string | no | "" | Additional class names for the root element. |

## Types

### AccordionItem
```typescript
interface AccordionItem {
  title: string;
  content: React.ReactNode;
}
```

### AccordionIconVariant
```typescript
type AccordionIconVariant = "expand" | "plus";
```

### AccordionVariant
```typescript
type AccordionVariant = "grouped" | "spaced";
```

### AccordionTitleTag
```typescript
type AccordionTitleTag = "span" | "h2" | "h3" | "h4" | "h5" | "h6";
```

### AccordionMargin / AccordionPadding
```typescript
type AccordionMargin = string | SpacingOption[];
type AccordionPadding = string | SpacingOption[];
```

### AccordionProps
```typescript
interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpandedIndex?: number | number[];
  iconVariant?: AccordionIconVariant;
  variant?: AccordionVariant;
  titleTag?: AccordionTitleTag;
  margin?: AccordionMargin;
  padding?: AccordionPadding;
  className?: string;
}
```

## Usage Examples

### Basic

```jsx
import { Accordion } from "cleanplate";

const items = [
  { title: "Section 1", content: "Content for section 1." },
  { title: "Section 2", content: "Content for section 2." },
];

<Accordion items={items} />
```

### FAQ (SEO-friendly)

```jsx
<Accordion
  items={faqItems}
  variant="spaced"
  titleTag="h3"
  iconVariant="plus"
/>
```

### Variants and icons

```jsx
<Accordion items={items} variant="grouped" />
<Accordion items={items} variant="spaced" />
<Accordion items={items} iconVariant="expand" />
<Accordion items={items} iconVariant="plus" />
```

### Initial panel(s)

```jsx
<Accordion items={items} defaultExpandedIndex={1} />
<Accordion items={items} allowMultiple defaultExpandedIndex={[0, 2]} />
```

### With spacing

```jsx
<Accordion items={items} margin="b-2" padding="4" />
```

## Behavior Notes

- **items:** Each item has `title` (string) and `content` (string or ReactNode). String content is wrapped in Typography.
- **titleTag:** When h2–h6, titles render as headings for SEO; header uses role="button" with keyboard support.
- **variant:** grouped = single bordered block; spaced = separate items with gap.
- **defaultExpandedIndex:** Single number or array; controls which panel(s) are open on initial render.
- **Margin/padding:** Uses suffix API (e.g. `"0"` → m-0, `"4"` → p-4).

## Related Components / Links

- Container (layout around accordion)
- Typography (used internally for title and string content)
- Icon (used for expand/collapse indicator)
