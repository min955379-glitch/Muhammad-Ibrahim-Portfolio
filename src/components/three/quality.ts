"use client";

export type QualityTier = "low" | "medium" | "high";

export type QualityProfile = {
  tier: QualityTier;
  dpr: [number, number];
  particles: number;
  enableDof: boolean;
  enableBloom: boolean;
  enableDistortion: boolean;
  antialias: boolean;
  starCount: number;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/**
 * Decides the rendering budget before the 3D bundle is even loaded.
 * Low-power devices, data-saver mode and reduced-motion users never
 * download the WebGL bundle at all.
 */
export function detectQuality(): QualityProfile {
  if (typeof window === "undefined") {
    return {
      tier: "medium",
      dpr: [1, 1.5],
      particles: 900,
      enableDof: false,
      enableBloom: true,
      enableDistortion: true,
      antialias: true,
      starCount: 700,
    };
  }

  const nav = navigator as NavigatorWithHints;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const saveData = Boolean(nav.connection?.saveData);
  const effectiveType = nav.connection?.effectiveType ?? "4g";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const memory = nav.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const smallViewport = window.innerWidth < 768;

  if (reducedMotion || saveData || effectiveType === "2g" || memory <= 2) {
    return {
      tier: "low",
      dpr: [1, 1],
      particles: 0,
      enableDof: false,
      enableBloom: false,
      enableDistortion: false,
      antialias: false,
      starCount: 0,
    };
  }

  if (coarse || smallViewport || memory <= 4 || cores <= 4) {
    return {
      tier: "medium",
      dpr: [1, 1.25],
      particles: 420,
      enableDof: false,
      enableBloom: true,
      enableDistortion: true,
      antialias: false,
      starCount: 380,
    };
  }

  return {
    tier: "high",
    dpr: [1, 1.5],
    particles: 900,
    enableDof: true,
    enableBloom: true,
    enableDistortion: true,
    antialias: true,
    starCount: 800,
  };
}

export function shouldSkip3D() {
  if (typeof window === "undefined") return true;
  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData || (nav.deviceMemory ?? 8) <= 4) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}
