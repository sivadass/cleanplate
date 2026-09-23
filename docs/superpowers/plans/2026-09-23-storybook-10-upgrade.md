# Storybook 10 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Cloud agent:** This file is the whole task. Do the work on a new branch, verify it, and open a pull request against `main`. Do not ask for confirmation between steps. Do not spawn subagents.

**Goal:** Upgrade the repo-root Storybook from 7.6.20 to 10.6 (latest 10.x), keep the docs site and story canvas building, and open a PR.

**Architecture:** Storybook's CLI upgrades one major at a time. Run 7 → latest 8, then latest 9, then latest 10, with `--yes` so nothing prompts. After the CLI finishes, force the final public APIs in this plan (the automigrations miss MDX and theme imports). Leave the published component library, React 18, and the demo apps alone.

**Tech Stack:** Storybook 10, `@storybook/react-vite`, Vite 5, React 18, npm, Node 20.19+ (22.12+ or 24 preferred).

## Global Constraints

- Base branch is `main`. Remote is `git@github.com:sivadass/cleanplate.git`. Feature branch name: `upgrade/storybook-10`.
- One PR. Do not push to `main`. Do not force-push. Do not amend unless a hook auto-edits files from a commit you just made on this branch and that commit is not on the remote.
- Commit only when `npm run build-storybook`, `npm run type-check`, and `npm run test` all exit 0. A half-upgraded tree is not a commit. One commit is enough unless visual snapshots change; those can be a second commit in the same PR.
- Package manager is npm. Do not switch to pnpm or yarn.
- Do not change `react` or `react-dom` from `^18.2.0`. If the upgrade rewrites them, restore `^18.2.0`.
- Do not edit `demos/react-spa` or `demos/html-app`. They are not Storybook apps. If the upgrade rewrites their lockfiles, revert those files.
- Do not change root `tsconfig.json` `"moduleResolution"` away from `"node"`. That file emits the published package types.
- Do not add Storybook packages to `dependencies`. They stay in `devDependencies`.
- Do not hand-edit `llms.txt`. Either regenerate it with `npm run generate-llms-txt` or leave it untouched and say so in the PR.
- Preserve `.storybook/main.js` `viteFinal`: CSS modules `generateScopedName: "[local]"` and Sass `api: "modern"`.
- Node must be `>=20.19` or `>=22.12`. This repo was verified on Node v24.15.0. If `node -v` is older, stop and report that; do not upgrade Storybook on an unsupported Node.

---

### Task 1: Branch and upgrade one major at a time

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.storybook/main.js` (automigration may edit this; Task 2 restores `viteFinal` if the CLI drops it)

**Interfaces:**
- Consumes: Storybook 7.6.20 at the repo root only (`.storybook/`).
- Produces: `storybook` and `@storybook/react-vite` on the same 10.x version. `npm ls storybook @storybook/react-vite` shows no unmet peer warnings that mention Storybook 7, 8, or 9.

- [ ] **Step 1: Create the branch from latest `main`**

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
git checkout -b upgrade/storybook-10
node -v
npm -v
```

Expected: branch `upgrade/storybook-10`, Node `v20.19+` or `v22.12+` or `v24.x`, npm 10+.

- [ ] **Step 2: Install current dependencies**

```bash
npm ci
```

Expected: exit 0.

- [ ] **Step 3: Upgrade 7 → 8**

```bash
npx storybook@8 upgrade --yes --package-manager npm --disable-telemetry
```

Expected: command exits 0 and `package.json` `storybook` version is `^8`.

If it stops on an autoblocker, read the message. Re-run with `--force` only when the blocker is one of: `moduleResolution` is `"node"`, or `core.builder` is a package name. Do not `--force` past a Node version error or a React peer error.

```bash
npx storybook@8 upgrade --yes --force --package-manager npm --disable-telemetry
```

- [ ] **Step 4: Upgrade 8 → 9**

```bash
npx storybook@9 upgrade --yes --package-manager npm --disable-telemetry
```

Same `--force` rule as Step 3 if, and only if, the blocker is `moduleResolution` or `core.builder`.

