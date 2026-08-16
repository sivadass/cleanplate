#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

const DOC_FIXTURE_MAP = {
  Accordion: "accordion.playground",
  MenuList: "menulist.playground",
  Stepper: "stepper.playground",
  Pills: "pills.playground",
  MediaObject: "mediaobject.playground",
  BreadCrumb: "breadcrumb.playground",
  Header: "header.playground",
  Footer: "footer.playground",
  PageHeader: "pageheader.playground",
  FeedbackState: "feedbackstate.playground",
  Statistic: "statistic.playground",
  ProgressBar: "progressbar.playground",
  Animated: "animated.playground",
  Pagination: "pagination.playground",
};

for (const [docName, fixtureBase] of Object.entries(DOC_FIXTURE_MAP)) {
  const docPath = join(root, `docs/${docName}.md`);
  const html = readFileSync(
    join(root, `src/html-to-jsx/fixtures/${fixtureBase}.html`),
    "utf8",
  ).trim();
  const jsx = readFileSync(
    join(root, `src/html-to-jsx/fixtures/${fixtureBase}.jsx`),
    "utf8",
  ).trim();

  let text = readFileSync(docPath, "utf8");
  if (text.includes("## HTML prototype")) {
    continue;
  }

  const block = `

## HTML prototype

\`\`\`bash
npm run html-to-jsx -- recipe.html
\`\`\`

### Recipe

\`\`\`html
${html}
\`\`\`

### React equivalent

\`\`\`jsx
${jsx}
\`\`\`
`;

  const marker = "## Related Components / Links";
  if (text.includes(marker)) {
    text = text.replace(marker, `${block}\n${marker}`);
  } else {
    text += block;
  }

  writeFileSync(docPath, text);
  console.log(`Updated docs/${docName}.md`);
}

// Table dual recipes
const tableDoc = join(root, "docs/Table.md");
let tableText = readFileSync(tableDoc, "utf8");
if (!tableText.includes("## HTML prototype")) {
  const desktopHtml = readFileSync(
    join(root, "src/html-to-jsx/fixtures/table.desktop.html"),
    "utf8",
  ).trim();
  const desktopJsx = readFileSync(
    join(root, "src/html-to-jsx/fixtures/table.desktop.jsx"),
    "utf8",
  ).trim();
  const mobileHtml = readFileSync(
    join(root, "src/html-to-jsx/fixtures/table.mobile.html"),
    "utf8",
  ).trim();
  const mobileJsx = readFileSync(
    join(root, "src/html-to-jsx/fixtures/table.mobile.jsx"),
    "utf8",
  ).trim();
  const block = `

## HTML prototype

Table requires \`data-cp-recipe\`. Use **two artboards** — one for \`desktop\` (HTML \`<table>\`) and one for \`mobile\` (MediaObject list). Mark column ids with \`data-cp-col\` on \`<th>\` and \`data-cp-field\` on \`<td>\`. Mobile rows use \`data-cp-mobile-*\` field maps on the Table root.

\`\`\`bash
npm run html-to-jsx -- table.desktop.html
npm run html-to-jsx -- table.mobile.html
\`\`\`

### Recipe (desktop)

\`\`\`html
${desktopHtml}
\`\`\`

### React equivalent (desktop)

\`\`\`jsx
${desktopJsx}
\`\`\`

### Recipe (mobile)

\`\`\`html
${mobileHtml}
\`\`\`

### React equivalent (mobile)

\`\`\`jsx
${mobileJsx}
\`\`\`
`;
  const marker = "## Related Components / Links";
  tableText = tableText.includes(marker)
    ? tableText.replace(marker, `${block}\n${marker}`)
    : tableText + block;
  writeFileSync(tableDoc, tableText);
  console.log("Updated docs/Table.md");
}

