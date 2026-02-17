# Templates

Reference templates for documentation and Storybook. Use these when adding or updating component docs.

| File | Purpose |
|------|---------|
| `storybook-docs-template.md` | How to write Storybook docs (stories + docs.mdx): folder structure, meta, argTypes, args, Default/named stories, spacing suffix, docs.mdx sections, checklist. |
| `docs-template-sample.md` | Sample structure for LLM/component docs in `docs/<Component>.md`. **Section order:** Purpose → Props / Inputs → Types → Usage Examples → Behavior Notes → Related Components / Links. Uses the **framework-wide spacing suffix rule** for margin/padding/gap (suffix only; see `llms.txt`). |

When adding a new component doc, follow the section order in `docs-template-sample.md` and describe any `margin`/`padding`/`gap` prop as suffix-only (same rule as all components). Then add the component to `llms.txt` (Component block, Quick Reference row, and Usage import).

See `llms.txt` for the full documentation index.
