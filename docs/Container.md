# Container Component

Purpose: A layout wrapper that controls display type, width, spacing (margin, padding, gap), and flex alignment. Use it to structure content, create flex layouts, and apply consistent spacing. Below the mobile breakpoint (600px), width variants collapse to full width for a responsive default.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | no | — | Content to render inside the container. |
| margin | string \| string[] | no | "m-0" | Spacing utility token(s) for outer margin, e.g. `m-0` or `["m-1", "m-b-2"]`. |
| padding | string \| string[] | no | "p-4" | Spacing utility token(s) for inner padding, e.g. `p-4` or `["p-2", "p-x-4"]`. |
| display | "block" \| "flex" \| "inline-block" \| "" | no | "" | Layout mode. Use `"flex"` for flexbox; leave empty for no display class. |
| align | "start" \| "center" \| "end" \| "" | no | "" | Flex align-items. Only applies when `display="flex"`. |
| justify | "space-between" \| "center" \| "space-around" \| "space-evenly" \| "flex-end" \| "flex-start" \| "" | no | "" | Flex justify-content. Only applies when `display="flex"`. |
| width | "small" \| "medium" \| "large" \| "extra-large" \| "quarter" \| "half" \| "three-quarters" \| "full" \| "" | no | "" | Width variant. At viewports ≤600px, all variants become full width. |
| gap | string \| string[] | no | "4" | Gap between flex children (e.g. `"4"` or `["2", "g-3"]`). Meaningful when `display="flex"`. |
| showBorder | boolean | no | false | When true, shows a border around the container. |
| className | string | no | "" | Additional class names for the root element. |
| onClick | function | no | — | Click handler for the root div. |
| style | React.CSSProperties | no | — | Inline styles for the root element. |
| ...rest | React.HTMLAttributes<HTMLDivElement> | no | — | Any other div attributes (e.g. `id`, `data-*`, `aria-*`) are forwarded. |

## Types

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### ContainerDisplay
```typescript
type ContainerDisplay = "inline-block" | "block" | "flex";
```

### ContainerWidth
```typescript
type ContainerWidth =
  | "small"
  | "medium"
  | "large"
  | "extra-large"
  | "quarter"
  | "half"
  | "three-quarters"
  | "full";
```

### ContainerJustify
```typescript
type ContainerJustify =
  | "space-between"
  | "center"
  | "space-around"
  | "space-evenly"
  | "flex-end"
  | "flex-start";
```

### ContainerAlign
```typescript
type ContainerAlign = "start" | "center" | "end";
```

### ContainerSpacing
```typescript
type ContainerSpacing = string | SpacingOption[];
```

### ContainerProps
```typescript
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  margin?: ContainerSpacing;
  padding?: ContainerSpacing;
  display?: ContainerDisplay | "";
  align?: ContainerAlign | "";
  justify?: ContainerJustify | "";
  width?: ContainerWidth | "";
  showBorder?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  gap?: ContainerSpacing;
}
```

## Usage Examples

### Block container

```jsx
import { Container } from "cleanplate";

export const Example = () => (
  <Container display="block" padding="p-4" showBorder>
    <p>Block container: full width, content stacks vertically.</p>
  </Container>
);
```

### Flex container with alignment

```jsx
import { Container } from "cleanplate";
import { Button } from "cleanplate";

export const Example = () => (
  <Container
    display="flex"
    justify="space-between"
    align="center"
    padding="p-3"
    gap="2"
    showBorder
  >
    <span>Left</span>
    <Button size="small">Action</Button>
  </Container>
);
```

### Width variants

```jsx
import { Container } from "cleanplate";

export const Example = () => (
  <>
    <Container width="small" showBorder padding="p-3">Small</Container>
    <Container width="medium" showBorder padding="p-3">Medium</Container>
    <Container width="half" showBorder padding="p-3">Half</Container>
    <Container width="full" showBorder padding="p-3">Full</Container>
  </>
);
```

### Inline-block (side by side)

```jsx
import { Container } from "cleanplate";

export const Example = () => (
  <Container display="inline-block" showBorder padding="p-2" margin="m-r-2">
    Block 1
  </Container>
  <Container display="inline-block" showBorder padding="p-2">
    Block 2
  </Container>
);
```

### Margin and padding

```jsx
import { Container } from "cleanplate";

export const Example = () => (
  <>
    <Container margin="m-2" padding="p-4" showBorder>
      Single tokens
    </Container>
    <Container margin={["m-1", "m-b-3"]} padding={["p-2", "p-x-4"]} showBorder>
      Multiple tokens
    </Container>
  </>
);
```

### Flex grid (quarters)

```jsx
import { Container } from "cleanplate";

export const Example = () => (
  <Container display="flex" padding="p-2" gap="2" showBorder>
    <Container width="quarter" showBorder padding="p-3">1</Container>
    <Container width="quarter" showBorder padding="p-3">2</Container>
    <Container width="quarter" showBorder padding="p-3">3</Container>
    <Container width="quarter" showBorder padding="p-3">4</Container>
  </Container>
);
```

### Clickable container

```jsx
import { Container } from "cleanplate";

export const Example = () => (
  <Container
    showBorder
    padding="p-4"
    onClick={() => console.log("Clicked")}
  >
    Clickable area
  </Container>
);
```

### With custom class and style

```jsx
import { Container } from "cleanplate";

export const Example = () => (
  <Container
    className="my-wrapper"
    style={{ minHeight: 200 }}
    padding="p-4"
    showBorder
  >
    Custom wrapper
  </Container>
);
```

## Behavior Notes

- **Responsive width:** For viewport width ≤600px (mobile breakpoint), all `width` variants are overridden to `100%` in CSS. No prop change is required.
- **Flex:** When `display="flex"`, the root uses `display: flex` and `flex-wrap: wrap`. Use `align` and `justify` to control alignment; use `gap` for spacing between children.
- **Spacing:** `margin`, `padding`, and `gap` accept a single token string (e.g. `"p-4"`, `"m-2"`, `"4"`) or an array of tokens (e.g. `["m-1", "m-b-2"]`). They map to design-system spacing utilities.
- **Empty layout props:** Passing `""` or omitting `display`, `align`, `justify`, or `width` means no corresponding class is applied.
- **Border:** `showBorder` only affects border visibility; the container always reserves border space (border is 1px solid, transparent when not shown).
- The root element is a `div`; all standard HTML div attributes and ref are supported via `...rest`.

## Related Components / Links

- Typography (often used inside Container for text)
- Button (commonly placed inside flex Containers)
- MediaObject (often wrapped in Container for layout)
