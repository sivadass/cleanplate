const HASH_LEN = 5;

/** Stable for a given (local, file). Used by Vite + Rollup until unhash. */
export function cssModulesScopedName(local: string, filename: string): string {
  if (process.env.CP_PUBLIC_CSS === "1") {
    return local;
  }
  let hash = 0;
  const key = `${filename}:${local}`;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  const token = hash.toString(36).slice(0, HASH_LEN).padEnd(HASH_LEN, "0");
  return `${local}-${token}`;
}

export const HASHED_CLASS_RE =
  /(^|[,{\s])\.((?:[a-z][\w-]*))-[a-z0-9]{5}(?=[^\w-]|$)/i;
