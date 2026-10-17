import Image from "next/image";
import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function About() {
  return (
    <Section id="about" tone="raised">
      <SectionShell>
        <Reveal>
          <SectionHeading
            index="08 // ABOUT, RESUME & FAQ"
            label="About & FAQ"
            title="About Muhammad Ibrahim"
            accent="violet"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal>
            <div className="glass overflow-hidden rounded-[24px] p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[20px] border border-[var(--glass-border-strong)]">
                  <Image
                    src="/images/muhammad-ibrahim-portrait.webp"
                    alt="Portrait of Muhammad Ibrahim"
                    width={512}
                    height={512}
                    sizes="92px"
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[20px] font-bold leading-tight text-[var(--text)]">
                    {siteConfig.name}
                  </h3>
                  <p className="mt-1 text-[13.5px] text-[var(--text-2)]">
                    Software Engineering Student · Abbottabad, Pakistan
                  </p>
                  <p className="mt-2 font-mono text-[10.5px] tracking-[0.16em] text-[var(--sky)]">
                    LANGUAGES: ENGLISH &amp; URDU
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[14.5px] leading-relaxed text-[var(--text-2)]">
                I build and verify complete digital products—combining clean
                HTML/CSS/TypeScript engineering, relational cloud databases, and
                automated testing.
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <a
                  href="/cv/muhammad-ibrahim-cv.pdf"
                  download
                  className="btn btn-download min-h-[46px] flex-1 justify-center rounded-[13px] text-[13px]"
                >
                  Download CV (PDF) ↓
                </a>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost min-h-[46px] flex-1 justify-center rounded-[13px] text-[13px]"
                >
                  GitHub Profile ↗
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </SectionShell>
    </Section>
  );
}
