export const getInitials = (fullName = "") => {
  const initial = fullName?.[0] || "";
  return initial.toUpperCase();
};

export const getSpacingClass = (marginConfig, styleObject, prefix) => {
  if (typeof marginConfig === "string") {
    return `${prefix}-${marginConfig}`;
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
