# Muhammad Ibrahim — Portfolio

Flagship, award-style portfolio rebuilt on **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · PostgreSQL (Drizzle ORM)**, with a React Three Fiber hero scene, GSAP/Lenis motion, a working contact pipeline and a 60 FPS canvas arcade.

> Live: <https://muhammad-ibrahim-portfolio-six.vercel.app>

---

## Design rules enforced across the codebase

| Rule | How it is enforced |
| --- | --- |
| **No green anywhere** | Every colour is a token in `src/app/globals.css`. The palette is indigo `#6366F1` → violet `#A855F7` → sky `#38BDF8`, plus an amber `#F59E0B` → rose `#F43F5E` ramp reserved for download CTAs. The DailyMB preview was re-tinted away from the app's original teal. |
| **No invented content** | Every project, metric, stack and link is taken from the live production site or from the owner's public repositories. The GitHub panel shows live API data; the deployment strip shows real server-side probes. |
| **Every link works** | Anchors scroll with a sticky-header offset, external links carry `rel="noopener"`, and the e2e suite asserts that no `target="_blank"` link is missing `noopener`. |

---

## Architecture

```
                    ┌───────────────────────────────────────────┐
                    │              src/app                      │
                    │  layout.tsx  ·  page.tsx  ·  [slug]/      │
                    │  api/{contact,github,status,leaderboard}  │
                    │  sitemap · robots · manifest · og-image   │
                    └───────────────┬───────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
  components/ui              components/sections        components/three
  Button · Tabs · Accordion   Hero · LiveSites · Projects  hero-scene (R3F)
  TiltCard · PhoneMockup      MobileApks · Services       scene-content
  SplitText · Counter         Studio3D · Skills           quality (adaptive)
  Marquee · Magnetic          Arcade · About · Contact
        │                           │                           │
        └───────────────┬───────────┴───────────┬───────────────┘
                        ▼                       ▼
                  components/providers       lib/
                  AppProviders (theme,        content.ts  ← single source of truth
                  locale, motion, menus)      live-data.ts (GitHub + live probes)
                  ToastProvider               i18n.ts · motion.ts · validation.ts
                                            site.ts · utils.ts
                                    │
                                    ▼
                              src/db (Drizzle)
                    contact_submissions · arcade_scores
```

### Request flow

1. **Live deployments** — `getSiteStatuses()` pings all five Vercel origins from the server, records HTTP status + latency, and the UI renders `LIVE · 142ms` / `DOWN` instead of a static badge.
2. **GitHub telemetry** — `getGithubSummary()` reads the public GitHub REST API with ISR (`revalidate: 3600`) and falls back to the published counts when the API is unreachable.
3. **Contact brief** — Zod validation → honeypot → rate limit (5 / 10 min / IP) → Postgres insert → optional Supabase mirror + Resend e-mail.
4. **Arcade leaderboard** — anonymous nickname + score rows, top 10 by score.

---

## Local development

```bash
npm install
cp .env.example .env          # set DATABASE_URL
npm run db:push               # create the three tables
npm run dev
```

Production build:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

### Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build & serve |
| `npm run lint` | ESLint (Next.js core-web-vitals) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | Apply the Drizzle schema |
| `npm run cv` | Regenerate `public/cv/muhammad-ibrahim-cv.pdf` |
| `npm run test:e2e` | Playwright suite (5 viewports) |
| `npm run ci` | lint → typecheck → build |

---

## Performance guard rails

- The 3D bundle is loaded with `next/dynamic({ ssr:false })` and **never** downloads when `prefers-reduced-motion`, `saveData` or a 2G connection is detected — a CSS poster is rendered instead.
- `dpr` is clamped to `[1, 1.5]`; drei's `PerformanceMonitor` drops it to `1` under load.
- The WebGL loop pauses (`frameloop="demand"`) whenever the canvas leaves the viewport.
- Particle counts scale with the detected tier (900 / 420 / 0).
- Depth of field is enabled on the high tier only.
- The arcade's `requestAnimationFrame` loop only runs while the section is visible.

## Accessibility

- Skip-to-content link, semantic landmarks, labelled form fields with `aria-invalid` / `aria-describedby`.
- Every interactive control is at least 44 × 44 px.
- `prefers-reduced-motion` is respected globally **and** can be toggled from the mobile menu.
- Light and dark themes both meet WCAG AA contrast on body and label text.
- The command palette is keyboard navigable (`⌘/Ctrl + K`, arrow keys, Enter, Escape).

---

## E2E coverage

`e2e/` runs against five viewports (360 / 390 / 430 / 768 / 1440):

- `home.spec.ts` — hero, section anchors, **no horizontal overflow**, full-width mobile CTAs, safe external links.
- `navigation.spec.ts` — mobile menu contents + 44 px tap targets, command palette, desktop anchor scrolling.
- `contact.spec.ts` — validation errors, successful submit, quick-contact destinations.
- `case-study.spec.ts` — all seven case-study routes and the 404 page.

CI runs lint → typecheck → build → Playwright on every push (`.github/workflows/ci.yml`).

---

## Environment variables

See `.env.example`. Only `DATABASE_URL` is required; every other variable enables an optional integration and degrades gracefully when missing.

---

© 2026 Muhammad Ibrahim · Abbottabad, Pakistan.
