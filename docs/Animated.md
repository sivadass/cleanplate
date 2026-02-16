# Animated Component

Purpose: Atom that adds scroll-triggered entrance (or exit) animations to any content. Uses IntersectionObserver to detect when the element enters the viewport, then applies a CSS animation class. Use it to animate headings, cards, avatars, or any wrapper content as the user scrolls. Supports polymorphic `as`, delay for staggering, and margin (suffix API).

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| animationType | AnimationType | no | "fade-in-bottom" | Animation when in view: fade-in-top, fade-in-right, fade-in-bottom, fade-in-left, fade-out-top, fade-out-right, fade-out-bottom, fade-out-left. |
| as | React.ElementType | no | "span" | Root element or component to render. |
| margin | string \| SpacingOption[] | no | ["0"] | Margin spacing. Suffix or array of spacing suffixes; component adds `m-` prefix. |
| delay | number | no | 0 | Delay in ms; maps to class `delay-{delay}` (e.g. 200 → delay-200) for staggered animations. |
| className | string | no | "" | Additional class names for the root element. |
| isBlock | boolean | no | false | If true, applies block display. |
| ...rest | React.HTMLAttributes<HTMLElement> | no | — | Any other HTML attributes forwarded to the root element. |

## Types

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### AnimatedMargin
```typescript
type AnimatedMargin = string | SpacingOption[];
```

### AnimationType
```typescript
type AnimationType = (typeof ANIMATION_TYPE_OPTIONS)[number];
// "fade-in-top" | "fade-in-right" | "fade-in-bottom" | "fade-in-left" |
// "fade-out-top" | "fade-out-right" | "fade-out-bottom" | "fade-out-left"
```

### AnimationDelay
```typescript
type AnimationDelay = (typeof ANIMATION_DELAY_OPTIONS)[number];
// number (e.g. 100, 200, ... 3000)
```

### AnimatedProps
```typescript
interface AnimatedProps extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  animationType?: AnimationType;
  as?: React.ElementType;
  margin?: AnimatedMargin;
  delay?: number;
  className?: string;
  isBlock?: boolean;
}
```

## Usage Examples

### Basic

```jsx
import { Animated } from "cleanplate";

<Animated animationType="fade-in-bottom">
  <h2>Animates when in view</h2>
</Animated>
```

### Staggered delay

```jsx
<Animated animationType="fade-in-bottom">First</Animated>
<Animated animationType="fade-in-bottom" delay={200}>Second</Animated>
<Animated animationType="fade-in-bottom" delay={400}>Third</Animated>
```

### With `as` and isBlock

```jsx
<Animated as="div" isBlock animationType="fade-in-bottom">
  <section>Block-level content</section>
</Animated>
```

### Animation types

```jsx
<Animated animationType="fade-in-top">Content</Animated>
<Animated animationType="fade-in-bottom">Content</Animated>
<Animated animationType="fade-in-left">Content</Animated>
<Animated animationType="fade-in-right">Content</Animated>
```

## Behavior Notes

- **IntersectionObserver:** The root element is observed on mount. When it intersects the viewport, the animation class is applied and the observer unobserves it (one-shot per mount).
- **Delay:** The `delay` value is used to build a class name `delay-{delay}`. Styles must define the corresponding `animation-delay` for that class (e.g. `.delay-200 { animation-delay: 200ms; }`).
- **Spacing:** `margin` uses the suffix API; the component adds the `m-` prefix via `getSpacingClass`.

## Related Components / Links

- Container (layout around animated content)
- Typography, Avatar, Badge, Button (common content wrapped by Animated)
- Header, BottomSheet, MenuList (use Animated internally)
