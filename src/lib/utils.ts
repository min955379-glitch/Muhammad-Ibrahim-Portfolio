import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function pad(value: number, length = 2) {
  return String(Math.max(0, Math.floor(value))).padStart(length, "0");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Formats a duration in milliseconds as a compact human string. */
export function formatLatency(ms: number) {
  if (!Number.isFinite(ms)) return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/** Computes Pakistan Standard Time parts for a given instant. */
export function getPktParts(date: Date) {
  const pkt = new Date(date.getTime() + (5 * 60 + 0) * 60 * 1000);
  return {
    hours: pkt.getUTCHours(),
    minutes: pkt.getUTCMinutes(),
    seconds: pkt.getUTCSeconds(),
    day: pkt.getUTCDate(),
    month: pkt.getUTCMonth() + 1,
    year: pkt.getUTCFullYear(),
    weekday: pkt.getUTCDay(),
  };
}

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Stable slug helper for anchors and case-study routes. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isExternal(href: string) {
  return /^https?:|^mailto:|^tel:/i.test(href);
}

export function absoluteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://muhammad-ibrahim-portfolio-six.vercel.app";
  return new URL(path, base).toString();
}
