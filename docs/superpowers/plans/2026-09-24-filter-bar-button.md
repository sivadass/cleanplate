# FilterBar Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the FilterBar drawer trigger a `filter_list` prefix icon, a customizable label, and separate Default, Open, and Applied treatments that can show Applied while the drawer is open.

**Architecture:** `FilterBar` already computes `activeDrawerCount` from committed values. The button reads that count plus `isOpen`. Applied (`count > 0`) switches `Button` to `variant="solid"` and appends the count to `buttonLabel`. Open with a zero count adds `cp-filter-bar__button--open`. `aria-expanded` follows the drawer in every state.

**Tech Stack:** React, TypeScript, CSS modules (`generateScopedName: "[local]"`), Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-24-filter-bar-button-design.md`

## Global Constraints

- `buttonLabel` defaults to `"Filters"`. The icon is fixed `filter_list`, not a prop.
- Count text is `` `${buttonLabel} ${n}` `` only when `n > 0`, from committed drawer values, including while the drawer is open.
- Default and Open use `variant="outline"`. Applied and Applied+open use `variant="solid"`.
- `cp-filter-bar__button--open` (`background: var(--primary-brand-light)`) is added only when the drawer is open and the count is 0.
- `aria-expanded` is `true` only while the drawer is open.
- Drawer title stays `Filters`.
- The button stays hidden when no field has `placement: "drawer"`.

## File structure

| File | Responsibility |
| --- | --- |
| `src/components/filter-bar/filter-bar-types.ts` | `buttonLabel?: string` on `FilterBarProps` |
| `src/components/filter-bar/FilterBar.tsx` | Icon, label, variant, open class, `aria-expanded` |
| `src/components/filter-bar/FilterBar.module.scss` | Open background |
| `src/components/filter-bar/FilterBar.test.tsx` | State and label tests |
| `docs/FilterBar.md` | Prop, states, HTML `data-cp-button-label` |
| `src/html-to-jsx/filter-bar-convert.ts` | Map `data-cp-button-label` |
| `src/html-to-jsx/component-manifest.json` | Declare `buttonLabel` |
| `src/html-to-jsx/convert.test.ts` | Converter assertion |
| `src/stories/filter-bar/filter-bar.docs.mdx` | Mention the label prop |

---

### Task 1: Button states

**Files:**
- Modify: `src/components/filter-bar/filter-bar-types.ts`
- Modify: `src/components/filter-bar/FilterBar.tsx`
- Modify: `src/components/filter-bar/FilterBar.module.scss`
- Test: `src/components/filter-bar/FilterBar.test.tsx`

**Interfaces:**
- Consumes: `activeCount` from `activeDrawerCount(drawerFields, values)` and `isOpen`.
- Produces: `buttonLabel?: string` on `FilterBarProps`. Button accessible name is `buttonLabel` or `` `${buttonLabel} ${activeCount}` ``.

- [x] **Step 1: Write the failing tests** in `describe("FilterBar drawer")` for prefix icon, `More filters 1` solid, open class, and applied+open without the open class.

- [x] **Step 2: Run** `npx vitest run src/components/filter-bar/FilterBar.test.tsx -t "FilterBar drawer"` and confirm the new assertions fail.

- [x] **Step 3: Implement** the prop, button variant/icon/class/`aria-expanded`, and `.cp-filter-bar__button--open`.

- [x] **Step 4: Run** the same vitest command and confirm pass.

### Task 2: Docs and HTML prototype

**Files:**
- Modify: `docs/FilterBar.md`
- Modify: `src/html-to-jsx/filter-bar-convert.ts`
- Modify: `src/html-to-jsx/component-manifest.json`
- Modify: `src/html-to-jsx/convert.test.ts`
- Modify: `src/stories/filter-bar/filter-bar.docs.mdx`

- [x] **Step 1: Document** `buttonLabel` and the four states. Map `data-cp-button-label` to `buttonLabel`, omitting the default `"Filters"`.

- [x] **Step 2: Run** `npx vitest run src/html-to-jsx/convert.test.ts src/components/filter-bar/FilterBar.test.tsx`.
