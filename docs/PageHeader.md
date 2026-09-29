# PageHeader Component

Purpose: Two-column page header with left column (title and optional subtitle) and right column (primary CTA and optional more menu with three-dots icon). Use at the top of a page or section. Right column is aligned to the right edge. Title and subtitle accept string or ReactNode; more menu can be a list of items (label, onClick) or custom content via moreMenuContent.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| title | ReactNode | yes | — | Page title (left column). String or custom ReactNode. |
| subtitle | ReactNode | no | — | Optional subtitle below the title (left column). |
| primaryCta | ReactNode \| PageHeaderCtaConfig | no | — | Primary call-to-action (right column). Prefer `PageHeaderCtaConfig` (object, not a render function). A React element is rendered unchanged at every viewport. |
| moreMenuItems | PageHeaderMoreMenuItem[] | no | — | More menu items; renders three-dots (more_vert) icon and dropdown. Each item has label and optional onClick; menu closes after click. |
| moreMenuContent | ReactNode | no | — | Custom content for the more menu dropdown instead of moreMenuItems (right column). |
| margin | string \| SpacingOption[] | no | "b-4" | Outer margin. Suffix API (`"b-4"`, `"0"`, `["t-2", "b-4"]`). Default is 16px below the header. |
| className | string | no | "" | Additional class name for the root element. |

## Types

### PageHeaderMoreMenuItem
```typescript
interface PageHeaderMoreMenuItem {
  label: string;      // Menu item label
  onClick?: () => void;  // Called when clicked; menu closes after
}
```

### PageHeaderCtaConfig
```typescript
interface PageHeaderCtaView {
  label?: string;
  icon?: MaterialIconName;
  variant?: "solid" | "outline" | "ghost" | "icon";
  size?: "small" | "medium" | "large";
}

interface PageHeaderCtaConfig {
  label: string;                 // Required. Visible label, and aria-label when the button is icon-only
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Shared by both breakpoints
  icon?: MaterialIconName;       // Desktop prefix. On mobile, switches the button to icon-only
  variant?: "solid" | "outline" | "ghost" | "icon"; // Desktop, and mobile only when no icon resolves. Default "solid"
  size?: "small" | "medium" | "large"; // Default "medium"
  desktop?: PageHeaderCtaView;   // Overrides for viewports wider than 600px
  mobile?: PageHeaderCtaView;    // Overrides for viewports up to 600px
}
```

### PageHeaderProps
```typescript
interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta?: React.ReactNode | PageHeaderCtaConfig;
  moreMenuItems?: PageHeaderMoreMenuItem[];
  moreMenuContent?: React.ReactNode;
  margin?: string | SpacingOption[]; // Default "b-4"
  className?: string;
}
```

## Usage Examples

### Full header

```jsx
import { PageHeader } from "cleanplate";

<PageHeader
  title="Projects"
  subtitle="Manage and track your team projects"
  primaryCta={{
    label: "New project",
    icon: "add",
    onClick: () => createProject(),
  }}
  moreMenuItems={[
    { label: "Export", onClick: () => exportData() },
    { label: "Archive", onClick: () => archive() },
    { label: "Settings", onClick: () => openSettings() },
  ]}
/>
```

### Title and subtitle only

```jsx
<PageHeader
  title="Settings"
  subtitle="Configure your account and preferences"
/>
```

### With primary CTA only

No `icon`: the same labeled button is used above and below 600px.

```jsx
<PageHeader
  title="Documents"
  subtitle="All your documents in one place"
  primaryCta={{ label: "Upload", onClick: () => upload() }}
/>
```

### Breakpoint overrides

`desktop` and `mobile` replace `label`, `icon`, `variant`, or `size` for that breakpoint only. Omit the shared `icon` when the wide layout should not show a prefix. Set `mobile.variant` to `"solid"` to keep the text label on small screens.

```jsx
<PageHeader
  title="Projects"
  primaryCta={{
    label: "New project",
    onClick: () => createProject(),
    mobile: { icon: "add" },
  }}
/>

<PageHeader
  title="Projects"
  primaryCta={{
    label: "New project",
    icon: "add",
    onClick: () => createProject(),
    mobile: { variant: "solid" },
  }}
/>
```

