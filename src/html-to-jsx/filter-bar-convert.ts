import type * as cheerio from "cheerio";
import type { ComponentManifest } from "./manifest";
import { ConvertError } from "./convert-errors";
import { docsPathForComponent } from "./manifest";
import type { HtmlElement } from "./convert-types";

const FIELD_TYPES = new Set(["search", "select", "multiSelect", "dateRange"]);
const PLACEMENTS = new Set(["bar", "drawer"]);

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

function parseField($: cheerio.CheerioAPI, child: HtmlElement): Record<string, unknown> {
  const docs = docsPathForComponent("FilterBar");
  const type = child.attribs["data-cp-type"];
  if (!type || !FIELD_TYPES.has(type)) {
    throw new ConvertError(`Illegal FilterBar field type "${type ?? ""}".`, docs);
  }

  const id = child.attribs["data-cp-id"];
  const label = child.attribs["data-cp-label"];
  const placement = child.attribs["data-cp-placement"];
  if (!id || !label || !placement) {
    throw new ConvertError("FilterBar field requires data-cp-id, data-cp-label, and data-cp-placement.", docs);
  }
  if (!PLACEMENTS.has(placement)) {
    throw new ConvertError(`Illegal FilterBar placement "${placement}".`, docs);
  }

  const field: Record<string, unknown> = {
    id,
    type,
    label,
    placement,
  };

  const placeholder = child.attribs["data-cp-placeholder"];
  if (placeholder) {
    if (type !== "search") {
      throw new ConvertError("data-cp-placeholder is only valid on search fields.", docs);
    }
    field.placeholder = placeholder;
  }

  if (type === "select" || type === "multiSelect") {
    const options = $(child as never)
      .children("[data-cp-value]")
      .toArray()
      .map((option) => {
        const value = (option as HtmlElement).attribs["data-cp-value"];
        const optionLabel = (option as HtmlElement).attribs["data-cp-label"];
        if (value === undefined || !optionLabel) {
          throw new ConvertError("Select options require data-cp-value and data-cp-label.", docs);
        }
        return { value, label: optionLabel };
      });
    field.options = options;
  }

  return field;
}

export function convertFilterBarComponent(
  $: cheerio.CheerioAPI,
  element: HtmlElement,
  entry: ComponentManifest,
): string {
  const docs = docsPathForComponent("FilterBar");
  const fields = $(element as never)
    .children("[data-cp-type]")
    .toArray()
    .map((child) => parseField($, child as HtmlElement));

  if (fields.length === 0) {
    throw new ConvertError("FilterBar requires at least one field child.", docs);
  }

  const propParts = [`fields={${formatJsxObjectLiteral(fields)}}`];
  const buttonLabel = element.attribs["data-cp-button-label"];
  if (buttonLabel && buttonLabel !== "Filters") {
    propParts.push(`buttonLabel="${escapeJsxString(buttonLabel)}"`);
  }
  const padding = element.attribs["data-cp-padding"];
  if (padding && padding !== "x-4") {
    const paddingDef = entry.props.padding;
    if (!paddingDef) {
      throw new ConvertError('Unknown prop "padding" on FilterBar.', docs);
    }
    propParts.push(`padding="${escapeJsxString(padding)}"`);
  }
  const fieldMaxWidth = element.attribs["data-cp-field-max-width"];
  if (fieldMaxWidth) {
    const widthDef = entry.props.fieldMaxWidth;
    if (!widthDef) {
      throw new ConvertError('Unknown prop "fieldMaxWidth" on FilterBar.', docs);
    }
    propParts.push(`fieldMaxWidth="${escapeJsxString(fieldMaxWidth)}"`);
  }
  const margin = element.attribs["data-cp-margin"];
  if (margin && margin !== "0") {
    const marginDef = entry.props.margin;
    if (!marginDef) {
      throw new ConvertError('Unknown prop "margin" on FilterBar.', docs);
    }
    propParts.push(`margin="${escapeJsxString(margin)}"`);
  }

  return `<FilterBar ${propParts.join(" ")} />`;
}
