# Footer Component

Purpose: Customizable footer with copyright text, optional powered-by link, and custom content via children. Use for app footers with branding, legal links, or column layouts. Supports sizes (small, medium, large), variants (light, dark), and margin spacing.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| margin | string \| SpacingOption[] | no | "0" | Spacing suffix(s) for outer margin; component adds m- prefix. |
| size | "small" \| "medium" \| "large" | no | "large" | Size of the footer. |
| variant | "light" \| "dark" | no | "light" | Visual variant. |
| brandName | string | no | "" | Brand name shown in copyright (e.g. "Acme Inc"). |
| poweredByLabel | string | no | "" | Label for the powered-by link (e.g. "Powered by X"). |
| poweredByLink | string | no | "" | URL for the powered-by link; shown when poweredByLabel is also set. |
| children | ReactNode | no | — | Custom content rendered above the copyright line. |
| className | string | no | "" | Additional class names for the root element. |

## Types

### FooterSize
```typescript
type FooterSize = "small" | "medium" | "large";
```

### FooterVariant
```typescript
type FooterVariant = "light" | "dark";
```

### FooterMargin
```typescript
type FooterMargin = string | SpacingOption[];
```

### FooterProps
```typescript
interface FooterProps {
  margin?: FooterMargin;
  size?: FooterSize;
  variant?: FooterVariant;
  brandName?: string;
  poweredByLabel?: string;
  poweredByLink?: string;
  children?: React.ReactNode;
  className?: string;
}
```

## Usage Examples

### Basic

```jsx
import { Footer } from "cleanplate";

<Footer brandName="Acme Inc" />
```

### With powered-by link

```jsx
<Footer
  brandName="Acme Inc"
  poweredByLabel="Powered by Sivadass"
  poweredByLink="https://sivadass.in"
/>
```

### With custom content

```jsx
<Footer brandName="Acme Inc">
  <Container display="flex" gap="4">
    <Container width="quarter">
      <Typography variant="h6" margin={["0", "b-2"]}>Links</Typography>
      <ul><li><a href="/contact">Contact</a></li></ul>
    </Container>
  </Container>
</Footer>
```

## Behavior Notes

- **Copyright:** Uses current year and `brandName` in "© {year} {brandName}. All rights reserved."
- **Powered-by:** Link shows only when both `poweredByLabel` and `poweredByLink` are set; link has `rel="noopener noreferrer"`.
- **children:** Rendered in a wrapper div above the copyright line.
- **Margin:** Uses the suffix API (e.g. `"0"` → m-0).

## Related Components / Links

- Container (layout for footer columns or custom content)
- Typography (used internally for copyright)
- Header (often paired with Footer for app layout)
