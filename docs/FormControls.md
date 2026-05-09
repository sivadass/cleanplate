# FormControls

FormControls is a set of form primitives exported as a namespace: `FormControls.Input`, `FormControls.Select`, `FormControls.TextArea`, `FormControls.Date`, `FormControls.Checkbox`, `FormControls.Radio`, `FormControls.File`, `FormControls.Toggle`, `FormControls.Stepper`. Use them to build forms with consistent styling, labels, validation messages, and optional fluid layout. Common props across controls: label, isDisabled, isRequired, isFluid, className, error.

## Controls overview

| Control | Purpose | Key props |
| --- | --- | --- |
| Input | Single-line text | placeholder, value, onChange(e), type |
| TextArea | Multi-line text | placeholder, value, onChange(e) |
| Select | Single or multi select dropdown | options ({ label, value }[]), value, onChange(option \| option[]), isMulti, placeholder |
| Date | Day/month/year picker (DD-MMM-YYYY) | defaultValue, onChange(dateValue: string) |
| Checkbox | Checkbox group (array-based, multi-select) | name, label, options, value (CheckboxValue[]), defaultValue, onChange(values, e), orientation, variant |
| Radio | Radio group (array-based) | name, label, options, value, defaultValue, onChange(value, e), orientation, variant |
| File | File picker with `button` / `card` variants, drag-and-drop, and a removable file list | name, label, variant, multiple, accept, value (File[]), onChange(files, e), buttonLabel, dropZoneText |
| Toggle | On/off switch | checked, defaultChecked, onChange(checked: boolean) |
| Stepper | Text input for step flows | placeholder, value, onChange(e) |

## Types

### SelectOption
```typescript
interface SelectOption {
  label: string;
  value: string | number;
}
```

### SelectProps
```typescript
interface SelectProps {
  onChange?: (option: SelectOption | SelectOption[]) => void;
  value?: SelectOption | SelectOption[] | null;
  label?: string;
  options?: SelectOption[];
  placeholder?: string;
  isMulti?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isFluid?: boolean;
  error?: string;
  className?: string;
  triggerClassName?: string;
  triggerActiveClassName?: string;
  contentsClassName?: string;
}
```

### InputProps
```typescript
interface InputProps {
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isFluid?: boolean;
  className?: string;
  error?: string;
  dataTestId?: string;
  /** Native `autocomplete` attribute. */
  autoComplete?: string;
  /** Hard cap on the number of characters the user can type. */
  maxLength?: number;
  /** Numeric lower bound (clamped on blur for `type="number"`). */
  min?: number | string;
  /** Numeric upper bound (clamped on blur for `type="number"`). */
  max?: number | string;
  /** Inline leading affix (currency, country code, …). Soft-capped at 4 chars. */
  prefix?: string;
  /** Inline trailing affix (unit, TLD, …). Soft-capped at 4 chars. */
  suffix?: string;
  /** Spoken label for screen readers when `prefix` is a symbol/abbreviation. */
  prefixA11yLabel?: string;
  /** Spoken label for screen readers when `suffix` is a symbol/abbreviation. */
  suffixA11yLabel?: string;
}
```

