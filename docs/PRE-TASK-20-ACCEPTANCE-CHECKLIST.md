# Pre–Task 20 acceptance checklist

Use this document to verify **Tasks 0–19** are complete before starting **Task 20** (release `1.0.0`).

| Context | Value |
| --- | --- |
| Branch | `cursor/html-react-bridge-dafc` |
| Base | `feat/design-agent-readiness` |
| PR | https://github.com/sivadass/cleanplate/pull/15 |
| Plan | `docs/superpowers/plans/2026-08-14-agent-html-react-bridge.md` |
| HLD | `docs/superpowers/specs/2026-08-14-agent-html-react-bridge-hld.md` |
| Current version | `1.0.0-beta.0` (beta — pin exact semver until stable `1.0.0`) |

**How to use:** Run each command block, tick boxes as you verify. All sections marked **Required** must pass before Task 20.

---

## 1. Quick smoke (Required)

```bash
npm test
npm run type-check
npm run build-package
npm test -- src/test/public-css-contract.test.ts src/test/docs-contract.test.ts src/html-to-jsx/convert.test.ts
```

- [ ] `npm test` — all green (expected: **205+** tests across **35** files)
- [ ] `npm run type-check` — no errors
- [ ] `npm run build-package` — succeeds
- [ ] Targeted contract tests — all green

---

## 2. Visual regression gates (Required)

```bash
npm run build-storybook
npm run test:visual
```

- [ ] Storybook build succeeds
- [ ] `npm run test:visual` PASS — **364/364** (346 Storybook + 18 kit)
- [ ] No `--update-snapshots` used unless documented in `tests/visual/REPORT.md`
- [ ] `tests/visual/REPORT.md` records:
  - [ ] Task 0 baseline PASS
  - [ ] Task 12 unhash PASS (no snapshot update)
  - [ ] Task 14 data-cp PASS
  - [ ] Task 17 kit gate PASS

**If visual fails:** stop. Diff SCSS values — do not update snapshots to hide real CSS drift.

---

## 3. Public CSS & tokens (Required)

After `npm run build-package`:

```bash
grep -c '\.cp-button' dist/index.css    # expect >= 1
grep 'HASHED' dist/index.css || echo 'no hashed marker'
test -f dist/tokens.css && grep -- '--space-4' dist/tokens.css
```

- [ ] `dist/index.css` contains unhashed `.cp-button` (no hash suffix)
- [ ] `dist/index.css` has no accidental hashed-class pattern from pre-v1 era
- [ ] `dist/tokens.css` exists and exports spacing tokens (e.g. `--space-4`)
- [ ] `src/test/public-css-contract.test.ts` PASS
- [ ] `src/test/tokens-css.test.ts` PASS

---

## 4. Type exports & opt-in `data-cp` (Required)

```bash
npm run build-types
grep 'ButtonProps' dist/index.d.ts
npm test -- src/prototype/emit-data-cp.test.tsx src/components/button/Button.test.tsx
```

- [ ] `import type { ButtonProps } from "cleanplate"` works (`dist/index.d.ts`)
- [ ] Button **without** `CleanPlatePrototypeAttributes` provider emits **no** `data-cp` in DOM
- [ ] Button **with** provider emits `data-cp` when enabled
- [ ] `src/prototype/emit-data-cp.test.tsx` PASS

---

## 5. Spacing & docs hygiene (Required)

```bash
npm test -- src/test/spacing-api.test.ts src/test/docs-contract.test.ts
```

- [ ] Spacing API rejects prefixed values (`margin="m-0"`, etc.)
- [ ] Component defaults use suffix-only (`"0"`, `"b-4"`, not `"m-0"`)
- [ ] `docs-contract` — no `margin="m-` / `padding="p-` / `gap="g-` in docs or `llms.txt`
- [ ] `docs/ProgressBar.md` exists
- [ ] Every top-level export in `docs-contract` has a matching `docs/<Name>.md`

---

## 6. HTML → JSX converter (Required)

```bash
npm test -- src/html-to-jsx/convert.test.ts
npm run html-to-jsx -- src/html-to-jsx/fixtures/button.open.html
```

### Core behavior

- [ ] Tagged `data-cp="Button"` converts to `<Button …>`
- [ ] Unknown component hard-fails with `docs/` path in error
- [ ] Illegal enum hard-fails (e.g. `data-cp-variant="primary"`)
- [ ] Unknown `data-cp-*` prop hard-fails (no silent drop)
- [ ] Function props hard-fail (`data-cp-on-click` → throw, not emit `onClick`)
- [ ] Untagged wrapper passthrough keeps `className`
- [ ] Inline geometry stripped (`top`, `left`, `width`, etc.) on floaters

### Guardrail tests (Task 19)

