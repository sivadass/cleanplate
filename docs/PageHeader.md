# PageHeader Component

Purpose: Two-column page header with left column (title and optional subtitle) and right column (primary CTA and optional more menu with three-dots icon). Use at the top of a page or section. Right column is aligned to the right edge. Title and subtitle accept string or ReactNode; more menu can be a list of items (label, onClick) or custom content via moreMenuContent.

## Props / Inputs

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| title | ReactNode | yes | — | Page title (left column). String or custom ReactNode. |
| subtitle | ReactNode | no | — | Optional subtitle below the title (left column). |
| primaryCta | ReactNode | no | — | Primary call-to-action, e.g. a Button (right column). |
| moreMenuItems | PageHeaderMoreMenuItem[] | no | — | More menu items; renders three-dots (more_vert) icon and dropdown. Each item has label and optional onClick; menu closes after click. |
| moreMenuContent | ReactNode | no | — | Custom content for the more menu dropdown instead of moreMenuItems (right column). |
| className | string | no | "" | Additional class name for the root element. |

## Types

### PageHeaderMoreMenuItem
```typescript
interface PageHeaderMoreMenuItem {
  label: string;      // Menu item label
  onClick?: () => void;  // Called when clicked; menu closes after
}
```

### PageHeaderProps
```typescript
interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta?: React.ReactNode;
  moreMenuItems?: PageHeaderMoreMenuItem[];
  moreMenuContent?: React.ReactNode;
  className?: string;
}
```

## Usage Examples

### Full header

```jsx
import { PageHeader, Button } from "cleanplate";

<PageHeader
  title="Projects"
  subtitle="Manage and track your team projects"
  primaryCta={<Button>New project</Button>}
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

```jsx
<PageHeader
  title="Documents"
  subtitle="All your documents in one place"
  primaryCta={<Button>Upload</Button>}
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
<PageHeader
  title={
    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span>📋</span>
      Custom title
    </span>
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

- **Layout:** Root is a `<header>`. Flex row: left (title + subtitle), right (CTA + more trigger). Right column uses margin-left: auto for right alignment.
- **Title / subtitle:** If string, rendered with Typography (h4 / p). If ReactNode, rendered in a div with the same layout class.
- **More menu:** When moreMenuItems is set, renders a Dropdown with an icon Button (more_vert) and a list; each item onClick runs and the dropdown closes. When moreMenuContent is set, that content is shown in the dropdown. Use one or the other.
- **Accessibility:** More trigger has aria-expanded and aria-haspopup; list uses role="menu" and role="menuitem".

## Related Components / Links

- Button (typically for primaryCta)
- Typography (used internally for string title and subtitle)
- Dropdown (used internally for the more menu)
- Icon (more_vert trigger)
- Container (wrap PageHeader and page content)
