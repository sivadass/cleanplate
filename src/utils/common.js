export const getInitials = (fullName = "") => {
  const initial = fullName?.[0] || "";
  return initial.toUpperCase();
};
