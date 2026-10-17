"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

export function Tabs({
  items,
  className,
  listClassName,
  variant = "pill",
  activeId: controlledActiveId,
  onActiveChange,
}: {
  items: TabItem[];
  className?: string;
  listClassName?: string;
  variant?: "pill" | "underline";
  activeId?: string;
  onActiveChange?: (id: string) => void;
}) {
  const [internalActiveId, setInternalActiveId] = useState(items[0]?.id);
  const activeId = controlledActiveId ?? internalActiveId;
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const setActiveId = (id: string) => {
    if (controlledActiveId === undefined) setInternalActiveId(id);
    onActiveChange?.(id);
  };

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        aria-label="Interactive selector"
        className={cn(
          "no-scrollbar flex gap-2 overflow-x-auto pb-1",
          variant === "pill" &&
            "rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] p-1.5",
          variant === "underline" &&
            "items-center gap-1 border-b border-[var(--glass-border)]",
          listClassName,
        )}
      >
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              id={`${baseId}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${item.id}`}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "relative shrink-0 rounded-xl px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors duration-300 sm:text-sm",
                variant === "underline" && "rounded-none px-3 sm:px-4",
                isActive
                  ? "text-white"
                  : "text-[var(--text-2)] hover:text-[var(--text)]",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId={`${baseId}-active-pill`}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className={cn(
                    "absolute inset-0 -z-10",
                    variant === "pill"
                      ? "rounded-xl"
                      : "rounded-t-lg bg-[var(--glass)]",
                  )}
                  style={{ background: "var(--brand-grad)" }}
                />
              ) : null}
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.label.split(" ").slice(0, 2).join(" ")}</span>
              <span className="sr-only sm:hidden">
                {index >= 0 ? ` (${index + 1} of ${items.length})` : ""}
              </span>
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== activeId}
          className="mt-5 focus-visible:outline-none"
        >
          {item.id === activeId ? item.content : null}
        </div>
      ))}

      <span className="sr-only" aria-live="polite">
        Tab {activeIndex + 1} of {items.length} selected
      </span>
    </div>
  );
}
