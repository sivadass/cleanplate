export function expectPublicClass(el: Element, publicName: string) {
  if (!el.classList.contains(publicName)) {
    throw new Error(
      `expected class ${publicName}, got ${el.className}`,
    );
  }
}
