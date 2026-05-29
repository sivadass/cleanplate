# FeedbackState component — design spec

**Status:** Approved (2026-05-29)  
**Scope:** Ship `<FeedbackState />` — unified empty and error region component for CleanPlate v1.  
**Source requirements:** `FeedbackState-requirements.md` (user-provided), adapted to CleanPlate conventions and brainstorming decisions (2026-05-29).

---

## 1. Summary

`FeedbackState` is a single component with `variant="empty" | "error"` for module-level “nothing here” and “something went wrong” regions inside cards, panels, tables, and main content areas. It composes existing primitives (`Typography`, `Button`, `Icon`) and owns layout and accessibility defaults.

**Illustrations are consumer-owned:** pass a public/ CDN image URL (`png`, `jpg`, `svg`) or a custom `ReactNode`. CleanPlate does not host assets or resolve slugs. When no image is provided, consumers may pass a Material `icon` name.

**Customization in v1:** no new public `--cp-feedback-state-*` token layer. Internal styles use existing global tokens from `reset.scss`. Consumers override via root `className` and documented BEM-style slot classes.

---

## 2. Goals and non-goals

### In scope (v1)

- Unified `FeedbackState` with `variant="empty" | "error"`.
- Required `title`; optional `description` (`string | ReactNode`).
- Media: `illustration` (URL or node) **or** `icon` (`MaterialIconName`), with documented precedence.
- Actions: `primaryAction` / `secondaryAction` (`onClick` only); `onRetry` shorthand for errors.
- Sizes: `small` | `medium` | `large` (CleanPlate naming, aligned with `Button` / `Icon` / `Alert`).
- Stacked layout only (media above text, centered actions).
- Error extras: `errorCode`, `errorDetails` (`<details>` disclosure).
- Accessibility: variant-based default `role`, `aria-labelledby`, decorative media rules.
- Subtle mount fade (CSS); disabled when `prefers-reduced-motion: reduce`.
- `margin` (suffix API), `dataTestId`, `className`, optional `role` override.
- `titleTag` for semantic title element (default `h2`).

### Out of scope (v1)

| Item | Notes |
|------|--------|
| Built-in illustration slugs / registry | Consumers supply URLs or nodes per module |
| CleanPlate-hosted CDN or versioned illustration paths | No asset pipeline in package |
| `fallbackIllustration` / image load-failure chain | Omit unless a future minimal `onError` hide is requested |
| `href` on `ActionConfig` | Secondary/primary use `Button` + `onClick` only |
| Horizontal layout, `orientation`, `illustrationPosition`, `actionAlignment` | Stacked only |
| `size="full"` / `100vh` min-height | Parent layout owns full-page takeover |
| Public `animate` prop | Internal fade only |
| `--cp-feedback-state-*` public token layer | Use globals in SCSS; override via `className` |
| `tertiaryAction`, `actions[]`, `action.icon` | Future extension |
| Inline `style` prop for layout | Not exposed |

### Relationship to existing components

| Component | Use when |
|-----------|----------|
| `Alert` | Short inline banner in document flow |
| `Toast` | Transient notification |
| `Spinner` | Loading; not empty/error copy |
| `FeedbackState` | Dedicated empty or failed **region** (table body, card, panel, page section) |
| Select empty copy | Remains internal to `Select` panel |

---

## 3. API

### Component signature

```tsx
<FeedbackState
  variant="empty" | "error"
  title="No results found"
  titleTag="h2"
  description="Try adjusting your filters."
  illustration="/assets/empty-search.png"
  illustrationAlt=""
  icon="search_off"
  size="medium"
  primaryAction={{ label: "Clear filters", onClick: handleClear }}
  secondaryAction={{ label: "Go back", onClick: handleBack }}
  onRetry={handleRetry}
  retryLabel="Try again"
  errorCode={404}
  errorDetails={technicalMessage}
  role="status"
  margin="4"
  className="my-module-empty"
  dataTestId="projects-empty"
/>
```

