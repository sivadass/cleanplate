import React, { useCallback, useEffect, useRef, useState } from "react";
import { useArgs } from "@storybook/preview-api";
import { de } from "date-fns/locale/de";
import { FormControls, Container, Typography, Icon } from "../../index";
import type { Option, SelectValue } from "../../components/form-controls/Select";

/* -------------------------------------------------------------------------- */
/* Shared argTypes / option lists                                             */
/* -------------------------------------------------------------------------- */

const selectOptions: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Mango", value: "mango" },
  { label: "Orange", value: "orange" },
  { label: "Grapes", value: "grapes" },
];

const selectOptionsExtended: Option[] = [
  ...selectOptions,
  { label: "Kiwi", value: "kiwi" },
  { label: "Banana", value: "banana" },
];

const fiveFruitSelection: SelectValue = [
  selectOptionsExtended[0],
  selectOptionsExtended[1],
  selectOptionsExtended[2],
  selectOptionsExtended[3],
  selectOptionsExtended[4],
];

/** Long static list for narrow-viewport / bottom-sheet scroll testing in Storybook. */
const selectOptionsMobileScrollTest: Option[] = [
  ...selectOptionsExtended,
  { label: "Blueberry", value: "blueberry" },
  { label: "Cherry", value: "cherry" },
  { label: "Coconut", value: "coconut" },
  { label: "Dragon fruit", value: "dragon_fruit" },
  { label: "Guava", value: "guava" },
  { label: "Lime", value: "lime" },
  { label: "Lychee", value: "lychee" },
  { label: "Melon", value: "melon" },
  { label: "Passion fruit", value: "passion_fruit" },
  { label: "Peach", value: "peach" },
  { label: "Pear", value: "pear" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Plum", value: "plum" },
  { label: "Pomegranate", value: "pomegranate" },
  { label: "Raspberry", value: "raspberry" },
  { label: "Strawberry", value: "strawberry" },
  { label: "Watermelon", value: "watermelon" },
  { label: "Papaya", value: "papaya" },
  { label: "Apricot", value: "apricot" },
  { label: "Blackberry", value: "blackberry" },
  { label: "Cranberry", value: "cranberry" },
  { label: "Date", value: "date" },
  { label: "Fig", value: "fig" },
  { label: "Grapefruit", value: "grapefruit" },
  { label: "Jackfruit", value: "jackfruit" },
];

function filterSelectDemoOptions(query: string): Option[] {
  const q = query.trim().toLowerCase();
  if (!q) return selectOptions;
  return selectOptions.filter((o) =>
    o.label.toLowerCase().includes(q)
  );
}

async function selectDemoOnSearch(query: string): Promise<Option[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 200));
  return filterSelectDemoOptions(query);
}

const selectRichGroupedOptions: Option[] = [
  {
    label: "Inbox",
    value: "inbox",
    group: "Mailboxes",
    icon: "inbox",
    meta: "12 new",
  },
  {
    label: "Sent",
    value: "sent",
    group: "Mailboxes",
    icon: "send",
  },
  {
    label: "Drafts",
    value: "drafts",
    group: "Mailboxes",
    icon: "draft",
    meta: "Read-only label",
    disabled: true,
  },
  {
    label: "Team channel",
    value: "team",
    group: "Collaboration",
    avatar: "https://picsum.photos/seed/cleanplate-chat/96/96",
    meta: "Shared workspace",
  },
  {
    label: "Direct messages",
    value: "dm",
    group: "Collaboration",
    icon: "chat",
  },
];

const commonControlArgTypes = {
  label: { control: "text", description: "Visible label above the field" },
  isRequired: {
    control: "boolean",
    description: "Mark the field as required (sets `required` + `aria-required`)",
  },
  isDisabled: { control: "boolean", description: "Disable the field" },
  isFluid: { control: "boolean", description: "Full-width wrapper" },
  error: {
    control: "text",
    description: "Error message under the field; flips error styling and ARIA",
  },
  className: { control: "text" },
  dataTestId: { control: "text", description: "Maps to `data-testid` on the underlying control" },
  name: { control: "text" },
  id: { control: "text" },
} as const;

/** Shared by all Input playground stories — maps to native `autocomplete`. */
const inputAutoCompleteArgType = {
  autoComplete: {
    control: { type: "select" },
    options: [
      "",
      "off",
      "on",
      "email",
      "username",
      "current-password",
      "new-password",
      "name",
      "given-name",
      "family-name",
      "tel",
      "url",
      "street-address",
      "postal-code",
      "country",
      "one-time-code",
      "search",
    ],
    description:
      "Native `autocomplete` (empty = browser default / omit). See MDN for full token list.",
  },
} as const;

const meta = {
  title: "atoms/FormControls/Playground",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Each form control has its own playground story with live controls. Toggle props in the Controls panel to see them reflected in the canvas (and vice versa where the control is stateful). Stories: **Input**, **Input (number)**, **Input (prefix / suffix)**, **Input (search)**, **TextArea**, **Select** (and Select variants: async, grouped, bulk/max, chip overflow, error, empty list, mobile sheet, form submit), **Date** (playground plus min/max, week start, disabled rules, locale/format, validation, read-only & no-clear, form `name`, mobile sheet), **Checkbox (group)**, **Checkbox (card variant)**, **Checkbox (single option)**, **Toggle**, **Radio (group)**, **Radio (card variant)**, **Radio (single option)**, **File (button)**, **File (card)**, **Stepper (form control)**, plus **All controls (showcase)**.",
      },
    },
  },
};

