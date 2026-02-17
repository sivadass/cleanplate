# CleanPlate

**A headless React UI framework** — reusable, accessible components you can style to match your brand. No opinionated theme; you bring the look and feel.

- [Installation](#installation)
- [Quick start](#quick-start)
- [Available components](#available-components)
- [Documentation](#documentation)
- [TypeScript](#typescript)
- [LLM / AI-friendly docs](#llm--ai-friendly-docs)

---

## Requirements

- **React** 18 or higher
- **React DOM** 18 or higher

---

## Installation

```bash
npm install cleanplate
```

Or with Yarn:

```bash
yarn add cleanplate
```

Published packages: [npm — cleanplate](https://www.npmjs.com/package/cleanplate)

---

## Quick start

### 1. Add styles

Import the reset and base styles **once** at your app root (e.g. `main.jsx`, `App.jsx`, or `index.js`):

```jsx
import "cleanplate/dist/index.css";
```

### 2. Import and use components

All components are **named exports** from `cleanplate`:

```jsx
import { Button, Typography, Container } from "cleanplate";

function App() {
  return (
    <Container padding="4">
      <Typography variant="h1">Hello</Typography>
      <Button variant="solid" onClick={() => alert("Saved!")}>
        Save
      </Button>
    </Container>
  );
}
```

### Example: Button

```jsx
import { Button } from "cleanplate";

<Button variant="solid">Primary action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

Variants: `solid`, `outline`, `ghost`, `icon`. Sizes: `small`, `medium`.

### Example: Typography

```jsx
import { Typography } from "cleanplate";

<Typography variant="h1">Heading 1</Typography>
<Typography variant="h4">Heading 4</Typography>
<Typography variant="p">Body paragraph.</Typography>
```

Variants: `h1`–`h6`, `p`, `span`, `small`.

### Example: Form controls

```jsx
import { FormControls } from "cleanplate";

<FormControls.Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<FormControls.Select
  label="Country"
  options={[
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
  ]}
  value={country}
  onChange={(e) => setCountry(e.target.value)}
/>
```

Other form primitives: `TextArea`, `Checkbox`, `Radio`, `Date`, `File`, `Toggle`, etc.

### Example: Icon

Uses [Google Material Symbols](https://fonts.google.com/icons). Include the font in your app; then:

```jsx
import { Icon } from "cleanplate";

<Icon name="settings" size="small" color="black" />
<Icon name="check_circle" size="medium" />
```

---

## Available components

| Component      | Use case |
|----------------|----------|
| Accordion      | Collapsible panels, FAQ sections |
| Alert          | Inline feedback (success, error, warning, info) |
| Animated       | Scroll-triggered animations |
| AppShell       | Full-page layout with Header, Footer, sidebar |
| Avatar         | User initials, image, or icon |
| Badge          | Status labels, tags |
| BottomSheet    | Slide-up panel |
| BreadCrumb     | Navigation trail |
| Button         | Actions and buttons |
| ConfirmDialog  | Confirmation modals |
| Container      | Layout, spacing, flex |
| Dropdown       | Menus, floating panels |
| Footer         | App footer |
| FormControls   | Input, Select, TextArea, Checkbox, etc. |
| Header         | App header with nav |
| Icon           | Material Symbols icons |
| MediaObject    | Media + title + description |
| MenuList       | Navigation lists |
| Modal          | Dialogs, overlays |
| PageHeader     | Page title + CTA + more menu |
| Pagination     | Page navigation |
| Pills          | Tags/chips |
| ProgressBar    | Progress indicator |
| Spinner        | Loading indicator |
| Stepper        | Multi-step flows |
| Table          | Tabular data |
| Toast          | Transient messages |
| Typography     | Headings and text |

Import any of them from `cleanplate`:

```jsx
import {
  Button,
  Typography,
  Container,
  Header,
  PageHeader,
  BreadCrumb,
  Table,
  FormControls,
  // ... etc.
} from "cleanplate";
```

---

## Documentation

- **Storybook** — Interactive playground and docs for every component:  
  [https://cleanplate.sivadass.in](https://cleanplate.sivadass.in)
- **GitHub** — Source and issue tracker:  
  [github.com/sivadass/cleanplate](https://github.com/sivadass/cleanplate)

---

## TypeScript

CleanPlate is written in TypeScript and ships type definitions. Types are included in the package (`dist/index.d.ts`). No extra `@types` package needed.

```tsx
import { Button } from "cleanplate";
import type { ButtonProps } from "cleanplate";
```

---

## LLM / AI-friendly docs

The repo includes documentation aimed at **AI assistants** (e.g. Cursor, Claude Code):

- **`llms.txt`** (project root) — Index of all components with file paths, purpose, and features. Point your AI at this file to discover the right docs.
- **`docs/`** — One Markdown file per component (e.g. `docs/Button.md`, `docs/PageHeader.md`) with props, types, examples, and behavior.

Reference `llms.txt` or `docs/<ComponentName>.md` in your prompts when using Cursor or Claude Code for more accurate suggestions.

---

## License

MIT © Sivadass N