### Other control types
- **TextAreaProps**: label, value/defaultValue, onChange, isDisabled, isRequired, isFluid, className, error, dataTestId.
- **FileProps**: `name`, `label`, `variant` (`"button" | "card"`, default `"button"`), `multiple`, `accept`, `value: File[]` (controlled), `defaultValue: File[]` (uncontrolled initial visual list), `onChange(files: File[], e?)`, `buttonLabel` (default `"Browse file"`), `dropZoneText` (default `"Drag files to upload"`, card variant only), plus the common `isDisabled`, `isRequired`, `isFluid`, `className`, `error`, `dataTestId`. The card variant supports drag-and-drop. **FileVariant** = `"button" | "card"`.
- **RadioProps**: `options` (non-empty `RadioOption[]`), `name`, `label` (group `<legend>`), optional `id`, `value`, `defaultValue`, `onChange(value, e)`, `orientation` (`"vertical" | "horizontal"`), `variant` (`"default" | "card"`), `isDisabled`, `isRequired`, `isFluid`, `className`, `error`, `dataTestId`.
- **RadioOption**: `{ label, value, isDisabled?, description?, icon?, dataTestId?, id? }`. `description` is rendered under the option label as muted secondary text and linked via `aria-describedby`. `icon` accepts any `ReactNode` (e.g. `<Icon />`, `<img />`, custom SVG) and renders to the left of the label/description.
- **ToggleProps**: checked, defaultChecked, onChange(checked: boolean), label, isDisabled, isRequired, isFluid, className, error, dataTestId.
- **CheckboxProps**: `options` (non-empty `CheckboxOption[]`), `name`, `label` (group `<legend>`), optional `id`, `value` (`CheckboxValue[]`), `defaultValue` (`CheckboxValue[]`), `onChange(values, e)`, `orientation` (`"vertical" | "horizontal"`), `variant` (`"default" | "card"`), `isDisabled`, `isRequired`, `isFluid`, `className`, `error`, `dataTestId`.
- **CheckboxOption**: `{ label, value, isDisabled?, description?, icon?, dataTestId?, id? }`. `description` is rendered under the option label as muted secondary text and linked via `aria-describedby`. `icon` accepts any `ReactNode` (e.g. `<Icon />`, `<img />`, custom SVG) and renders to the left of the label/description. `CheckboxValue = string | number`.
- **DateProps**: optional `id`, `label`, `defaultValue` (`"dd-mm-yyyy"`), `onChange(dateValue: string)`, plus `isDisabled`, `isRequired`, `isFluid`, `className`, `error`, `dataTestId`.
- **FormControlsStepperProps**: label, placeholder, value/defaultValue, onChange(e), type, isDisabled, isRequired, isFluid, className, error, dataTestId.

## Usage Examples

### Input and Select

```jsx
import { FormControls } from "cleanplate";

<FormControls.Input label="Email" placeholder="user@example.com" isRequired />
<FormControls.Select
  label="Fruit"
  placeholder="Select"
  options={[{ label: "Apple", value: "apple" }, { label: "Mango", value: "mango" }]}
  onChange={(option) => console.log(option)}
/>
```

### Input with prefix / suffix

```jsx
<FormControls.Input label="Amount"   type="number" prefix="$"   suffix="USD" placeholder="0.00" />
<FormControls.Input label="Phone"    type="tel"    prefix="+91" placeholder="98765 43210" />
<FormControls.Input label="Weight"   type="number" suffix="kg"  placeholder="0" />
<FormControls.Input label="Discount" type="number" suffix="%"   placeholder="0" />
<FormControls.Input label="Website"  type="url"    suffix=".com" placeholder="acme" />
```

### TextArea and Date

```jsx
<FormControls.TextArea label="Message" placeholder="Hello" />
<FormControls.Date label="DOB" defaultValue="31-05-1992" onChange={(v) => {}} />
```

### Checkbox group

Pass an `options` array. The component renders the entire group inside a `<fieldset>` + `<legend>` and emits `onChange(values, event)` with the next array of selected values. The required `*` is rendered on the group label, not on individual options.

```jsx
const [interests, setInterests] = useState(["product"]);
<FormControls.Checkbox
  label="Email me about"
  name="interests"
  value={interests}
  onChange={(v) => setInterests(v)}
  options={[
    { label: "Newsletters",     value: "newsletter", description: "Weekly digest" },
    { label: "Product updates", value: "product",    description: "Release notes for features you use" },
    { label: "Promotions",      value: "promo",      isDisabled: true },
  ]}
/>
```

For a single checkbox (consent / opt-in), pass an array with one entry — `value` is still an array; an empty array means unchecked:

```jsx
const [accepted, setAccepted] = useState([]);
<FormControls.Checkbox
  label="Terms and conditions"
  name="accept"
  isRequired
  value={accepted}
  onChange={(v) => setAccepted(v)}
  options={[{ label: "I accept the terms and conditions", value: "yes" }]}
/>
```

### Checkbox (card variant with icons)

```jsx
import { FormControls, Icon } from "cleanplate";

<FormControls.Checkbox
  label="Add-ons"
  name="addons"
  variant="card"
  orientation="horizontal"
  isFluid
  value={addons}
  onChange={(v) => setAddons(v)}
  options={[
    { label: "Analytics",     value: "analytics",  description: "Real-time dashboards", icon: <Icon name="bar_chart" /> },
    { label: "Automation",    value: "automation", description: "Trigger on events",    icon: <Icon name="bolt" /> },
    { label: "Collaboration", value: "collab",     description: "Roles and comments",   icon: <Icon name="groups" /> },
  ]}
/>
```

### Radio group

