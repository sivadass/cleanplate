import * as cheerio from "cheerio";
import type { ComponentManifest, Manifest } from "./manifest";
import { docsPathForComponent } from "./manifest";
import { ConvertError } from "./convert-errors";
import { convertTableComponent } from "./table-convert";
import type { HtmlElement, HtmlNode } from "./convert-types";

export { ConvertError } from "./convert-errors";

const GEOMETRY_STYLE_PROPS = new Set([
  "top",
  "left",
  "right",
  "bottom",
  "transform",
  "width",
  "maxheight",
  "max-width",
]);

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const ATTR_RENAMES: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  autocomplete: "autoComplete",
};

function dataCpAttrToProp(attr: string): string {
  const kebab = attr.replace(/^data-cp-/, "");
  return kebab.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

function isDefaultValue(defaultValue: unknown, value: unknown): boolean {
  if (defaultValue === undefined) {
    return false;
  }
  if (Array.isArray(defaultValue)) {
    if (Array.isArray(value)) {
      return JSON.stringify(defaultValue) === JSON.stringify(value);
    }
    return defaultValue.length === 1 && defaultValue[0] === value;
  }
  return defaultValue === value;
}

function parsePropValue(
  rawValue: string,
  propType: ComponentManifest["props"][string]["type"],
): string | number | boolean {
  if (propType === "boolean") {
    return rawValue === "true";
  }
  if (propType === "number") {
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) {
      return rawValue;
    }
    return parsed;
  }
  return rawValue;
}

function collectDataCpProps(
  element: HtmlElement,
  componentName: string,
  entry: ComponentManifest,
): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {};

  for (const [attr, rawValue] of Object.entries(element.attribs)) {
    if (!attr.startsWith("data-cp-") || attr === "data-cp-slot") {
      continue;
    }

    const propName = dataCpAttrToProp(attr);
    const propDef = entry.props[propName];

    if (!propDef) {
      throw new ConvertError(
        `Unknown prop "${propName}" on ${componentName}.`,
        docsPathForComponent(componentName),
      );
    }

    const parsed = parsePropValue(rawValue, propDef.type);

    if (
      propDef.type === "enum" &&
      propDef.values &&
      !propDef.values.includes(String(parsed))
    ) {
      throw new ConvertError(
        `Illegal value "${rawValue}" for prop "${propName}" on ${componentName}.`,
        docsPathForComponent(componentName),
      );
    }

    if (!isDefaultValue(propDef.default, parsed)) {
      props[propName] = parsed;
    }
  }

  return props;
}

function stripGeometryStyle(style: string | undefined): string | undefined {
  if (!style) {
    return undefined;
  }

  const kept = style
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => {
      const colonIndex = part.indexOf(":");
      if (colonIndex === -1) {
        return true;
      }
      const key = part.slice(0, colonIndex).trim().toLowerCase();
      return !GEOMETRY_STYLE_PROPS.has(key);
    });

  return kept.length > 0 ? kept.join("; ") : undefined;
}

function escapeJsxText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/{/g, "&#123;");
}

function escapeJsxAttr(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatJsxProp(name: string, value: string | number | boolean): string {
  if (typeof value === "boolean") {
    return value ? name : `${name}={false}`;
  }
  if (typeof value === "number") {
    return `${name}={${value}}`;
  }
  return `${name}="${escapeJsxAttr(value)}"`;
}

function formatJsxPropExpression(name: string, expression: string): string {
  return `${name}={${expression}}`;
}

function formatOpeningTag(
  tagName: string,
  props: string[],
  selfClosing: boolean,
): string {
  if (props.length === 0) {
    return selfClosing ? `<${tagName} />` : `<${tagName}>`;
  }
  return selfClosing
    ? `<${tagName} ${props.join(" ")} />`
    : `<${tagName} ${props.join(" ")}>`;
}

function jsxStyleObject(style: string): string {
  return style
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const colonIndex = part.indexOf(":");
      const key = part.slice(0, colonIndex).trim();
      const value = part.slice(colonIndex + 1).trim();
      const camelKey = key.replace(/-([a-z])/g, (_, char: string) =>
        char.toUpperCase(),
      );
      return `${camelKey}: "${escapeJsxAttr(value)}"`;
    })
    .join(", ");
}

function closingTagName(exportName: string): string {
  return exportName.includes(".") ? exportName.split(".").pop()! : exportName;
}