- [ ] **Step 5: Upgrade 9 → 10**

```bash
npx storybook@10 upgrade --yes --package-manager npm --disable-telemetry
```

Same `--force` rule as Step 3.

- [ ] **Step 6: Confirm the installed major**

```bash
npm ls storybook @storybook/react-vite --depth=0
node -p "require('./node_modules/storybook/package.json').version"
```

Expected: both packages are `10.x` and the printed version starts with `10.`. If `@storybook/addon-docs` is missing and Task 2's import path fails later, install it at the same major:

```bash
npm install -D @storybook/addon-docs@10
```

Do not keep these packages. Uninstall any that remain:

```bash
npm uninstall @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-links @storybook/blocks @storybook/builder-vite @storybook/react @storybook/testing-library
```

`@storybook/testing-library` has no source imports. Removing it is safe.

---

### Task 2: Apply the Storybook 10 source API

**Files:**
- Modify: `.storybook/main.js`
- Modify: `.storybook/preview.jsx`
- Modify: `.storybook/manager.js`
- Modify: `.storybook/cleanplate-theme.js`
- Modify: `src/stories/form-controls/form-controls.stories.tsx` (line 2 import only)
- Modify: `src/stories/drawer/drawer.stories.tsx` (line 2 import only)
- Modify: `src/stories/table/table-arg-types.ts`
- Modify: `tsconfig.json` (exclude list only)
- Modify: every MDX file listed in Step 5
- Modify: `templates/storybook-docs-template.md`

**Interfaces:**
- Consumes: Storybook 10 packages from Task 1.
- Produces: no remaining imports of `@storybook/blocks`, `@storybook/addon-docs` (the package root), `@storybook/preview-api`, `@storybook/manager-api`, `@storybook/theming`, `@storybook/types`, or `ArgsTable`. Docs blocks import from `@storybook/addon-docs/blocks`.

- [ ] **Step 1: Replace `.storybook/main.js` with this file**

Keep whatever else the automigration added only if `npm run build-storybook` fails without it. The required contents are:

```js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    config.css = config.css ?? {};
    config.css.modules = {
      ...config.css.modules,
      generateScopedName: "[local]",
    };
    config.css.preprocessorOptions = {
      ...config.css.preprocessorOptions,
      scss: {
        ...config.css.preprocessorOptions?.scss,
        api: "modern",
      },
    };
    return config;
  },
};
export default config;
```

Delete `core.builder`. `@storybook/react-vite` already selects the Vite builder. In Storybook 10 a string `core.builder` must be a fully resolved file path, so leaving the old string breaks the build.

If `build-storybook` later reports that docs blocks are not registered, set `addons` to `["@storybook/addon-docs"]` and re-run the build. Do not add `addon-essentials`, `addon-links`, or `addon-interactions`.

- [ ] **Step 2: Remove the removed actions regex from `.storybook/preview.jsx`**

`parameters.actions.argTypesRegex` was removed. `on*` handlers are inferred. Leave the decorator, controls matchers, and `storySort` in place. The parameters object becomes:

```jsx
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: "",
        order: ["Introduction", "Components"],
        locales: "",
      },
    },
  },
```

- [ ] **Step 3: Point the manager and theme at the consolidated `storybook` package**

`.storybook/manager.js`:

```js
import { addons } from "storybook/manager-api";
import cleanplateTheme from "./cleanplate-theme";

addons.setConfig({
  theme: cleanplateTheme,
});
```

`.storybook/cleanplate-theme.js` — change only the import. Leave the `create({...})` options as they are.

```js
import { create } from "storybook/theming";
```

Prove the export exists:

```bash
node --input-type=module -e "import { create } from 'storybook/theming'; console.log(typeof create)"
```

Expected: `function`.

- [ ] **Step 4: Update story imports and keep Storybook types out of the published package**

`src/stories/form-controls/form-controls.stories.tsx` and `src/stories/drawer/drawer.stories.tsx`:

```ts
import { useArgs } from "storybook/preview-api";
```

