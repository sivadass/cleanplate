import manifestJson from "./component-manifest.json";

export type PropDef = {
  type: "string" | "boolean" | "enum" | "number";
  values?: string[];
  default?: unknown;
};

export type ComponentManifest = {
  exportName: string;
  tier: 1 | 2 | 3 | 4;
  props: Record<string, PropDef>;
  slots?: string[];
  recipes?: string[];
};

export type Manifest = {
  components: Record<string, ComponentManifest>;
};

const manifest = manifestJson as Manifest;

export function loadManifest(): Manifest {
  return manifest;
}

export function docsPathForComponent(componentName: string): string {
  const base = componentName.includes(".")
    ? componentName.split(".")[0]!
    : componentName;
  return `docs/${base}.md`;
}