function convertUntaggedElement(
  $: cheerio.CheerioAPI,
  element: HtmlElement,
  manifest: Manifest,
): string {
  const tagName = element.name;
  const props: string[] = [];

  for (const [attr, value] of Object.entries(element.attribs)) {
    if (attr === "data-cp-slot") {
      continue;
    }

    if (attr === "style") {
      const stripped = stripGeometryStyle(value);
      if (stripped) {
        props.push(`style={{ ${jsxStyleObject(stripped)} }}`);
      }
      continue;
    }

    const jsxName = ATTR_RENAMES[attr] ?? attr;
    props.push(`${jsxName}="${escapeJsxAttr(value)}"`);
  }

  const selfClosing = VOID_ELEMENTS.has(tagName);
  const open = formatOpeningTag(tagName, props, selfClosing);

  if (selfClosing) {
    return open;
  }

  const children = $(element as never)
    .contents()
    .toArray()
    .map((child) => convertNode($, child, manifest))
    .join("");

  return `${open}${children}</${tagName}>`;
}

function convertTaggedComponent(
  $: cheerio.CheerioAPI,
  element: HtmlElement,
  componentName: string,
  manifest: Manifest,
): string {
  const entry = manifest.components[componentName];
  if (!entry) {
    throw new ConvertError(
      `Unknown component "${componentName}".`,
      docsPathForComponent(componentName),
    );
  }

  if (componentName === "Table") {
    return convertTableComponent($, element, entry);
  }

  const recipe = element.attribs["data-cp-recipe"];
  if (entry.tier === 3) {
    if (!recipe) {
      throw new ConvertError(
        `${componentName} requires data-cp-recipe.`,
        docsPathForComponent(componentName),
      );
    }
    if (entry.recipes && !entry.recipes.includes(recipe)) {
      throw new ConvertError(
        `Illegal recipe "${recipe}" on ${componentName}.`,
        docsPathForComponent(componentName),
      );
    }
  }

  const props = collectDataCpProps(element, componentName, entry);
  if (recipe && !props.recipe) {
    props.recipe = recipe;
  }
  const propStrings: string[] = Object.entries(props).map(([name, value]) =>
    formatJsxProp(name, value),
  );

  const slotNames = entry.slots ?? [];
  const slotted = new Map<string, string>();
  const defaultChildren: string[] = [];

  $(element as never)
    .contents()
    .toArray()
    .forEach((child) => {
      if (child.type === "text") {
        const text = "data" in child ? String(child.data ?? "") : "";
        if (text.trim()) {
          defaultChildren.push(escapeJsxText(text));
        }
        return;
      }

      if (child.type !== "tag") {
        return;
      }

      const slot = child.attribs["data-cp-slot"];
      const converted = convertNode($, child, manifest);

      if (slot && slotNames.includes(slot)) {
        slotted.set(slot, converted);
        return;
      }

      if (slot) {
        throw new ConvertError(
          `Unknown slot "${slot}" on ${componentName}.`,
          docsPathForComponent(componentName),
        );
      }

      defaultChildren.push(converted);
    });

  for (const slotName of slotNames) {
    if (slotName === "default") {
      continue;
    }
    const slotValue = slotted.get(slotName);
    if (slotValue) {
      propStrings.push(formatJsxPropExpression(slotName, slotValue));
    }
  }

  const exportName = entry.exportName;
  const children = defaultChildren.join("");

  if (children.length === 0 && propStrings.length === 0) {
    return `<${exportName} />`;
  }

  if (children.length === 0) {
    return formatOpeningTag(exportName, propStrings, true);
  }

  const open = formatOpeningTag(exportName, propStrings, false);
  return `${open}${children}</${closingTagName(exportName)}>`;
}

function convertNode(
  $: cheerio.CheerioAPI,
  node: HtmlNode,
  manifest: Manifest,
): string {
  if (node.type === "text") {
    const text = "data" in node ? String(node.data ?? "") : "";
    return escapeJsxText(text);
  }

  if (node.type !== "tag") {
    return "";
  }

  const element = node as HtmlElement;
  const componentName = element.attribs["data-cp"];

  if (componentName) {
    return convertTaggedComponent($, element, componentName, manifest);
  }

  return convertUntaggedElement($, element, manifest);
}

export function convertHtmlToJsx(
  html: string,
  manifest: Manifest,
): { jsx: string } {
  const $ = cheerio.load(`<div id="__cp_root__">${html}</div>`, { xml: false });
  const jsxParts: string[] = [];

  $("#__cp_root__")
    .contents()
    .toArray()
    .forEach((node) => {
      jsxParts.push(convertNode($, node, manifest));
    });

  return { jsx: jsxParts.join("\n") };
}