export default meta;

/* -------------------------------------------------------------------------- */
/* Input                                                                       */
/* -------------------------------------------------------------------------- */

type InputArgs = React.ComponentProps<typeof FormControls.Input>;

export const Input = {
  name: "Input",
  argTypes: {
    ...commonControlArgTypes,
    ...inputAutoCompleteArgType,
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    placeholder: { control: "text" },
    value: { control: "text" },
    defaultValue: { control: "text" },
    onChange: { action: "onChange" },
    onKeyDown: { action: "onKeyDown" },
  },
  args: {
    label: "Email Address",
    name: "email",
    type: "email",
    placeholder: "user@acme.com",
    autoComplete: "email",
    value: "",
    isRequired: false,
    isDisabled: false,
    isFluid: false,
    error: "",
    dataTestId: "email-input",
  } as Partial<InputArgs>,
  render: (args: InputArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Input
          {...args}
          onChange={(e) => {
            args.onChange?.(e);
            updateArgs({ value: e.target.value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Input (number)                                                              */
/* -------------------------------------------------------------------------- */

export const InputNumber = {
  name: "Input (number)",
  parameters: {
    docs: {
      description: {
        story:
          "`type=\"number\"` is mapped internally to `<input type=\"text\" inputmode=\"numeric\" pattern=\"[0-9]*\">` so mobile shows the numeric keypad, HTML5 validates digit-only entry, and you avoid the well-known UX issues of native `type=\"number\"` (scroll-wheel mutates value, spinner buttons, accepts `e`/`+`/`-`). Use the controls to test required, disabled, error, fluid, and the digit-only validation behavior.",
      },
    },
  },
  argTypes: {
    ...commonControlArgTypes,
    ...inputAutoCompleteArgType,
    placeholder: { control: "text" },
    value: { control: "text" },
    defaultValue: { control: "text" },
    onChange: { action: "onChange" },
    onKeyDown: { action: "onKeyDown" },
  },
  args: {
    label: "Quantity",
    name: "qty",
    type: "number",
    placeholder: "Enter a whole number",
    autoComplete: "off",
    value: "",
    isRequired: false,
    isDisabled: false,
    isFluid: false,
    error: "",
    dataTestId: "qty-input",
  } as Partial<InputArgs>,
  render: (args: InputArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Input
          {...args}
          onChange={(e) => {
            args.onChange?.(e);
            updateArgs({ value: e.target.value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Input (prefix / suffix affixes)                                             */
/* -------------------------------------------------------------------------- */

export const InputAffix = {
  name: "Input (prefix / suffix)",
  parameters: {
    docs: {
      description: {
        story:
          "Inline `prefix` and `suffix` props for currency symbols, units, country codes, and similar short adornments. Soft-capped at 4 characters so the layout stays predictable. Adjust `prefix`, `suffix`, and `type` in the Controls panel to try common combos: `$` + USD amount (`type=\"number\"`), `+91` + phone (`type=\"tel\"`), `kg` / `%` units, `.com` for URLs, etc. Ignored when `type=\"search\"` (the search icon and clear button already occupy those slots).",
      },
    },
  },
  argTypes: {
    ...commonControlArgTypes,
    ...inputAutoCompleteArgType,
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    prefix: {
      control: "text",
      description: "Leading affix (max 4 chars). Examples: `$`, `+91`, `Rs`",
    },
    suffix: {
      control: "text",
      description: "Trailing affix (max 4 chars). Examples: `kg`, `%`, `.com`",
    },
    placeholder: { control: "text" },
    value: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "Amount",
    name: "amount",
    type: "number",
    placeholder: "0.00",
    autoComplete: "off",
    prefix: "$",
    suffix: "USD",
    value: "",
    isRequired: false,
    isDisabled: false,
    isFluid: false,
    error: "",
    dataTestId: "amount-input",
  } as Partial<InputArgs>,
  render: (args: InputArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Input
          {...args}
          onChange={(e) => {
            args.onChange?.(e);
            updateArgs({ value: e.target.value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Input (search variant)                                                      */
/* -------------------------------------------------------------------------- */

export const InputSearch = {
  name: "Input (search)",
  parameters: {
    docs: {
      description: {
        story:
          "When `type=\"search\"`, the field renders with a leading search icon and replaces the browser's default clear control with our own (`close` from the icon library). The clear button only appears once there's content, focuses the input on click, and emits a synthetic `onChange` with an empty value so controlled and uncontrolled inputs both stay in sync.",
      },
    },
  },
  argTypes: {
    ...commonControlArgTypes,
    ...inputAutoCompleteArgType,
    placeholder: { control: "text" },
    value: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "Search",
    name: "q",
    type: "search",
    placeholder: "Search products, orders, customers...",
    autoComplete: "search",
    value: "",
    isRequired: false,
    isDisabled: false,
    isFluid: true,
    error: "",
    dataTestId: "search-input",
  } as Partial<InputArgs>,
  render: (args: InputArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Input
          {...args}
          onChange={(e) => {
            args.onChange?.(e);
            updateArgs({ value: e.target.value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* TextArea                                                                    */
/* -------------------------------------------------------------------------- */

type TextAreaArgs = React.ComponentProps<typeof FormControls.TextArea>;

export const TextArea = {
  name: "TextArea",
  argTypes: {
    ...commonControlArgTypes,
    placeholder: { control: "text" },
    value: { control: "text" },
    defaultValue: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "Message",
    name: "message",
    placeholder: "Hello world!",
    value: "",
    isRequired: false,
    isDisabled: false,
    isFluid: false,
    error: "",
    dataTestId: "message-textarea",
  } as Partial<TextAreaArgs>,
  render: (args: TextAreaArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.TextArea
          {...args}
          onChange={(e) => {
            args.onChange?.(e);
            updateArgs({ value: e.target.value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Select                                                                      */
/* -------------------------------------------------------------------------- */

type SelectArgs = React.ComponentProps<typeof FormControls.Select>;

export const Select = {
  name: "Select",
  argTypes: {
    ...commonControlArgTypes,
    placeholder: { control: "text" },
    mode: { control: "inline-radio", options: ["single", "multi"] },
    triggerMaxItems: {
      control: { type: "number", min: 0, max: 12, step: 1 },
    },
    clearable: { control: "boolean" },
    isMulti: {
      control: false,
      table: { disable: true },
      description:
        "Deprecated — use mode='multi'. Shown here only when passed through args.",
    },
    options: { control: "object" },
    onChange: { action: "onChange" },
    searchPlaceholder: { control: "text" },
    searchDebounce: {
      control: { type: "number", min: 0, max: 2000, step: 50 },
    },
    onSearch: { table: { disable: true }, control: false },
    onAddOption: { action: "onAddOption", control: false },
    closeOnAddOption: { control: "boolean" },
    groups: { control: "boolean", description: "Show headings from Option.group" },
    maxSelect: {
      control: { type: "number", min: 1, max: 20, step: 1 },
      description:
        "Multi only — max selections; extras look disabled until you deselect.",
    },
  },
  args: {
    label: "Fruit",
    name: "fruit",
    placeholder: "Select a fruit",
    options: selectOptions,
    searchPlaceholder: "Search",
    searchDebounce: 300,
    mode: "single",
    triggerMaxItems: 2,
    clearable: true,
    closeOnAddOption: true,
    groups: false,
    isRequired: false,
    isDisabled: false,
    isFluid: false,
    error: "",
    dataTestId: "fruit-select",
  } as Partial<SelectArgs>,
  render: (args: SelectArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Select
          {...args}
          onChange={(option) => {
            args.onChange?.(option);
            updateArgs({ value: option });
          }}
        />
      </Container>
    );
  },
};

export const SelectBulkAndCap = {
  name: "Select · bulk actions & max selection",
  argTypes: {
    ...Select.argTypes,
  },
  args: {
    ...(Select.args as Partial<SelectArgs>),
    mode: "multi",
    maxSelect: 3,
    placeholder: "Pick up to three fruits",
    triggerMaxItems: 3,
  } as Partial<SelectArgs>,
  render: Select.render,
};

export const SelectMultiChipsOverflow = {
  name: "Select · multi (chip overflow +N)",
  argTypes: Select.argTypes,
  args: {
    ...(Select.args as Partial<SelectArgs>),
    mode: "multi",
    triggerMaxItems: 2,
    options: selectOptionsExtended,
    value: fiveFruitSelection,
    placeholder: "Five fruits selected — +N overflow",
  } as Partial<SelectArgs>,
  render: Select.render,
};

export const SelectSingleWithError = {
  name: "Select · single (validation error)",
  argTypes: Select.argTypes,
  args: {
    ...(Select.args as Partial<SelectArgs>),
    mode: "single",
    error: "Pick an option from the list.",
    isRequired: true,
  } as Partial<SelectArgs>,
  render: Select.render,
};

export const SelectSyncEmptyOptions = {
  name: "Select · sync list empty",
  argTypes: Select.argTypes,
  args: {
    ...(Select.args as Partial<SelectArgs>),
    options: [],
    placeholder: "No static options available",
  } as Partial<SelectArgs>,
  render: Select.render,
};

export const SelectMobileBottomSheet = {
  name: "Select · narrow viewport (bottom sheet)",
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "Canvas uses the **mobile1** preset (320×568 — under the 768px breakpoint). Open the control: the panel should use the bottom sheet + dimmed backdrop. Options are a long static list so you can verify **in-panel scrolling**.",
      },
    },
  },
  argTypes: Select.argTypes,
  args: {
    ...(Select.args as Partial<SelectArgs>),
    options: selectOptionsMobileScrollTest,
    placeholder: "Open to scroll a long list",
  } as Partial<SelectArgs>,
  render: Select.render,
};

export const SelectFormMultiSubmit = {
  name: "Select · form (hidden multi value)",
  parameters: {
    docs: {
      description: {
        story:
          "The hidden `<input type=\"hidden\">` joins multi values with commas. Submit to see the posted value rendered below.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState<SelectValue>([
      selectOptions[0],
      selectOptions[1],
    ]);
    const [posted, setPosted] = useState<string | null>(null);
    return (
      <Container padding="4" style={{ minWidth: 280 }}>
        <Typography variant="small" margin="b-2">
          Multi selection is submitted as one field: comma-separated `value`
          tokens (parse on the server accordingly).
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            setPosted(String(fd.get("tags") ?? ""));
          }}
        >
          <FormControls.Select
            label="Tags"
            name="tags"
            mode="multi"
            options={selectOptions}
            value={value}
            onChange={(next) => setValue(next)}
            dataTestId="tags-select-form"
          />
          <button type="submit" style={{ marginTop: 12 }}>
            Submit
          </button>
        </form>
        {posted !== null ? (
          <Typography variant="small" margin="t-2">
            Last <code>tags</code> value: <code>{posted}</code>
          </Typography>
        ) : null}
      </Container>
    );
  },
};

type SelectAsyncStoryArgs = Omit<SelectArgs, "options" | "onSearch">;

export const SelectAsync = {
  name: "Select · async onSearch",
  argTypes: {
    ...Select.argTypes,
    options: { table: { disable: true }, control: false },
    onSearch: { table: { disable: true }, control: false },
    value: { control: false },
  },
  args: {
    ...(Select.args as Partial<SelectAsyncStoryArgs>),
    options: undefined,
  } as Partial<SelectAsyncStoryArgs>,
  render: (args: SelectAsyncStoryArgs) => {
    const [selection, setSelection] = useState<SelectValue>(null);
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <Typography variant="small" margin="b-2">
          Static list is disabled: `options=null` and results come from
          `onSearch`, debounced except for an empty query.
        </Typography>
        <FormControls.Select
          {...args}
          options={null}
          onSearch={selectDemoOnSearch}
          value={selection}
          onChange={(option) => {
            setSelection(option);
          }}
        />
      </Container>
    );
  },
};

type SelectRichStoryArgs = React.ComponentProps<typeof FormControls.Select>;

export const SelectRichGrouped = {
  name: "Select · groups, icons & meta",
  argTypes: {
    ...Select.argTypes,
    options: { control: false, table: { disable: true } },
  },
  args: {
    ...(Select.args as Partial<SelectRichStoryArgs>),
    label: "Destination",
    placeholder: "Pick a mailbox or channel…",
    options: selectRichGroupedOptions,
    groups: true,
  } as Partial<SelectRichStoryArgs>,
  render: (args: SelectRichStoryArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Select
          {...args}
          onChange={(option) => {
            args.onChange?.(option);
            updateArgs({ value: option });
          }}
        />
      </Container>
    );
  },
};

export const SelectAsyncRetryDemo = {
  name: "Select · async (error + retry)",
  argTypes: {
    ...SelectAsync.argTypes,
  },
  args: {
    ...(SelectAsync.args as Partial<SelectAsyncStoryArgs>),
  } as Partial<SelectAsyncStoryArgs>,
  render: (args: SelectAsyncStoryArgs) => {
    const [selection, setSelection] = useState<SelectValue>(null);
    const failOnceRef = useRef(true);
    const onSearch = useCallback(async (query: string) => {
      await new Promise((resolve) => window.setTimeout(resolve, 220));
      if (failOnceRef.current) {
        failOnceRef.current = false;
        throw new Error("Simulated fetch failure");
      }
      return filterSelectDemoOptions(query);
    }, []);
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <Typography variant="small" margin="b-2">
          First request fails — use Retry to rerun the latest search. Subsequent
          calls succeed.
        </Typography>
        <FormControls.Select
          {...args}
          options={null}
          onSearch={onSearch}
          value={selection}
          onChange={(option) => {
            setSelection(option);
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Date                                                                        */
/* -------------------------------------------------------------------------- */

type DateArgs = React.ComponentProps<typeof FormControls.Date>;

function dateStoryRemountKey(args: Partial<DateArgs>) {
  if (args.value !== undefined) {
    return args.value != null ? `v:${String(args.value.getTime())}` : "v:null";
  }
  return args.defaultValue instanceof Date
    ? `d:${String(args.defaultValue.getTime())}`
    : "d:unset";
}

function renderDateStory(args: DateArgs) {
  return (
    <Container padding="4" style={{ minWidth: 360 }}>
      <FormControls.Date key={dateStoryRemountKey(args)} {...args} />
    </Container>
  );
}

/** Named `DateStory` — not `Date` — so `new Date()` in `args` does not hit the TDZ of a same-named export. */
export const DateStory = {
  name: "Date",
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    ...commonControlArgTypes,
    defaultValue: {
      control: false,
      description: "Uncontrolled initial calendar date (`Date`; remount Storybook canvas to retry)",
    },
    value: { control: false, description: "Controlled `Date | null`; use code if needed" },
    onChange: { action: "onChange" },
    minDate: { control: "date", description: "Inclusive minimum selectable date" },
    maxDate: { control: "date", description: "Inclusive maximum selectable date" },
  },
  args: {
    label: "Date of birth",
    defaultValue: new Date(1992, 4, 31),
    isRequired: false,
    isDisabled: false,
    readOnly: false,
    isFluid: false,
    error: "",
    dataTestId: "dob",
  } satisfies Partial<DateArgs>,
  render: renderDateStory,
};

export const DateMinMaxRange = {
  name: "Date · min / max window",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "`minDate` and `maxDate` constrain navigation and selection. The initial value sits inside the allowed range.",
      },
    },
  },
  argTypes: DateStory.argTypes,
  args: {
    label: "Delivery date",
    defaultValue: new Date(2026, 5, 15),
    minDate: new Date(2026, 5, 1),
    maxDate: new Date(2026, 5, 30),
    dataTestId: "date-minmax",
  } satisfies Partial<DateArgs>,
  render: renderDateStory,
};

export const DateWeekStartsMonday = {
  name: "Date · week starts Monday",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "`weekStartsOn={1}` aligns the calendar grid so weeks begin on Monday.",
      },
    },
  },
  argTypes: DateStory.argTypes,
  args: {
    label: "Week (Mon start)",
    defaultValue: new Date(2026, 4, 10),
    weekStartsOn: 1,
    dataTestId: "date-mon",
  } satisfies Partial<DateArgs>,
  render: renderDateStory,
};

export const DateDisabledRules = {
  name: "Date · disabled weekends + dates",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "`disabledDaysOfWeek` greys out Sat/Sun; `disabledDates` blocks specific calendar days.",
      },
    },
  },
  argTypes: DateStory.argTypes,
  args: {
    label: "Appointment",
    defaultValue: new Date(2026, 5, 11),
    disabledDaysOfWeek: [0, 6],
    disabledDates: [
      new Date(2026, 5, 10),
      new Date(2026, 5, 17),
      new Date(2026, 5, 24),
    ],
    dataTestId: "date-disabled",
  } satisfies Partial<DateArgs>,
  render: renderDateStory,
};

export const DateLocaleAndFormat = {
  name: "Date · locale + display format",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Uses **`date-fns` `de`** for month/weekday labels and **`dateFormat`** for the field (`dd.MM.yyyy`). Locale is wired in render so Storybook controls stay JSON-safe.",
      },
    },
  },
  argTypes: DateStory.argTypes,
  render: () =>
    renderDateStory({
      label: "Datum",
      defaultValue: new Date(2026, 3, 20),
      locale: de,
      dateFormat: "dd.MM.yyyy",
      dataTestId: "date-de",
    }),
};

export const DateValidationError = {
  name: "Date · required + error",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "**`isRequired`** and **`error`**: asterisk on the label, message under the field, and invalid styling on the trigger.",
      },
    },
  },
  argTypes: DateStory.argTypes,
  args: {
    label: "Start date",
    defaultValue: null,
    placeholder: "Choose a date",
    isRequired: true,
    error: "Select a start date to continue.",
    dataTestId: "date-err",
  } satisfies Partial<DateArgs>,
  render: renderDateStory,
};

export const DateReadOnlyAndNoClear = {
  name: "Date · read-only & no clear",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "**`readOnly`** locks the value and blocks opening the calendar; **`clearable={false}`** hides the clear (×) control.",
      },
    },
  },
  argTypes: DateStory.argTypes,
  args: {
    label: "Locked date",
    value: new Date(2018, 7, 3),
    readOnly: true,
    clearable: false,
    dataTestId: "date-ro",
  } satisfies Partial<DateArgs>,
  render: renderDateStory,
};

export const DateFormHiddenName = {
  name: "Date · form (hidden yyyy-MM-dd)",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "With **`name`**, the component renders a hidden input that submits **`yyyy-MM-dd`**—useful alongside native form posts.",
      },
    },
  },
  render: () => {
    const [posted, setPosted] = useState<string | null>(null);
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            setPosted(String(fd.get("starts_on") ?? ""));
          }}
        >
          <FormControls.Date
            label="Starts on"
            name="starts_on"
            defaultValue={new Date(2026, 8, 9)}
            dataTestId="date-form-name"
          />
          <Typography variant="small" margin="t-2 b-2">
            Submit posts the hidden field as <code>yyyy-MM-dd</code> (calendar date).
          </Typography>
          <button type="submit">Submit</button>
        </form>
        {posted ? (
          <Typography variant="small" margin="t-2">
            Posted <code>starts_on</code>: <strong>{posted}</strong>
          </Typography>
        ) : null}
      </Container>
    );
  },
};

export const DateMobileBottomSheet = {
  name: "Date · narrow viewport (bottom sheet)",
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "**mobile1** (320×568) is under the 768px breakpoint. Open the picker to see the **bottom sheet**, backdrop, and Cancel / OK flow.",
      },
    },
  },
  argTypes: DateStory.argTypes,
  args: {
    label: "Event date",
    defaultValue: new Date(2026, 6, 4),
    dataTestId: "date-mobile",
  } satisfies Partial<DateArgs>,
  render: renderDateStory,
};