### With more menu only

```jsx
<PageHeader
  title="Report"
  subtitle="Generated on 17 Feb 2025"
  moreMenuItems={[
    { label: "Print", onClick: handlePrint },
    { label: "Download PDF", onClick: handleDownload },
    { label: "Share", onClick: handleShare },
  ]}
/>
```

### Custom title (ReactNode)

```jsx
import { PageHeader, Button, Container, Icon } from "cleanplate";

<PageHeader
  title={
    <Container display="flex" align="center" gap="2" padding="0" margin="0">
      <Icon name="assignment" size="medium" />
      Custom title with icon
    </Container>
  }
  subtitle="Optional subtitle"
  primaryCta={<Button>Action</Button>}
/>
```

### Custom more menu content

```jsx
<PageHeader
  title="Page"
  primaryCta={<Button>Save</Button>}
  moreMenuContent={
    <div style={{ padding: "8px" }}>
      <a href="/export">Export</a>
      <hr />
      <button type="button">Settings</button>
    </div>
  }
/>
```

## Behavior Notes

- **Layout:** Root is a `<header>`. Flex row that does not wrap: left column (title above subtitle), right column (CTA + more trigger, `margin-left: auto`). Title and subtitle truncate with an ellipsis when the row runs out of room, so the actions stay visible. Below 600px (`--mobile-breakpoint`) the actions column keeps a minimum width of one medium icon button, or two when both the primary action and the more menu are present.
- **Margin:** `margin` uses the suffix API. Default `"b-4"` (16px, `--space-4`) below the header. Pass `margin="0"` to remove it.
- **Title / subtitle:** Rendered with Typography (`h4` for the title, `small` for the subtitle). Each is one line and ellipsizes when the actions need the remaining width.
- **Primary CTA:** Pass a `PageHeaderCtaConfig` object. Do not pass a function of the viewport. `label` and `onClick` are shared. `size` defaults to `medium`. Both breakpoint buttons are rendered; CSS shows one (`display: none` on the other) so server HTML matches the client. The cutoff is 600px, the same value as `--mobile-breakpoint`.
  - Wider than 600px: labeled Button. `variant` defaults to `solid`. `icon` is a prefix icon (`prefixIcon`).
  - Up to 600px: if an icon resolves (shared `icon` or `mobile.icon`), the button becomes `variant="icon"` and `label` is its `aria-label`. The glyph is `prefixIcon`. The base `variant` is not used on mobile in that case. `mobile.variant` overrides this (`"solid"` keeps the text label). If no icon resolves, mobile uses the same labeled button as desktop.
  - `desktop` and `mobile` override `label`, `icon`, `variant`, and `size` for that breakpoint only.
  - `variant: "icon"` with no icon name falls back to a labeled solid button.
  - A React element is custom content and is rendered once, unchanged at every viewport. A plain object with a string `label` is the config.
- **More menu:** When moreMenuItems is set, renders a Dropdown with an icon Button (more_vert) and MenuList; each item onClick runs and the dropdown closes. When moreMenuContent is set, that content is shown in the dropdown. Use one or the other.
- **Accessibility:** More trigger has aria-expanded, aria-haspopup, and aria-label; menu items use MenuList semantics.



## HTML prototype

```bash
npm run html-to-jsx -- recipe.html
```

### Recipe

```html
<div data-cp="PageHeader" class="cp-page-header"><h1 data-cp-slot="title">Projects</h1></div>
```

### React equivalent

```jsx
<PageHeader title={<h1>Projects</h1>} />
```

## Related Components / Links

- Button (rendered for a `PageHeaderCtaConfig`; a Button element is also valid as a custom `primaryCta`)
- Typography (used internally for string title and subtitle)
- Dropdown (used internally for the more menu)
- MenuList (used internally for moreMenuItems)
- Icon (more_vert trigger)
- Container (wrap PageHeader and page content)
