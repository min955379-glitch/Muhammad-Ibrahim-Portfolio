import { getGithubSummary } from "@/lib/live-data";
import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GithubPanel } from "@/components/sections/github-panel";
import { skills } from "@/lib/content";

const accentColor = {
  indigo: "var(--indigo)",
  sky: "var(--sky)",
  violet: "var(--violet)",
  rose: "var(--rose)",
} as const;

export async function Skills() {
  const github = await getGithubSummary();

  return (
    <Section id="skills">
      <SectionShell>
        <Reveal>
          <SectionHeading
            index="06 // TECHNICAL SKILLS & CLOUD SNAPSHOT (SKY)"
            label="Skills"
            title="Engineering Stack & Cloud"
            subtitle="8 core specializations and verified production telemetry across GitHub, Vercel, and Supabase."
            accent="sky"
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, index) => (
            <Reveal key={skill.index} delay={index % 4}>
              <article
                className="group glass relative h-full overflow-hidden rounded-[20px] p-5 transition-transform duration-300 hover:-translate-y-1"
                style={{ ["--accent" as string]: accentColor[skill.accent] }}
              >
                <div
                  aria-hidden
                  className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
                  style={{ background: accentColor[skill.accent] }}
                />
                <p
                  className="eyebrow relative"
                  style={{ color: accentColor[skill.accent] }}
                >
                  {skill.index} / {skill.label}
                </p>
                <h3 className="relative mt-2.5 font-display text-[16.5px] font-bold leading-snug text-[var(--text)]">
                  {skill.title}
                </h3>
                <p className="relative mt-2 text-[13px] leading-relaxed text-[var(--text-2)]">
                  {skill.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <GithubPanel summary={github} />
      </SectionShell>
    </Section>
  );
}
