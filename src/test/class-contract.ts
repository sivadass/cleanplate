export function expectPublicClass(el: Element, publicName: string) {
  const ok = [...el.classList].some((c) => {
    if (c === publicName || c.startsWith(`${publicName}-`)) return true;
    // Vite/Rollup CSS modules: _local_hash
    const local = c.replace(/^_/, "").split("_")[0];
    return local === publicName || local.startsWith(`${publicName}-`);
  });
  if (!ok) {
    throw new Error(
      `expected class ${publicName} (or hashed), got ${el.className}`,
    );
  }
}
