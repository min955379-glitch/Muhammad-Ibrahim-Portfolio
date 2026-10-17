"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "@/hooks/use-media-query";
import { useApp } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

/**
 * Magnetic hover effect — the element leans towards the cursor.
 * Only active for precise pointers and when motion is allowed.
 */
export function Magnetic({
  children,
  className,
  strength = 0.32,
}: MagneticProps) {
  const finePointer = useFinePointer();
  const { reduceMotion } = useApp();
  const enabled = finePointer && !reduceMotion;
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * 34 * strength);
    y.set(relY * 26 * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={enabled ? { x, y } : undefined}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}
