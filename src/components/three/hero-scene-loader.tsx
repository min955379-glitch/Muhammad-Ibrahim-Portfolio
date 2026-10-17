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
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute left-1/2 top-1/2 h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, rgba(99,102,241,0.55), rgba(168,85,247,0.34) 42%, rgba(56,189,248,0.18) 62%, transparent 74%)",
          filter: "blur(14px)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[min(42vw,300px)] w-[min(42vw,300px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--glass-border-strong)]"
        style={{
          background:
            "conic-gradient(from 140deg, rgba(99,102,241,0.32), rgba(168,85,247,0.24), rgba(56,189,248,0.18), rgba(99,102,241,0.32))",
        }}
      />
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

  if (skip) return <ScenePoster />;
  return <HeroScene />;
}