### Props table

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `"empty" \| "error"` | Yes | — | Drives default `role` and error tone |
| `title` | `string` | Yes | — | Primary headline |
| `titleTag` | `"h1"` … `"h6" \| "p"` | No | `"h2"` | Semantic element for title (a11y / SEO) |
| `description` | `string \| ReactNode` | No | — | Supporting copy |
| `illustration` | `string \| ReactNode` | No | — | Image URL (`png`/`jpg`/`svg`) or custom node |
| `illustrationAlt` | `string` | No | `""` | `alt` for URL images; empty = decorative |
| `icon` | `MaterialIconName` | No | — | Used only when `illustration` is omitted |
| `size` | `"small" \| "medium" \| "large"` | No | `"medium"` | Scale for spacing, min-height, media box, icon size |
| `primaryAction` | `ActionConfig` | No | — | Solid `Button` |
| `secondaryAction` | `ActionConfig` | No | — | Ghost `Button` |
| `onRetry` | `() => void` | No | — | Error shorthand: primary “Try again” if no `primaryAction` |
| `retryLabel` | `string` | No | `"Try again"` | Label when `onRetry` is used |
| `errorCode` | `string \| number` | No | — | Visual accent; not sole indicator of state |
| `errorDetails` | `string` | No | — | Renders native `<details>` when set |
| `role` | `"alert" \| "status" \| "none"` | No | `status` (empty) / `alert` (error) | Root ARIA role; `none` omits role |
| `margin` | `string \| SpacingOption[]` | No | `"0"` | Framework suffix API (`"b-2"`, etc.) |
| `className` | `string` | No | `""` | Merged on root for consumer CSS overrides |
| `dataTestId` | `string` | No | — | `data-testid` on root |

Not exposed in v1: `style`, `animate`, `href`, layout/orientation props, `illustrationSize` override (size drives media box).

### Types

```ts
type FeedbackStateVariant = "empty" | "error";
type FeedbackStateSize = "small" | "medium" | "large";
type FeedbackStateTitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
type FeedbackStateRole = "alert" | "status" | "none";

type ActionConfig = {
  label: string;
  onClick: () => void;
};

interface FeedbackStateProps {
  variant: FeedbackStateVariant;
  title: string;
  titleTag?: FeedbackStateTitleTag;
  description?: string | React.ReactNode;
  illustration?: string | React.ReactNode;
  illustrationAlt?: string;
  icon?: MaterialIconName;
  size?: FeedbackStateSize;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  onRetry?: () => void;
  retryLabel?: string;
  errorCode?: string | number;
  errorDetails?: string;
  role?: FeedbackStateRole;
  margin?: string | SpacingOption[];
  className?: string;
  dataTestId?: string;
}
```

### Action precedence

1. If `primaryAction` is set → render it (solid).
2. Else if `onRetry` is set → render primary with `retryLabel` (or default “Try again”).
3. Else → no primary button.

`secondaryAction` is independent (ghost), rendered when provided.

### Media precedence

1. If `illustration` is set → render URL as `<img src={illustration} alt={illustrationAlt} />` or render node.
2. Else if `icon` is set → render `<Icon name={icon} size={mapped} />` with variant-appropriate color.
3. Else → no media slot (text and actions only).

If both `illustration` and `icon` are passed, **`illustration` wins** (document in JSDoc).

### Image URL contract

- Consumer supplies absolute or app-relative paths (`/public/...`, CDN URL).
- Formats: **PNG, JPG, SVG** via standard `<img>`.
- No slug resolution, no bundled default artwork, no CleanPlate CDN.
- Theming via `currentColor` in SVG applies only when consumers inline SVG as `ReactNode`, not for remote SVG URLs.

---

## 4. Layout and sizing

### Layout (v1)

Always **stacked**, centered column:

```
[ media? ]
[ title ]
[ description? ]
[ errorCode? ]      (error variant only, when set)
[ actions? ]
[ errorDetails? ]   (<details>, when set)
```

### Size reference

| `size` | Intended context | Media box (img max) | `Icon` size | Min height (SCSS constant) |
|--------|------------------|---------------------|-------------|----------------------------|
| `small` | Table cells, sidebars, narrow widgets | 48px | `small` | 120px |
| `medium` | Cards, panels, drawers | 120px | `medium` | 240px |
| `large` | Main content regions | 200px | `large` | 360px |

Min heights and media dimensions are **fixed in component SCSS** for v1 (not exposed as `--cp-feedback-state-*` tokens). Values may use existing globals (`--space-*`) for padding/gaps only.

---

## 5. Styling and customization

### Internal styling

- SCSS module: `FeedbackState.module.scss`, root class `cp-feedback-state`.
- Use existing tokens: `--text-default`, `--text-subtle`, `--text-muted`, `--error`, `--space-2`, `--space-4`, `--space-6`, etc.
- Follow `.cursor/rules/scss-patterns.mdc`: `cp-` prefix, kebab-case, no hard-coded colors outside variables where possible.
- Compose `Typography`, `Button`, `Icon`; do not duplicate their variant logic.

### Consumer overrides (v1)

| Mechanism | Supported |
|-----------|-----------|
| `className` on root | Yes — merged with module root class |
| Targeting documented slot classes | Yes — stable BEM-style hooks |
| `margin` prop | Yes — suffix API per `llms.txt` |
| Public `--cp-feedback-state-*` on `:root` | **No** in v1 |
| `style` prop | **No** |

**Documented slot classes** (implementation must keep stable):

