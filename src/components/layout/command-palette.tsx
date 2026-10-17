"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, siteConfig } from "@/lib/site";
import { projects } from "@/lib/content";
import { useApp } from "@/components/providers/app-providers";
import { useToast } from "@/components/providers/toast-provider";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Command = {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Projects" | "Actions";
  run: () => void;
};

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setMenuOpen, toggleTheme, reduceMotion, setReduceMotion } =
    useApp();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paletteOpen, setPaletteOpen, setMenuOpen]);

  useEffect(() => {
    if (!paletteOpen) return;
    const frame = window.requestAnimationFrame(() => {
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [paletteOpen]);

  const commands = useMemo<Command[]>(() => {
    const navigate: Command[] = navItems.map((item) => ({
      id: `nav-${item.id}`,
      label: `Go to ${item.label}`,
      hint: item.description,
      group: "Navigate",
      run: () => {
        document
          .getElementById(item.id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        setPaletteOpen(false);
      },
    }));

    const openProjects: Command[] = projects.map((project) => ({
      id: `project-${project.slug}`,
      label: project.title,
      hint: project.kicker,
      group: "Projects",
      run: () => {
        window.location.href = `/projects/${project.slug}`;
        setPaletteOpen(false);
      },
    }));

    const actions: Command[] = [
      {
        id: "copy-email",
        label: "Copy e-mail address",
        hint: siteConfig.email,
        group: "Actions",
        run: () => {
          void navigator.clipboard
            ?.writeText(siteConfig.email)
            .then(() => toast("Email copied to clipboard"))
            .catch(() => toast("Copy failed — " + siteConfig.email));
          setPaletteOpen(false);
        },
      },
      {
        id: "whatsapp",
        label: "Open WhatsApp chat",
        hint: siteConfig.phoneDisplay,
        group: "Actions",
        run: () => {
          window.open(`https://wa.me/${siteConfig.whatsappNumber}`, "_blank");
          setPaletteOpen(false);
        },
      },
      {
        id: "github",
        label: "Open GitHub profile",
        hint: siteConfig.githubHandle,
        group: "Actions",
        run: () => {
          window.open(siteConfig.githubUrl, "_blank");
          setPaletteOpen(false);
        },
      },
      {
        id: "toggle-theme",
        label: "Toggle colour theme",
        hint: "Dark / light",
        group: "Actions",
        run: () => {
          toggleTheme();
          setPaletteOpen(false);
        },
      },
      {
        id: "toggle-motion",
        label: reduceMotion ? "Enable motion" : "Reduce motion",
        hint: "Respect reduced-motion preferences",
        group: "Actions",
        run: () => {
          setReduceMotion(!reduceMotion);
          setPaletteOpen(false);
        },
      },
    ];

    return [...navigate, ...openProjects, ...actions];
  }, [reduceMotion, setPaletteOpen, setReduceMotion, toast, toggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (command) =>
        command.label.toLowerCase().includes(q) ||
        command.hint.toLowerCase().includes(q) ||
        command.group.toLowerCase().includes(q),
    );
  }, [commands, query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      filtered[activeIndex]?.run();
    }
  }

  useEffect(() => {
    const node = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <>
      {/* Floating trigger (mobile + desktop) */}
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Open command palette"
        className="fixed bottom-5 right-4 z-[76] inline-flex h-12 items-center gap-2 rounded-[14px] border border-[var(--glass-border-strong)] bg-[var(--surface)]/85 px-4 text-[13px] font-semibold text-[var(--text)] shadow-[var(--shadow-lg)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.03] md:bottom-7 md:right-7"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="6.4" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="ml-1 hidden rounded-md border border-[var(--glass-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-3)] sm:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {paletteOpen ? (
          <motion.div
            key="palette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <button
              type="button"
              aria-label="Close command palette"
              onClick={() => setPaletteOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-[var(--bg-deep)]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="glass-strong relative w-full max-w-xl overflow-hidden rounded-2xl shadow-[var(--shadow-lg)]"
            >
              <div className="flex items-center gap-3 border-b border-[var(--glass-border)] px-4">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[var(--text-3)]">
                  <circle cx="11" cy="11" r="6.4" stroke="currentColor" strokeWidth="1.8" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Jump to a section, open a project, copy e-mail…"
                  aria-label="Search commands"
                  className="h-14 w-full bg-transparent text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
                />
                <button
                  type="button"
                  onClick={() => setPaletteOpen(false)}
                  className="rounded-md border border-[var(--glass-border)] px-2 py-1 font-mono text-[10px] text-[var(--text-3)]"
                >
                  ESC
                </button>
              </div>

              <ul
                ref={listRef}
                className="max-h-[52vh] overflow-y-auto p-2"
                role="listbox"
                aria-label="Commands"
              >
                {filtered.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-[var(--text-3)]">
                    No matches for “{query}”.
                  </li>
                ) : (
                  filtered.map((command, index) => (
                    <li key={command.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={command.run}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                          index === activeIndex
                            ? "bg-[var(--glass-strong)]"
                            : "hover:bg-[var(--glass)]",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-medium text-[var(--text)]">
                            {command.label}
                          </span>
                          <span className="block truncate text-[12px] text-[var(--text-3)]">
                            {command.hint}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-3)]">
                          {command.group}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