Pass an `options` array. The component renders the entire group inside a `<fieldset>` + `<legend>` and emits `onChange(value, event)`. The required `*` is rendered on the group label, not on individual options.

```jsx
const [plan, setPlan] = useState("std");
<FormControls.Radio
  label="Shipping"
  name="ship"
  value={plan}
  onChange={(v) => setPlan(String(v))}
  isRequired
  options={[
    { label: "Standard", value: "std" },
    { label: "Express", value: "exp", description: "1–2 business days" },
    { label: "Overnight", value: "ovn", isDisabled: true },
  ]}
/>
```

For a single radio, just pass an array with one entry:

```jsx
<FormControls.Radio
  label="Subscription"
  name="subscribe"
  value={subscribed ? "yes" : ""}
  onChange={(v) => setSubscribed(v === "yes")}
  options={[{ label: "Subscribe to weekly digest", value: "yes" }]}
/>
```

### Radio (card variant with icons)

```jsx
import { FormControls, Icon } from "cleanplate";

<FormControls.Radio
  label="Delivery method"
  name="delivery"
  variant="card"
  orientation="horizontal"
  isFluid
  value={method}
  onChange={(v) => setMethod(String(v))}
  options={[
    { label: "Standard",   value: "std",  description: "4–10 business days · $5.00",  icon: <Icon name="local_shipping" /> },
    { label: "Express",    value: "exp",  description: "2–5 business days · $16.00",  icon: <Icon name="bolt" /> },
    { label: "Super Fast", value: "fast", description: "1 business day · $25.00",     icon: <Icon name="rocket_launch" /> },
  ]}
/>
```

### File (button variant)

Compact trigger that looks like a primary button. Selected files render below the trigger as small cards with a type-specific thumbnail icon, name, size, and a remove button.

```jsx
const [files, setFiles] = useState([]);
<FormControls.File
  label="Upload file"
  name="upload"
  value={files}
  onChange={(next) => setFiles(next)}
/>
```

### File (card / drop-zone variant)

Drop-zone with dashed border, helper text, and a `Browse file` CTA. Click anywhere in the zone to open the picker, or drag files in. Combine with `multiple` and `accept` to constrain selection.

```jsx
const [files, setFiles] = useState([]);
<FormControls.File
  label="File Upload"
  name="upload"
  variant="card"
  multiple
  accept="image/*,application/pdf"
  value={files}
  onChange={(next) => setFiles(next)}
/>
```

### Used by other components

Pagination uses `FormControls.Select` for rows-per-page. Pills uses `FormControls.Input` in edit mode.

## Behavior Notes