/* -------------------------------------------------------------------------- */
/* Checkbox (group, array-based API)                                           */
/* -------------------------------------------------------------------------- */

const interestOptions = [
  {
    label: "Newsletters",
    value: "newsletter",
    description: "Weekly digest of what's new across the platform.",
  },
  {
    label: "Product updates",
    value: "product",
    description: "Release notes and changelogs for features you use.",
  },
  {
    label: "Promotions",
    value: "promo",
    description: "Discounts, deals, and limited-time offers.",
  },
  {
    label: "Events",
    value: "events",
    description: "Webinars, meetups, and conferences near you.",
  },
];

type CheckboxArgs = React.ComponentProps<typeof FormControls.Checkbox>;

export const Checkbox = {
  name: "Checkbox (group)",
  parameters: {
    docs: {
      description: {
        story:
          "Group-first API: pass an `options` array (single item is fine for one checkbox). The component renders a `<fieldset>` with a `<legend>`, manages selection via a `value` array, and emits `onChange(values, event)`. The required `*` lives on the legend.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "Group label (rendered in <legend>)" },
    name: { control: "text" },
    value: {
      control: { type: "check" },
      options: interestOptions.map((o) => o.value),
      description: "Currently checked option values (controlled, string[])",
    },
    options: { control: "object" },
    orientation: {
      control: { type: "inline-radio" },
      options: ["vertical", "horizontal"],
    },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isFluid: { control: "boolean" },
    error: { control: "text" },
    onChange: {
      action: "onChange",
      description: "Fires with the next array of selected values (and the underlying event)",
    },
  },
  args: {
    label: "Email me about",
    name: "interests",
    value: ["product"],
    options: interestOptions,
    orientation: "vertical",
    isDisabled: false,
    isRequired: false,
    isFluid: false,
    error: "",
    dataTestId: "interests-group",
  } as Partial<CheckboxArgs>,
  render: (args: CheckboxArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Checkbox
          {...args}
          onChange={(value, e) => {
            args.onChange?.(value, e);
            updateArgs({ value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Checkbox (card variant with icons)                                          */
/* -------------------------------------------------------------------------- */

const featureCardOptions = [
  {
    label: "Analytics",
    value: "analytics",
    description: "Real-time dashboards and weekly reports.",
    icon: <Icon name="bar_chart" />,
  },
  {
    label: "Automation",
    value: "automation",
    description: "Build workflows that trigger on events.",
    icon: <Icon name="bolt" />,
  },
  {
    label: "Collaboration",
    value: "collab",
    description: "Shared spaces with roles and comments.",
    icon: <Icon name="groups" />,
  },
];

export const CheckboxCard = {
  name: "Checkbox (card variant)",
  parameters: {
    docs: {
      description: {
        story:
          "Tile-style options with the checkbox in the top-right corner, an optional `icon` to the left of the label/description, and a primary-brand border + tint when checked. Icons accept any `ReactNode` — Material `<Icon>`, brand logos (`<img>`), custom SVG, etc.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    value: {
      control: { type: "check" },
      options: featureCardOptions.map((o) => o.value),
    },
    orientation: {
      control: { type: "inline-radio" },
      options: ["vertical", "horizontal"],
    },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isFluid: { control: "boolean" },
    error: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "Add-ons",
    name: "addons",
    value: ["automation"],
    variant: "card",
    options: featureCardOptions,
    orientation: "horizontal",
    isDisabled: false,
    isRequired: false,
    isFluid: true,
    error: "",
    dataTestId: "addons-card-group",
  } as Partial<CheckboxArgs>,
  render: (args: CheckboxArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 560 }}>
        <FormControls.Checkbox
          {...args}
          variant="card"
          onChange={(value, e) => {
            args.onChange?.(value, e);
            updateArgs({ value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Checkbox (single option via array)                                          */
/* -------------------------------------------------------------------------- */

export const CheckboxSingle = {
  name: "Checkbox (single option)",
  parameters: {
    docs: {
      description: {
        story:
          "Single checkbox rendered through the same array API — pass `options` with one entry. Common for an opt-in / consent confirmation. The `value` prop is still an array; an empty array means unchecked.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    value: {
      control: { type: "check" },
      options: ["yes"],
    },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isFluid: { control: "boolean" },
    error: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "Terms and conditions",
    name: "accept",
    value: [],
    options: [
      {
        label: "I accept the terms and conditions",
        value: "yes",
        description: "You can change your mind later from your account settings.",
      },
    ],
    isDisabled: false,
    isRequired: true,
    isFluid: false,
    error: "",
    dataTestId: "accept-checkbox",
  } as Partial<CheckboxArgs>,
  render: (args: CheckboxArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Checkbox
          {...args}
          onChange={(value, e) => {
            args.onChange?.(value, e);
            updateArgs({ value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Toggle                                                                      */
/* -------------------------------------------------------------------------- */

type ToggleArgs = React.ComponentProps<typeof FormControls.Toggle>;

export const Toggle = {
  name: "Toggle",
  argTypes: {
    ...commonControlArgTypes,
    checked: {
      control: "boolean",
      description: "Controlled checked state",
    },
    defaultChecked: { control: "boolean" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "Email notifications",
    name: "notifications",
    checked: false,
    isRequired: false,
    isDisabled: false,
    isFluid: false,
    error: "",
    dataTestId: "notifications-toggle",
  } as Partial<ToggleArgs>,
  render: (args: ToggleArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Toggle
          {...args}
          onChange={(checked) => {
            args.onChange?.(checked);
            updateArgs({ checked });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Radio (group, array-based API)                                              */
/* -------------------------------------------------------------------------- */

const shippingOptions = [
  {
    label: "Standard (free)",
    value: "std",
    description: "Arrives in 5–7 business days.",
  },
  {
    label: "Express",
    value: "exp",
    description: "Arrives in 1–2 business days.",
  },
  {
    label: "Overnight",
    value: "ovn",
    description: "Order before 5pm — delivered next morning.",
  },
];

type RadioArgs = React.ComponentProps<typeof FormControls.Radio>;

export const Radio = {
  name: "Radio (group)",
  parameters: {
    docs: {
      description: {
        story:
          "Group-first API: pass an `options` array (single item is fine for one radio). The component renders a `<fieldset>` with a `<legend>`, manages selection via a single `value`, and emits `onChange(value, event)`. The required `*` lives on the legend.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "Group label (rendered in <legend>)" },
    name: { control: "text" },
    value: {
      control: { type: "inline-radio" },
      options: shippingOptions.map((o) => o.value),
      description: "Currently selected option (controlled)",
    },
    options: { control: "object" },
    orientation: {
      control: { type: "inline-radio" },
      options: ["vertical", "horizontal"],
    },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isFluid: { control: "boolean" },
    error: { control: "text" },
    onChange: {
      action: "onChange",
      description: "Fires with the next selected value (and the underlying event)",
    },
  },
  args: {
    label: "Shipping speed",
    name: "shipping",
    value: "std",
    options: shippingOptions,
    orientation: "vertical",
    isDisabled: false,
    isRequired: false,
    isFluid: false,
    error: "",
    dataTestId: "shipping-group",
  } as Partial<RadioArgs>,
  render: (args: RadioArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Radio
          {...args}
          onChange={(value, e) => {
            args.onChange?.(value, e);
            updateArgs({ value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Radio (card variant with icons)                                             */
/* -------------------------------------------------------------------------- */

const shippingCardOptions = [
  {
    label: "Standard",
    value: "std",
    description: "4–10 business days · $5.00",
    icon: <Icon name="local_shipping" />,
  },
  {
    label: "Express",
    value: "exp",
    description: "2–5 business days · $16.00",
    icon: <Icon name="bolt" />,
  },
  {
    label: "Super Fast",
    value: "fast",
    description: "1 business day · $25.00",
    icon: <Icon name="rocket_launch" />,
  },
];

export const RadioCard = {
  name: "Radio (card variant)",
  parameters: {
    docs: {
      description: {
        story:
          "Tile-style options with the radio ring in the top-right corner, an optional `icon` to the left of the label/description, and a primary-brand border + tint when selected. Icons accept any `ReactNode` — Material `<Icon>`, brand logos (`<img>`), custom SVG, etc.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    value: {
      control: { type: "inline-radio" },
      options: shippingCardOptions.map((o) => o.value),
    },
    orientation: {
      control: { type: "inline-radio" },
      options: ["vertical", "horizontal"],
    },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isFluid: { control: "boolean" },
    error: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "Delivery method",
    name: "shipping-card",
    value: "exp",
    variant: "card",
    options: shippingCardOptions,
    orientation: "horizontal",
    isDisabled: false,
    isRequired: false,
    isFluid: true,
    error: "",
    dataTestId: "shipping-card-group",
  } as Partial<RadioArgs>,
  render: (args: RadioArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 560 }}>
        <FormControls.Radio
          {...args}
          variant="card"
          onChange={(value, e) => {
            args.onChange?.(value, e);
            updateArgs({ value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Radio (single option via array)                                             */
/* -------------------------------------------------------------------------- */

export const RadioSingle = {
  name: "Radio (single option)",
  parameters: {
    docs: {
      description: {
        story:
          "Single radio rendered through the same array API — pass `options` with one entry. Useful when you only need one switchable radio (e.g. opt-in confirmation).",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isFluid: { control: "boolean" },
    error: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "Subscription plan",
    name: "subscribe",
    value: "yes",
    options: [{ label: "Subscribe to weekly digest", value: "yes" }],
    isDisabled: false,
    isRequired: false,
    isFluid: false,
    error: "",
    dataTestId: "subscribe-radio",
  } as Partial<RadioArgs>,
  render: (args: RadioArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Radio
          {...args}
          onChange={(value, e) => {
            args.onChange?.(value, e);
            updateArgs({ value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* File (button variant)                                                       */
/* -------------------------------------------------------------------------- */

type FileArgs = React.ComponentProps<typeof FormControls.File>;

export const File = {
  name: "File (button)",
  parameters: {
    docs: {
      description: {
        story:
          "Compact trigger that looks like a primary button. Use when the upload sits inline with other form fields. Selected files render below the button with name, size, and a remove action. Set `multiple` to allow appending additional files on subsequent picks.",
      },
    },
  },
  argTypes: {
    ...commonControlArgTypes,
    variant: {
      control: { type: "inline-radio" },
      options: ["button", "card"],
    },
    multiple: { control: "boolean" },
    accept: { control: "text", description: "Native `accept` (e.g. `image/*`)" },
    buttonLabel: { control: "text" },
    onChange: {
      action: "onChange",
      description: "Fires with the next File[] (and underlying event when picker-driven)",
    },
  },
  args: {
    label: "Upload file",
    name: "upload",
    variant: "button",
    multiple: false,
    accept: "",
    buttonLabel: "Browse file",
    isRequired: false,
    isDisabled: false,
    isFluid: false,
    error: "",
    dataTestId: "file-upload",
  } as Partial<FileArgs>,
  render: (args: FileArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.File
          {...args}
          onChange={(files, e) => {
            args.onChange?.(files, e);
            updateArgs({ value: files });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* File (card / drop-zone variant)                                             */
/* -------------------------------------------------------------------------- */

export const FileCard = {
  name: "File (card)",
  parameters: {
    docs: {
      description: {
        story:
          "Drop-zone with a dashed border, helper text, and a `Browse file` CTA. Click anywhere in the zone to open the picker, or drag files in to add them. Hovering with files dragged tints the zone with the primary brand color. Selected files render below the zone as cards with a type-specific thumbnail icon, name, size, and a remove button.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    multiple: { control: "boolean" },
    accept: { control: "text" },
    buttonLabel: { control: "text" },
    dropZoneText: { control: "text", description: "Helper line above the `or` divider" },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isFluid: { control: "boolean" },
    error: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "File Upload",
    name: "upload-card",
    variant: "card",
    multiple: true,
    accept: "image/*,application/pdf",
    buttonLabel: "Browse file",
    dropZoneText: "Drag files to upload",
    isDisabled: false,
    isRequired: false,
    isFluid: false,
    error: "",
    dataTestId: "file-upload-card",
  } as Partial<FileArgs>,
  render: (args: FileArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 480 }}>
        <FormControls.File
          {...args}
          variant="card"
          onChange={(files, e) => {
            args.onChange?.(files, e);
            updateArgs({ value: files });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* Stepper                                                                     */
/* -------------------------------------------------------------------------- */

type StepperArgs = React.ComponentProps<typeof FormControls.Stepper>;

export const Stepper = {
  name: "Stepper (form control)",
  argTypes: {
    ...commonControlArgTypes,
    layout: {
      control: { type: "select" },
      options: ["default", "split-controls", "trailing-stacked-chevrons"],
    },
    placeholder: { control: "text" },
    value: { control: "text" },
    defaultValue: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    step: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "Max Late Arrivals",
    name: "qty",
    placeholder: "",
    defaultValue: "2",
    min: "0",
    max: "99",
    step: "1",
    layout: "default",
    isRequired: false,
    isDisabled: false,
    isFluid: false,
    error: "",
    dataTestId: "qty-stepper",
  } as Partial<StepperArgs>,
  render: (args: StepperArgs) => {
    const [, updateArgs] = useArgs();
    return (
      <Container padding="4" style={{ minWidth: 360 }}>
        <FormControls.Stepper
          {...args}
          onChange={(e) => {
            args.onChange?.(e);
            updateArgs({ value: e.target.value });
          }}
        />
      </Container>
    );
  },
};

/* -------------------------------------------------------------------------- */
/* All controls — static showcase                                              */
/* -------------------------------------------------------------------------- */

export const AllControls = {
  name: "All controls (showcase)",
  parameters: { controls: { disable: true } },
  render: () => {
    const [accepted, setAccepted] = useState<(string | number)[]>([]);
    const [toggle, setToggle] = useState(false);
    const [pick, setPick] = useState<string | number>("a");

    useEffect(() => {
      // no-op, ensures hook order is stable across re-renders
    }, []);

    return (
      <Container padding="4" style={{ minWidth: 480 }}>
        <Typography variant="h5" margin="m-0 m-b-2">
          Form controls
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <FormControls.Input label="Email" placeholder="user@acme.com" isRequired />
          <FormControls.TextArea label="Message" placeholder="Hello world!" />
          <FormControls.Select label="Fruit" options={selectOptions} placeholder="Select a fruit" />
          <FormControls.Date label="Date of birth" defaultValue={new Date(1992, 4, 31)} />
          <FormControls.Checkbox
            label="Terms and conditions"
            name="accept"
            value={accepted}
            options={[{ label: "I accept the terms and conditions", value: "yes" }]}
            onChange={(v) => setAccepted(v)}
          />
          <FormControls.Toggle
            label="Notifications"
            name="notifications"
            checked={toggle}
            onChange={setToggle}
          />
          <FormControls.Radio
            label="Pick one"
            name="showcase-pick"
            value={pick}
            options={[
              { label: "Option A", value: "a" },
              { label: "Option B", value: "b" },
              { label: "Option C", value: "c" },
            ]}
            onChange={(v) => setPick(v)}
          />
          <FormControls.File label="Upload file" />
          <FormControls.Stepper
            label="Max Late Arrivals"
            defaultValue="2"
            min="0"
            max="99"
          />
        </div>
      </Container>
    );
  },
};
