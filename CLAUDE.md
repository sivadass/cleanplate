# Claude / design-agent pointers

Follow **[AGENTS.md](./AGENTS.md)** for CleanPlate React code generation rules.

Start with **[llms.txt](./llms.txt)** for the component index, spacing API, and HTML prototype workflow.

## HTML → React bridge

1. **Author HTML** using `data-cp` attributes + public `cp-*` CSS — see `skills/cleanplate-html-prototype/SKILL.md`.
2. **Convert mechanically** with the CLI — see `skills/cleanplate-html-to-react/SKILL.md`.
3. **Reference recipes** in `docs/<Component>.md` under `## HTML prototype` (Input: `### HTML prototype (Input)` in `docs/FormControls.md`).
4. **Sticker sheet:** `docs/html/kit.html`

Do not invent JSX when a HTML recipe exists — run the converter and fix HTML on failure.
