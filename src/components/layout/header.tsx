"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, siteConfig } from "@/lib/site";
import { useApp } from "@/components/providers/app-providers";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";

function BrandMark() {
  return (
    <span
      aria-hidden
      className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] text-[13px] font-bold text-[#04060e] shadow-[0_8px_24px_-10px_rgba(99,102,241,0.9)]"
      style={{ background: "var(--brand-grad)" }}
    >
      MI
    </span>
  );
}

export function Header() {
  const { locale, setMenuOpen, menuOpen, theme, toggleTheme } = useApp();
  const dict = getDictionary(locale);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[80] border-b border-[var(--glass-border)] bg-[var(--glass-bg-strong)] pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl transition-shadow duration-300",
        scrolled && "shadow-[0_10px_40px_-24px_rgba(2,3,10,0.9)]",
      )}
    >
      <div className="section-shell">
        <div className="flex h-[64px] items-center justify-between gap-3">
          {/* Brand — single row, never wraps */}
          <Link
            href="#top"
            className="flex min-w-0 items-center gap-2.5"
            aria-label={`${siteConfig.name} — home`}
          >
            <BrandMark />
            <span className="min-w-0 truncate whitespace-nowrap font-display text-[13px] font-semibold text-[var(--text)] min-[380px]:text-[15px]">
              <span className="min-[380px]:hidden">Muhammad I.</span>
              <span className="hidden min-[380px]:inline">{siteConfig.name}</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 lg:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-lg px-2.5 py-2 text-[13px] font-medium whitespace-nowrap text-[var(--text-2)] transition-colors duration-200 hover:bg-[var(--glass)] hover:text-[var(--text)]"
              >
                {dict.nav[item.id] ?? item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dict.common.theme}
              className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-2)] transition-colors duration-200 hover:text-[var(--text)]"
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            <a
              href="#contact"
              className="hidden h-11 items-center whitespace-nowrap rounded-full bg-[var(--indigo)] px-4 text-sm font-semibold text-white sm:inline-flex"
            >
              {dict.common.hireMe}
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? dict.common.close : dict.common.menu}
              className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text)] lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-current"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-current"
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>{menuOpen ? <MobileMenu /> : null}</AnimatePresence>
    </header>
  );
}

function MobileMenu() {
  const { locale, setLocale, setMenuOpen, reduceMotion, setReduceMotion, theme } =
    useApp();
  const dict = getDictionary(locale);

  return (
    <motion.div
      id="mobile-menu"
      key="mobile-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      className="fixed inset-0 z-[79] lg:hidden"
    >
      <button
        type="button"
        aria-label={dict.common.close}
        onClick={() => setMenuOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-[var(--bg-deep)]/92 backdrop-blur-xl"
      />

      <motion.nav
        aria-label="Mobile"
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative flex h-full flex-col overflow-y-auto pt-[calc(var(--header-h)+8px)] pb-8"
      >
        <div className="section-shell flex flex-1 flex-col">
          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + index * 0.045, duration: 0.45, ease: EASE }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="group flex min-h-[56px] items-center gap-4 border-b border-[var(--glass-border)] py-2"
                >
                  <span
                    className="font-mono text-[11px] font-semibold"
                    style={{ color: "var(--sky)" }}
                  >
                    {item.index}
                  </span>
                  <span className="font-display text-[22px] font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--sky)]">
                    {dict.nav[item.id] ?? item.label}
                  </span>
                  <span
                    aria-hidden
                    className="ml-auto text-[var(--text-3)] transition-transform duration-300 group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.45, ease: EASE }}
            className="mt-7 flex flex-col gap-3"
          >
            <div className="flex flex-wrap gap-2">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-medium text-[var(--text)]"
              >
                GitHub ↗
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-medium text-[var(--text)]"
              >
                WhatsApp ↗
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="glass inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-medium text-[var(--text)]"
              >
                Email ↗
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setLocale(locale === "en" ? "ur" : "en")}
                className="glass inline-flex min-h-[44px] items-center rounded-xl px-4 text-sm font-medium text-[var(--text)]"
              >
                {locale === "en" ? "اردو" : "English"}
              </button>
              <button
                type="button"
                onClick={() => setReduceMotion(!reduceMotion)}
                aria-pressed={reduceMotion}
                className="glass inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-medium text-[var(--text)]"
              >
                <span
                  aria-hidden
                  className={cn(
                    "relative h-5 w-9 rounded-full border transition-colors",
                    reduceMotion
                      ? "border-[var(--sky)] bg-[var(--sky-soft)]"
                      : "border-[var(--glass-border)] bg-[var(--glass)]",
                  )}
                >
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    className={cn(
                      "absolute top-[2px] h-[14px] w-[14px] rounded-full",
                      reduceMotion ? "right-[2px]" : "left-[2px]",
                    )}
                    style={{
                      background: reduceMotion ? "var(--sky)" : "var(--text-3)",
                    }}
                  />
                </span>
                {dict.common.reduceMotion}
              </button>
              <span className="text-xs text-[var(--text-3)]">
                {theme === "dark" ? "Dark" : "Light"} theme
              </span>
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </motion.div>
  );
}
