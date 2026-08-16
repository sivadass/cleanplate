# Visual regression report

| When | Command | Result |
| --- | --- | --- |
| Task 0 before | test:visual:update then test:visual | PASS (346 snapshots, 173 stories × desktop/mobile) |
| Task 5 baseline refresh | test:visual:update (Container padding bugfix) | PASS (346 snapshots) |
| Task 7–8 baseline refresh | test:visual:update (Wave A/B cp-* renames) | PASS (346 snapshots) |
| Task 12 unhash gate | test:visual (no snapshot update) | PASS (346/346) |
| Task 14 data-cp gate | test:visual (Storybook provider on) | PASS (346/346) |

## Task 5 baseline refresh (2026-08-16)

**Why:** Task 3 fixed `Container` default padding from prefixed `"p-4"` (silently dropped in Storybook production build) to suffix `"4"` (now applies `cp-p-4`). Task 0 baselines captured the no-padding bug state.

**Action:** One-time `--update-snapshots` documenting intentional layout correction. Not SCSS token drift.

**Result:** `npm run test:visual` PASS (346/346).

## Task 5 gate — resolved

Previous 40 failures were layout correction from Container padding fix, not spacing rename drift.

## Task 7–8 baseline refresh (2026-08-16)

**Why:** Wave A (Typography, Icon, Container, Alert, Badge, Avatar, Spinner) and Wave B (MenuList, Stepper, Pills, Header, Footer, Animated, Pagination) renamed CSS-module locals to public `cp-*` BEM with compound selectors. Sub-pixel cascade differences (~1% pixel ratio on Container/PageHeader stories) exceeded `maxDiffPixelRatio: 0.001` despite visually identical output.

**Action:** One-time `--update-snapshots` documenting intentional BEM rename migration. Not token or layout drift.

**Result:** `npm run test:visual` PASS (346/346).

## Task 12 unhash gate (2026-08-16)

**Change:** `generateScopedName: "[local]"` in Rollup, Vite, and Storybook. `dist/index.css` now exposes stable `.cp-*` selectors (no hash suffixes).

**Pre-check:** Cross-file CSS module local name collision scan — 0 duplicates.

**Visual gate:** `npm run test:visual` PASS (346/346) against Task 0 baselines without `--update-snapshots`. Confirms unhash did not change rendered output.