- [ ] `toast.single.html` — exactly **one** `data-cp="Toast"`
- [ ] `modal.open.html` — contains `cp-modal-overlay`, not inside `overflow: hidden`
- [ ] `dropdown.open.html` — strips coords; emits `placement` + `trigger` + `content` slots

### Fixture round-trips

All **40** `.html` fixtures in `src/html-to-jsx/fixtures/` have matching `.jsx` and pass `convert.test.ts`:

- [ ] v1 primitives (8): Button, Typography, Icon, Container, Alert, Badge, Avatar, Spinner
- [ ] FormControls.Input fixture
- [ ] Wave B Tier 1 (14): Accordion, MenuList, Stepper, Pills, MediaObject, BreadCrumb, Header, Footer, PageHeader, FeedbackState, Statistic, ProgressBar, Animated, Pagination
- [ ] Tier 3 (4): `table.desktop`, `table.mobile`, `appshell.desktop`, `appshell.mobile-drawer`
- [ ] Tier 2 overlays (5): `modal.open`, `drawer.open`, `confirm-dialog.open`, `toast.single`, `bottom-sheet.open`
- [ ] Tier 4 floaters (8): `dropdown.closed`, `dropdown.open`, `select.closed`, `select.open`, `date.closed`, `date.open`, `colorpicker.closed`, `colorpicker.open`

### CLI

- [ ] `npm run html-to-jsx -- <file.html>` prints JSX to stdout
- [ ] Invalid HTML exits non-zero with actionable error

---

## 7. Manifest coverage (Required)

`src/html-to-jsx/component-manifest.json` entries (**35** components):

| Tier | Components |
| --- | --- |
| 1 | Button, Typography, Icon, Container, Alert, Badge, Avatar, Spinner, FormControls.Input, Accordion, MenuList, Stepper, Pills, MediaObject, BreadCrumb, Header, Footer, PageHeader, FeedbackState, Statistic, ProgressBar, Animated, Pagination |
| 2 | Modal, Drawer, ConfirmDialog, Toast, BottomSheet |
| 3 | Table, AppShell (with `recipes`) |
| 4 | Dropdown, FormControls.Select, FormControls.Date, FormControls.ColorPicker |

- [ ] All tiers present in manifest
- [ ] Tier 3 components require `data-cp-recipe` (converter hard-fails without it)
- [ ] Tier 4 components declare `trigger` + `content` slots where applicable

---

## 8. HTML prototype docs (Required)

### v1 primitives (`## HTML prototype`)

- [ ] Button, Typography, Icon, Container, Alert, Badge, Avatar, Spinner

### FormControls (`### HTML prototype (…)`)

- [ ] Input (Task 17)
- [ ] Select closed + open (Task 19)
- [ ] Date closed + open — frozen month grid, `data-cp-date` on cells (Task 19)
- [ ] ColorPicker closed + open — converter maps `value` hex only (Task 19)

### Wave B Tier 1

- [ ] Accordion, MenuList, Stepper, Pills, MediaObject, BreadCrumb, Header, Footer, PageHeader, FeedbackState, Statistic, ProgressBar, Animated, Pagination

### Tier 3 (dual recipes)

- [ ] `docs/Table.md` — desktop + mobile recipes, `data-cp-recipe`, `data-cp-col` / `data-cp-field`
- [ ] `docs/AppShell.md` — desktop + mobile-drawer, artboard-root note

### Tier 2 overlays (open frame + artboard root)

- [ ] `docs/Modal.md`
- [ ] `docs/Drawer.md`
- [ ] `docs/ConfirmDialog.md`
- [ ] `docs/Toast.md` — single-card snapshot; imperative queue noted
- [ ] `docs/BottomSheet.md` — baked snap (`data-cp-snap`)

### Tier 4 floaters (closed + open)

- [ ] `docs/Dropdown.md`
- [ ] FormControls Select / Date / ColorPicker sections

### Agent skills & kit

- [ ] `skills/cleanplate-html-prototype/SKILL.md` exists
- [ ] `skills/cleanplate-html-to-react/SKILL.md` exists (must run CLI, never invent JSX)
- [ ] `docs/html/kit.html` — v1 primitive sticker sheet with `data-cp`
- [ ] `tests/visual/kit.spec.ts` — 18 snapshots (9 rows × desktop/mobile)
- [ ] `AGENTS.md` / `llms.txt` point to CleanPlate HTML workflow

---

## 9. CSS rename waves (Tasks 5–11) — spot check

- [ ] All component SCSS locals use unique `cp-<component>` BEM (no bare `.button`, `.overlay`, `.medium`)
- [ ] `expectPublicClass` / `toHaveClass("cp-button")` tests pass post-unhash
- [ ] Overlay classes exist: `cp-modal-overlay`, `cp-drawer-overlay`, `cp-confirm-dialog-overlay`, `cp-bottom-sheet--snap-*`, `cp-dropdown-floating`

