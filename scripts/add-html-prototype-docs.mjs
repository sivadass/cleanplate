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
