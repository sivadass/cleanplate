---
name: cleanplate-html-to-react
description: Convert CleanPlate HTML prototypes to React JSX using the mechanical html-to-jsx CLI. Use when implementing design-agent HTML, running fixture tests, or producing React from data-cp recipes. Never invent JSX by hand.
---

# CleanPlate HTML → React conversion

## When to use

- Converting `data-cp` HTML recipes to CleanPlate React JSX
- Verifying fixtures in `src/html-to-jsx/fixtures/`
- After authoring HTML in Paper or `docs/<Component>.md` prototype sections

## Hard rules

1. **Always run the CLI.** Never invent JSX from HTML by reading props manually.
2. **If the CLI fails, fix the HTML** — do not patch around errors in JSX.
3. **Hand-wire callbacks** (`onClick`, `onChange`, `onDismiss`) after conversion.
4. **Import from `cleanplate`:** `import { Button, Typography, FormControls } from "cleanplate";`
5. **Include styles once:** `import "cleanplate/dist/index.css";`

## Commands

From the cleanplate repo (development):

```bash
npm run html-to-jsx -- path/to/recipe.html
```

Published package / npx:

```bash
npx cleanplate-html-to-jsx path/to/recipe.html
```

Exit code `1` on `ConvertError` — read the message; it points to `docs/<Component>.md`.

## Fixture tests

Every HTML recipe should have a matching fixture pair:

- `src/html-to-jsx/fixtures/<name>.html`
- `src/html-to-jsx/fixtures/<name>.jsx`

Run:

```bash
npm test -- src/html-to-jsx
```

## After conversion

1. Add imports for every component in the output.
2. Wire event handlers where the UI needs interactivity.
3. Replace static fixture text with app state where needed.
4. Run `npm test` and Storybook to verify behavior.

## Related

- Authoring HTML: `cleanplate-html-prototype` skill
- Component props: `docs/<Component>.md`
- Manifest (allowed props/enums): `src/html-to-jsx/component-manifest.json`