`src/stories/table/table-arg-types.ts` is compiled by the root `tsconfig.json` today (`include` is `src/**/*`, and only `*.stories.*` is excluded). Importing `storybook/internal/types` from that file would leak Storybook into `dist` and would fail under `"moduleResolution": "node"`. Replace the Storybook type with a local structural type. Keep the exported names `tableMobileColumnsArgType` and `tableDocsArgTypes` and keep every existing property value.

```ts
type StoryArgType = {
  description?: string;
  control?: false | { type?: string };
  table?: {
    type?: { summary?: string; detail?: string };
    defaultValue?: { summary?: string };
  };
};

const tableMobileColumnsTypeDetail = `interface TableMobileColumns {
  title: string; // row key (required)
  subtitle?: string | (row) => ReactNode;
  description?: string | (row) => ReactNode;
  meta?: string | (row) => ReactNode;
  mediaAvatar?: string;
  mediaAvatarCodeText?: string | (row) => string;
  mediaIcon?: string | (row) => string;
  mediaImage?: string | (row) => string;
  action?: (row) => ReactNode;
  descriptionLineClamp?: number;
  // Plus MediaObject passthrough: margin, padding, className, etc.
}`;

/** Storybook argTypes override — docgen shows "union" for TableMobileColumns | null. */
export const tableMobileColumnsArgType: StoryArgType = {
  description:
    "When set and viewport width is under 768px, each row renders as a MediaObject instead of a table row. Omit or pass null for table-only layout.",
  control: false,
  table: {
    type: {
      summary: "TableMobileColumns | null",
      detail: tableMobileColumnsTypeDetail,
    },
    defaultValue: { summary: "null" },
  },
};

export const tableDocsArgTypes: Record<string, StoryArgType> = {
  mobileColumns: tableMobileColumnsArgType,
};
```

In `tsconfig.json`, add `src/stories/**` to `exclude` so story helpers are not emitted as package types. The rest of the compiler options stay unchanged:

```json
  "exclude": ["node_modules", "dist", "storybook-static", "src/stories/**", "**/*.stories.*", "**/*.test.*", "**/*.spec.*", "src/index.js"]
```

- [ ] **Step 5: Rewrite MDX doc blocks**

`ArgsTable` was removed in Storybook 8. `ArgTypes` is the replacement. `@storybook/blocks` was unpublished in Storybook 9.

For a file whose imports are only `Meta` and `ArgsTable`, replace both import lines with:

```mdx
import { Meta, ArgTypes } from "@storybook/addon-docs/blocks";
```

Replace each component table:

```mdx
<ArgTypes of={Button} />
```

The `of={...}` expression stays the same component reference. Do not retarget it at the CSF stories module. That would change which props the docs page lists.

Apply that pattern to these files:

- `src/stories/accordion/accordion.docs.mdx`
- `src/stories/alert/alert.docs.mdx`
- `src/stories/animated/animated.docs.mdx`
- `src/stories/app-shell/app-shell.docs.mdx`
- `src/stories/avatar/avatar.docs.mdx`
- `src/stories/badge/badge.docs.mdx`
- `src/stories/bottom-sheet/bottom-sheet.docs.mdx`
- `src/stories/breadcrumb/breadcrumb.docs.mdx`
- `src/stories/button/button.docs.mdx`
- `src/stories/confirm-dialog/confirm-dialog.docs.mdx`
- `src/stories/container/container.docs.mdx`
- `src/stories/dropdown/dropdown.docs.mdx`
- `src/stories/footer/footer.docs.mdx`
- `src/stories/header/header.docs.mdx`
- `src/stories/media-object/media-object.docs.mdx`
- `src/stories/menu-list/menu-list.docs.mdx`
- `src/stories/modal/modal.docs.mdx`
- `src/stories/page-header/page-header.docs.mdx`
- `src/stories/pagination/pagination.docs.mdx`
- `src/stories/pills/pills.docs.mdx`
- `src/stories/progress-bar/progress-bar.docs.mdx`
- `src/stories/spinner/spinner.docs.mdx`
- `src/stories/stepper/stepper.docs.mdx`
- `src/stories/toast/toast.docs.mdx`
- `src/stories/typography/typography.docs.mdx`

