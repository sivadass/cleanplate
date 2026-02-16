# FormControls

FormControls is a set of form primitives exported as a namespace: `FormControls.Input`, `FormControls.Select`, `FormControls.TextArea`, `FormControls.Date`, `FormControls.Checkbox`, `FormControls.Radio`, `FormControls.File`, `FormControls.Toggle`, `FormControls.Stepper`. Use them to build forms with consistent styling, labels, validation messages, and optional fluid layout. Common props across controls: label, isDisabled, isRequired, isFluid, className, error.

## Controls overview

| Control | Purpose | Key props |
| --- | --- | --- |
| Input | Single-line text | placeholder, value, onChange(e), type |
| TextArea | Multi-line text | placeholder, value, onChange(e) |
| Select | Single or multi select dropdown | options ({ label, value }[]), value, onChange(option \| option[]), isMulti, placeholder |
| Date | Day/month/year picker (DD-MMM-YYYY) | defaultValue, onChange(dateValue: string) |
| Checkbox | Single checkbox | value (boolean), onChange(checked: boolean) |
| Radio | Radio input | name, value, onChange(e) |
| File | File input | onChange(e) |
| Toggle | Toggle input | name, value, onChange(e) |
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
}
```

### Other control types
- **TextAreaProps**, **FileProps**, **RadioProps**, **ToggleProps**: label, value/defaultValue, onChange, isDisabled, isRequired, isFluid, className, error (where applicable).
- **CheckboxProps**: value (boolean), onChange(checked: boolean).
- **DateProps**: defaultValue (string "dd-mm-yyyy"), onChange(dateValue: string).
- **FormControlsStepperProps**: label, placeholder, value, onChange(e).

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

### TextArea, Checkbox, Date

```jsx
<FormControls.TextArea label="Message" placeholder="Hello" />
<FormControls.Checkbox label="Accept terms?" value={checked} onChange={setChecked} />
<FormControls.Date label="DOB" defaultValue="31-05-1992" onChange={(v) => {}} />
```

### Used by other components

Pagination uses `FormControls.Select` for rows-per-page. Pills uses `FormControls.Input` in edit mode.

## Behavior Notes

- **Select:** options are `{ label, value }`; single select passes one option to onChange, multi passes an array. value can be option or array for multi.
- **Date:** Returns string "dd-mm-yyyy" to onChange; uses internal day/month/year Selects.
- **Error:** When `error` is set, the field shows error styling and message below.
- **isFluid:** Full-width field wrapper.

## Related Components / Links

- Pills (uses FormControls.Input in edit mode)
- Pagination (uses FormControls.Select for rows-per-page)
- Container (layout around form fields)
- Button (submit/cancel in forms)
