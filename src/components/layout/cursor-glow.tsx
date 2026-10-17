"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "@/hooks/use-media-query";
import { useApp } from "@/components/providers/app-providers";

/**
 * Cursor spotlight — desktop / fine-pointer devices only.
 * A soft brand-tinted glow that trails the pointer.
 */
export function CursorGlow() {
  const finePointer = useFinePointer();
  const { reduceMotion } = useApp();
  const enabled = finePointer && !reduceMotion;
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(useMotionValue(-200), {
    stiffness: 140,
    damping: 24,
    mass: 0.5,
  });
  const y = useSpring(useMotionValue(-200), {
    stiffness: 140,
    damping: 24,
    mass: 0.5,
  });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX - 180);
      y.set(event.clientY - 180);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[360px] w-[360px] rounded-full opacity-60 mix-blend-screen"
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.20) 0%, rgba(168,85,247,0.12) 38%, rgba(56,189,248,0.05) 58%, transparent 72%)",
        }}
      />
    </motion.div>
  );
}
