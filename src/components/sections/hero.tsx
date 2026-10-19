"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { HeroSceneLoader } from "@/components/three/hero-scene-loader";
import { SplitText } from "@/components/ui/split-text";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic-button";
import { useApp } from "@/components/providers/app-providers";
import { useIsTouch } from "@/hooks/use-media-query";
import { usePktClock } from "@/hooks/use-pkt-clock";
import { getDictionary } from "@/lib/i18n";
import { heroStats, techChips } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Lightweight CSS-3D wireframe object. Drag / swipe rotates it — no GPU
 * cost, works with touch, mouse and keyboard.
 */
function DraggableMesh() {
  const [rotation, setRotation] = useState({ x: -18, y: 24 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const isTouch = useIsTouch();

  return (
    <div
      className="relative isolate h-12 w-12 shrink-0 select-none overflow-hidden rounded-xl sm:h-16 sm:w-16"
      style={{ perspective: "700px" }}
      onPointerDown={(event) => {
        dragging.current = true;
        last.current = { x: event.clientX, y: event.clientY };
        (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return;
        const dx = event.clientX - last.current.x;
        const dy = event.clientY - last.current.y;
        last.current = { x: event.clientX, y: event.clientY };
        setRotation((r) => ({
          x: Math.max(-70, Math.min(70, r.x - dy * 0.6)),
          y: (r.y + dx * 0.7) % 360,
        }));
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      role="img"
      aria-label="Interactive wireframe mesh"
    >
      <motion.div
        animate={{ rotateX: rotation.x, rotateY: rotation.y }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {[
          { t: "rotateX(0deg) translateZ(17px)" },
          { t: "rotateX(0deg) rotateY(180deg) translateZ(17px)" },
          { t: "rotateY(90deg) translateZ(17px)" },
          { t: "rotateY(-90deg) translateZ(17px)" },
          { t: "rotateX(90deg) translateZ(17px)" },
          { t: "rotateX(-90deg) translateZ(17px)" },
        ].map((face, index) => (
          <span
            key={index}
            aria-hidden
            className="absolute inset-0 rounded-2xl border border-[var(--glass-border-strong)]"
            style={{
              transform: face.t,
              background:
                index % 2 === 0
                  ? "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(56,189,248,0.05))"
                  : "linear-gradient(135deg, rgba(168,85,247,0.10), rgba(99,102,241,0.05))",
            }}
          />
        ))}
      </motion.div>
      <span className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-[9px] tracking-[0.04em] text-[var(--text-muted)]">
        60 FPS
      </span>
    </div>
  );
}

export function Hero() {
  const { locale } = useApp();
  const dict = getDictionary(locale);
  const isTouch = useIsTouch();
  const clock = usePktClock();

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[calc(100svh-var(--header-h))] items-center overflow-hidden pb-32 pt-9 md:pb-20 md:pt-16"
    >
      {/* Restrained dark grid and scrim: the 3D object stays behind the content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="grid-bg absolute inset-0 opacity-15" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,14,0.35)_0%,rgba(4,6,14,0.78)_55%,#04060E_100%)]" />
      </div>

      {/* 3D scene */}
      <HeroSceneLoader />

      <div className="section-shell relative z-10 w-full">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          {/* Copy */}
          <div className="relative min-w-0 order-1 lg:order-1">
            <div aria-hidden className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_35%_35%,rgba(4,6,14,.96),rgba(4,6,14,.38)_70%,transparent)]" />
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] px-3.5 py-1.5"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--sky)" }}
              />
              <span className="font-mono text-[11px] font-semibold tracking-[0.08em] text-[var(--text-secondary)]">
                {dict.hero.badge.toUpperCase()}
              </span>
            </motion.div>

            <SplitText
              text={dict.hero.title}
              delay={0.18}
              className="mt-5 text-[clamp(2rem,8.5vw,3rem)] font-bold leading-[1.1] text-[var(--text-primary)]"
            />

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
              className="mt-5 max-w-prose text-base leading-relaxed text-[var(--text-secondary)] sm:text-[17px]"
            >
              {dict.hero.subtitle}
            </motion.p>

            {/* CTAs — identical height & radius, full width on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.58 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Magnetic className="w-full sm:w-auto">
                <a
                  href="#live-sites"
                  className="btn btn-primary h-[52px] w-full text-[15px] sm:w-auto"
                >
                  {dict.hero.ctaPrimary}
                  <span aria-hidden>↗</span>
                </a>
              </Magnetic>

              <Magnetic className="w-full sm:w-auto">
                <a
                  href={siteConfig.apkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn btn-download h-[52px] w-full text-[15px] sm:w-auto"
                >
                  {dict.hero.ctaDownload}
                  <span aria-hidden>↓</span>
                </a>
              </Magnetic>

              <Magnetic className="w-full sm:w-auto">
                <a
                  href="#arcade"
                  className="btn btn-ghost h-[52px] w-full text-[15px] sm:w-auto"
                >
                  {dict.hero.ctaArcade}
                  <span aria-hidden>↗</span>
                </a>
              </Magnetic>
            </motion.div>

            {/* Tech chips */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
            >
              {techChips.map((chip) => (
                <li
                  key={chip}
                  className="shrink-0 snap-start whitespace-nowrap rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] px-3 py-1.5 font-mono text-xs text-[var(--text-secondary)]"
                >
                  {chip}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Identity card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            className="min-w-0 order-2 lg:order-2"
          >
            <div className="glass-strong relative isolate overflow-hidden rounded-[22px] p-4 shadow-[var(--shadow-lg)] sm:p-6">
              <div className="relative z-10 grid grid-cols-[68px_minmax(0,1fr)_52px] items-center gap-2 sm:grid-cols-[88px_minmax(0,1fr)_68px] sm:gap-4">
                <Image
                  src="/images/profile.webp"
                  width={88}
                  height={88}
                  sizes="(max-width: 640px) 68px, 88px"
                  alt="Muhammad Ibrahim personal brand emblem"
                  className="h-[68px] w-[68px] rounded-xl border border-[var(--glass-border)] object-cover sm:h-[88px] sm:w-[88px]"
                  priority
                />
                <div className="min-w-0">
                  <p className="eyebrow text-[var(--sky)]">Product Engineer</p>
                  <h2 className="mt-1.5 font-display text-[19px] font-bold leading-tight text-[var(--text-primary)] sm:text-[26px]">
                    Muhammad Ibrahim
                  </h2>
                  <p className="mt-1 font-mono text-xs tracking-[0.04em] text-[var(--text-secondary)]">
                    3D PYTHON · 60 FPS
                  </p>
                </div>
                <DraggableMesh />
              </div>
              <p className="relative z-10 mt-3 text-xs text-[var(--text-secondary)]">
                {isTouch ? "Drag to rotate 3D mesh" : "Move cursor to rotate 3D mesh"}
              </p>

              <div className="relative mt-5 grid grid-cols-2 gap-2 border-t border-[var(--glass-border)] pt-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] px-3 py-2.5"
                  >
                    <p
                      className="font-display text-[20px] font-bold leading-none"
                      style={{ color: "#FFFFFF" }}
                    >
                      <Counter value={stat.value} />
                    </p>
                    <p className="mt-1.5 text-xs leading-tight text-[var(--text-secondary)]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-[var(--glass-border)] pt-4">
                <div>
                  <p className="eyebrow text-[var(--text-muted)]">Local time (PKT)</p>
                  <p className="mt-1 font-mono text-[15px] tnum text-[var(--text)]">
                    {clock.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="eyebrow text-[var(--text-muted)]">Based in</p>
                  <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
                    {siteConfig.locationShort}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.a
          href="#live-sites"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className={cn(
            "mt-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.10em] text-[var(--text-muted)] transition-colors hover:text-[var(--sky)]",
          )}
        >
          <span
            aria-hidden
            className="h-8 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--sky), transparent)",
            }}
          />
          {dict.hero.scrollHint.toUpperCase()}
        </motion.a>
      </div>
    </section>
  );
}
