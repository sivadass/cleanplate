import type * as cheerio from "cheerio";
import type { ComponentManifest } from "./manifest";
import { ConvertError } from "./convert-errors";
import { docsPathForComponent } from "./manifest";
import type { HtmlElement } from "./convert-types";

function slugifyColumnId(title: string): string {
  const parts = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) {
    return "column";
  }
  return parts
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join("");
}

function escapeJsxString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatJsxObjectLiteral(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  const inner = "  ".repeat(indent + 1);

  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "string") {
    return `"${escapeJsxString(value)}"`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    const items = value
      .map((item) => `${inner}${formatJsxObjectLiteral(item, indent + 1)}`)
      .join(",\n");
    return `[\n${items},\n${pad}]`;
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) {
    return "{}";
  }
  const props = entries
    .map(
      ([key, val]) =>
        `${inner}${/^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${formatJsxObjectLiteral(val, indent + 1)}`,
    )
    .join(",\n");
  return `{\n${props},\n${pad}}`;
}

function collectScalarProps(
  element: HtmlElement,
  componentName: string,
  entry: ComponentManifest,
): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {};

  for (const [attr, rawValue] of Object.entries(element.attribs)) {
    if (!attr.startsWith("data-cp-") || attr === "data-cp-slot") {
      continue;
    }
    const propName = attr
      .replace(/^data-cp-/, "")
      .replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
    const propDef = entry.props[propName];
    if (!propDef) {
      continue;
    }
    let parsed: string | number | boolean = rawValue;
    if (propDef.type === "boolean") {
      parsed = rawValue === "true";
    } else if (propDef.type === "number") {
      parsed = Number(rawValue);
    }
    if (propDef.type === "enum" && propDef.values && !propDef.values.includes(String(parsed))) {
      throw new ConvertError(
        `Illegal value "${rawValue}" for prop "${propName}" on ${componentName}.`,
        docsPathForComponent(componentName),
      );
    }
    if (propDef.default !== parsed) {
      props[propName] = parsed;
    }
  }

  return props;
}

function parseDesktopTable($: cheerio.CheerioAPI, element: HtmlElement) {
  const table = $(element as never).find("table").first();
  if (!table.length) {
    throw new ConvertError(
      'Table recipe "desktop" requires a <table> element.',
      docsPathForComponent("Table"),
    );
  }

  const columns: Array<{ id: string; title: string }> = [];
  table
    .find("thead th")
    .toArray()
    .forEach((th) => {
      const title = $(th).text().trim();
      const id =
        th.attribs["data-cp-col"] ||
        th.attribs["data-cp-field"] ||
        slugifyColumnId(title);
      columns.push({ id, title });
    });

  const data: Array<Record<string, string>> = [];
  table
    .find("tbody tr")
    .toArray()
    .forEach((tr) => {
      const row: Record<string, string> = {};
      $(tr)
        .find("td")
        .toArray()
        .forEach((td, index) => {
          const field =
            td.attribs["data-cp-field"] ||
            td.attribs["data-cp-col"] ||
            columns[index]?.id;
          if (!field) {
            return;
          }
          row[field] = $(td).text().trim();
        });
      if (Object.keys(row).length > 0) {
        data.push(row);
      }
    });

  return { columns, data };
}

function parseMobileTable($: cheerio.CheerioAPI, element: HtmlElement) {
  const mobileColumns: Record<string, string> = {};
  for (const [attr, value] of Object.entries(element.attribs)) {
    if (attr.startsWith("data-cp-mobile-")) {
      const key = attr
        .replace(/^data-cp-mobile-/, "")
        .replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
      mobileColumns[key] = value;
    }
  }

  if (!mobileColumns.title) {
    throw new ConvertError(
      'Table recipe "mobile" requires data-cp-mobile-title.',
      docsPathForComponent("Table"),
    );
  }

  const data: Array<Record<string, string>> = [];
  $(element as never)
    .find('[data-cp="MediaObject"], [data-cp-row]')
    .toArray()
    .forEach((rowEl) => {
      const row: Record<string, string> = {};
      for (const [attr, value] of Object.entries(rowEl.attribs)) {
        if (attr.startsWith("data-cp-field-")) {
          const key = attr.replace(/^data-cp-field-/, "");
          row[key] = value;
        }
      }
      if (Object.keys(row).length === 0) {
        for (const [key, columnKey] of Object.entries(mobileColumns)) {
          const dataCpKey = `data-cp-${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`;
          if (rowEl.attribs[dataCpKey]) {
            row[columnKey] = rowEl.attribs[dataCpKey];
          }
        }
      }
      if (Object.keys(row).length > 0) {
        data.push(row);
      }
    });

  return { mobileColumns, data };
}

export function convertTableComponent(
  $: cheerio.CheerioAPI,
  element: HtmlElement,
  entry: ComponentManifest,
): string {
  const recipe = element.attribs["data-cp-recipe"];
  if (!recipe) {
    throw new ConvertError(
      'Table requires data-cp-recipe ("desktop" or "mobile").',
      docsPathForComponent("Table"),
    );
  }
  if (!entry.recipes?.includes(recipe)) {
    throw new ConvertError(
      `Illegal recipe "${recipe}" on Table.`,
      docsPathForComponent("Table"),
    );
  }

  const scalarProps = collectScalarProps(element, "Table", entry);
  const propParts = [`recipe="${recipe}"`];

  for (const [name, value] of Object.entries(scalarProps)) {
    if (name === "recipe") {
      continue;
    }
    if (typeof value === "boolean") {
      propParts.push(value ? name : `${name}={false}`);
    } else if (typeof value === "number") {
      propParts.push(`${name}={${value}}`);
    } else {
      propParts.push(`${name}="${escapeJsxString(value)}"`);
    }
  }

  if (recipe === "desktop") {
    const { columns, data } = parseDesktopTable($, element);
    propParts.push(`columns={${formatJsxObjectLiteral(columns)}}`);
    propParts.push(`data={${formatJsxObjectLiteral(data)}}`);
  } else {
    const { mobileColumns, data } = parseMobileTable($, element);
    propParts.push(`mobileColumns={${formatJsxObjectLiteral(mobileColumns)}}`);
    propParts.push(`data={${formatJsxObjectLiteral(data)}}`);
  }

  return `<Table ${propParts.join(" ")} />`;
}
