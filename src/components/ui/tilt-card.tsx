"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/hooks/use-media-query";
import { useApp } from "@/components/providers/app-providers";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  glare?: boolean;
  lift?: number;
};

/**
 * 3D tilt + specular glare card. Spring driven, disabled on coarse
 * pointers and when the user asked for reduced motion.
 */
export function TiltCard({
  children,
  className,
  max = 9,
  glare = true,
  lift = 16,
}: TiltCardProps) {
  const finePointer = useFinePointer();
  const { reduceMotion } = useApp();
  const enabled = finePointer && !reduceMotion;

  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), {
    stiffness: 220,
    damping: 24,
    mass: 0.6,
  });
  const rotateY = useSpring(useMotionValue(0), {
    stiffness: 220,
    damping: 24,
    mass: 0.6,
  });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22), rgba(255,255,255,0) 58%)`;

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * max * 2);
    rotateX.set(-(py - 0.5) * max * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        enabled
          ? { rotateX, rotateY, transformPerspective: 1100 }
          : undefined
      }
      className={cn("tilt-card relative", className)}
    >
      {children}
      {glare && enabled ? (
        <motion.span
          aria-hidden
          style={{ backgroundImage: glareBackground }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : null}
      {enabled ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[0_28px_60px_-30px_rgba(99,102,241,0.6)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : null}
      <span className="sr-only">{lift}</span>
    </motion.div>
  );
}