- **Input (`type="number"`):** Renders as `<input type="text" inputmode="numeric" pattern="[0-9]*">` so the field shows the numeric keypad on mobile, validates digit-only input via HTML5 pattern, and avoids the well-known UX issues of native `type="number"` (scroll-wheel mutates value, spinner buttons, accepts `e`/`+`/`-`). Consumers still pass `type="number"` at the API boundary; for decimals or signed numbers, use `type="text"` and add a custom `inputMode`/validation.
- **Input (`type="search"`):** Keeps `type="search"` semantics (mobile search keyboard, autosuggest history) but hides the browser's native cancel button and renders a leading `search` icon plus a custom `close` clear button from the icon library. The clear button shows only when the input has content, focuses the input on click, and emits a synthetic `onChange` with an empty value so both controlled (`value`/`onChange`) and uncontrolled (`defaultValue`) usage stay in sync.
- **Input (`prefix` / `suffix`):** Inline leading/trailing text affix for currency (`$`), country code (`+91`), unit (`kg`, `%`), TLD (`.com`), etc. Soft-capped at 4 characters so the layout stays predictable; longer strings are truncated. When set, the field's outer wrapper takes over the visible border / padding / focus ring so the affixes read as part of the same input. Affixes are linked to the input via `aria-describedby`, so screen readers announce e.g. "Amount, dollars, $500" when the visible affix is `$`. For symbols/abbreviations that don't read well, pass `prefixA11yLabel` / `suffixA11yLabel` (e.g. `prefix="$"`, `prefixA11yLabel="dollars"`). Ignored when `type="search"` (search already uses both edges) — for any other `type`, including `number`, affixes work as expected.
- **Input (validation / constraints):** `maxLength` is passed straight to the native attribute (works for any `type`). `min` / `max` are passed to the native attribute (HTML5 form-validation hints) and, for `type="number"` only, also clamped on `blur` — the user can finish typing freely and the value snaps to the bound when they leave the field.
- **Input (`autoComplete` / `onBlur`):** `autoComplete` maps to the native attribute (`"email"`, `"current-password"`, `"off"`, …). `onBlur` runs after any internal numeric clamp so consumers see the final value.
- **Select:** options are `{ label, value }`; single select passes one option to onChange, multi passes an array. value can be option or array for multi.
- **Date:** Returns string "dd-mm-yyyy" to onChange; uses internal day/month/year Selects.
- **Radio:** Group-first API — pass `options: RadioOption[]`. Renders `<fieldset>` + `<legend>` with a single `value` and `onChange(value, e)`. `isRequired` puts `*` on the legend and adds `required`/`aria-required` to the first enabled option (HTML5 only requires one input in the group to carry it). Custom ring/dot follows the native `:checked` state so uncontrolled groups stay visually correct. Pass `variant="card"` for tile-style options (ring in top-right, optional `icon` on the left, primary-brand border + tint when selected).
- **Checkbox:** Group-first API — pass `options: CheckboxOption[]`. Renders `<fieldset>` + `<legend>` with a `value: CheckboxValue[]` and `onChange(values, e)`. `isRequired` puts `*` on the legend and sets `aria-required` on the group; native HTML5 doesn't enforce "at least one" for checkbox groups, so add custom validation at the form layer. Custom box/tick follows the native `:checked` state. Pass `variant="card"` for tile-style options (box in top-right, optional `icon` on the left, primary-brand border + tint when checked). For a single checkbox, pass a one-element `options` array — `value=[]` is unchecked, `value=[opt.value]` is checked.
- **File:** Native `<input type="file">` is visually hidden but stays in the a11y tree. Manages a `File[]` selection internally; `onChange(files, e)` fires for picker selections, drops, and removals (the underlying event is `undefined` for non-picker triggers). With `multiple`, subsequent picks/drops append; without, the new selection replaces the old. The card variant supports drag-and-drop and tints primary-brand on hover. Removing a file resets the native input so re-selecting the same file still emits a change. `defaultValue` seeds the visual list only — browsers don't allow programmatic pre-population of file inputs.
- **isFluid:** Full-width field wrapper.

## Theming

CleanPlate exposes a thin layer of CSS custom properties on `:root` so consumer apps can retheme the form-control surface without forking styles or wrestling specificity. Override these in your own stylesheet **after** the `cleanplate/dist/index.css` import.

| Token | Default | What it controls |
| --- | --- | --- |
| `--cp-form-control-radius` | `var(--radius-large)` (12px) | Corner radius for `Input`, `TextArea`, `Stepper`, `Select` trigger + open dropdown corners, `Date` day/month/year segments, `File` (outline trigger, drop zone, in-card CTA, file list rows), and `Radio` / `Checkbox` `variant="card"` option tiles. |

### Recipes

```css
/* Square-ish form fields across the whole app, while leaving badges, cards,   */
/* and other --radius-large surfaces alone.                                    */
:root {
  --cp-form-control-radius: 4px;
}
```

```css
/* Scope the override to one section — CSS custom properties cascade, so any   */
/* wrapper works as the boundary.                                              */
.checkout-form {
  --cp-form-control-radius: 0;
}
```

```jsx
// Per-instance override — same token, scoped to one element via the style prop.
<FormControls.Input
  name="zip"
  label="ZIP"
  style={{ "--cp-form-control-radius": "20px" }}
/>
```

### When to override what

- **`--cp-form-control-radius`** when you want to retheme just the form-field family (Input, Select trigger, Date, Stepper, TextArea, File triggers and card CTA, file list rows, Radio/Checkbox card tiles). Recommended path.
- **`--radius-large`** (the underlying design token) when you want every "large radius" surface in CleanPlate — form fields *and* anything else that opts into the same scale — to move together. Coarser, but useful for whole-product rebrands.

The component-level token is the public, supported override. Underlying design tokens (`--radius-small`, `--radius-medium`, `--radius-large`, …) are exposed but treated as the lower tier — overriding them is allowed, but expect broader visual impact.

## Related Components / Links

- Pills (uses FormControls.Input in edit mode)
- Pagination (uses FormControls.Select for rows-per-page)
- Container (layout around form fields)
- Button (submit/cancel in forms)
