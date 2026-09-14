---
name: cleanplate-html-prototype
description: Write canonical-frame HTML for CleanPlate components using data-cp attributes and public cp-* CSS classes. Use when authoring Paper/Claude Design sticker sheets, HTML recipes, or design-agent prototypes before React conversion.
---

# CleanPlate HTML prototype authoring

## When to use

- Authoring HTML in Paper, Claude Design, or static HTML before React integration
- Writing `docs/html/kit.html` rows or `## HTML prototype` sections in `docs/<Component>.md`
- Creating `src/html-to-jsx/fixtures/*.html` round-trip tests

## Rules

1. **React API is source of truth.** Encode props as `data-cp` + `data-cp-*` on tagged nodes.
2. **Public `cp-*` classes are visual only.** The converter ignores them; use them so Paper/CSS matches Storybook.
3. **Suffix-only spacing** in `data-cp-margin`, `data-cp-padding`, `data-cp-gap`: `"b-2"`, `"4"` — never `"m-b-2"` or `"p-4"`.
4. **No callbacks** in HTML (`onClick`, `onChange`, etc.). Hand-wire after CLI conversion.
5. **Strip decorative geometry** from inline styles (`top`, `left`, `transform`, `width`, `maxHeight`). Tier 4 floaters use canonical `cp-*` placement CSS.
6. **Overlays (Tier 2+)** go at artboard root (`position: fixed`), not inside `overflow: hidden` frames.
7. **Table / AppShell** need `data-cp-recipe` and two artboards — one HTML file cannot represent both breakpoints.

## Workflow

1. Read `docs/<Component>.md` for props, enums, and the HTML prototype recipe.
2. Read `node_modules/cleanplate/llms.txt` for global spacing and Typography rules.
3. Tag the root node: `data-cp="Button"` (or `FormControls.Input` for namespaced exports).
4. Add non-default props: `data-cp-variant="outline"`, `data-cp-margin="b-2"`.
5. Add public classes for Paper preview: `class="cp-button cp-button--outline cp-m-b-2"`.
6. For composites with slots (Dropdown, Modal): `data-cp-slot="trigger"` / `data-cp-slot="content"`.
7. Run the converter (see `cleanplate-html-to-react` skill) before shipping JSX.

## v1 primitives (Tier 1)

Button, Typography, Icon, Container, Alert, Badge, Avatar, Spinner, FormControls.Input

## Example (Button)

```html
<button
  data-cp="Button"
  data-cp-variant="outline"
  data-cp-margin="b-2"
  class="cp-button cp-button--outline cp-m-b-2"
>
  Save
</button>
```

## Kit reference

See `docs/html/kit.html` for a sticker sheet of all v1 primitives with fonts and `dist/index.css`.
