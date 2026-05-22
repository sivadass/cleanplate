# FormControls

FormControls is a set of form primitives exported as a namespace: `FormControls.Input`, `FormControls.Select`, `FormControls.TextArea`, `FormControls.Date`, `FormControls.Checkbox`, `FormControls.Radio`, `FormControls.File`, `FormControls.Toggle`, `FormControls.Stepper`. Use them to build forms with consistent styling, labels, validation messages, and optional fluid layout. Common props across controls: label, isDisabled, isRequired, isFluid, className, error.

## Controls overview

| Control | Purpose | Key props |
| --- | --- | --- |
| Input | Single-line text | placeholder, value, onChange(e), type, `phoneDigits` (numeric autofill) |
| TextArea | Multi-line text | placeholder, value, onChange(e) |
| Select | Floating UI combobox: desktop portalled list; **≤768px** bottom sheet; sync or async options, search, groups, multi chips + cap | `mode` / `isMulti`, `options`, `onSearch`, `searchable`, `groups`, `maxSelect`, `triggerMaxItems`, `panelMinWidth`, `name`, `placeholder`, `error` |
| Date | Calendar date picker (`date-fns` + Floating UI); **Cancel** / **OK** staging; desktop **popover** (~**400px** max width, viewport-capped); **≤768px** **bottom sheet** + backdrop; **month** / **year** subviews with back + titled headers; trigger **`calendar_month`** icon | `value`/`defaultValue` (`Date \| null`), `onChange`, `minDate`/`maxDate`/`disabledDates`/`disabledDaysOfWeek`, `locale`, `weekStartsOn`, `dateFormat`, `clearable`, `readOnly`, `name` (hidden **yyyy-MM-dd**), `popoverPlacement`, `onOpen`/`onClose` |
| Checkbox | Checkbox group (array-based, multi-select) | name, label, options, value (CheckboxValue[]), defaultValue, onChange(values, e), orientation, variant |
| Radio | Radio group (array-based) | name, label, options, value, defaultValue, onChange(value, e), orientation, variant |
| File | File picker with `button` / `card` variants, drag-and-drop, and a removable file list | name, label, variant, multiple, accept, value (File[]), onChange(files, e), buttonLabel, dropZoneText |
| Toggle | On/off switch | checked, defaultChecked, onChange(checked: boolean) |
| Stepper | Numeric value with integrated − / + (integer text field + `min` / `max` / `step`) | placeholder, value, onChange(e), min, max, step, layout |

## Types

### Option (and SelectOption)

`Option` is the canonical option shape. **`SelectOption` is a deprecated alias** — use `Option` in new code.

```typescript
interface Option {
  value: string | number;
  label: string;
  /** Contiguous rows with the same non-empty string get a sticky group heading when `groups` is true. */
  group?: string;
  /** Material Symbols icon name (row-leading). */
  icon?: string;
  /** Image URL for a circular avatar (row-leading). */
  avatar?: string;
  /** Muted secondary line (e.g. subtitle). */
  meta?: string;
  disabled?: boolean;
}
```

### SelectProps

