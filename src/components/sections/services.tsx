"use client";

import { motion } from "framer-motion";
import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic-button";
import { useApp } from "@/components/providers/app-providers";
import { getDictionary } from "@/lib/i18n";
import { processSteps, services } from "@/lib/content";
import { EASE, viewportOnce } from "@/lib/motion";
import { useInView } from "@/hooks/use-in-view";

const accentColor = {
  indigo: "var(--indigo)",
  sky: "var(--sky)",
  violet: "var(--violet)",
  rose: "var(--rose)",
} as const;

/** Scroll-triggered SVG path that draws the five-step process line. */
function ProcessTimeline() {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.2,
    once: true,
  });

  return (
    <div ref={ref} className="relative">
      {/* connector line (desktop) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-[26px] hidden h-[40px] w-full lg:block"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="process-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="55%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <path
          d="M60 20 H1140"
          stroke="var(--glass-border-strong)"
          strokeWidth="2"
          fill="none"
        />
        <motion.path
          d="M60 20 H1140"
          stroke="url(#process-grad)"
          strokeWidth="2.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.8, ease: EASE }}
        />
      </svg>

      <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.map((step, index) => (
          <motion.li
            key={step.step}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center gap-3 lg:block">
              <span
                aria-hidden
                className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl border border-[var(--glass-border)] bg-[var(--surface-2)] font-mono text-[13px] font-bold text-[var(--text)]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="eyebrow text-[var(--text-3)] lg:mt-4">{step.step}</p>
            </div>
            <h4 className="mt-2 font-display text-[18px] font-bold text-[var(--text)] lg:mt-1.5">
              {step.title}
            </h4>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--text-2)]">
              {step.body}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function Services() {
  const { locale } = useApp();
  const dict = getDictionary(locale);

  return (
    <Section id="services">
      <SectionShell>
        <Reveal>
          <SectionHeading
            index="04 // SERVICES & WORKFLOW (SKY)"
            label="Services"
            title={dict.services.title}
            subtitle={dict.services.subtitle}
            accent="sky"
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.index} delay={index}>
              <article
                className="group glass relative h-full overflow-hidden rounded-[22px] p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6"
                style={{ ["--accent" as string]: accentColor[service.accent] }}
              >
                <div
                  aria-hidden
                  className="absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: accentColor[service.accent] }}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="eyebrow"
                      style={{ color: accentColor[service.accent] }}
                    >
                      {service.index} / {service.label}
                    </p>
                    <h3 className="mt-2.5 font-display text-[19px] font-bold leading-tight text-[var(--text)] sm:text-[21px]">
                      {service.title}
                    </h3>
                  </div>
                  <span
                    aria-hidden
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: accentColor[service.accent] }}
                  />
                </div>
                <p className="relative mt-3 text-[14px] leading-relaxed text-[var(--text-2)]">
                  {service.body}
                </p>
                <div className="relative mt-5">
                  <Magnetic>
                    <a
                      href={service.href}
                      className="link-underline inline-flex min-h-[44px] items-center gap-1.5 text-[13.5px] font-semibold text-[var(--text)] transition-colors hover:text-[var(--sky)]"
                    >
                      {dict.services.quote} <span aria-hidden>↗</span>
                    </a>
                  </Magnetic>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <SectionHeading
              index="HOW WE WORK // 5-STEP PROCESS"
              label={dict.services.processTitle}
              title="From brief to handover"
              accent="sky"
            />
          </Reveal>
          <div className="mt-10">
            <ProcessTimeline />
          </div>
        </div>
      </SectionShell>
    </Section>
  );
}
