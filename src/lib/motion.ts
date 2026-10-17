import type { Variants } from "framer-motion";

/** Shared easing — matches the CSS cubic-bezier(0.22, 1, 0.36, 1). */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE, delay: i * 0.07 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.06 },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE, delay: i * 0.06 },
  }),
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "110%", rotateX: -55 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: { duration: 0.85, ease: EASE, delay: i * 0.075 },
  }),
};

export const lineReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.1 },
  }),
};

export const viewportOnce = { once: true, amount: 0.25 } as const;
export const viewportOnceSoft = { once: true, amount: 0.1 } as const;