```typescript
type SelectValue = Option | Option[] | null;

interface SelectProps {
  name?: string;
  id?: string;
  label?: string;
  /** Controlled selection: one option, array (multi), or `null` when cleared (single). Multi clear uses `[]`. */
  value?: SelectValue;
  onChange?: (option: Option | Option[] | null) => void;
  /**
   * Static list, or `null` with `onSearch` for async/search-backed data.
   * `[]` or missing = empty sync list.
   */
  options?: Option[] | null;
  /** Required when `options` is `null`. Debounced by `searchDebounce`; empty query runs immediately. */
  onSearch?: (query: string) => Promise<Option[]>;
  /** Debounce for `onSearch` only (ms). @default 300 */
  searchDebounce?: number;
  /** When false, hides the panel search field. @default true */
  searchable?: boolean;
  /** Panel search field placeholder. @default "Search" */
  searchPlaceholder?: string;
  /** When search text matches nothing, optional “add” callback receives trimmed string. */
  onAddOption?: (value: string) => void;
  /** @default true */
  closeOnAddOption?: boolean;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isFluid?: boolean;
  error?: string;
  className?: string;
  triggerClassName?: string;
  triggerActiveClassName?: string;
  contentsClassName?: string;
  /** Desktop only: min width of the options panel (px or CSS length). @default trigger width only */
  panelMinWidth?: number | string;
  dataTestId?: string;
  /** Selection mode. @default 'single'. Prefer over legacy `isMulti`. */
  mode?: "single" | "multi";
  /** @deprecated Use `mode="multi"`. */
  isMulti?: boolean;
  /** Multi: max chips before a "+N" overflow badge. @default 2 */
  triggerMaxItems?: number;
  /** Multi: show clear control on trigger when allowed. @default true */
  clearable?: boolean;
  /** Group headings for contiguous same-`group` options. @default false */
  groups?: boolean;
  /** Multi only: max selectable options; “Select all” respects cap. No effect in single mode. */
  maxSelect?: number;
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
  /**
   * For `type="number"` only: after non-digits are removed, keep the last N digits
   * when the value is longer — e.g. browser autofill `+91 98765 43210` → `9876543210`.
   * Pair with `autoComplete="tel"` and `maxLength` for phone fields.
   */
  phoneDigits?: number;
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
- **DateProps**: `value` / `defaultValue` (`Date | null`), `onChange(date: Date | null)`, `placeholder`, **`dateFormat`** (display string via `date-fns` + `locale`, default `MMM dd, yyyy`), **`name`** (renders a hidden `<input>` that submits **`yyyy-MM-dd`** for the committed calendar date), **`minDate`** / **`maxDate`** (inclusive navigation + selection bounds), **`disabledDates`** / **`disabledDaysOfWeek`** (greyed cells), **`locale`** (`date-fns` `Locale` — grid, subview copy, and field text), **`weekStartsOn`** (`0`–`6`, default `0` = Sunday), **`clearable`** (default `true`; shows clear control when a value exists), **`readOnly`** (no picker; value fixed), **`popoverPlacement`** (Floating UI placement for desktop; default `bottom-start`), **`onOpen`** / **`onClose`**, plus shared `label`, `isDisabled`, `isRequired`, `isFluid`, `className`, `error`, `dataTestId`.
- **FormControlsStepperProps**: label, placeholder, value/defaultValue, onChange(e), min, max, step, layout (`"default" | "split-controls" | "trailing-stacked-chevrons"`), isDisabled, isRequired, isFluid, className, error, dataTestId.

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

### Select — multi, groups, async

**Multi** with `mode="multi"` (or legacy `isMulti`). **`triggerMaxItems`** limits visible chips; extra selections show a **`+N`** badge with an accessible label. **`maxSelect`** caps how many options can be chosen (optional).

```jsx
const [tags, setTags] = useState([{ label: "A", value: "a" }]);
<FormControls.Select
  label="Tags"
  mode="multi"
  placeholder="Choose"
  triggerMaxItems={2}
  maxSelect={5}
  value={tags}
  onChange={(next) => setTags(Array.isArray(next) ? next : [])}
  options={[
    { label: "Apple", value: "apple", group: "Fruit" },
    { label: "Carrot", value: "carrot", group: "Veg" },
  ]}
  groups
/>
```

**Async / search-backed list:** pass **`options={null}`** and implement **`onSearch(query)`** returning a `Promise<Option[]>`. The panel search field debounces calls (**`searchDebounce`**, default 300ms); an empty query runs immediately. For a fixed in-memory list, pass **`options={items}`** — the same search field **filters** options client-side.

```jsx
<FormControls.Select
  label="City"
  options={null}
  onSearch={async (q) => fetchCities(q)} // return Option[]
  searchPlaceholder="Type to search"
/>
```

**Mobile:** At **viewport width ≤768px**, the panel opens as a **bottom sheet** (fixed to the lower viewport) with dialog semantics when a **label** is present, instead of a floating anchored list.

### Input with prefix / suffix

```jsx
<FormControls.Input label="Amount"   type="number" prefix="$"   suffix="USD" placeholder="0.00" />
<FormControls.Input label="Weight"   type="number" suffix="kg"  placeholder="0" />
<FormControls.Input label="Discount" type="number" suffix="%"   placeholder="0" />
<FormControls.Input label="Website"  type="url"    suffix=".com" placeholder="acme" />
```

### Input — phone number (browser autofill)

Use `type="number"` (digit-only numeric input), `autoComplete="tel"` so the browser offers saved numbers, `prefix` for the visible country code, `phoneDigits={10}` to strip non-digits and keep the **last 10 digits** when autofill includes a country code (e.g. `+91 98765 43210` → `9876543210`), and `maxLength={10}` to cap manual entry.

```jsx
<FormControls.Input
  label="Mobile number"
  name="mobile"
  type="number"
  autoComplete="tel"
  prefix="+91"
  phoneDigits={10}
  maxLength={10}
  placeholder="10-digit mobile"
  isRequired
/>
```

### TextArea and Date

```jsx
import { de } from "date-fns/locale/de";

<FormControls.TextArea label="Message" placeholder="Hello" />
<FormControls.Date label="DOB" defaultValue={new Date(1992, 4, 31)} onChange={(d) => {}} />
<FormControls.Date
  label="Ship date"
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
  disabledDaysOfWeek={[0, 6]}
  weekStartsOn={1}
/>
<FormControls.Date
  label="Start (DE)"
  locale={de}
  dateFormat="dd.MM.yyyy"
  defaultValue={new Date(2026, 3, 20)}
/>
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

