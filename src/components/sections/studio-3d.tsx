import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Marquee } from "@/components/ui/marquee";
import { SprocketMonitorPanel } from "@/components/sections/sprocket-monitor";
import { capabilityChips, studioItems } from "@/lib/content";
import { whatsappMessages } from "@/lib/site";

export function Studio3D() {
  const [sprocket, promo, clipping] = studioItems;

  return (
    <Section id="studio-3d" tone="deep">
      <SectionShell>
        <Reveal>
          <SectionHeading
            index="05 // 3D BLENDER & MEDIA STUDIO (VIOLET)"
            label="3D & Studio"
            title="3D Python Rig & Commercial Studio"
            subtitle="Blender 5.2.2 Cycles GPU animations (Ryzen 5 3600 + RX 6600), FFmpeg video pipelines, and Ibrahim Promo Studio."
            accent="violet"
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          {/* Sprocket */}
          <Reveal>
            <article className="glass h-full rounded-[24px] p-5 sm:p-7">
              <p className="eyebrow text-[var(--violet)]">{sprocket.kicker}</p>
              <h3 className="mt-3 font-display text-[21px] font-bold leading-tight text-[var(--text)] sm:text-[24px]">
                {sprocket.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--text-2)]">
                {sprocket.body}
              </p>
              <div className="mt-6">
                <SprocketMonitorPanel />
              </div>
            </article>
          </Reveal>

          <div className="grid gap-5">
            {/* Promo studio */}
            <Reveal delay={1}>
              <article className="glass h-full rounded-[24px] p-5 sm:p-7">
                <p className="eyebrow text-[var(--amber)]">{promo.kicker}</p>
                <h3 className="mt-3 font-display text-[19px] font-bold leading-tight text-[var(--text)]">
                  {promo.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                  {promo.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {promo.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 text-[12.5px] font-semibold text-[var(--text)] transition-colors hover:text-[var(--amber)]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>
            </Reveal>

            {/* Podcast clipping */}
            <Reveal delay={2}>
              <article className="glass h-full rounded-[24px] p-5 sm:p-7">
                <p className="eyebrow text-[var(--sky)]">{clipping.kicker}</p>
                <h3 className="mt-3 font-display text-[19px] font-bold leading-tight text-[var(--text)]">
                  {clipping.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                  {clipping.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["1080x1920", "9:16", "-14 LUFS", "H.264 / AAC", "48 kHz"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1.5 font-mono text-[10.5px] text-[var(--text-2)]"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </article>
            </Reveal>
          </div>
        </div>

        <div className="mt-12 border-y border-[var(--glass-border)] py-5">
          <Marquee items={capabilityChips} />
        </div>
      </SectionShell>
    </Section>
  );
}
