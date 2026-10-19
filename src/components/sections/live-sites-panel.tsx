"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs } from "@/components/ui/tabs";
import { EASE } from "@/lib/motion";
import { formatLatency } from "@/lib/utils";
import type { SiteStatus } from "@/lib/live-data";
import type { LiveSite } from "@/lib/content";
import { cn } from "@/lib/utils";

type Item = { site: LiveSite; status: SiteStatus | null };

function StatusPill({ status }: { status: SiteStatus | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-[var(--text-3)]">
        CHECKING
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em]",
        status.online
          ? "border-[color:var(--sky)] bg-[var(--sky-soft)] text-[var(--sky)]"
          : "border-[color:var(--rose)] bg-[var(--rose-soft)] text-[var(--rose)]",
      )}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: status.online ? "var(--sky)" : "var(--rose)",
        }}
      />
      {status.online ? "LIVE" : "DOWN"}
      {status.latencyMs !== null ? (
        <span>· {formatLatency(status.latencyMs)}</span>
      ) : null}
    </span>
  );
}

export function LiveSitesPanel({ items }: { items: Item[] }) {
  const [activeId, setActiveId] = useState(items[0]?.site.id);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const tabs = items.map(({ site, status }) => ({
    id: site.id,
    label: site.label,
    content: (
      <div className="glass overflow-hidden rounded-[22px] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-[20px] font-bold text-[var(--text)] sm:text-[24px]">
                {site.label}
              </h3>
              <StatusPill status={status} />
            </div>
            <div className="mt-2 flex min-w-0 max-w-full items-center gap-2">
              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs text-[var(--text-secondary)]" title={site.url}>{site.url}</span>
              <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[var(--glass-border)] text-xs text-[var(--text-secondary)]" aria-label={`Copy ${site.label} URL`} onClick={async () => {
                try { await navigator.clipboard.writeText(site.url); setCopiedUrl(site.id); window.setTimeout(() => setCopiedUrl(null), 2000); } catch { /* clipboard may be blocked */ }
              }}>{copiedUrl === site.id ? "✓" : "Copy"}</button>
            </div>
            {status?.statusCode ? (
              <p className="mt-1 font-mono text-[11px] text-[var(--text-3)]">
                HTTP {status.statusCode} · checked{" "}
                {new Date(status.checkedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary min-h-[44px] justify-center rounded-[12px] px-4 text-[13px]"
            >
              Open live site ↗
            </a>
            {site.repo ? (
              <a
                href={site.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost min-h-[44px] justify-center rounded-[12px] px-4 text-[13px]"
              >
                Repository ↗
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          <p className="eyebrow text-[var(--text-3)]">Endpoint preview</p>
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto rounded-xl border border-[var(--glass-border)] bg-[var(--bg-deep)] px-3 py-2.5">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                background: status?.online ? "var(--sky)" : "var(--rose)",
              }}
            />
            <span className="truncate font-mono text-[12px] text-[var(--text-2)]">
              {site.url}
            </span>
            <span className="ml-auto shrink-0 font-mono text-[11px] text-[var(--text-3)]">
              {status?.online ? "reachable" : "unreachable"}
            </span>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <div className="mt-9">
      <p className="mb-2 text-right font-mono text-xs text-[var(--text-secondary)]" aria-live="polite">{Math.max(1, items.findIndex(({ site }) => site.id === activeId) + 1)}/{items.length}</p>
      <Tabs className="live-sites-tabs"
        items={tabs}
        onActiveChange={setActiveId}
        activeId={activeId}
      />
    </div>
  );
}