// AppShell dual recipes
const shellDoc = join(root, "docs/AppShell.md");
let shellText = readFileSync(shellDoc, "utf8");
if (!shellText.includes("## HTML prototype")) {
  const desktopHtml = readFileSync(
    join(root, "src/html-to-jsx/fixtures/appshell.desktop.html"),
    "utf8",
  ).trim();
  const desktopJsx = readFileSync(
    join(root, "src/html-to-jsx/fixtures/appshell.desktop.jsx"),
    "utf8",
  ).trim();
  const mobileHtml = readFileSync(
    join(root, "src/html-to-jsx/fixtures/appshell.mobile-drawer.html"),
    "utf8",
  ).trim();
  const mobileJsx = readFileSync(
    join(root, "src/html-to-jsx/fixtures/appshell.mobile-drawer.jsx"),
    "utf8",
  ).trim();
  const block = `

## HTML prototype

AppShell requires \`data-cp-recipe\`. Use **two artboards**: \`desktop\` (header/sidebar/main) and \`mobile-drawer\` (overlay + entered drawer). Place mobile navigation at the artboard root, not inside clipped frames.

\`\`\`bash
npm run html-to-jsx -- appshell.desktop.html
npm run html-to-jsx -- appshell.mobile-drawer.html
\`\`\`

### Recipe (desktop)

\`\`\`html
${desktopHtml}
\`\`\`

### React equivalent (desktop)

\`\`\`jsx
${desktopJsx}
\`\`\`

### Recipe (mobile-drawer)

\`\`\`html
${mobileHtml}
\`\`\`

### React equivalent (mobile-drawer)

\`\`\`jsx
${mobileJsx}
\`\`\`
`;
  const marker = "## Related Components / Links";
  shellText = shellText.includes(marker)
    ? shellText.replace(marker, `${block}\n${marker}`)
    : shellText + block;
  writeFileSync(shellDoc, shellText);
  console.log("Updated docs/AppShell.md");
}

function readFixture(base) {
  const html = readFileSync(
    join(root, `src/html-to-jsx/fixtures/${base}.html`),
    "utf8",
  ).trim();
  const jsx = readFileSync(
    join(root, `src/html-to-jsx/fixtures/${base}.jsx`),
    "utf8",
  ).trim();
  return { html, jsx };
}

function insertBeforeRelated(docPath, block) {
  let text = readFileSync(docPath, "utf8");
  if (text.includes("## HTML prototype")) {
    return false;
  }
  const marker = "## Related Components / Links";
  text = text.includes(marker)
    ? text.replace(marker, `${block}\n${marker}`)
    : text + block;
  writeFileSync(docPath, text);
  return true;
}

const TIER2_OVERLAY_DOCS = {
  Modal: {
    intro:
      "Place the **open** overlay at the **artboard root** as a sibling of the page — not inside `overflow: hidden` or transformed frames. Use `data-cp-is-open=\"true\"` and slots `title`, `body`, `footer`.",
    fixture: "modal.open",
  },
  Drawer: {
    intro:
      "Place the **open** drawer overlay at the **artboard root**. Use `data-cp-is-open=\"true\"`, `data-cp-placement`, and slots `title`, `body`, `footer`.",
    fixture: "drawer.open",
  },
  ConfirmDialog: {
    intro:
      "Place the **open** confirm dialog at the **artboard root** with `cp-confirm-dialog-overlay-open`. Map `title`, `description`, and button labels via `data-cp-*` props.",
    fixture: "confirm-dialog.open",
  },
  Toast: {
    intro:
      "HTML recipe is a **single toast card** snapshot (not the imperative queue). Place the host at the **artboard root** (`position: fixed; top: 16px; right: 16px`). After conversion, wire `ref.addMessage({ mode, message })` by hand.",
    fixture: "toast.single",
  },
  BottomSheet: {
    intro:
      "Place the **open** bottom sheet at the **artboard root**. Bake one snap with `data-cp-snap` and matching `cp-bottom-sheet--snap-*` class — no drag listeners in HTML.",
    fixture: "bottom-sheet.open",
  },
};

