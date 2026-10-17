"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type PhoneScreen = {
  id: string;
  label: string;
  image: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * CSS-3D phone frame with a swipeable screen switcher. Uses the real
 * application screenshots, rendered with next/image so there is no
 * layout shift.
 */
export function PhoneMockup({
  screens,
  className,
  accent = "var(--indigo)",
}: {
  screens: PhoneScreen[];
  className?: string;
  accent?: string;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const dragStart = useRef<number | null>(null);

  const current = screens[Math.min(index, screens.length - 1)];

  function go(next: number) {
    const clamped = Math.max(0, Math.min(screens.length - 1, next));
    setDirection(clamped >= index ? 1 : -1);
    setIndex(clamped);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        className="relative mx-auto w-full max-w-[280px]"
        style={{ perspective: "1200px" }}
        onPointerDown={(event) => {
          dragStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (dragStart.current === null) return;
          const delta = event.clientX - dragStart.current;
          dragStart.current = null;
          if (delta < -40) go(index + 1);
          else if (delta > 40) go(index - 1);
        }}
      >
        <motion.div
          animate={{ rotateY: -12, rotateX: 6 }}
          whileHover={{ rotateY: -6, rotateX: 3 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="relative aspect-[260/534] w-full rounded-[38px] p-[10px] shadow-[var(--shadow-lg)]"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.12))",
            border: "1px solid var(--glass-border-strong)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-[#05070f]">
            {/* status bar */}
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-3 font-mono text-[9px] text-white/70">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: direction * 44 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -44 }}
                transition={{ duration: 0.36, ease: EASE }}
                className="h-full w-full"
              >
                <Image
                  src={current.image}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  sizes="(max-width: 768px) 260px, 280px"
                  className="h-full w-full object-cover object-top"
                />
              </motion.div>
            </AnimatePresence>

            {/* notch */}
            <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black/85" />
          </div>
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-[38px] opacity-60 blur-2xl"
          style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)` }}
        />
      </div>

      {/* switcher */}
      <div className="flex flex-col items-center gap-3">
        <div className="no-scrollbar flex w-full max-w-[320px] gap-1.5 overflow-x-auto">
          {screens.map((screen, screenIndex) => (
            <button
              key={screen.id}
              type="button"
              onClick={() => go(screenIndex)}
              aria-pressed={screenIndex === index}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] transition-colors",
                screenIndex === index
                  ? "border-transparent text-white"
                  : "border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-3)] hover:text-[var(--text)]",
              )}
              style={
                screenIndex === index
                  ? { background: "var(--brand-grad)" }
                  : undefined
              }
            >
              {screen.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous screen"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-2)] transition-colors hover:text-[var(--text)] disabled:opacity-35"
          >
            ←
          </button>
          <span className="font-mono text-[11px] tnum text-[var(--text-3)]">
            {index + 1} / {screens.length}
          </span>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === screens.length - 1}
            aria-label="Next screen"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-2)] transition-colors hover:text-[var(--text)] disabled:opacity-35"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
