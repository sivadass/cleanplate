export const getInitials = (name = "") => {
  const initials = name.match(/^(\b\w)/g);
  if (initials) {
    return initials.join("").toUpperCase();
  }
  return ""; // Return null if no initials found
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
