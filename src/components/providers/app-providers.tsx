"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import { type Locale, localeMeta } from "@/lib/i18n";

type Theme = "dark" | "light";

type AppState = {
  theme: Theme;
  toggleTheme: () => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
};

const AppContext = createContext<AppState | null>(null);

const THEME_KEY = "mi-theme";
const LOCALE_KEY = "mi-locale";
const MOTION_KEY = "mi-reduce-motion";

function readStored<T extends string>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return (window.localStorage.getItem(key) as T) ?? fallback;
  } catch {
    return fallback;
  }
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [locale, setLocaleState] = useState<Locale>("en");
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate persisted preferences after mount (avoids SSR mismatch).
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedTheme = readStored<Theme>(THEME_KEY, "dark");
      const storedLocale = readStored<Locale>(LOCALE_KEY, "en");
      const storedMotion = readStored<string>(MOTION_KEY, "false") === "true";
      const systemPrefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      setTheme(storedTheme);
      setLocaleState(storedLocale);
      setReduceMotionState(storedMotion || systemPrefersReduced);
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }, [theme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.lang = locale;
    root.dir = localeMeta[locale].dir;
  }, [locale, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.reduceMotion = reduceMotion
      ? "true"
      : "false";
  }, [reduceMotion, hydrated]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const setReduceMotion = useCallback((value: boolean) => {
    setReduceMotionState(value);
    try {
      window.localStorage.setItem(MOTION_KEY, String(value));
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Lock body scroll while the mobile menu / command palette is open.
  useEffect(() => {
    const locked = menuOpen || paletteOpen;
    const previous = document.body.style.overflow;
    if (locked) document.body.style.overflow = "hidden";
    else document.body.style.overflow = previous || "";
    return () => {
      document.body.style.overflow = previous || "";
    };
  }, [menuOpen, paletteOpen]);

  const value = useMemo<AppState>(
    () => ({
      theme,
      toggleTheme,
      locale,
      setLocale,
      reduceMotion,
      setReduceMotion,
      menuOpen,
      setMenuOpen,
      paletteOpen,
      setPaletteOpen,
    }),
    [
      theme,
      toggleTheme,
      locale,
      setLocale,
      reduceMotion,
      setReduceMotion,
      menuOpen,
      paletteOpen,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
        {children}
      </MotionConfig>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProviders>");
  return ctx;
}
