import { useEffect, useState } from "react";

export const getInitials = (name = "") => {
  // Get the first letter of each word in the name and join them together upto 2 letters
  const initials = name.split(" ").map((word) => word[0]).join("").toUpperCase();
  return initials.substring(0, 2);
};

const PREFIXED = /^(m|p|g)-/;

export const getSpacingClass = (marginConfig, styleObject, prefix) => {
  const one = (value) => {
    if (typeof value !== "string" || value.length === 0) return "";
    if (PREFIXED.test(value)) {
      if (process.env.NODE_ENV !== "production") {
        throw new Error(
          `Spacing value "${value}" includes the ${prefix}- prefix. Use suffix-only (e.g. "0", "b-2").`,
        );
      }
      return "";
    }
    const key = `${prefix}-${value}`;
    return styleObject[key] ?? "";
  };
  if (typeof marginConfig === "string") return one(marginConfig);
  if (Array.isArray(marginConfig)) {
    return marginConfig.map(one).filter(Boolean).join(" ");
  }
  return "";
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

export const isNotEmptyObject = (obj) => {
  return obj && typeof obj === "object" && Object.keys(obj).length > 0;
};

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
