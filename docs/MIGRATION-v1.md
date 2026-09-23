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

## Button sizes (1.0.0-beta.x)

- `small` remapped from 24px to **32px**; `medium` (default) from 50px to **44px**; `min-width: 96px` removed on medium.
- New **`large`** size at **52px**.
- `variant="icon"` is now a **square** at the size height, not a circle.
- New props: **`prefixIcon`** and **`suffixIcon`** (Material Symbol names).
- Default Button (`medium`, 44px) now matches default boxed form fields. Use the same `size` on buttons and fields that sit on one row.
- Height and radius tokens are shared with form controls: `--cp-form-control-height-*` and `--cp-form-control-radius-*`. `--cp-button-height-*` is removed.

See `docs/Button.md` for the full size table and HTML prototype recipes.

## Form control sizes (1.0.0-beta.x)

- Boxed fields share Button heights: `small` **32px**, `medium` (default) **44px** (was 50px), `large` **52px**.
- New `size` prop on `Input`, `TextArea`, `Select`, `Date`, `ColorPicker`, `Stepper`, `SegmentedControl`, and `File` (button variant).
- `SegmentedControl` `small` remaps 40px → 32px; `medium` 50px → 44px; `large` is new at 52px.
- Checkbox, Radio, Toggle, and File **card** are not sized.
- Public tokens are `--cp-form-control-height-small|medium|large` and `--cp-form-control-radius-small|medium|large` (shared with Button). `--cp-form-control-radius` (single token) and font / pad-x / icon / textarea-min tokens are not public.

See `docs/FormControls.md`.

## Pagination sizes (1.0.0-beta.x)

- Page-number / prev / next buttons and the rows-per-page Select are locked to **small** (32px height, 8px radius) to sit lighter under tables than default Button / Select medium.
- The rows-per-page trigger is no longer 36px. Pagination has no `size` prop.

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

## Typography type scale (1.0.0-beta.x)

Visual remap only. `variant` names and `cp-typography--*` classes are unchanged.

| Variant | Before | After |
| --- | --- | --- |
| `h1` | 60px / 60px | 48px / 56px / 700 / −0.03em |
| `h2` | 50px / 50px | 32px / 40px / 700 / −0.02em |
| `h3` | 40px / 40px | 24px / 32px / 700 / −0.015em |
| `h4` | 30px / 30px | 20px / 28px / 600 |
| `h5` | 24px / 24px | 16px / 24px / 600 |
| `h6` | 18px / 18px | 14px / 20px / 600 |
| `p` / `span` | 16px / 24px | 16px / 24px / 400 |
| `small` | 14px / 20px | 12px / 16px / 400 |

`h5` is now body-sized semibold — use `h3` or `h4` for 24/20. Apps that need the old 14px caption should use `h6` or a local style. Override tokens after importing `cleanplate/dist/index.css` (for example `--cp-font-size-4xl`) rather than targeting hashed classes.

## Need help?

Open an issue at [github.com/sivadass/cleanplate](https://github.com/sivadass/cleanplate) with the component name and the selector you were overriding.