- `cp-feedback-state` — root
- `cp-feedback-state__media`
- `cp-feedback-state__content`
- `cp-feedback-state__title`
- `cp-feedback-state__description`
- `cp-feedback-state__error-code`
- `cp-feedback-state__actions`
- `cp-feedback-state__details` (wrapper for `<details>`)

Example override:

```css
.projects-empty.cp-feedback-state {
  min-height: 280px;
}
.projects-empty .cp-feedback-state__media img {
  max-width: 140px;
}
```

### Motion

- On mount: subtle opacity/transform fade (~180ms) via CSS class on root.
- `@media (prefers-reduced-motion: reduce)`: no animation.
- No public `animate` prop in v1.

---

## 6. Accessibility

| Variant | Default `role` | Announcement |
|---------|----------------|--------------|
| `empty` | `status` | Polite |
| `error` | `alert` | Assertive |

- Root `aria-labelledby` references the title element `id`.
- When `role="none"`, do not set `role` on root (consumer handles semantics).
- Media is decorative when `illustrationAlt` is empty/omitted and a visible `title` exists: `aria-hidden="true"` on media wrapper.
- Non-empty `illustrationAlt` → use as `alt` on `<img>`; do not hide from AT.
- `errorCode` is visual supplement only; `title` (and optionally `description`) carry meaning.
- `errorDetails`: native `<details>` / `<summary>` (“Show details”), keyboard accessible, styled via module.
- Actions: existing `Button` focus styles.

---

## 7. Architecture

**Approach:** Lean single component (internal sub-render helpers allowed; no separate public `EmptyState` / `ErrorState` exports in v1).

```
FeedbackState
├── resolveMedia() → img | Icon | null
├── resolvePrimaryAction() → Button | null
├── Title (dynamic tag via titleTag)
├── Description (Typography)
├── ErrorCode (optional)
├── Actions row (Container flex or module flex)
└── ErrorDetails (optional <details>)
```

**Dependencies:** `Typography`, `Button`, `Icon`, `getSpacingClass`, `MaterialIconName` type export path consistent with other components.

---

## 8. Testing

**Unit / component tests (Vitest + Testing Library):**

- Media precedence: illustration over icon; neither → no media node.
- `primaryAction` overrides `onRetry`.
- Default `role` per variant; `role="none"` omits attribute.
- `dataTestId` on root.
- `className` merged on root.
- Reduced motion: no animation class or disabled animation when media query emulated (if testable).

**Storybook:**

- Empty + error variants; with illustration URL, with icon only, text-only.
- All three sizes; with primary/secondary actions; `onRetry`; `errorDetails`.
- Custom `className` override example in docs.

---

## 9. Documentation and exports

- Add `docs/FeedbackState.md` (props table, examples, override guidance, relation to `Alert` / `Toast`).
- Register in `llms.txt` component index (via `generate-llms-txt` or manual entry per project practice).
- Export from package entry: `FeedbackState`, `FeedbackStateProps`, related types.
- **CHANGELOG** entry for new component (minor version bump).

---

## 10. Files to touch (implementation preview)

| File | Action |
|------|--------|
| `src/components/feedback-state/FeedbackState.tsx` | Create |
| `src/components/feedback-state/FeedbackState.module.scss` | Create |
| `src/components/feedback-state/FeedbackState.test.tsx` | Create |
| `src/index.ts` (or barrel) | Export component |
| `docs/FeedbackState.md` | Create |
| `src/stories/feedback-state/*` | Stories + arg types |
| `llms.txt` | Index entry |

No changes to `reset.scss` for v1 token layer.

---

## 11. Decisions log (brainstorming)

| Topic | Decision |
|-------|----------|
| Illustrations | User URL or `ReactNode`; no slugs; no hosting |
| Missing illustration | Optional `icon` (`MaterialIconName`) at mapped sizes |
| Secondary action links | `onClick` only; no `href` |
| Layout | Stacked only (no horizontal) |
| Sizes | `small` \| `medium` \| `large`; no `full` |
| Animation | Internal fade; no public `animate` |
| Token layer | None in v1; `className` + slot classes for overrides |
| Component shape | Single `FeedbackState` |

---

## 12. Self-review checklist

- [x] No TBD placeholders in behaviour sections.
- [x] API consistent with CleanPlate: `dataTestId`, `titleTag`, `margin` suffix, `className`, size naming.
- [x] Scope fits one implementation plan.
- [x] No contradiction with “no href” and Button-only actions.
- [x] Illustration and icon precedence explicit.
- [x] Out-of-scope list matches all user approvals from brainstorming.

---

## 13. References

- Original requirements: `FeedbackState-requirements.md` (Downloads; adapted).
- Patterns: `docs/Alert.md`, `docs/Accordion.md` (`titleTag`), `docs/Icon.md`, `docs/Button.md`, `llms.txt` spacing rules.
- SCSS rules: `.cursor/rules/scss-patterns.mdc`.
