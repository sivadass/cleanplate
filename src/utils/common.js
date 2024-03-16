export const getInitials = (fullName = "") => {
  const initial = fullName?.[0] || "";
  return initial.toUpperCase();
};

export const getSpacingClass = (marginConfig, styleObject, prefix) => {
  if (typeof marginConfig === "string") {
    const prefixedClass = `${prefix}-${marginConfig}`;
    return styleObject[prefixedClass];
  }
  if (Array.isArray(marginConfig)) {
    return marginConfig
      .map((mConfig) => {
        const prefixedClass = `${prefix}-${mConfig}`;
        return styleObject[prefixedClass];
      })
      .join(" ");
  }
  return "m-0";
};
