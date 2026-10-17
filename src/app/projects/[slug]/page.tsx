import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { notFound as notFoundPage } from "next/navigation";
import { projects } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Case study" };

  return {
    title: `${project.title} — case study`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${siteConfig.name}`,
      description: project.summary,
      url: `${siteConfig.url}/projects/${project.slug}`,
      type: "article",
    },
  };
}

const accentMap = {
  indigo: "var(--indigo)",
  violet: "var(--violet)",
  sky: "var(--sky)",
  rose: "var(--rose)",
} as const;

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFoundPage();

  const accent = accentMap[project.accent];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}/projects/${project.slug}`,
    ...(project.stack ? { keywords: project.stack.join(", ") } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section tone="deep" className="pt-[calc(var(--header-h)+40px)]">
        <SectionShell>
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-[var(--text-3)] transition-colors hover:text-[var(--sky)]"
            >
              ← Back to projects
            </Link>
          </nav>

          <p className="eyebrow" style={{ color: accent }}>
            {project.kicker}
          </p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2rem,7vw,3.25rem)] font-bold leading-[1.06] text-[var(--text)]">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--text-2)] sm:text-[17px]">
            {project.summary}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary min-h-[46px] justify-center rounded-[13px] px-5 text-[13.5px]"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/#contact"
              className="btn btn-ghost min-h-[46px] justify-center rounded-[13px] px-5 text-[13.5px]"
            >
              Start a project like this ↗
            </Link>
          </div>
        </SectionShell>
      </Section>

      <Section>
        <SectionShell>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="flex flex-col gap-5">
              {project.problem ? (
                <Reveal>
                  <article className="glass rounded-[22px] p-5 sm:p-6">
                    <p className="eyebrow" style={{ color: accent }}>
                      Problem
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-2)]">
                      {project.problem}
                    </p>
                  </article>
                </Reveal>
              ) : null}

              {project.solution ? (
                <Reveal delay={1}>
                  <article className="glass rounded-[22px] p-5 sm:p-6">
                    <p className="eyebrow" style={{ color: accent }}>
                      Solution
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-2)]">
                      {project.solution}
                    </p>
                  </article>
                </Reveal>
              ) : null}

              {project.stack ? (
                <Reveal delay={2}>
                  <article className="glass rounded-[22px] p-5 sm:p-6">
                    <p className="eyebrow" style={{ color: accent }}>
                      Stack
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {project.stack.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1.5 font-mono text-[11.5px] text-[var(--text-2)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ) : null}

              {project.result ? (
                <Reveal delay={3}>
                  <article className="glass rounded-[22px] p-5 sm:p-6">
                    <p className="eyebrow" style={{ color: accent }}>
                      Result
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--text)]">
                      {project.result}
                    </p>
                  </article>
                </Reveal>
              ) : null}
            </div>

            <div className="flex flex-col gap-5">
              {project.metrics ? (
                <Reveal>
                  <article className="glass rounded-[22px] p-5 sm:p-6">
                    <p className="eyebrow text-[var(--text-3)]">
                      Published numbers
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-2.5">
                      {project.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-3"
                        >
                          <dt className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-3)]">
                            {metric.label}
                          </dt>
                          <dd
                            className="mt-1.5 font-display text-[15px] font-bold leading-snug"
                            style={{ color: accent }}
                          >
                            {metric.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                </Reveal>
              ) : null}

              {project.architecture ? (
                <Reveal delay={1}>
                  <article className="glass rounded-[22px] p-5 sm:p-6">
                    <p className="eyebrow text-[var(--text-3)]">Architecture</p>
                    <div className="mt-4">
                      <ArchitectureDiagram
                        nodes={project.architecture}
                        accent={accent}
                      />
                    </div>
                  </article>
                </Reveal>
              ) : null}
            </div>
          </div>

          {project.lessons && project.lessons.length > 0 ? (
            <div className="mt-14">
              <Reveal>
                <SectionHeading
                  index="LESSONS"
                  label="Takeaways"
                  title="What the build taught"
                  accent={project.accent === "rose" ? "rose" : project.accent}
                />
              </Reveal>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {project.lessons.map((lesson, index) => (
                  <Reveal key={lesson.title} delay={index}>
                    <article className="glass h-full rounded-[20px] p-5">
                      <p className="eyebrow" style={{ color: accent }}>
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2.5 font-display text-[16px] font-bold leading-snug text-[var(--text)]">
                        {lesson.title}
                      </h3>
                      <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--text-2)]">
                        {lesson.body}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </SectionShell>
      </Section>
    </>
  );
}
