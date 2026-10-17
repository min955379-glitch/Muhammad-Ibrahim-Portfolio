"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const PRELOAD_ASSETS = [
  "/images/profile.webp",
  "/images/dailymb-answers.webp",
  "/images/maths-dashboard.webp",
  "/images/ep-mobile-home.webp",
];

const MIN_DURATION = 520;
const MAX_DURATION = 1900;

/**
 * Cinematic preloader — the monogram is drawn with SVG path animation
 * while a counter tracks real asset progress. Hard capped below 2s.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let settled = 0;
    const startedAt = performance.now();
    let finished = false;

    const bump = () => {
      settled += 1;
      setProgress(Math.round((settled / PRELOAD_ASSETS.length) * 100));
    };

    const images = PRELOAD_ASSETS.map((src) => {
      const image = new Image();
      image.onload = bump;
      image.onerror = bump;
      image.src = src;
      return image;
    });

    const interval = window.setInterval(() => {
      setProgress((value) => (value >= 99 ? 99 : value + 1));
    }, 40);

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearInterval(interval);
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      window.setTimeout(() => {
        setProgress(100);
        window.setTimeout(() => setDone(true), 260);
      }, remaining);
    };

    // Hard cap so the experience never waits longer than ~2s.
    const cap = window.setTimeout(finish, MAX_DURATION);

    const allLoaded = window.setTimeout(() => {
      if (settled >= PRELOAD_ASSETS.length) finish();
    }, 1200);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(cap);
      window.clearTimeout(allLoaded);
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, []);

  useEffect(() => {
    if (done) {
      document.body.style.overflow = "";
    }
  }, [done]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="fixed inset-0 z-[200] grid place-items-center bg-[var(--bg-deep)]"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-6">
            <svg width="84" height="84" viewBox="0 0 64 64" fill="none">
              <defs>
                <linearGradient id="preloader-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="50%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
              <motion.rect
                x="2"
                y="2"
                width="60"
                height="60"
                rx="16"
                stroke="url(#preloader-grad)"
                strokeWidth="2.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: EASE }}
              />
              <motion.path
                d="M17 47V17h6.2l8.8 13.4L40.8 17H47v30h-6.2V28.6L32 42 23.2 28.6V47H17Z"
                fill="url(#preloader-grad)"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
              />
            </svg>

            <div className="flex w-[220px] flex-col gap-2">
              <div
                className="h-[3px] w-full overflow-hidden rounded-full"
                style={{ background: "var(--glass-strong)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--brand-grad)" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "linear" }}
                />
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-[var(--text-3)]">
                <span>LOADING</span>
                <span className="tnum text-[var(--text-2)]">
                  {String(progress).padStart(3, "0")}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
