"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** True only for precise pointers (mouse / trackpad). */
export function useFinePointer() {
  return useMediaQuery("(pointer: fine)");
}

export function useIsTouch() {
  return useMediaQuery("(pointer: coarse)");
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

export function useIsLowPower() {
  const saveData = useMediaQuery("(prefers-reduced-data: reduce)");
  const noBattery = useMediaQuery("(update: slow)");
  return saveData || noBattery;
}
