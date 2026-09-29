# Templates

Storybook group **templates** shows full pages built from CleanPlate components. The stories are a visual reference. This file is the copy-paste reference for agents. These pages are not exported from the package.

Install the form library in the app (it is not a CleanPlate dependency):

```bash
npm install react-hook-form
```

CleanPlate fields are controlled. Wire them with `useForm` and `Controller`. Pass `fieldState.error?.message` to `error`. `Select` values are `Option` objects (`{ value, label }`), not raw strings.

```jsx
import { useForm, Controller } from "react-hook-form";
import { Button, FormControls } from "cleanplate";

const { Input } = FormControls;

function EmailField({ control }) {
  return (
    <Controller
      control={control}
      name="email"
      rules={{ required: "Email is required" }}
      render={({ field, fieldState }) => (
        <Input
          name={field.name}
          label="Email"
          type="email"
          isFluid
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

function LoginForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" },
  });

  return (
    <form onSubmit={handleSubmit((values) => console.log(values))}>
      <EmailField control={control} />
      <Button type="submit" variant="solid">Sign in</Button>
    </form>
  );
}
```

Stories: `src/stories/templates/`.

| Story | What it shows |
| --- | --- |
| `templates/Login` | Centered sign-in form. CleanPlate logo, forgot-password link, and a register CTA. No `AppShell`. |
| `templates/Register` | Same card as Login. Placeholders, confirm-password check, and a sign-in link. |
| `templates/CRUD` → Listing | Breadcrumb, `PageHeader` Create, `FilterBar`, paginated `Table`. |
| `templates/CRUD` → Details | Breadcrumb, page header, overview and details columns, metric cards, and an activity table. |
| `templates/Dashboard` | `Statistic` cards, then two tables in one flex row. |
| `templates/Settings` | Horizontal `MenuList` with four panels, each its own `useForm`. |

## App shell

Dashboard, CRUD, and Settings use `AppShell` with the same sidebar items. Login and Register use a centered `Container` (`width="medium"`) and no shell.

## CRUD

Create and Edit share one `Drawer`. The primary footer button calls `handleSubmit`. Delete uses `ConfirmDialog` with `variant="destructive"`.

The actions cell must stop the row click:

```jsx
<Container display="flex" justify="flex-end" onClick={(event) => event.stopPropagation()}>
  <Dropdown
    placement="bottom-end"
    trigger={<Button variant="icon" size="small" type="button" aria-label="Actions" prefixIcon="more_vert" />}
    content={
      <MenuList
        direction="vertical"
        size="small"
        items={[
          { label: "Edit", value: "edit" },
          { label: "Delete", value: "delete" },
        ]}
        onMenuClick={(item) => {
          if (item.value === "edit") openEdit(row);
          if (item.value === "delete") openDelete(row);
        }}
      />
    }
  />
</Container>
```

`Table` `onRowClick` opens the details view. In an app, navigate with your router. The story switches local view state. The details breadcrumb uses `href="#projects"` and the story calls `preventDefault` so the parent crumb returns to the listing.

Details opens from a row click. The page keeps the breadcrumb and page header, then an overview column beside a details column, a row of budget, task, and progress metrics, and a full-width activity table. Set `align="start"` on the column row so the shorter column does not stretch. On a narrow viewport the columns wrap because `Container` flex wraps.

```jsx
<Container display="flex" align="start" gap="6" padding="0" margin="t-6">
  <Container display="block" padding="6" showBorder>
    <Typography variant="h5" margin="b-3">Overview</Typography>
    <Typography variant="p">{project.description}</Typography>
  </Container>
  <Container display="block" padding="6" showBorder>
    <Typography variant="h5" margin="b-4">Details</Typography>
  </Container>
</Container>
```

## Settings tabs

CleanPlate has no `Tabs` component. Use `MenuList` with `direction="horizontal"` and render one panel from `activeItem`. Give each panel its own `useForm`.

```jsx
const TABS = [
  { label: "Profile", value: "profile" },
  { label: "Notifications", value: "notifications" },
  { label: "Security", value: "security" },
  { label: "Billing", value: "billing" },
];

<MenuList
  items={TABS}
  direction="horizontal"
  activeItem={tab}
  margin="b-4"
  onMenuClick={(item) => setTab(item.value)}
/>
```