- **Input (`type="number"`):** Renders as `<input type="text" inputmode="numeric" pattern="[0-9]*">` so the field shows the numeric keypad on mobile, validates digit-only input via HTML5 pattern, and avoids the well-known UX issues of native `type="number"` (scroll-wheel mutates value, spinner buttons, accepts `e`/`+`/`-`). Non-digits are stripped on `change` (covers browser autofill and paste). Consumers still pass `type="number"` at the API boundary; for decimals or signed numbers, use `type="text"` and add a custom `inputMode`/validation.
- **Input (`phoneDigits`):** Optional on `type="number"`. After non-digits are removed, values longer than `phoneDigits` are trimmed to the **last N digits** — use for phone fields when autofill inserts a country code (`+91 9876543210` → `9876543210` with `phoneDigits={10}`). Normalizes on `change` and `blur`. Pair with `autoComplete="tel"` and `maxLength`; show the country code via `prefix` (not in the value).
- **Input (`type="search"`):** Keeps `type="search"` semantics (mobile search keyboard, autosuggest history) but hides the browser's native cancel button and renders a leading `search` icon plus a custom `close` clear button from the icon library. The clear button shows only when the input has content, focuses the input on click, and emits a synthetic `onChange` with an empty value so both controlled (`value`/`onChange`) and uncontrolled (`defaultValue`) usage stay in sync.
- **Input (`prefix` / `suffix`):** Inline leading/trailing text affix for currency (`$`), country code (`+91`), unit (`kg`, `%`), TLD (`.com`), etc. Soft-capped at 4 characters so the layout stays predictable; longer strings are truncated. When set, the field's outer wrapper takes over the visible border / padding / focus ring so the affixes read as part of the same input. Affixes are linked to the input via `aria-describedby`, so screen readers announce e.g. "Amount, dollars, $500" when the visible affix is `$`. For symbols/abbreviations that don't read well, pass `prefixA11yLabel` / `suffixA11yLabel` (e.g. `prefix="$"`, `prefixA11yLabel="dollars"`). Ignored when `type="search"` (search already uses both edges) — for any other `type`, including `number`, affixes work as expected.
- **Input (validation / constraints):** `maxLength` is passed straight to the native attribute (works for any `type`). `min` / `max` are passed to the native attribute (HTML5 form-validation hints) and, for `type="number"` only, also clamped on `blur` — the user can finish typing freely and the value snaps to the bound when they leave the field.
- **Input (`autoComplete` / `onBlur`):** `autoComplete` maps to the native attribute (`"email"`, `"current-password"`, `"off"`, …). `onBlur` runs after any internal numeric clamp so consumers see the final value.
- **Select:** Built on **Floating UI** — desktop uses a **portalled** panel with flip/shift to stay in the viewport; panel **width** matches the trigger, with optional **`panelMinWidth`** when options need more horizontal space; **`searchable={false}`** hides the panel search field (full static list, or async `onSearch("")` on open); **≤768px** uses a **bottom sheet** (`role="dialog"`, `aria-modal`, `aria-labelledby` to the field label when the label exists). **Option** shape supports `group`, `icon`, `avatar`, `meta`, `disabled`. **`mode`** (`'single' | 'multi'`) replaces **`isMulti`** (still supported, deprecated). Single mode: **`onChange(Option | null)`** — `null` when cleared. Multi mode: **`onChange(Option[])`** — use **`[]`** for clear. **`name` + hidden `<input>`:** native form submit posts the selected **`value`**(s); **multi** joins with **commas** — avoid comma characters inside `value` if you rely on `FormData`, or parse manually. **`options={null}` + `onSearch`:** async loading; show loading/empty/error states in the panel. **`groups`:** sticky headings for shared `Option.group`. **`maxSelect`:** multi only; **`triggerMaxItems`:** chip overflow **`+N`**. **`aria-controls`** on the combobox trigger and panel search point at the listbox **only while open**. **`aria-invalid`** reflects **`error`** on trigger, search field, and listbox. Validation message uses **`role="alert"`** (via shared field error pattern).
- **Date:** **`Date | null`** with **`onChange`**. Opens a **`role="dialog"`** calendar: **staging** applies on day tap; **Cancel** reverts to the last committed value; **OK** commits (and clears staging). **Desktop:** portalled Floating UI panel with flip/shift, fixed **max width ~400px** (capped by viewport). **≤768px:** bottom sheet fixed to the lower viewport + dimmed backdrop, `aria-modal`, body scroll lock while open (same breakpoint idea as Select). **Header:** month cluster + year cluster (44px arrow hits); tapping month/year opens **scrollable subviews** with **back (`arrow_back`)** and headings **“Select a month of {yyyy}”** / **“Select a year for {MMMM}”** (locale-aware via `locale`). **Trigger:** **`calendar_month`** trailing icon (not Select chevrons); optional **clear** when `clearable`. **`readOnly`** and **`isDisabled`** block interaction. Constraints: **`minDate`/`maxDate`** (inclusive), **`disabledDates`**, **`disabledDaysOfWeek`**. **`dateFormat`** + **`locale`** control the field string; grid labels follow **`locale`** and **`weekStartsOn`**. **`name`:** hidden input posts **`yyyy-MM-dd`** for the **committed** value only. **`onOpen`/`onClose`** fire when the panel opens/closes. **`popoverPlacement`** adjusts desktop anchor (default `bottom-start`). **`error`** / **`isRequired`** use the shared field error pattern (`aria-invalid`, message under the field).
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
