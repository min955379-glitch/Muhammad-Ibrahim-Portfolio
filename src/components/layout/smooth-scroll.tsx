"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/components/providers/app-providers";
import { useFinePointer } from "@/hooks/use-media-query";

/**
 * Lenis smooth scrolling wired into the GSAP ticker so ScrollTrigger
 * stays perfectly in sync. Disabled for coarse pointers and whenever the
 * user asks for reduced motion.
 */
export function SmoothScroll() {
  const { reduceMotion } = useApp();
  const finePointer = useFinePointer();

  useEffect(() => {
    if (reduceMotion || !finePointer) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Re-measure after fonts / images settle.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 900);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      window.clearTimeout(refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduceMotion, finePointer]);

  return null;
}
