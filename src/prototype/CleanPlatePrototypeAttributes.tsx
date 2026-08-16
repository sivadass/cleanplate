import React from "react";

const Ctx = React.createContext(false);

export function CleanPlatePrototypeAttributes({
  enabled = true,
  children,
}: {
  enabled?: boolean;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={enabled}>{children}</Ctx.Provider>;
}

export function usePrototypeAttributes() {
  return React.useContext(Ctx);
}
