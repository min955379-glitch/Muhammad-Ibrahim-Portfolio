"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { shouldSkip3D } from "@/components/three/quality";
import { useApp } from "@/components/providers/app-providers";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => <ScenePoster />,
});

/**
 * Static, zero-cost poster used while the WebGL bundle streams in — and
 * permanently on low-power devices, data-saver mode and reduced-motion.
 */
export function ScenePoster() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#04060E]">
      {/* Static wireframe torus: inexpensive accent for data-saver / low-power devices. */}
      <svg
        className="absolute right-[-5%] top-[58%] h-[min(45vw,220px)] w-[min(45vw,220px)] opacity-80 md:right-[5%] md:top-[45%] md:h-[300px] md:w-[300px]"
        viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="poster-glow"><stop stopColor="#6366F1" stopOpacity=".22"/><stop offset="1" stopColor="#6366F1" stopOpacity="0"/></radialGradient>
          <linearGradient id="poster-line" x1="20" y1="30" x2="210" y2="190"><stop stopColor="#6366F1"/><stop offset=".55" stopColor="#A855F7"/><stop offset="1" stopColor="#38BDF8"/></linearGradient>
        </defs>
        <circle cx="110" cy="110" r="105" fill="url(#poster-glow)" />
        <g stroke="url(#poster-line)" strokeWidth="1.4" opacity=".78">
          <ellipse cx="110" cy="110" rx="89" ry="35" transform="rotate(-28 110 110)" />
          <ellipse cx="110" cy="110" rx="89" ry="35" transform="rotate(28 110 110)" />
          <ellipse cx="110" cy="110" rx="89" ry="35" transform="rotate(88 110 110)" />
          <ellipse cx="110" cy="110" rx="68" ry="25" transform="rotate(-28 110 110)" opacity=".7" />
          <ellipse cx="110" cy="110" rx="68" ry="25" transform="rotate(28 110 110)" opacity=".7" />
          <ellipse cx="110" cy="110" rx="68" ry="25" transform="rotate(88 110 110)" opacity=".7" />
        </g>
      </svg>
    </div>
  );
}

export function HeroSceneLoader() {
  const { reduceMotion } = useApp();
  const [skip, setSkip] = useState(true);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSkip(shouldSkip3D() || reduceMotion);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  return <><ScenePoster />{!skip && <HeroScene />}</>;
}
