# Storybook docs reference template

Use this as a reference when adding or updating Storybook documentation for a component. The pattern is used by Alert, Avatar, Spinner, Stepper, ConfirmDialog, and Dropdown.

---

## 1. Folder and file structure

Put each component's stories and docs in a **folder** under `src/stories/`:

```
src/stories/
  <component-name>/
    <component-name>.stories.jsx   # Playground + named stories
    <component-name>.docs.mdx      # Documentation tab
```

Examples: `alert/alert.stories.jsx`, `avatar/avatar.docs.mdx`, `stepper/stepper.stories.jsx`.

---

## 2. Stories file (`*.stories.jsx`)

### Meta (shared)

- **title:** `atoms/<ComponentName>/Playground` or `molecules/<ComponentName>/Playground` (match your taxonomy).
- **component:** The component from `../../index`.
- **parameters:** `layout: "centered"` for consistent canvas.
- **argTypes:** One entry per prop you want in the Controls panel:
  - `control: "text"` or `control: "boolean"` or `control: { type: "select" }` with `options`.
  - `description` for each.
  - For event handlers use `{ action: "onClick" }` (or onClose, etc.).
- **args:** Default values for the Controls (and for the Default story if it spreads `args`).

### Spacing props (margin, padding, gap)

- Use **suffix** values: the component adds the prefix (`m-`, `p-`, `g-`) internally.
- In argTypes, use a limited options list, e.g. `SPACING_OPTIONS.slice(0, 10)` and `control: { type: "select" }`.
- In args and in static examples, use strings like `"0"`, `"b-2"` (not `"m-0"`, `"m-b-2"`).

### Stories to export

- **Default:** Single interactive story that spreads `args` so Controls drive the component. Wrap in `Container` if needed.
- **Variants / Sizes / etc.:** Named stories that show a few fixed variants (e.g. all variants, all sizes) with short headings via Typography.

### Imports

- Component(s), Container, Typography from `../../index`.
- Constants (e.g. `SPACING_OPTIONS`) from `../../constants/common` if needed.

### Example skeleton (stories)

```jsx
import { ComponentName, Container, Typography } from "../../index";
import { SPACING_OPTIONS } from "../../constants/common";

const MARGIN_OPTIONS = SPACING_OPTIONS.slice(0, 10);

const meta = {
  title: "atoms/ComponentName/Playground",
  component: ComponentName,
  parameters: { layout: "centered" },
  argTypes: {
    someProp: { control: "text", description: "..." },
    variant: {
      options: ["a", "b"],
      control: { type: "select" },
      description: "...",
    },
    margin: {
      options: MARGIN_OPTIONS,
      control: { type: "select" },
      description: "Margin spacing (suffix: e.g. '0' applies m-0)",
    },
    onClick: { action: "onClick" },
  },
  args: {
    variant: "a",
    margin: "0",
  },
};

export const Default = {
  name: "Default",
  render: (args) => (
    <Container padding="4">
      <ComponentName {...args} />
    </Container>
  ),
};

export const Variants = {
  name: "Variants",
  render: () => (
    <Container padding="4">
      <Typography variant="h5" margin="m-0 m-b-2">Variants</Typography>
      {/* ... */}
    </Container>
  ),
};

export default meta;
```

---

## 3. Documentation MDX (`*.docs.mdx`)

### Meta

```mdx
import { Meta } from "@storybook/blocks";
import { ArgsTable } from "@storybook/addon-docs";
import { ComponentName, Container, Typography } from "../../index";

<Meta title="atoms/ComponentName/Documentation" />
```

### Sections (in order)

1. **Title and intro**  
   One short paragraph: what the component is and when to use it.

2. **Features**  
   Bullet list of main capabilities (variants, sizes, key props, spacing API, etc.).

3. **Usage**  
   Single code block (jsx) with one import and one minimal example.

4. **Examples**  
   Subsections (e.g. Variants, Sizes, With Container) with short descriptions and code blocks. Use `jsx` for blocks.

5. **Spacing (if applicable)**  
   Explain suffix API and show single value and array usage.

6. **Behavior**  
   Bullet list: how key props work, DOM structure, accessibility notes.

7. **Props**  
   ```mdx
   ## Props
   <ArgsTable of={ComponentName} />
   ```

8. **Related components**  
   Bullet list of related components and how they're used with this one.

### Example skeleton (docs)

```mdx
import { Meta } from "@storybook/blocks";
import { ArgsTable } from "@storybook/addon-docs";
import { ComponentName, Container } from "../../index";

<Meta title="atoms/ComponentName/Documentation" />

# ComponentName

Short intro: what it is and when to use it.

## Features

- **Feature one:** ...
- **Feature two:** ...

## Usage

```jsx
import { ComponentName } from "cleanplate";
const App = () => <ComponentName prop="value" />;
```

## Examples

### Variants
```jsx
<ComponentName variant="a" />
<ComponentName variant="b" />
```

### With Container
```jsx
<Container padding="4">
  <ComponentName margin="b-2" />
</Container>
```

## Spacing (margin)

`margin` accepts the **spacing suffix**. Component adds `m-` prefix (e.g. `"0"` → m-0).

```jsx
<ComponentName margin="0" />
<ComponentName margin={["b-2"]} />
```

## Behavior

- **Point one:** ...
- **Root element:** ...

## Props

<ArgsTable of={ComponentName} />

## Related components

- **OtherComponent** – How it relates
```

---

## 4. Naming and taxonomy

- **Atoms:** Low-level primitives and single-behavior wrappers. Examples: Button, Typography, Icon, Alert, Avatar, Spinner, Stepper, Container, **Animated** (scroll-triggered animation wrapper), Badge, Pills, Table, Pagination.
- **Molecules:** Composed patterns (multiple components or complex behavior). Examples: Dropdown, ConfirmDialog, Modal, MediaObject, Header, Footer, Menu List.
- Use the same segment in both titles: `atoms/Alert/Playground` and `atoms/Alert/Documentation`.
- **How to decide:** If the component mainly wraps content with one clear behavior (e.g. animate on scroll, show a spinner, layout children) and doesn’t compose other full-blown components, use **atoms**. If it combines several components or a full pattern (e.g. dialog with overlay + panel + buttons), use **molecules**.

---

## 5. Checklist for a new component

- [ ] Create `src/stories/<name>/<name>.stories.jsx` with meta (title, component, parameters, argTypes, args), Default story, and at least one named story (e.g. Variants).
- [ ] Create `src/stories/<name>/<name>.docs.mdx` with Meta, intro, Features, Usage, Examples, Behavior, Props (ArgsTable), Related components.
- [ ] Use spacing **suffix** in examples and in Controls (e.g. `"0"`, `"b-2"`), not full tokens like `"m-0"`.
- [ ] Add `onClick` / `onClose` etc. as `action` in argTypes so they appear in the Actions panel.
- [ ] Ensure the Documentation tab title matches the Playground (e.g. both `atoms/Alert/...`).

---

## 6. Reference components

For full examples, see:

- **Stories:** `src/stories/alert/alert.stories.jsx`, `src/stories/avatar/avatar.stories.jsx`, `src/stories/spinner/spinner.stories.jsx`
- **Docs:** `src/stories/alert/alert.docs.mdx`, `src/stories/avatar/avatar.docs.mdx`
