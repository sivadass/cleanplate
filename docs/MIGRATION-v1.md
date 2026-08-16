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

Spacing props still use **suffix-only** values (`margin="b-2"`, `padding="4"`). The generated utility classes are `cp-m-*`, `cp-p-*`, and `cp-g-*`. Do not pass CSS-class-style prefixes (`m-`, `p-`, `g-`) in prop values.

## Prototype attributes (`data-cp`) are opt-in

`data-cp` / `data-cp-*` are **not** a production API. Published `dist/` components do **not** emit them on consumer markup. They exist only for HTML prototypes and Storybook round-trips.

To emit them in an app (prototype only), wrap the tree in `CleanPlatePrototypeAttributes`. Storybook already does this; production apps should leave the provider off.

## HTML → JSX

Design agents author canonical-frame HTML with `data-cp` + public `cp-*` classes, then convert mechanically — do not invent JSX by hand:

```bash
npm run html-to-jsx -- recipe.html
```

See `llms.txt` (HTML prototype section), `skills/cleanplate-html-to-react/SKILL.md`, and each component's `## HTML prototype` recipe in `docs/<Component>.md`. Sticker sheet: `docs/html/kit.html`.

## Storybook and visual tests

Storybook and the Playwright visual suite use the same unhashed names. Pixel baselines captured before the migration remain valid when markup and tokens are unchanged.

## Need help?

Open an issue at [github.com/sivadass/cleanplate](https://github.com/sivadass/cleanplate) with the component name and the selector you were overriding.