for (const [docName, { intro, fixture }] of Object.entries(TIER2_OVERLAY_DOCS)) {
  const { html, jsx } = readFixture(fixture);
  const block = `

## HTML prototype

${intro}

\`\`\`bash
npm run html-to-jsx -- ${fixture}.html
\`\`\`

### Recipe (open)

\`\`\`html
${html}
\`\`\`

### React equivalent

\`\`\`jsx
${jsx}
\`\`\`
`;
  if (insertBeforeRelated(join(root, `docs/${docName}.md`), block)) {
    console.log(`Updated docs/${docName}.md`);
  }
}

const dropdownClosed = readFixture("dropdown.closed");
const dropdownOpen = readFixture("dropdown.open");
const dropdownBlock = `

## HTML prototype

Tier 4 floater: document **closed** and **open** frames. Open panel uses canonical CSS placement (\`cp-dropdown-floating\`); do not rely on runtime Floating UI coords — the converter strips inline \`top\` / \`left\` / \`width\`.

\`\`\`bash
npm run html-to-jsx -- dropdown.closed.html
npm run html-to-jsx -- dropdown.open.html
\`\`\`

### Recipe (closed)

\`\`\`html
${dropdownClosed.html}
\`\`\`

### React equivalent (closed)

\`\`\`jsx
${dropdownClosed.jsx}
\`\`\`

### Recipe (open)

\`\`\`html
${dropdownOpen.html}
\`\`\`

### React equivalent (open)

\`\`\`jsx
${dropdownOpen.jsx}
\`\`\`
`;
if (insertBeforeRelated(join(root, "docs/Dropdown.md"), dropdownBlock)) {
  console.log("Updated docs/Dropdown.md");
}

const formControlsDoc = join(root, "docs/FormControls.md");
let formText = readFileSync(formControlsDoc, "utf8");

const formTier4Sections = [
  {
    title: "Select",
    intro:
      "Place open panels at the **artboard root** when portalling in React. Use \`data-cp-slot=\"trigger\"\` and \`data-cp-slot=\"content\"\`. Strip runtime coords from HTML — canonical \`cp-select-dropdown-panel-entered\` placement only.",
    closed: "select.closed",
    open: "select.open",
  },
  {
    title: "Date",
    intro:
      "Freeze **one month grid** in the open fixture (\`data-cp-date\` on day cells as text). Converter maps \`data-cp-value\` as an ISO date string; calendar math stays React-only.",
    closed: "date.closed",
    open: "date.open",
  },
  {
    title: "ColorPicker",
    intro:
      "Freeze hue and thumb position in HTML/CSS for the open frame. Converter maps \`data-cp-value\` hex only — pointer capture and channel math stay React-only.",
    closed: "colorpicker.closed",
    open: "colorpicker.open",
  },
];

for (const section of formTier4Sections) {
  const marker = `### HTML prototype (${section.title})`;
  if (formText.includes(marker)) {
    continue;
  }
  const closed = readFixture(section.closed);
  const open = readFixture(section.open);
  const block = `

### HTML prototype (${section.title})

${section.intro}

\`\`\`bash
npm run html-to-jsx -- ${section.closed}.html
npm run html-to-jsx -- ${section.open}.html
\`\`\`

#### Recipe (closed)

\`\`\`html
${closed.html}
\`\`\`

#### React equivalent (closed)

\`\`\`jsx
${closed.jsx}
\`\`\`

#### Recipe (open)

\`\`\`html
${open.html}
\`\`\`

#### React equivalent (open)

\`\`\`jsx
${open.jsx}
\`\`\`
`;
  const anchor = "## Related Components / Links";
  formText = formText.includes(anchor)
    ? formText.replace(anchor, `${block}\n${anchor}`)
    : formText + block;
  console.log(`Updated docs/FormControls.md (${section.title})`);
}

writeFileSync(formControlsDoc, formText);