---

## 10. Migration doc (Required before release, verify content now)

- [ ] `docs/MIGRATION-v1.md` exists and explains:
  - [ ] Hashed → unhashed `cp-*` class migration
  - [ ] Spacing suffix-only API
  - [ ] `data-cp` is opt-in (prototype only)
  - [ ] Link to HTML → JSX workflow

---

## 11. HLD contract rules (manual review)

From `docs/superpowers/specs/2026-08-14-agent-html-react-bridge-hld.md`:

### Always true

- [ ] No function/callback props in HTML contract (`onClick`, `onChange`, etc. wired by hand after conversion)
- [ ] Illegal tagged values hard-fail (converter throws, points to docs)
- [ ] Same `cp-*` public CSS in HTML prototypes and React

### Tier-specific honesty

| Tier | Canonical frame | Not promised in HTML |
| --- | --- | --- |
| 1 | Static DOM + public CSS | — |
| 2 | Open overlay at artboard root | Focus trap, scroll lock, Escape dismiss, animations, Toast queue/stack |
| 3 | Two artboards per component (`data-cp-recipe`) | Resize listener, one file for both viewports |
| 4 | Closed + open; CSS placement only | Floating UI flip/shift, async search, calendar math, ColorPicker drag |

- [ ] Table: desktop `<table>` + mobile MediaObject are separate fixtures
- [ ] Toast: single card only (not a stack)
- [ ] Date open fixture: one frozen month (text dates, no calendar math in HTML)
- [ ] ColorPicker: `value` hex in contract; hue/thumb frozen in HTML/CSS only

---

## 12. Task-by-task sign-off (0–19)

Tick when you have verified the deliverable exists and its gate passed.

| Task | Deliverable | Gate |
| --- | --- | --- |
| 0 | Playwright visual baselines | 346 snapshots committed; `test:visual` PASS |
| 1 | CSS modules helper + public-css contract (unskipped Task 12) | tests pass |
| 2–3 | Spacing API suffix-only | `spacing-api.test.ts` PASS |
| 4 | Docs hygiene + ProgressBar.md + type re-exports | `docs-contract` PASS |
| 5 | Spacing utils `cp-m-*` / `cp-p-*` / `cp-g-*` | visual PASS (documented baseline refresh) |
| 6 | Button golden `cp-button` | visual PASS |
| 7 | Wave A primitives | visual PASS |
| 8 | Wave B shells/display | visual PASS (documented refresh) |
| 9 | FormControls `cp-*` | visual PASS |
| 10 | Table + AppShell chrome | visual PASS |
| 11 | Overlay + floater CSS rename | visual PASS |
| 12 | Unhash `[local]` + `MIGRATION-v1.md` | visual PASS **without** snapshot update |
| 13 | `dist/tokens.css` | `tokens-css.test.ts` PASS |
| 14 | Opt-in `data-cp` provider | visual PASS; no `data-cp` without provider |
| 15 | `convert.ts` core (hard-fail, passthrough, geometry strip) | `convert.test.ts` PASS |
| 16 | CLI + manifest + Button fixtures | `npm run html-to-jsx` works |
| 17 | v1 docs, skills, kit.html, kit visual | 18 kit snapshots; skills present |
| 18 | Wave B + Table/AppShell recipes | fixtures + docs; Table recipe hard-fail |
| 19 | Tier 2 + Tier 4 recipes | overlay/floater fixtures + guardrails |

- [ ] Tasks 0–19 all signed off

---

## 13. Intentionally NOT done yet (Task 20 only)

Do **not** expect these until Task 20 starts:

- [ ] `package.json` version `1.0.0-beta.0` (beta; stable `1.0.0` later)
- [ ] `CHANGELOG.md` release entry with breaking changes (hashed-class removal)
- [ ] `README.md` LLM section (tokens.css, html-to-jsx, migration link)
- [ ] Final `tests/visual/REPORT.md` Task 20 row
- [ ] `npm publish`

---

## 14. Final go / no-go

**Required for Task 20:**

```bash
npm test && npm run type-check && npm run build-package && \
npm test -- src/test/public-css-contract.test.ts src/test/docs-contract.test.ts src/html-to-jsx/convert.test.ts && \
npm run build-storybook && npm run test:visual
```

| Decision | Criteria |
| --- | --- |
| **GO** | All Required sections (1–12) checked; Section 13 items still open |
| **NO-GO** | Any visual failure, undocumented snapshot update, converter hard-fail regression, or missing fixture/doc for a shipped recipe |

### Sign-off

| Role | Name | Date | GO / NO-GO |
| --- | --- | --- | --- |
| Engineering | | | |
| Design / agent workflow | | | |

---

*Generated for branch `cursor/html-react-bridge-dafc` — Tasks 0–19 complete as of commit `0ff88c8`.*
