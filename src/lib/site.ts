export const siteConfig = {
  name: "Muhammad Ibrahim",
  shortName: "M. Ibrahim",
  initials: "MI",
  role: "Product Engineer",
  title:
    "Muhammad Ibrahim — Full-Stack Web, Mobile & 3D Product Builder",
  description:
    "Software Engineering student building and shipping real Next.js 16 platforms, Supabase cloud backends, signed Android APKs, and Blender 3D Python scenes.",
  location: "Abbottabad, Pakistan",
  locationShort: "Abbottabad, PK",
  availability: "Open to work",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://muhammad-ibrahim-portfolio-six.vercel.app",
  email: "min955379@gmail.com",
  phoneDisplay: "03485581969",
  phoneIntl: "+923485581969",
  whatsappNumber: "923485581969",
  githubHandle: "min955379-glitch",
  githubUrl: "https://github.com/min955379-glitch",
  apkUrl:
    "https://github.com/min955379-glitch/DailyMB/releases/download/apk-build/DailyMB.apk",
  timezoneLabel: "UTC+5 PKT",
  copyrightYear: 2026,
} as const;

export const whatsappMessages = {
  general:
    "Assalam-o-Alaikum%20Muhammad%20Ibrahim%2C%20I%20viewed%20your%20portfolio%20and%20want%20to%20discuss%20a%20project.",
  studio:
    "Assalam-o-Alaikum%2C%20please%20share%20this%20week%27s%20Ibrahim%20Promo%20Studio%20price%20list.",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${message}`;
}

export type NavItem = {
  id: string;
  label: string;
  shortLabel: string;
  index: string;
  description: string;
};

/** Every anchor that exists on the single-page experience. */
export const navItems: NavItem[] = [
  {
    id: "live-sites",
    label: "Live Sites",
    shortLabel: "Live Sites",
    index: "01",
    description: "Production deployments, probed live",
  },
  {
    id: "projects",
    label: "Projects",
    shortLabel: "Projects",
    index: "02",
    description: "Case studies, architecture and repos",
  },
  {
    id: "mobile-apks",
    label: "Mobile APKs",
    shortLabel: "Mobile APKs",
    index: "03",
    description: "Signed Android builds",
  },
  {
    id: "services",
    label: "Services",
    shortLabel: "Services",
    index: "04",
    description: "What I build and how we work",
  },
  {
    id: "studio-3d",
    label: "3D & Studio",
    shortLabel: "3D & Studio",
    index: "05",
    description: "Blender renders and video pipelines",
  },
  {
    id: "skills",
    label: "Skills",
    shortLabel: "Skills",
    index: "06",
    description: "Engineering stack and cloud",
  },
  {
    id: "arcade",
    label: "Arcade",
    shortLabel: "Arcade",
    index: "07",
    description: "Cyber-Nova Interceptor",
  },
  {
    id: "about",
    label: "About & FAQ",
    shortLabel: "About",
    index: "08",
    description: "Background, answers and CV",
  },
  {
    id: "contact",
    label: "Contact",
    shortLabel: "Contact",
    index: "09",
    description: "Start a project brief",
  },
];
