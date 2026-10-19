"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

const accentColor = {
  indigo: "var(--indigo-text)",
  violet: "var(--violet)",
  sky: "var(--sky)",
  rose: "var(--rose)",
} as const;

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, moved: false });

  function handleScroll() {
    const node = scroller.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setProgress(max > 0 ? node.scrollLeft / max : 0);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const node = scroller.current;
    if (!node) return;
    setDragging(true);
    dragState.current = {
      startX: event.clientX,
      scrollLeft: node.scrollLeft,
      moved: false,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = scroller.current;
    if (!node || !dragging) return;
    const delta = event.clientX - dragState.current.startX;
    if (Math.abs(delta) > 4) dragState.current.moved = true;
    node.scrollLeft = dragState.current.scrollLeft - delta;
  }

  function endDrag() {
    setDragging(false);
  }

  return (
    <div className="mt-8">
      <div
        ref={scroller}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={cn(
          "no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8",
          dragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        style={{ scrollbarWidth: "none" }}
      >
        {projects.map((project) => (
          <article
            key={project.slug}
            className="glass group relative w-[84vw] max-w-[380px] shrink-0 snap-start rounded-[22px] p-5"
          >
            <div
              aria-hidden
              className="absolute inset-x-5 top-0 h-px"
              style={{ background: accentColor[project.accent] }}
            />
            <p
              className="eyebrow"
              style={{ color: accentColor[project.accent] }}
            >
              {project.kicker}
            </p>
            <h3 className="mt-3 font-display text-[19px] font-bold leading-tight text-[var(--text)]">
              {project.title}
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--text-2)]">
              {project.summary}
            </p>

            {project.metrics ? (
              <dl className="mt-4 grid grid-cols-2 gap-2">
                {project.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2"
                  >
                    <dt className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-3)]">
                      {metric.label}
                    </dt>
                    <dd className="mt-1 text-[12.5px] font-semibold text-[var(--text)]">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3.5 text-[12.5px] font-semibold text-[var(--text)] transition-colors hover:text-[var(--sky)]"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex min-h-[40px] items-center rounded-xl px-3.5 text-[12.5px] font-semibold text-white"
                style={{ background: "var(--brand-grad)" }}
              >
                Case study ↗
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div
          className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--glass)]"
          role="progressbar"
          aria-label="Gallery scroll progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--brand-grad)" }}
            animate={{ width: `${Math.max(12, progress * 100)}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--text-3)]">
          DRAG →
        </span>
      </div>
    </div>
  );
}
