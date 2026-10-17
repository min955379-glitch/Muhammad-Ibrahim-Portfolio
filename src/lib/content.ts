import { whatsappMessages } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Every string below is preserved from the live production site.
 * Nothing is invented: no testimonials, no client names, no metrics
 * beyond the figures already published by the site owner.
 * ------------------------------------------------------------------ */

export type LinkRef = { label: string; href: string };

export type Project = {
  slug: string;
  kicker: string;
  title: string;
  category: "case-study" | "project";
  featured: boolean;
  summary: string;
  problem?: string;
  solution?: string;
  stack?: string[];
  result?: string;
  accent: "indigo" | "violet" | "sky" | "rose";
  links: LinkRef[];
  /** Real, published numbers for this project. */
  metrics?: { label: string; value: string }[];
  /** Architecture nodes derived from the published stack. */
  architecture?: { label: string; detail: string }[];
  lessons?: { title: string; body: string }[];
  cover?: string;
};

export const projects: Project[] = [
  {
    slug: "my-english-practice",
    kicker: "Case Study 01 · Flagship",
    title: "My English Practice",
    category: "case-study",
    featured: true,
    accent: "indigo",
    summary:
      "Audio-first letter-by-letter spelling drill with red-letter error feedback, 3-step hint ladder, and FSRS review.",
    problem:
      "Adult beginners struggle with apps that assume fluent reading.",
    solution:
      "Audio-first letter-by-letter spelling drill with red-letter error feedback, 3-step hint ladder, and FSRS review.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Drizzle ORM",
      "Supabase",
    ],
    result:
      "13 open levels, 408 items, 24 phonics patterns; 40 unit/API + 56 browser tests passing.",
    links: [
      {
        label: "Live Site ↗",
        href: "https://my-english-practice-three.vercel.app",
      },
      {
        label: "GitHub ↗",
        href: "https://github.com/min955379-glitch/My-English-Practice",
      },
    ],
    metrics: [
      { label: "Open levels", value: "13" },
      { label: "Practice items", value: "408" },
      { label: "Phonics patterns", value: "24" },
      { label: "Passing tests", value: "40 unit / API + 56 browser" },
    ],
    architecture: [
      { label: "Next.js 16 App Router", detail: "Route handlers + server components" },
      { label: "React 19 + Tailwind v4", detail: "Accessible drill UI" },
      { label: "Drizzle ORM", detail: "Typed schema and queries" },
      { label: "Supabase", detail: "Auth, Postgres, Storage" },
    ],
    lessons: [
      {
        title: "Audio first, text second",
        body: "A beginner cannot read the word they are being asked to spell. Playing the target before showing it removed the reading barrier that made the drill feel impossible.",
      },
      {
        title: "Errors should teach, not block",
        body: "Red-letter feedback on the exact wrong cell plus a three-step hint ladder keeps the loop running instead of ending the attempt.",
      },
      {
        title: "Review is a product feature",
        body: "FSRS review was wired into the same drill surface, so retention work does not need a separate screen or a second habit.",
      },
    ],
  },
  {
    slug: "dailymb-quiz-helper",
    kicker: "Case Study 02 · Android & Cloud",
    title: "DailyMB Quiz Helper",
    category: "case-study",
    featured: true,
    accent: "sky",
    summary:
      "Automated 3x/day cloud fetches (00:05, 05:30, 12:05 PKT) that cross-verify answers across independent sources.",
    problem:
      "Daily quiz answers on public sites are often unverified or inconsistent.",
    solution:
      "Automated 3x/day cloud fetches (00:05, 05:30, 12:05 PKT) that cross-verify answers across independent sources.",
    stack: [
      "Expo SDK 51",
      "React Native 0.74",
      "TypeScript",
      "Zustand",
      "Supabase Edge",
      "pg_cron",
    ],
    result:
      "Signed APK via GitHub Actions, 5-day streak tracker (25–125 MB), zero-login read-only security.",
    links: [
      {
        label: "Get APK ↓",
        href: "https://github.com/min955379-glitch/DailyMB/releases/download/apk-build/DailyMB.apk",
      },
      { label: "GitHub ↗", href: "https://github.com/min955379-glitch/DailyMB" },
    ],
    metrics: [
      { label: "Daily fetches", value: "3× / day" },
      { label: "Fetch times (PKT)", value: "00:05 · 05:30 · 12:05" },
      { label: "APK size range", value: "25–125 MB" },
      { label: "Streak tracker", value: "5 days" },
    ],
    architecture: [
      { label: "Supabase Edge Function", detail: "Scheduled fetch + parse" },
      { label: "pg_cron", detail: "Three daily triggers (PKT)" },
      { label: "Postgres answers table", detail: "Cross-verified source rows" },
      { label: "Expo / React Native app", detail: "Zustand store, read-only" },
      { label: "GitHub Actions", detail: "Signed APK build" },
    ],
    lessons: [
      {
        title: "Schedule in the user's timezone",
        body: "The fetch windows are defined in PKT, not UTC, so the app always has data when the daily quiz opens.",
      },
      {
        title: "Cross-verification beats scraping",
        body: "Answers are only published when independent sources agree, which removes the guesswork the original problem was about.",
      },
      {
        title: "Read-only is a feature",
        body: "The app never asks for an account, so the security model is zero-login by construction rather than by policy.",
      },
    ],
  },
  {
    slug: "blue-peak-store",
    kicker: "Case Study 03 · E-commerce Brand",
    title: "Blue Peak Clothing Store",
    category: "case-study",
    featured: true,
    accent: "violet",
    summary:
      "Custom storefront + RLS-protected /admin portal with 3-slot auto-resized product photo uploads.",
    problem:
      "Needed a fast Pakistani ready-to-wear store with owner-managed inventory and COD.",
    solution:
      "Custom storefront + RLS-protected /admin portal with 3-slot auto-resized product photo uploads.",
    stack: [
      "Next.js",
      "Supabase Auth",
      "Supabase Storage",
      "Supabase RLS",
      "WordPress",
      "Shopify",
    ],
    result:
      "12 active products (XS–XXL, PKR 2,845–10,495) with nationwide Cash on Delivery & WhatsApp checkout.",
    links: [
      {
        label: "Live Store ↗",
        href: "https://blue-peak-store.vercel.app",
      },
      {
        label: "GitHub ↗",
        href: "https://github.com/min955379-glitch/Blue-Peak-store",
      },
    ],
    metrics: [
      { label: "Active products", value: "12" },
      { label: "Size range", value: "XS–XXL" },
      { label: "Price range", value: "PKR 2,845–10,495" },
      { label: "Checkout", value: "Cash on Delivery + WhatsApp" },
    ],
    architecture: [
      { label: "Next.js storefront", detail: "Product catalogue + PDP" },
      { label: "Supabase Auth", detail: "Owner admin session" },
      { label: "Supabase Storage", detail: "3-slot auto-resized images" },
      { label: "RLS policies", detail: "Public read, owner-only write" },
      { label: "WordPress / Shopify", detail: "Catalog parity" },
    ],
    lessons: [
      {
        title: "Three upload slots, one pipeline",
        body: "Constraining the gallery to three auto-resized images keeps every product page fast and consistent without a media manager.",
      },
      {
        title: "RLS is the admin boundary",
        body: "The /admin portal has no bespoke auth code — the database policy decides who can write.",
      },
      {
        title: "Cash on delivery needs a chat path",
        body: "Pairing COD with a WhatsApp checkout keeps the order conversation on the channel customers already use.",
      },
    ],
  },
  {
    slug: "town-fitness-point",
    kicker: "Project 04 · Gym & Fitness Platform",
    title: "Town Fitness Point & Fitness Pro",
    category: "project",
    featured: false,
    accent: "sky",
    summary:
      "Abbottabad gym website with goal-based programs, trainer profiles, class schedule, membership tiers, and Supabase backup.",
    links: [
      {
        label: "Live Site ↗",
        href: "https://town-fitness-point.vercel.app/",
      },
      {
        label: "GitHub ↗",
        href: "https://github.com/min955379-glitch/Fitness-pro-",
      },
    ],
    metrics: [
      { label: "Programs", value: "Goal-based" },
      { label: "Membership", value: "Tiered" },
      { label: "Schedule", value: "Class timetable" },
      { label: "Backup", value: "Supabase" },
    ],
    lessons: [
      {
        title: "Sell the outcome, list the tiers",
        body: "Goal-based programs sit above membership tiers, so a visitor self-selects a plan before they ever see pricing.",
      },
    ],
  },
  {
    slug: "reviewnudge-saas",
    kicker: "Project 05 · SaaS Product",
    title: "ReviewNudge SaaS",
    category: "project",
    featured: false,
    accent: "indigo",
    summary:
      "Next.js + TypeScript + Supabase review reminder product with complete PRD, roadmap, architecture, and phase plans.",
    links: [
      {
        label: "Live App ↗",
        href: "https://review-nudge-alpha.vercel.app",
      },
      { label: "GitHub ↗", href: "https://github.com/min955379-glitch/ReviewNudge" },
    ],
    metrics: [
      { label: "Product docs", value: "Full PRD" },
      { label: "Planning", value: "Roadmap + phase plan" },
      { label: "Stack", value: "Next.js + TypeScript + Supabase" },
    ],
    lessons: [
      {
        title: "Document the product, then build it",
        body: "The PRD, roadmap, architecture and phase plans were written before implementation, which is why the build stayed on scope.",
      },
    ],
  },
  {
    slug: "terrastep",
    kicker: "Project 06 · University Android Game",
    title: "Terrastep — Territory Fitness Game",
    category: "project",
    featured: false,
    accent: "rose",
    summary:
      "Built from a 33-page blueprint where walking captures map territory. All 4 stages completed and debug APK built via cloud CI.",
    links: [
      {
        label: "University Repo ↗",
        href: "https://github.com/NematUllah9812/FYP-",
      },
      { label: "BluePeak WP ↗", href: "https://bluepeak8.wordpress.com" },
    ],
    metrics: [
      { label: "Blueprint", value: "33 pages" },
      { label: "Stages completed", value: "4 / 4" },
      { label: "Build", value: "Debug APK via cloud CI" },
    ],
    lessons: [
      {
        title: "A blueprint makes an Android game tractable",
        body: "33 pages of design separated game design decisions from Android build problems, so each stage had a defined exit criterion.",
      },
    ],
  },
  {
    slug: "genvexa-mental-maths-arhms",
    kicker: "Project 07 · Web & AI Cloud Repos",
    title: "Genvexa, Mental Maths & ARHMS AI",
    category: "project",
    featured: false,
    accent: "violet",
    summary:
      "JavaScript web platforms, rapid mental math aptitude trainer, and an archived AI experiment backed by Supabase.",
    links: [
      { label: "Genvexa Repo ↗", href: "https://github.com/min955379-glitch/genvexa" },
      {
        label: "Maths Repo ↗",
        href: "https://github.com/min955379-glitch/Mental-Maths-Practice-",
      },
    ],
    metrics: [
      { label: "Platforms", value: "JavaScript web" },
      { label: "Trainer", value: "Rapid mental math" },
      { label: "AI experiment", value: "ARHMS (archived)" },
      { label: "Backend", value: "Supabase" },
    ],
    lessons: [
      {
        title: "Keep the archive honest",
        body: "ARHMS is labelled as an archived experiment rather than presented as a shipped product.",
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export type LiveSite = {
  id: string;
  label: string;
  url: string;
  kind: "web" | "portfolio" | "store" | "saas" | "gym";
  repo?: string;
};

export const liveSites: LiveSite[] = [
  {
    id: "english-practice",
    label: "My English Practice",
    url: "https://my-english-practice-three.vercel.app",
    kind: "web",
    repo: "https://github.com/min955379-glitch/My-English-Practice",
  },
  {
    id: "blue-peak",
    label: "Blue Peak Store",
    url: "https://blue-peak-store.vercel.app",
    kind: "store",
    repo: "https://github.com/min955379-glitch/Blue-Peak-store",
  },
  {
    id: "town-fitness",
    label: "Town Fitness Point",
    url: "https://town-fitness-point.vercel.app/",
    kind: "gym",
    repo: "https://github.com/min955379-glitch/Fitness-pro-",
  },
  {
    id: "reviewnudge",
    label: "ReviewNudge SaaS",
    url: "https://review-nudge-alpha.vercel.app",
    kind: "saas",
    repo: "https://github.com/min955379-glitch/ReviewNudge",
  },
  {
    id: "portfolio",
    label: "Live Portfolio",
    url: "https://muhammad-ibrahim-portfolio-six.vercel.app",
    kind: "portfolio",
  },
];

export type MobileApp = {
  id: string;
  kicker: string;
  title: string;
  image: string;
  alt: string;
  accent: "amber" | "sky" | "violet";
  pills: string[];
  links: LinkRef[];
};

export const mobileApps: MobileApp[] = [
  {
    id: "dailymb",
    kicker: "App 01 · DailyMB APK",
    title: "DailyMB Quiz Helper",
    image: "/images/dailymb-answers.webp",
    alt: "DailyMB Android dark screen showing the answers tab",
    accent: "amber",
    pills: ["Answers", "Streak", "Settings"],
    links: [
      {
        label: "Get APK ↓",
        href: "https://github.com/min955379-glitch/DailyMB/releases/download/apk-build/DailyMB.apk",
      },
      { label: "Repo ↗", href: "https://github.com/min955379-glitch/DailyMB" },
    ],
  },
  {
    id: "mental-maths",
    kicker: "App 02 · Mental Maths",
    title: "Mental Maths & AI Coach",
    image: "/images/maths-dashboard.webp",
    alt: "Mental Maths dark screen showing the stats dashboard",
    accent: "sky",
    pills: ["Stats", "Modes", "AI Coach", "Mistakes", "Weak", "Settings"],
    links: [
      {
        label: "Get APK ↓",
        href: "https://github.com/min955379-glitch/DailyMB/releases/download/apk-build/DailyMB.apk",
      },
      {
        label: "Repo ↗",
        href: "https://github.com/min955379-glitch/Mental-Maths-Practice-",
      },
    ],
  },
  {
    id: "english-practice",
    kicker: "App 03 · PWA Mobile Dark",
    title: "My English Practice Mobile",
    image: "/images/ep-mobile-home.webp",
    alt: "My English Practice mobile dark screen showing home with 13 levels",
    accent: "violet",
    pills: ["Home (13 Levels)", "Voice & Theme"],
    links: [
      {
        label: "Live App ↗",
        href: "https://my-english-practice-three.vercel.app",
      },
      {
        label: "Repo ↗",
        href: "https://github.com/min955379-glitch/My-English-Practice",
      },
    ],
  },
];

export type Service = {
  index: string;
  label: string;
  title: string;
  body: string;
  accent: "indigo" | "sky" | "violet" | "rose";
  href: string;
};

export const services: Service[] = [
  {
    index: "01",
    label: "Web Platforms",
    title: "Full-Stack Web Apps",
    body: "Fast Next.js 16 & Supabase platforms with secure auth, RLS admin portals, and SEO.",
    accent: "indigo",
    href: "#contact",
  },
  {
    index: "02",
    label: "Android Apps",
    title: "Mobile Apps (APK)",
    body: "Offline-capable React Native & Expo Android apps with automated GitHub Actions APK builds.",
    accent: "sky",
    href: "#contact",
  },
  {
    index: "03",
    label: "Business & E-com",
    title: "Gym & Store Websites",
    body: "Conversion-focused business sites and Cash-on-Delivery stores with custom admin panels.",
    accent: "violet",
    href: "#contact",
  },
  {
    index: "04",
    label: "3D & Media",
    title: "3D Blender & Video",
    body: "Procedural 3D Blender Python animations and 9:16 captioned vertical podcast shorts.",
    accent: "rose",
    href: "#contact",
  },
];

export type ProcessStep = {
  step: string;
  title: string;
  body: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "Step 01",
    title: "Discuss",
    body: "Scope goals, features, and timeline in a clear written brief.",
  },
  {
    step: "Step 02",
    title: "Design",
    body: "Structure database schema, dark/light UI system, and mobile layouts.",
  },
  {
    step: "Step 03",
    title: "Build",
    body: "Develop frontend, cloud APIs, and admin controls with real data.",
  },
  {
    step: "Step 04",
    title: "Launch",
    body: "Run automated tests, deploy to Vercel or build signed APK.",
  },
  {
    step: "Step 05",
    title: "Support",
    body: "Database backups, handover docs, and post-launch updates.",
  },
];

export type Skill = {
  index: string;
  label: string;
  title: string;
  body: string;
  accent: "indigo" | "sky" | "violet" | "rose";
};

export const skills: Skill[] = [
  {
    index: "01",
    label: "Frontend",
    title: "Next.js 16 & React 19",
    body: "App Router, TypeScript, Tailwind v4, accessible UI, offline IndexedDB & service workers.",
    accent: "indigo",
  },
  {
    index: "02",
    label: "Backend & DB",
    title: "Supabase & Turso",
    body: "PostgreSQL, Drizzle ORM, RLS allowlists, Auth, Storage, Deno Edge Functions & pg_cron.",
    accent: "sky",
  },
  {
    index: "03",
    label: "Mobile Apps",
    title: "React Native & Expo",
    body: "Zustand, React Query, AsyncStorage, native notifications & GitHub Actions signed APKs.",
    accent: "violet",
  },
  {
    index: "04",
    label: "DevOps & E-com",
    title: "Vercel, Shopify & WP",
    body: "GitHub Actions CI/CD, Vercel production hosting, plus Shopify & WordPress stores.",
    accent: "rose",
  },
  {
    index: "05",
    label: "Automation & QA",
    title: "Python & Playwright",
    body: "Python data scripts, ReportLab PDFs, Jest unit/DB tests & Playwright browser suites.",
    accent: "indigo",
  },
  {
    index: "06",
    label: "3D & Video",
    title: "Blender & FFmpeg",
    body: "Procedural Python 3D models, Cycles GPU rendering, and -14 LUFS vertical video clipping.",
    accent: "violet",
  },
  {
    index: "07",
    label: "AI Workflow",
    title: "Verified Agent Ops",
    body: "Structured prompts, parallel quality checks, build verification, and plain failure reporting.",
    accent: "sky",
  },
  {
    index: "08",
    label: "Cloud Backups",
    title: "6 Supabase Projects",
    body: "dailymb & my-english-practice active in prod; full exports held for paused/archived DBs.",
    accent: "rose",
  },
];

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "How do you approach project pricing?",
    answer:
      "Fixed-scope milestone pricing based on your exact deliverables—whether it is a landing page, a full Next.js + Supabase platform, or an Android APK build.",
  },
  {
    question: "What is the typical delivery timeline?",
    answer:
      "Business websites ship in 5–10 days; full-stack web apps and mobile APKs take 2–4 weeks with live Vercel preview links shared throughout.",
  },
  {
    question: "How do revisions and testing work?",
    answer:
      "Every milestone includes structured revisions, type/lint checks, and real mobile viewport testing before final handover.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Bank transfer, JazzCash / Easypaisa across Pakistan, and international freelance milestone options.",
  },
];

