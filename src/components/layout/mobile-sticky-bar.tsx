"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/site";
import { EASE } from "@/lib/motion";
import { useApp } from "@/components/providers/app-providers";

/**
 * Sticky mobile quick-action bar. Automatically hides while the contact
 * section is on screen so it never covers the form.
 */
export function MobileStickyBar() {
  const [hidden, setHidden] = useState(true);
  const [visible, setVisible] = useState(false);
  const { setPaletteOpen } = useApp();

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHidden(entry.isIntersecting);
      },
      { threshold: 0.12 },
    );
    observer.observe(contact);

    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && !hidden ? (
        <motion.div
          key="sticky-bar"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.36, ease: EASE }}
          className="mobile-action-bar fixed inset-x-0 bottom-0 z-[75] border-t border-[var(--glass-border)] bg-[var(--glass-bg-strong)] px-3 pt-2 backdrop-blur-xl md:hidden"
        >
          <div className="safe-bottom mx-auto flex max-w-md items-center gap-3">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=Assalam-o-Alaikum%20Muhammad%20Ibrahim%2C%20I%20viewed%20your%20portfolio%20and%20want%20to%20discuss%20a%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--indigo)] text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phoneIntl}`}
              className="glass grid h-[52px] w-[52px] shrink-0 place-items-center rounded-xl text-[var(--text)]"
              aria-label="Call"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6.6 3.5h2.1l1.6 4-2 1.4a12 12 0 0 0 6.8 6.8l1.4-2 4 1.6v2.1a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="glass grid h-[52px] w-[52px] shrink-0 place-items-center rounded-xl text-[var(--text)]"
              aria-label="Search portfolio"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.8" />
                <path d="m15.6 15.6 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
