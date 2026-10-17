"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { GithubSummary } from "@/lib/live-data";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

const levelColor = [
  "rgba(255,255,255,0.05)",
  "rgba(99,102,241,0.35)",
  "rgba(99,102,241,0.55)",
  "rgba(168,85,247,0.72)",
  "rgba(56,189,248,0.9)",
];

export function GithubPanel({ summary }: { summary: GithubSummary }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="glass rounded-[22px] p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-[var(--sky)]">Live GitHub telemetry</p>
            <p className="mt-2 font-display text-[20px] font-bold text-[var(--text)]">
              {summary.login}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em]",
              summary.source === "live"
                ? "border-[color:var(--sky)] bg-[var(--sky-soft)] text-[var(--sky)]"
                : "border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-3)]",
            )}
          >
            {summary.source === "live" ? "LIVE API" : "CACHED"}
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-3">
            <dt className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-3)]">
              Public repositories
            </dt>
            <dd className="mt-1 font-display text-[24px] font-bold text-[var(--text)] tnum">
              {summary.publicRepos ?? 8}
            </dd>
          </div>
          <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-3">
            <dt className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-3)]">
              Followers
            </dt>
            <dd className="mt-1 font-display text-[24px] font-bold text-[var(--text)] tnum">
              {summary.followers ?? "—"}
            </dd>
          </div>
        </dl>

        <a
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost mt-4 min-h-[44px] w-full justify-center rounded-[12px] text-[13px]"
        >
          Open GitHub profile ↗
        </a>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
        className="glass rounded-[22px] p-5 sm:p-6"
      >
        <p className="eyebrow text-[var(--violet)]">Repository activity</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-2)]">
          Each cell is a day of the last 90 days; a lit cell means at least
          one repository was pushed that day.
        </p>

        <div className="mt-4 overflow-x-auto pb-1">
          <div className="flex gap-[3px]">
            {summary.heatmap.map((day) => (
              <button
                key={day.date}
                type="button"
                onMouseEnter={() => setHovered(day.date)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(day.date)}
                onBlur={() => setHovered(null)}
                aria-label={`${day.date}: ${day.count} ${
                  day.count === 1 ? "push" : "pushes"
                }`}
                className="h-[13px] w-[13px] shrink-0 rounded-[3px] transition-transform duration-150 hover:scale-125"
                style={{ background: levelColor[day.level] }}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 font-mono text-[11px] text-[var(--text-3)]">
          {hovered ?? "Hover a square for the date"}
        </p>

        <div className="mt-5 border-t border-[var(--glass-border)] pt-4">
          <p className="eyebrow text-[var(--text-3)]">Latest commits</p>
          {summary.latestCommits.length === 0 ? (
            <p className="mt-2 text-[13px] text-[var(--text-3)]">
              Commit feed is unavailable right now.
            </p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1.5">
              {summary.latestCommits.map((commit) => (
                <li key={commit.url}>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--glass)]"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--sky)" }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] text-[var(--text)]">
                        {commit.message}
                      </span>
                      <span className="block font-mono text-[10.5px] text-[var(--text-3)]">
                        {commit.repo} ·{" "}
                        {new Date(commit.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.article>
    </div>
  );
}
