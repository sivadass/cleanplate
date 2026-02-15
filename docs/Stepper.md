# Stepper Component

Purpose: Displays a sequence of steps (e.g. for a wizard or checkout). Each step has a label, optional active/completed state, and can be clickable. Use it for multi-step flows and progress indication. Supports horizontal and vertical layout.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| variant | "horizontal" \| "vertical" | no | — | Layout direction. |
| margin | string \| string[] | no | "0" | Spacing **suffix** for outer margin. The component adds the `m-` prefix (e.g. `"0"` → m-0, `"b-2"` → m-b-2). Use a single string or array. |
| className | string | no | "" | Additional class names for the root element. |
| config | StepperStepConfig[] | yes | — | Step definitions: each has label, key, and optionally isCompleted, isActive. |
| onClick | (step: StepperStepConfig) => void | no | — | Called when a step is clicked; receives the step config. |

## Types

### StepperStepConfig
```typescript
interface StepperStepConfig {
  label: string;        // Display label
  key: string;          // Unique key (e.g. href fragment or route path)
  isCompleted?: boolean;
  isActive?: boolean;
}
```

### StepperVariant
```typescript
type StepperVariant = "horizontal" | "vertical";
```

### SpacingOption
```typescript
type SpacingOption = (typeof SPACING_OPTIONS)[number];
```

### StepperMargin
```typescript
type StepperMargin = string | SpacingOption[];
```

### StepperProps
```typescript
interface StepperProps {
  variant?: StepperVariant;
  margin?: StepperMargin;
  className?: string;
  config: StepperStepConfig[];
  onClick?: (step: StepperStepConfig) => void;
}
```

## Usage Examples

### Basic

```jsx
import { Stepper } from "cleanplate";

const config = [
  { label: "Details", key: "/details", isActive: true },
  { label: "Review", key: "/review", isCompleted: true },
  { label: "Confirm", key: "/confirm" },
];

export const Example = () => (
  <Stepper config={config} variant="horizontal" />
);
```

### With onClick

```jsx
import { Stepper } from "cleanplate";
import { useState } from "react";

const Example = () => {
  const [active, setActive] = useState("step1");
  const config = [
    { label: "Step 1", key: "step1", isActive: active === "step1" },
    { label: "Step 2", key: "step2", isActive: active === "step2" },
  ];
  return (
    <Stepper config={config} onClick={(step) => setActive(step.key)} />
  );
};
```

### Horizontal and vertical

```jsx
<Stepper config={config} variant="horizontal" />
<Stepper config={config} variant="vertical" />
```

### With completed steps

```jsx
<Stepper
  config={[
    { label: "Step 1", key: "1", isCompleted: true },
    { label: "Step 2", key: "2", isCompleted: true },
    { label: "Step 3", key: "3", isActive: true },
    { label: "Step 4", key: "4" },
  ]}
  variant="horizontal"
/>
```

### With Container

```jsx
import { Stepper, Container } from "cleanplate";

<Container padding="4">
  <Stepper config={config} variant="horizontal" margin="b-2" />
</Container>
```

## Behavior Notes

- **Links:** Each step label is an `<a href={step.key}>`. The component calls `preventDefault()` on click and invokes `onClick(step)` so you can control navigation (e.g. router) without following the href.
- **Completed:** When `step.isCompleted` is true, the step number is replaced with a done icon.
- **Active:** When `step.isActive` is true, the step gets the active CSS class.
- **Spacing:** `margin` accepts the **spacing suffix**; the component adds the `m-` prefix via `getSpacingClass`.

## Related Components / Links

- Container (layout and spacing around the stepper)
- Typography (headings above or near the stepper)
- Icon (used internally for the done icon on completed steps)
