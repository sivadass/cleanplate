import { isValidElement } from "react";

export function emitDataCp(
  enabled: boolean,
  component: string,
  props: Record<string, unknown>,
  defaults: Record<string, unknown>,
): Record<string, string> {
  if (!enabled) return {};
  const out: Record<string, string> = { "data-cp": component };
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === "function") continue;
    if (key === "children" || key === "className" || key === "style") continue;
    if (value === undefined || value === defaults[key]) continue;
    if (isValidElement(value)) continue;
    const attr =
      "data-cp-" + key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
    if (typeof value === "boolean") {
      if (value) out[attr] = "true";
      continue;
    }
    if (typeof value === "string" || typeof value === "number") {
      out[attr] = String(value);
    }
  }
  return out;
}
