"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * DailyMB screens are reproduced from the app's own dark-mode snapshot
 * and screen sources (DailyMB repository). The original build used a
 * teal palette; this portfolio re-tints those surfaces to the brand
 * ramp because green is not used anywhere on this site.
 * ------------------------------------------------------------------ */

type ScreenId = "answers" | "streak" | "settings";

function DailyMbAnswers() {
  return (
    <div className="flex h-full flex-col gap-2.5 p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.16em] text-[var(--text-3)]">
          ANSWERS
        </span>
        <span className="flex items-center gap-1 rounded-full border border-[var(--sky)] bg-[var(--sky-soft)] px-2 py-0.5 font-mono text-[8px] tracking-[0.1em] text-[var(--sky)]">
          ● VERIFIED
        </span>
      </div>

      <div className="rounded-[14px] border border-[var(--glass-border)] bg-[var(--surface-2)] p-3">
        <p className="text-[10px] leading-relaxed text-[var(--text-2)]">
          <span className="font-semibold text-[var(--text-3)]">Question 1: </span>
          She is taller ___ her sister.
        </p>
        <p className="mt-1 text-[11px] font-bold text-[var(--sky)]">
          Answer: <span className="text-[var(--text)]">than</span>
        </p>
      </div>

      <div className="rounded-[14px] border border-[var(--glass-border)] bg-[var(--surface-2)] p-3">
        <p className="text-[10px] leading-relaxed text-[var(--text-2)]">
          <span className="font-semibold text-[var(--text-3)]">Question 2: </span>
          He ___ here yesterday.
        </p>
        <p className="mt-1 text-[11px] font-bold text-[var(--sky)]">
          Answer: <span className="text-[var(--text)]">came</span>
        </p>
        <p className="mt-1.5 text-[9.5px] leading-relaxed text-[var(--rose)]">
          Sources disagree. Candidates: came / come
        </p>
        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-[var(--amber)] bg-[var(--amber-soft)] px-2 py-0.5 font-mono text-[8px] tracking-[0.1em] text-[var(--amber)]">
          △ UNCERTAIN
        </span>
      </div>

      <div className="mt-auto flex items-center gap-2">
        <span className="rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-2.5 py-1 font-mono text-[8px] text-[var(--text-2)]">
          Short
        </span>
        <span
          className="rounded-full px-2.5 py-1 font-mono text-[8px] text-white"
          style={{ background: "var(--brand-grad)" }}
        >
          Full
        </span>
      </div>
    </div>
  );
}

