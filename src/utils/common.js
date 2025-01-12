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

export const getUniqueId = () => {
  let dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const getVariantIcon = (variant) => {
  let iconName = "";
  switch (variant) {
    case "error":
      iconName = "error";
      break;
    case "warning":
      iconName = "warning";
      break;
    case "success":
      iconName = "check_circle";
      break;
    default:
      iconName = "info";
  }
  return iconName;
};

import { useEffect, useState } from "react";

export const useIntersectionObserver = (options) => {
  const [ref, setRef] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref) observer.observe(ref);
    return () => ref && observer.disconnect();
  }, [ref, options]);

  return [setRef, isIntersecting];
};

export default useIntersectionObserver;