`src/stories/icon/icon.docs.mdx` keeps `IconGallery` and `IconItem`:

```mdx
import { Meta, IconGallery, IconItem, ArgTypes } from "@storybook/addon-docs/blocks";
```

```mdx
<ArgTypes of={Icon} />
```

`src/stories/statistic/statistic.docs.mdx` keeps `Canvas`:

```mdx
import { Meta, Canvas, ArgTypes } from "@storybook/addon-docs/blocks";
```

```mdx
<ArgTypes of={Statistic} />
```

`src/stories/form-controls/form-controls.docs.mdx` has four tables. One import, then:

```mdx
<ArgTypes of={FormControls.Input} />
```

```mdx
<ArgTypes of={FormControls.Select} />
```

```mdx
<ArgTypes of={FormControls.Date} />
```

```mdx
<ArgTypes of={FormControls.ColorPicker} />
```

`src/stories/table/table.docs.mdx` passes an override the `ArgTypes` block does not accept as an `argTypes` prop. The CSF meta in `table.stories.tsx` already sets `argTypes: tableDocsArgTypes`. Point the block at that meta so `mobileColumns` still shows `TableMobileColumns | null` instead of `union`.

```mdx
import { Meta, ArgTypes } from "@storybook/addon-docs/blocks";
import { Table, Badge, Container } from "../../index";
import * as TableStories from "./table.stories";
```

Delete `import { tableDocsArgTypes } from "./table-arg-types";` from the MDX file. Keep that module; `table.stories.tsx` still imports it.

```mdx
<ArgTypes of={TableStories} />
```

Files that import `Meta` and no `ArgsTable` — change the import path only:

- `src/stories/introduction.mdx`
- `src/stories/drawer/drawer.docs.mdx`
- `src/stories/feedback-state/feedback-state.docs.mdx`
- `src/stories/menu-list/tabs.docs.mdx`

```mdx
import { Meta } from "@storybook/addon-docs/blocks";
```

`src/stories/typography/typography.scale.mdx`:

```mdx
import { Meta, Unstyled } from "@storybook/addon-docs/blocks";
```

- [ ] **Step 6: Update the docs template the same way**

In `templates/storybook-docs-template.md`, both sample import pairs become:

```mdx
import { Meta, ArgTypes } from "@storybook/addon-docs/blocks";
```

And the props sample becomes:

```mdx
## Props
<ArgTypes of={ComponentName} />
```

There are two copies of the import pair and one `<ArgsTable of={ComponentName} />`. Replace all of them. Do not leave `ArgsTable` or `@storybook/blocks` in that file.

- [ ] **Step 7: Search for leftovers**

```bash
rg -n "@storybook/(blocks|preview-api|manager-api|theming|types|testing-library|addon-essentials|addon-interactions|addon-links|builder-vite)|ArgsTable|argTypesRegex|from \"@storybook/addon-docs\"" \
  --glob '!package-lock.json' \
  --glob '!node_modules/**' \
  --glob '!docs/superpowers/**' \
  --glob '!storybook-static/**'
```

Expected: no matches. `from "@storybook/addon-docs/blocks"` is allowed and will not match `from "@storybook/addon-docs"` because of the trailing quote in the pattern.

---

### Task 3: Verify, commit, and open the PR

**Files:**
- Test: `npm run type-check`, `npm run test`, `npm run build-storybook`, `npx storybook doctor`, `npm run test:visual`
- Modify: visual snapshots under `tests/visual` only if the iframe screenshots differ and the component markup did not

**Interfaces:**
- Consumes: the source from Task 2.
- Produces: a green local gate and an open GitHub PR URL.

- [ ] **Step 1: Typecheck, unit tests, and a static Storybook build**

```bash
npm run type-check
npm run test
npm run build-storybook
npx storybook doctor
```

Expected: each command exits 0. `storybook-static/index.json` exists and has an `entries` object. `tests/visual/story-ids.ts` already walks that shape; do not change it unless `entries` is missing.

If `build-storybook` fails on `@storybook/addon-docs/blocks`, read `node_modules/@storybook/addon-docs/package.json` `exports` and switch the MDX imports to the subpath that file actually publishes. Then re-run this step.