function DailyMbStreak() {
  const rewards = [25, 50, 80, 100, 125];
  return (
    <div className="flex h-full flex-col gap-2.5 p-3">
      <p className="font-mono text-[9px] tracking-[0.16em] text-[var(--text-3)]">
        STREAK
      </p>
      <div className="rounded-[14px] border border-[var(--glass-border)] bg-[var(--surface-2)] p-3 text-center">
        <p className="text-[20px] font-bold leading-none text-[var(--amber)]">5</p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[var(--text-3)]">
          Day claim cycle
        </p>
      </div>

      <div className="rounded-[12px] border border-[var(--amber)] bg-[var(--amber-soft)] p-2.5">
        <p className="text-[9.5px] leading-relaxed text-[var(--amber)]">
          Not claimed yet — 25 MB
        </p>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {rewards.map((mb, index) => (
          <div
            key={mb}
            className="rounded-[10px] border border-[var(--glass-border)] bg-[var(--surface-2)] p-1.5 text-center"
          >
            <p className="text-[9px] font-bold text-[var(--text)]">{mb}</p>
            <p className="text-[7px] uppercase tracking-[0.1em] text-[var(--text-3)]">
              MB
            </p>
            <p className="text-[7px] text-[var(--text-3)]">Day {index + 1}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 rounded-[12px] border border-[var(--glass-border)] bg-[var(--surface-2)] p-2.5">
        <span
          aria-hidden
          className="h-3.5 w-3.5 shrink-0 rounded-[5px] border"
          style={{ borderColor: "var(--sky)" }}
        />
        <span className="text-[9.5px] text-[var(--text-2)]">Mark claimed</span>
      </div>
    </div>
  );
}

function DailyMbSettings() {
  const presets = ["05:30", "06:00", "06:30", "07:00", "08:00"];
  return (
    <div className="flex h-full flex-col gap-2.5 p-3">
      <p className="font-mono text-[9px] tracking-[0.16em] text-[var(--text-3)]">
        SETTINGS
      </p>
      <div className="rounded-[14px] border border-[var(--glass-border)] bg-[var(--surface-2)] p-3">
        <p className="text-[10px] font-semibold text-[var(--text)]">
          Notification time
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map((preset, index) => (
            <span
              key={preset}
              className={cn(
                "rounded-full border px-2 py-1 font-mono text-[8.5px]",
                index === 1
                  ? "border-transparent bg-[var(--brand-grad)] text-white"
                  : "border-[var(--glass-border)] bg-transparent text-[var(--text-2)]",
              )}
            >
              {preset}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[14px] border border-[var(--glass-border)] bg-[var(--surface-2)] p-3">
        <p className="text-[10px] font-semibold text-[var(--text)]">Mode</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-[var(--glass-border)] px-2 py-1 font-mono text-[8.5px] text-[var(--text-2)]">
            Short
          </span>
          <span
            className="rounded-full border border-transparent bg-[var(--brand-grad)] px-2 py-1 font-mono text-[8.5px] text-white"
          >
            Full
          </span>
        </div>
      </div>

      <p className="mt-auto text-[8.5px] leading-relaxed text-[var(--text-3)]">
        Zero-login, read-only access. Notification presets mirror the three
        daily PKT fetch windows.
      </p>
    </div>
  );
}

const dailyMbScreens: { id: ScreenId; label: string }[] = [
  { id: "answers", label: "Answers" },
  { id: "streak", label: "Streak" },
  { id: "settings", label: "Settings" },
];

function DailyMbPreview() {
  const [active, setActive] = useState<ScreenId>("answers");
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-[260/534] w-[220px] overflow-hidden rounded-[34px] border border-[var(--glass-border-strong)] bg-[#05070f] p-2 shadow-[var(--shadow-lg)] sm:w-[240px]">
        <div className="absolute left-1/2 top-3 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black/85" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="h-full w-full overflow-hidden rounded-[26px] bg-[var(--bg)]"
          >
            {active === "answers" ? (
              <DailyMbAnswers />
            ) : active === "streak" ? (
              <DailyMbStreak />
            ) : (
              <DailyMbSettings />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5">
        {dailyMbScreens.map((screen) => (
          <button
            key={screen.id}
            type="button"
            onClick={() => setActive(screen.id)}
            aria-pressed={active === screen.id}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] transition-colors",
              active === screen.id
                ? "border-transparent bg-[var(--brand-grad)] text-white"
                : "border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-3)] hover:text-[var(--text)]",
            )}
          >
            {screen.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Mental Maths ---------------- */

const mentalMathsScreens = [
  {
    id: "stats",
    label: "Stats",
    image: "/images/mental-maths-dashboard-screen.webp",
    alt: "Mental Maths dark dashboard screen",
    width: 1080,
    height: 2200,
  },
  {
    id: "modes",
    label: "Modes",
    image: "/images/mental-maths-practice-screen.webp",
    alt: "Mental Maths practice screen",
    width: 1080,
    height: 2200,
  },
  {
    id: "coach",
    label: "AI Coach",
    image: "/images/mental-maths-feedback-screen.webp",
    alt: "Mental Maths quiz feedback screen",
    width: 786,
    height: 1600,
  },
  {
    id: "mistakes",
    label: "Mistakes",
    image: "/images/mental-maths-quiz-screen.webp",
    alt: "Mental Maths quiz screen in dark mode",
    width: 786,
    height: 1600,
  },
  {
    id: "weak",
    label: "Weak",
    image: "/images/mental-maths-feedback-screen.webp",
    alt: "Mental Maths feedback screen used for weak-topic review",
    width: 786,
    height: 1600,
  },
  {
    id: "settings",
    label: "Settings",
    image: "/images/mental-maths-settings-screen.webp",
    alt: "Mental Maths settings dropdown in dark mode",
    width: 786,
    height: 1600,
  },
];

const englishScreens = [
  {
    id: "home",
    label: "Home (13 Levels)",
    image: "/images/english-practice-mobile-card.webp",
    alt: "My English Practice mobile dark home screen",
    width: 390,
    height: 1400,
  },
  {
    id: "voice",
    label: "Voice & Theme",
    image: "/images/english-practice-settings-card.webp",
    alt: "My English Practice mobile dark settings screen",
    width: 390,
    height: 1400,
  },
];

function ScreenCard({
  title,
  kicker,
  accent,
  screens,
  links,
  children,
}: {
  title: string;
  kicker: string;
  accent: string;
  screens: {
    id: string;
    label: string;
    image: string;
    alt: string;
    width: number;
    height: number;
  }[];
  links: { label: string; href: string }[];
  children?: React.ReactNode;
}) {
  const [activeId, setActiveId] = useState(screens[0]?.id);
  const active = screens.find((screen) => screen.id === activeId) ?? screens[0];

  return (
    <article className="glass flex flex-col gap-4 rounded-[24px] p-5 sm:p-6">
      <div>
        <p className="eyebrow" style={{ color: accent }}>
          {kicker}
        </p>
        <h3 className="mt-2.5 font-display text-[19px] font-bold leading-tight text-[var(--text)]">
          {title}
        </h3>
      </div>

      <div className="flex flex-1 flex-col items-center gap-4">
        {children ?? (
          <div className="relative aspect-[260/534] w-[200px] overflow-hidden rounded-[30px] border border-[var(--glass-border-strong)] bg-[#05070f] p-[7px] shadow-[var(--shadow-lg)] sm:w-[216px]">
            <div className="absolute left-1/2 top-2.5 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black/85" />
            <div className="h-full w-full overflow-hidden rounded-[24px] bg-[#05070f]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 26 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -26 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="h-full w-full"
                >
                  <Image
                    src={active.image}
                    alt={active.alt}
                    width={active.width}
                    height={active.height}
                    sizes="216px"
                    className="h-full w-full object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-1.5">
          {screens.map((screen) => (
            <button
              key={screen.id}
              type="button"
              onClick={() => setActiveId(screen.id)}
              aria-pressed={screen.id === activeId}
              className={cn(
                "rounded-full border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.08em] transition-colors",
                screen.id === activeId
                  ? "border-transparent text-white"
                  : "border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-3)] hover:text-[var(--text)]",
              )}
              style={
                screen.id === activeId ? { background: accent } : undefined
              }
            >
              {screen.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[var(--glass-border)] pt-4">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex min-h-[42px] items-center rounded-xl px-3.5 text-[12.5px] font-semibold transition-transform hover:-translate-y-0.5",
              link.label.startsWith("Get APK")
                ? "text-white"
                : "border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text)] hover:text-[var(--sky)]",
            )}
            style={
              link.label.startsWith("Get APK")
                ? { background: "var(--download-grad)" }
                : undefined
            }
          >
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}

export function MobileApks() {
  return (
    <Section id="mobile-apks" tone="raised">
      <SectionShell>
        <Reveal>
          <SectionHeading
            index="03 // MOBILE APK LAB (AMBER)"
            label="Mobile APKs"
            title="Android Apps & Dark Screens"
            subtitle="Swipe the screen pills to inspect dark-mode screenshots from DailyMB, Mental Maths Practice, and My English Practice."
            accent="amber"
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <Reveal>
            <ScreenCard
              kicker="App 01 · DailyMB APK"
              title="DailyMB Quiz Helper"
              accent="var(--amber)"
              screens={dailyMbScreens.map((screen) => ({
                id: screen.id,
                label: screen.label,
                image: "/images/dailymb-app-icon.svg",
                alt: "DailyMB Quiz Helper application icon",
                width: 512,
                height: 512,
              }))}
              links={[
                {
                  label: "Get APK ↓",
                  href: "https://github.com/min955379-glitch/DailyMB/releases/download/apk-build/DailyMB.apk",
                },
                {
                  label: "Repo ↗",
                  href: "https://github.com/min955379-glitch/DailyMB",
                },
              ]}
            >
              <DailyMbPreview />
            </ScreenCard>
          </Reveal>

          <Reveal delay={1}>
            <ScreenCard
              kicker="App 02 · Mental Maths"
              title="Mental Maths & AI Coach"
              accent="var(--sky)"
              screens={mentalMathsScreens}
              links={[
                {
                  label: "Get APK ↓",
                  href: "https://github.com/min955379-glitch/DailyMB/releases/download/apk-build/DailyMB.apk",
                },
                {
                  label: "Repo ↗",
                  href: "https://github.com/min955379-glitch/Mental-Maths-Practice-",
                },
              ]}
            />
          </Reveal>

          <Reveal delay={2}>
            <ScreenCard
              kicker="App 03 · PWA Mobile Dark"
              title="My English Practice Mobile"
              accent="var(--violet)"
              screens={englishScreens}
              links={[
                {
                  label: "Live App ↗",
                  href: "https://my-english-practice-three.vercel.app",
                },
                {
                  label: "Repo ↗",
                  href: "https://github.com/min955379-glitch/My-English-Practice",
                },
              ]}
            />
          </Reveal>
        </div>
      </SectionShell>
    </Section>
  );
}
