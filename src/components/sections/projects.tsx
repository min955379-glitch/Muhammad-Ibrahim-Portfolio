import Link from "next/link";
import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { featuredProjects, projects } from "@/lib/content";
import { ProjectGallery } from "@/components/sections/projects-gallery";
import { PhoneShowcase } from "@/components/sections/phone-showcase";

export function Projects() {
  return (
    <Section id="projects">
      <SectionShell>
        <Reveal>
          <SectionHeading
            index="02 // CASE STUDIES & REPOSITORIES"
            label="Projects"
            title="Featured Projects"
            subtitle="Real architectures with Problem, Solution, Stack, and verified Results."
            accent="indigo"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index}>
              <TiltCard className="h-full">
                <article className="glass flex h-full flex-col rounded-[24px] p-5 sm:p-6">
                  <p
                    className="eyebrow"
                    style={{
                      color:
                        project.accent === "indigo"
                          ? "var(--indigo)"
                          : project.accent === "violet"
                            ? "var(--violet)"
                            : project.accent === "sky"
                              ? "var(--sky)"
                              : "var(--rose)",
                    }}
                  >
                    {project.kicker}
                  </p>
                  <h3 className="mt-3 font-display text-[20px] font-bold leading-tight text-[var(--text)] sm:text-[22px]">
                    {project.title}
                  </h3>

                  <div className="mt-4 flex flex-1 flex-col gap-3">
                    <div>
                      <p className="eyebrow text-[var(--text-3)]">Problem</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                        {project.problem}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow text-[var(--text-3)]">Solution</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                        {project.solution}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow text-[var(--text-3)]">Stack</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                        {project.stack?.join(", ")}.
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow text-[var(--text-3)]">Result</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--text)]">
                        {project.result}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--glass-border)] pt-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3.5 text-[12.5px] font-semibold text-[var(--text)] transition-colors hover:border-[var(--glass-border-strong)] hover:text-[var(--sky)]"
                      >
                        {link.label}
                      </a>
                    ))}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex min-h-[40px] items-center rounded-xl px-3.5 text-[12.5px] font-semibold text-white transition-transform hover:-translate-y-0.5"
                      style={{ background: "var(--brand-grad)" }}
                    >
                      Case study ↗
                    </Link>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <PhoneShowcase />

        <div className="mt-14">
          <Reveal>
            <SectionHeading
              index="MORE // 04 — 07"
              label="Repository gallery"
              title="Every Other Project"
              subtitle="Drag or scroll sideways to move through the remaining repositories and products."
              accent="violet"
            />
          </Reveal>
          <ProjectGallery projects={projects.filter((p) => !p.featured)} />
        </div>
      </SectionShell>
    </Section>
  );
}