If Vite's peer range on `@storybook/react-vite@10` rejects Vite 5.4, bump only the root `vite` devDependency to the lowest version that satisfies that peer. Do not bump Vite in `demos/`.

- [ ] **Step 2: Smoke the manager and one story iframe**

```bash
npm run storybook
```

Wait until the log prints `Local:` and a URL on port 6001. Then:

```bash
curl -fsS -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:6001/iframe.html?id=atoms-button-playground--default&viewMode=story"
curl -fsS -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:6001/"
```

Expected: both print `200`. Stop the Storybook process after that. Do not leave it running.

- [ ] **Step 3: Visual tests**

Screenshots hit `/iframe.html`, not the manager chrome. Install Chromium if Playwright reports it missing:

```bash
npx playwright install chromium
npm run test:visual
```

Expected: pass.

If screenshots fail, open a few diffs. Update snapshots only when the diff is Storybook's canvas padding, background, or font loading and the component DOM is unchanged:

```bash
npm run test:visual:update
npm run test:visual
```

If a component's own markup or colors changed, fix that regression. Do not update snapshots to hide it.

- [ ] **Step 4: Regenerate LLM docs**

```bash
npm run generate-llms-txt
```

Expected: exit 0 and `llms.txt` updated only if the scraped docs changed.

If the extractor fails because Storybook 10's docs DOM no longer matches `@fluentui/storybook-llms-extractor@0.0.2`, revert any partial `llms.txt` edit and record the command output in the PR. Do not rewrite the extractor and do not hand-edit `llms.txt`.

- [ ] **Step 5: Commit**

```bash
git status
git diff
git log -5 --oneline
```

Stage the upgrade, story files, `.storybook`, `package.json`, `package-lock.json`, `tsconfig.json`, `templates/storybook-docs-template.md`, this plan, and any snapshot or `llms.txt` updates. Do not stage `demos/` or secrets.

```bash
git add package.json package-lock.json tsconfig.json .storybook src/stories templates/storybook-docs-template.md docs/superpowers/plans/2026-09-23-storybook-10-upgrade.md
git add -u tests/visual llms.txt
git commit -m "$(cat <<'EOF'
chore: upgrade Storybook from 7.6 to 10

The 7.x dev server nags on every start, and 10.x is the current line. Docs now use ArgTypes, and the manager theme imports the consolidated storybook package.

EOF
)"
git status
```

Expected: branch ahead of `origin/main` by 1 commit, working tree clean. If visual snapshots were not staged by the second `git add`, check `git status` and add the snapshot directory that actually changed, then commit again only if the first commit has not been pushed — in that case make a second commit, `test: refresh Storybook visual baselines`, rather than amending.

- [ ] **Step 6: Push and open the PR**

```bash
git push -u origin HEAD
gh pr create --title "Upgrade Storybook from 7.6 to 10" --body "$(cat <<'EOF'
## Summary
- Upgrades the repo-root Storybook from 7.6.20 to 10.x so `storybook dev` is on a current release.
- Moves docs MDX from `ArgsTable` / `@storybook/blocks` to `ArgTypes` from `@storybook/addon-docs/blocks`, and points the manager theme at `storybook/theming`.
- Keeps React 18, the Vite CSS-module and modern Sass hooks, and the demo apps unchanged.

## Test plan
- [ ] `npm run type-check`
- [ ] `npm run test`
- [ ] `npm run build-storybook`
- [ ] `npx storybook doctor`
- [ ] Iframe smoke: `atoms-button-playground--default` returns 200
- [ ] `npm run test:visual`
- [ ] `npm run generate-llms-txt` (note in this PR if the extractor cannot scrape Storybook 10)
- [ ] Open the Button docs page and confirm the props table renders
- [ ] Open the Table docs page and confirm `mobileColumns` is not typed as `union`

EOF
)"
```

Expected: `gh` prints the PR URL. Put that URL in the final message.

If `generate-llms-txt` failed, add one sentence under the test plan with the error's first meaningful line so reviewers know `llms.txt` was left as-is on purpose.
