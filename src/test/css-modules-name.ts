/** Post–Task 12: public class names are unhashed `[local]` values. */
export function cssModulesScopedName(local: string, _filename?: string): string {
  return local;
}

/** Detect accidental CSS-module hash suffixes (must include a digit in the 5-char tail). */
export const HASHED_CLASS_RE =
  /(^|[,{\s])\.((?:[a-z][\w-]*))-(?=[a-z0-9]*\d)[a-z0-9]{5}(?=[^\w-]|$)/i;
