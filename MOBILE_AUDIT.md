# Mobile visual audit — local patch, not yet deployed

**Status:** The source changes and screenshots in this workspace are local. The public URL has **not** been updated or verified with these changes. Do not treat the after images as live-deployment evidence.

## Root cause

- The original WebGL scene combined a 4.2-unit `Halo` disk, point lights at intensities **22 / 18 / 10**, emissive intensities up to **1.6**, ACES exposure **1.05**, and Bloom threshold **0.22** / intensity **1.15**. Together with the large radial fallback poster, this created the bright periwinkle wash.
- The scene rendered as an absolute full-hero layer while the card surfaces were nearly transparent (`rgba(255,255,255,.045)`). Light text was therefore composited over a light moving background.
- The CSS wireframe cube's faces translated **58px** outside an unclipped small wrapper; they could paint over the stat grid as a black/wireframe wedge.
- The mobile card used `order-1` while the headline used `order-2`, so the card appeared before the headline. The fixed header started transparent, letting hero content visually collide with it. A separate mobile command-palette launcher occupied the same corner as the bottom action bar's search button.

## Before → after

| Area | Before | Local patch |
|---|---|---|
| Hero scene | Full-screen bright bloom / large halo | Transparent canvas, ACES exposure 0.7, Bloom threshold 0.88 / intensity 0.3, much lower lights and emissive values; smaller lower-right accent; static dark wireframe poster on low-power devices |
| Glass and text | Near-transparent cards, faint text | Dark glass `rgba(10,14,30,.74)` / strong `rgba(8,11,24,.90)`, lighter readable text tokens, opaque fallback |
| Profile card | Cube spilled across stats; card above H1 | Clipped, isolated miniature cube; brand image, card below copy and chips; opaque stat tiles and white numbers |
| Header | Transparent at top / content collision | 64px fixed dark header, safe-area padding, bottom border only; main top offset and anchor scroll margin |
| Live Sites | Literal `(INDIGO)`, cramped URLs | Clean label, scroll-snap tab rail, active indicator and 1/5 counter; ellipsized URL + copy button; live probe retained |
| Bottom controls | Floating search duplicated the action bar | Exactly WhatsApp / Call / Search with 52px targets and 12px gaps; search opens the existing palette; bar hides at Contact |
| Guardrails | No dedicated visual-regression test | Axe color-contrast, screenshot pixel contrast samples, page-wide overflow, anchor/header offsets and action-bar geometry in CI |

## After contrast (390 × 844, screenshot-pixel samples)

| Text | Contrast ratio |
|---|---:|
| Hero headline | 19.03:1 |
| Hero subtitle | 13.08:1 |
| Availability badge | 12.15:1 |
| Tech chip | 13.05:1 |
| Profile heading | 18.91:1 |
| Stat number | 20.27:1 |
| Stat label | 13.10:1 |
| PKT label | 9.02:1 |
| Based-in label | 8.98:1 |
| Scroll hint | 9.02:1 |

Axe color-contrast reports **zero violations** in the tested dark page. The screenshot samples use the rendered foreground color and a nearby rendered background pixel; moving image content can change a ratio slightly.

## Local verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db npm run build`: passed. The URL is a local build placeholder, not a production credential.
- Playwright mobile visual regression at 390 × 844: passed.
- Playwright home/navigation subset at mobile 390 and desktop 1440: 14 passed, 2 intentionally skipped.
- Playwright captures at **360, 390, 430, and 1440px**: `scrollWidth === viewport width` at each; all three hero CTAs are 52px tall and do not wrap; badge begins below the header. At 390px, section anchors land below the header and the bottom-bar buttons do not overlap.
- GitHub Actions runs the E2E suite, including the new regression, on every push; mobile/tablet device emulations use Chromium because CI installs only Chromium.

## Screenshots

| View | Before: current public site | After: local patched build |
|---|---|---|
| Hero, 390px | [before](screenshots/before/live-390-hero.png) | [after](screenshots/after/after-390-hero.png) |
| Profile/stats, 390px | [before](screenshots/before/live-390-profile.png) | [after](screenshots/after/after-390-profile.png) |
| Live Sites, 390px | [before](screenshots/before/live-390-live-sites.png) | [after](screenshots/after/after-390-live-sites.png) |
| Bottom bar, 390px | [before](screenshots/before/live-390-bottom-bar.png) | [after](screenshots/after/after-390-bottom-bar.png) |
| Hero, 360 / 430 / 1440px | — | [360](screenshots/after/after-360-hero.png) · [430](screenshots/after/after-430-hero.png) · [1440](screenshots/after/after-1440-hero.png) |

## Outstanding for a live release

1. **Push access is needed.** The public repository can be cloned but this workspace has no authenticated GitHub write connection; do not assume a Vercel deployment has started.
2. **Actual portrait asset is missing.** Both existing `public/images/profile.webp` and `public/images/muhammad-ibrahim-portrait.webp` contain the same book-and-sun brand logo, not a photograph of Muhammad Ibrahim. The card uses `next/image` with the real supplied logo and honest alt text; an actual portrait cannot be restored without a supplied image. A real photo can replace `public/images/profile.webp` later without a component change.
3. After an authorized push, wait for the production deployment to become Ready, then rerun Playwright against `https://muhammad-ibrahim-portfolio-six.vercel.app` and capture **live after** screenshots. The present after screenshots are local only.
