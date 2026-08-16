# Visual regression report

| When | Command | Result |
| --- | --- | --- |
| Task 0 before | test:visual:update then test:visual | PASS (346 snapshots, 173 stories × desktop/mobile) |

## Task 5 gate — STOP (2026-08-16)

**Command:** `npm run build-storybook && npm run test:visual` after spacing utility rename (`cp-m` / `cp-p` / `cp-g`).

**Result:** **FAIL** — 40 / 346 tests differ (desktop + mobile). Example: `atoms-badge-playground--default`.

**Root cause (not SCSS value drift):** Task 3 changed `Container` default `padding` from `"p-4"` to suffix `"4"`. In the Storybook static build (`NODE_ENV=production`), prefixed `"p-4"` was rejected by `getSpacingClass` and returned `""`, so **no default padding was applied** when Task 0 baselines were captured. After Task 3, `"4"` resolves to `cp-p-4` and **default padding is applied**, shifting layout for any story nesting `Container` (Badge, MediaObject, Table, Statistic, etc.).

**Task 5 rename alone:** spacing token CSS values (`--space-*`) unchanged; class locals renamed `.m` → `.cp-m` only.

**Action taken:** Did **not** `--update-snapshots`. Per plan: stop and diff, do not accept layout change via snapshots.

**To unblock:** Either (a) accept a one-time baseline refresh documenting the Container padding bugfix, or (b) change `Container` default padding to `"0"` (API/docs change) to preserve Task 0 pixels.
