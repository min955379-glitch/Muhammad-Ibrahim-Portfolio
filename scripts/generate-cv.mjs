/**
 * Generates a one-page, dependency-free PDF CV from the real portfolio
 * content model. Run with: node scripts/generate-cv.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const OUT = resolve("public/cv/muhammad-ibrahim-cv.pdf");

const lines = [
  { text: "Muhammad Ibrahim", font: "F2", size: 24, gap: 8 },
  { text: "Product Engineer - Full-Stack Web, Mobile & 3D - Abbottabad, Pakistan", font: "F1", size: 11, gap: 16 },
  { text: "min955379@gmail.com  |  +92 348 5581969  |  github.com/min955379-glitch", font: "F1", size: 10, gap: 18 },
  { text: "PROFILE", font: "F2", size: 12, gap: 8 },
  {
    text: "Software Engineering student building and shipping real Next.js 16 platforms, Supabase cloud backends,",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "signed Android APKs, and Blender 3D Python scenes. I build and verify complete digital products - combining",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "clean HTML/CSS/TypeScript engineering, relational cloud databases, and automated testing.",
    font: "F1",
    size: 10,
    gap: 18,
  },
  { text: "TECHNICAL STACK", font: "F2", size: 12, gap: 8 },
  {
    text: "Next.js 16 - React 19 - TypeScript - Tailwind CSS v4 - Supabase (PostgreSQL, Auth, Storage, RLS, Edge) -",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "Drizzle ORM - React Native 0.74 / Expo SDK 51 - Zustand - Vercel - GitHub Actions - Python - Playwright -",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "Blender 5.2 (Cycles GPU) - FFmpeg (9:16 vertical pipeline)",
    font: "F1",
    size: 10,
    gap: 18,
  },
  { text: "SELECTED WORK", font: "F2", size: 12, gap: 8 },
  {
    text: "My English Practice - Audio-first spelling drill, FSRS review. 13 levels, 408 items, 24 phonics patterns.",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "DailyMB Quiz Helper - Expo/React Native app, 3x/day cross-verified cloud fetches, signed APK via CI.",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "Blue Peak Clothing Store - Next.js + Supabase storefront, RLS admin portal, Cash on Delivery.",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "Town Fitness Point - Abbottabad gym platform with programs, trainers, schedule and memberships.",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "ReviewNudge SaaS - Review reminder product with PRD, roadmap, architecture and phase plans.",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "Ibrahim Promo Studio - TikTok / Instagram / Facebook growth packages and a FFmpeg short-form pipeline.",
    font: "F1",
    size: 10,
    gap: 18,
  },
  { text: "SERVICES", font: "F2", size: 12, gap: 8 },
  {
    text: "Full-Stack Web Apps  |  Mobile Apps (APK)  |  Gym & Store Websites  |  3D Blender & Video",
    font: "F1",
    size: 10,
    gap: 18,
  },
  { text: "WORKING METHOD", font: "F2", size: 12, gap: 8 },
  {
    text: "Discuss - Design - Build - Launch - Support. Fixed-scope milestone pricing, live preview links, and",
    font: "F1",
    size: 10,
    gap: 12,
  },
  {
    text: "type/lint checks plus real mobile viewport testing before final handover.",
    font: "F1",
    size: 10,
    gap: 18,
  },
  {
    text: "Languages: English & Urdu  |  Local time: UTC+5 (PKT)  |  Available for freelance projects.",
    font: "F1",
    size: 10,
    gap: 0,
  },
];

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 52;
const LINE_H = 1.45;

let y = PAGE_H - MARGIN;
const parts = [];
for (const line of lines) {
  const font = line.font === "F2" ? "/F2" : "/F1";
  const size = line.size;
  y -= size * LINE_H;
  const escaped = line.text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  parts.push(
    `BT ${font} ${size} Tf 1 0 0 1 ${MARGIN} ${y.toFixed(2)} Tm (${escaped}) Tj ET`,
  );
  y -= line.gap;
  if (y < MARGIN) break;
}

const content = parts.join("\n");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
];

let pdf = "%PDF-1.4\n";
const offsets = [];
objects.forEach((body, index) => {
  offsets.push(pdf.length);
  pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefOffset = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets) {
  pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, pdf, "latin1");
console.log(`Wrote ${OUT} (${pdf.length} bytes)`);
