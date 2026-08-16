# Migrating to CleanPlate 1.0 public CSS classes

CleanPlate 1.0 ships **stable, unhashed** CSS class names on `dist/index.css`. Every component-local class is prefixed with `cp-` (for example `cp-button`, `cp-modal__body`).

## What changed

| Before (0.3.x) | After (1.0) |
| --- | --- |
| Hashed module classes such as `cp-button-a1b2c` | Exact `cp-button`, `cp-button--medium`, … |
| Class names differed per build/file hash | Class names are stable across builds |
| HTML prototypes could not target component chrome reliably | HTML + `dist/index.css` can mirror React markup |

## If you only use React

No change is required for typical usage:

- Keep importing components from `cleanplate`.
- Keep passing `className` for your own styles — component `className` props still merge with internal `cp-*` classes.
- There is **no dual class system**; hashed names are removed, not aliased.

## If you targeted hashed classes in custom CSS

Replace selectors that matched hash suffixes with the public `cp-*` name:

```css
/* Before */
.my-page .cp-button-x7k2p { margin-top: 8px; }

/* After */
.my-page .cp-button { margin-top: 8px; }
```

Use the BEM-style modifiers documented in each component's `docs/<Component>.md` file (for example `cp-button--outline`, `cp-modal--large`).

## Spacing utilities

Spacing props still use **suffix-only** values (`margin="b-2"`, `padding="4"`). The generated utility classes are `cp-m-*`, `cp-p-*`, and `cp-g-*`.

## Storybook and visual tests

Storybook and the Playwright visual suite use the same unhashed names. Pixel baselines captured before the migration remain valid when markup and tokens are unchanged.

## Need help?

Open an issue at [github.com/sivadass/cleanplate](https://github.com/sivadass/cleanplate) with the component name and the selector you were overriding.
