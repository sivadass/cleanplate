#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "src/html-to-jsx/component-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

if (!manifest.components || typeof manifest.components !== "object") {
  console.error("Invalid component manifest: missing components object");
  process.exit(1);
}

for (const [name, entry] of Object.entries(manifest.components)) {
  if (!entry.exportName || !entry.tier || !entry.props) {
    console.error(`Invalid manifest entry for ${name}`);
    process.exit(1);
  }
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `Validated ${Object.keys(manifest.components).length} components in component-manifest.json`,
);
