"use client";

import { motion } from "framer-motion";
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
      className="relative h-32 w-32 select-none sm:h-40 sm:w-40"
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
          { t: "rotateX(0deg) translateZ(58px)" },
          { t: "rotateX(0deg) rotateY(180deg) translateZ(58px)" },
          { t: "rotateY(90deg) translateZ(58px)" },
          { t: "rotateY(-90deg) translateZ(58px)" },
          { t: "rotateX(90deg) translateZ(58px)" },
          { t: "rotateX(-90deg) translateZ(58px)" },
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
      <span className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-[10px] tracking-[0.2em] text-[var(--text-3)]">
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
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-14 pt-[calc(var(--header-h)+26px)]"
    >
      {/* Gradient mesh + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div
          className="absolute -left-[18%] top-[-12%] h-[52vw] w-[52vw] max-h-[620px] max-w-[620px] rounded-full opacity-55 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.55), transparent 68%)",
            animation: "var(--animate-mesh)",
          }}
        />
        <div
          className="absolute -right-[14%] top-[4%] h-[46vw] w-[46vw] max-h-[560px] max-w-[560px] rounded-full opacity-45 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.5), transparent 68%)",
            animation: "var(--animate-mesh)",
            animationDelay: "-7s",
          }}
        />
        <div
          className="absolute bottom-[-20%] left-[28%] h-[40vw] w-[40vw] max-h-[480px] max-w-[480px] rounded-full opacity-40 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.45), transparent 68%)",
            animation: "var(--animate-mesh)",
            animationDelay: "-13s",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </div>

      {/* 3D scene */}
      <HeroSceneLoader />

      <div className="section-shell relative w-full">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3.5 py-1.5"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--sky)" }}
              />
              <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-[var(--text-2)]">
                {dict.hero.badge.toUpperCase()}
              </span>
            </motion.div>

            <SplitText
              text={dict.hero.title}
              delay={0.18}
              className="mt-5 text-[clamp(2rem,8.5vw,3.5rem)] font-bold leading-[1.04] text-[var(--text)]"
            />

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--text-2)] sm:text-[17px]"
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
                  className="btn btn-primary w-full text-[15px] sm:w-auto"
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
                  className="btn btn-download w-full text-[15px] sm:w-auto"
                >
                  {dict.hero.ctaDownload}
                  <span aria-hidden>↓</span>
                </a>
              </Magnetic>

              <Magnetic className="w-full sm:w-auto">
                <a
                  href="#arcade"
                  className="btn btn-ghost w-full text-[15px] sm:w-auto"
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
              className="mt-8 flex flex-wrap gap-2"
            >
              {techChips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1.5 font-mono text-[11px] text-[var(--text-2)]"
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
            className="order-1 lg:order-2"
          >
            <div className="glass relative overflow-hidden rounded-[26px] p-5 shadow-[var(--shadow-lg)] sm:p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-40 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(99,102,241,0.6), transparent 70%)",
                }}
              />
              <div className="relative flex items-start gap-4">
                <div className="shrink-0">
                  <DraggableMesh />
                </div>
                <div className="min-w-0">
                  <p className="eyebrow text-[var(--sky)]">Product Engineer</p>
                  <h2 className="mt-1.5 font-display text-[22px] font-bold leading-tight text-[var(--text)] sm:text-[26px]">
                    Muhammad Ibrahim
                  </h2>
                  <p className="mt-1 font-mono text-[11px] tracking-[0.14em] text-[var(--text-3)]">
                    3D PYTHON · 60 FPS
                  </p>
                  <p className="mt-3 text-[12px] leading-relaxed text-[var(--text-2)]">
                    {isTouch
                      ? "Drag to rotate 3D mesh"
                      : "Move cursor to rotate 3D mesh"}
                  </p>
                </div>
              </div>

              <div className="relative mt-5 grid grid-cols-2 gap-2 border-t border-[var(--glass-border)] pt-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2.5"
                  >
                    <p
                      className="font-display text-[20px] font-bold leading-none"
                      style={{
                        color:
                          stat.accent === "indigo"
                            ? "var(--indigo)"
                            : stat.accent === "violet"
                              ? "var(--violet)"
                              : stat.accent === "sky"
                                ? "var(--sky)"
                                : "var(--rose)",
                      }}
                    >
                      <Counter value={stat.value} />
                    </p>
                    <p className="mt-1.5 text-[11px] leading-tight text-[var(--text-3)]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-[var(--glass-border)] pt-4">
                <div>
                  <p className="eyebrow text-[var(--text-3)]">Local time (PKT)</p>
                  <p className="mt-1 font-mono text-[15px] tnum text-[var(--text)]">
                    {clock.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="eyebrow text-[var(--text-3)]">Based in</p>
                  <p className="mt-1 text-[13px] text-[var(--text-2)]">
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
            "mt-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[var(--text-3)] transition-colors hover:text-[var(--sky)]",
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
