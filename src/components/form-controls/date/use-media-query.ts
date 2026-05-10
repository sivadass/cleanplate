import { useEffect, useState } from "react";

export function useMediaQuery(matchesQuery: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return false;
    }
    return window.matchMedia(matchesQuery).matches;
  });

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }
    const mq = window.matchMedia(matchesQuery);
    const listener = (): void => {
      setMatches(mq.matches);
    };
    listener();
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [matchesQuery]);

  return matches;
}
