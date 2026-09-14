#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { convertHtmlToJsx, ConvertError } from "./convert";
import { loadManifest } from "./manifest";

function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error("Usage: cleanplate html-to-jsx <file.html>");
    process.exit(1);
  }

  try {
    const html = readFileSync(inputPath, "utf8");
    const { jsx } = convertHtmlToJsx(html, loadManifest());
    process.stdout.write(`${jsx}\n`);
  } catch (error) {
    if (error instanceof ConvertError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
}

main();