export type Stat = { value: number; suffix?: string; label: string; accent: string };

export const heroStats: Stat[] = [
  { value: 8, label: "GitHub Repos", accent: "indigo" },
  { value: 5, label: "Live Vercel Sites", accent: "violet" },
  { value: 6, label: "Supabase Clouds", accent: "sky" },
  { value: 3, label: "Mobile Apps", accent: "rose" },
  { value: 408, label: "Learning Drills", accent: "indigo" },
  { value: 96, label: "Automated Tests", accent: "violet" },
];

export const techChips = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Supabase PostgreSQL",
  "React Native / Expo",
  "Tailwind CSS v4",
  "GitHub Actions",
  "Python & Blender 5.2",
];

export const capabilityChips = [
  "Next.js 16 App Router",
  "Supabase PostgreSQL & RLS",
  "React Native & Expo APK",
  "Blender 5.2 Cycles GPU",
  "FFmpeg 9:16 Video Pipeline",
];

export const studioItems = [
  {
    kicker: "Blender 5.2 Python · Cycles GPU",
    title: "Sprocket Rig & 3D Scenes",
    body: "Includes The Great Desktop Migration (4.9s/frame), First Light v2 (15s sunrise sprout with subsurface scattering), and Sprocket (720x1280 clay robot).",
    clips: [
      { id: "idle", label: "01. Idle", state: "Idle" },
      { id: "wave", label: "02. Wave", state: "Wave" },
      { id: "walk", label: "03. Walk", state: "Walk" },
      { id: "jump-spin", label: "04. Jump-Spin", state: "Jump-Spin" },
    ],
    footnote: "Sprocket 720x1280 — Idle",
    links: [] as LinkRef[],
  },
  {
    kicker: "Social Media Growth Business",
    title: "Ibrahim Promo Studio",
    body: "TikTok, Instagram & Facebook growth packages using quality-first Non-Drop suppliers with a 30-day refill guarantee and weekly Tuesday dark-and-gold poster packs.",
    links: [
      { label: "Request Price Pack ↗", href: whatsappMessages.studio ? `https://wa.me/923485581969?text=${whatsappMessages.studio}` : "#" },
      { label: "Studio Inquiry ↗", href: whatsappMessages.general ? `https://wa.me/923485581969?text=${whatsappMessages.general}` : "#" },
    ],
  },
  {
    kicker: "FFmpeg Short-Form Pipeline",
    title: "Podcast & Vertical Video Clipping",
    body: "67-minute podcasts analysed and cut into 1080x1920 vertical 9:16 shorts with burned-in captions, -14 LUFS loudness normalization, and H.264/AAC 48 kHz stereo output.",
    links: [] as LinkRef[],
  },
];

export const projectTypes = [
  "Full-Stack Web App",
  "Mobile App (APK)",
  "Gym / Business Website",
  "E-commerce Store",
  "3D / Video Production",
  "Something else",
] as const;

export const budgetRanges = [
  "Under PKR 50,000",
  "PKR 50,000 – 150,000",
  "PKR 150,000 – 400,000",
  "PKR 400,000+",
  "Not sure yet",
] as const;
