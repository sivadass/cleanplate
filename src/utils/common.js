export const getInitials = (fullName = "") => {
  const [firstName, secondName] = fullName.split(" ");
  let initials = "";
  if (!secondName) {
    initials = firstName?.[0] || "";
  } else if (!firstName && !secondName) {
    initials = "";
  } else {
    initials = `${firstName?.[0] || ""}${secondName?.[0] || ""}`;
  }
  return initials.toUpperCase();
};
